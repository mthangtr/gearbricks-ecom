// app/api/products/category/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product, Category } from "@/models/Product";
import mongoose from "mongoose";

await connectDB();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCategory = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;

    console.log("rawCategory", rawCategory);
    console.log("search", search);

    const filter: any = {};

    // --- xử lý category ---
    if (rawCategory && rawCategory !== "all") {
      let catId: mongoose.Types.ObjectId | null = null;

      // 1) thử xem rawCategory có phải ObjectId hợp lệ không
      if (mongoose.Types.ObjectId.isValid(rawCategory)) {
        catId = new mongoose.Types.ObjectId(rawCategory);
      } else {
        // 2) không phải ObjectId → lookup theo name
        const catDoc = (await Category.findOne({
          name: rawCategory,
        }).lean()) as { _id: mongoose.Types.ObjectId } | null;
        if (catDoc && catDoc._id) {
          catId = catDoc._id;
        } else {
          // nếu không tìm thấy category đó thì trả về rỗng luôn
          return NextResponse.json({
            products: [],
            pagination: { total: 0, page, totalPages: 0, perPage: limit },
          });
        }
      }

      filter.category = catId;
    }

    // --- xử lý search ---
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // truy vấn chính
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name") // nếu cần gửi luôn tên category
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        perPage: limit,
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
