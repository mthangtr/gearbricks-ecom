// file: app/api/products/related/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

await connectDB();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    let currentProductId: mongoose.Types.ObjectId | null = null;
    let keywords: string[] = [];

    // 1) Nếu có slug thì load product hiện tại để lấy _id và keywords
    if (slug) {
      const current = (await Product.findOne({ slug }).lean()) as {
        _id: mongoose.Types.ObjectId;
        name: string;
      } | null;
      if (current) {
        currentProductId = current._id;
        keywords = current.name
          .split(/\W+/)
          .map((w) => w.toLowerCase())
          .filter((w) => w.length > 1);
      }
    }

    // 2) Build pipeline để tìm keyword-matches
    const pipeline: any[] = [
      { $match: { category } },
      ...(currentProductId
        ? [{ $match: { _id: { $ne: currentProductId } } }]
        : []),
    ];

    if (keywords.length) {
      const lowerName = { $toLower: "$name" };
      pipeline.push({
        $addFields: {
          matchCount: {
            $sum: keywords.map((kw) => ({
              $cond: [{ $gt: [{ $indexOfBytes: [lowerName, kw] }, -1] }, 1, 0],
            })),
          },
        },
      });
      pipeline.push({ $match: { matchCount: { $gt: 0 } } });
      pipeline.push({ $sort: { matchCount: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push({ $limit: 10 });
    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        price: 1,
        images: 1,
        category: 1,
        matchCount: 1,
      },
    });

    // 3) Chạy aggregation để lấy related theo keyword (max 10)
    let related = await Product.aggregate(pipeline);

    // 4) Nếu chưa đủ 10, bù bằng sản phẩm mới nhất
    if (related.length < 10) {
      // các _id cần exclude: current + những đã lấy ở trên
      const excludeIds = related.map((p) => p._id);
      if (currentProductId) excludeIds.push(currentProductId);

      // fetch thêm theo recency
      const additional = await Product.find({
        category,
        _id: { $nin: excludeIds },
      })
        .sort({ createdAt: -1 })
        .limit(10 - related.length)
        .select({ name: 1, slug: 1, price: 1, images: 1, category: 1 })
        .lean();

      related = related.concat(additional);
    }

    return NextResponse.json(related);
  } catch (err) {
    console.error("Error fetching related products:", err);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
