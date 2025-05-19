import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product, Category } from "@/models/Product";

await connectDB();

// POST - Tạo sản phẩm mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, price, images, inStock, category, colors } = body;

    const catDoc = await Category.findById(category);
    if (!catDoc) {
      return NextResponse.json(
        { error: "Category không hợp lệ" },
        { status: 400 }
      );
    }

    const normalizedImages = Array.isArray(images)
      ? images
          .map((img: any) => ({
            url: String(img.url),
            index: Number(img.index) || 0,
          }))
          .sort((a, b) => a.index - b.index)
      : [];

    const newProduct = new Product({
      name,
      slug,
      price,
      images: normalizedImages,
      inStock,
      category: catDoc._id,
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
