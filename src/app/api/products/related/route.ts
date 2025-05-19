// file: app/api/products/related/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

await connectDB();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCategory = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!rawCategory) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // 1) Chuyển category thành ObjectId
    let categoryId: mongoose.Types.ObjectId;
    try {
      categoryId = new mongoose.Types.ObjectId(rawCategory);
    } catch {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // 2) Nếu có slug, tìm product hiện tại để exclude và lấy keywords
    let currentProductId: mongoose.Types.ObjectId | null = null;
    let keywords: string[] = [];

    if (slug) {
      const current = (await Product.findOne({ slug })
        .select({ _id: 1, name: 1 })
        .lean()) as { _id: mongoose.Types.ObjectId; name: string } | null;
      if (current) {
        currentProductId = current._id;
        keywords = current.name
          .split(/\W+/)
          .map((w) => w.toLowerCase())
          .filter((w) => w.length > 1);
      }
    }

    // 3) Build aggregation pipeline
    const pipeline: any[] = [
      // match đúng categoryId
      { $match: { category: categoryId } },
      // exclude product hiện tại nếu có
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
      },
    });

    let related = await Product.aggregate(pipeline);

    // 4) Nếu chưa đủ 10, bù thêm sản phẩm mới nhất cùng category
    if (related.length < 10) {
      const excludeIds = related.map((p) => p._id);
      if (currentProductId) excludeIds.push(currentProductId);

      const additional = await Product.find({
        category: categoryId,
        _id: { $nin: excludeIds },
      })
        .sort({ createdAt: -1 })
        .limit(10 - related.length)
        .select({ _id: 1, name: 1, slug: 1, price: 1, images: 1, category: 1 })
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
