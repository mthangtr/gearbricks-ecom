import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";

await connectDB();

// GET - Trả về tất cả sản phẩm hoặc theo category
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawCategory = searchParams.get("category");
    const category = !rawCategory || rawCategory === "all" ? null : rawCategory;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;

    const filter: any = category ? { category } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

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
