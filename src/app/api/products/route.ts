import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product, Category } from "@/models/Product";

await connectDB();

// GET - Lấy danh sách sản phẩm
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
          .map((img: { url: string; index: number }) => ({
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
