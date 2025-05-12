import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";

await connectDB();

// POST - Tạo sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      price,
      images,
      thumbnailIndex,
      stock,
      category,
      colors,
    } = body;

    const newProduct = new Product({
      name,
      slug,
      price,
      images,
      thumbnailIndex: thumbnailIndex || 0,
      stock,
      category,
      colors,
    });

    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct, { status: 201 });
  } catch (err) {
    console.error("Error creating product:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
