import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";

await connectDB();

// GET - Trả về 5 sản phẩm mới nhất
export async function GET(req: NextRequest) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(5);
    return NextResponse.json(products);
  } catch (err) {
    console.error("Error fetching latest products:", err);
    return NextResponse.json(
      { error: "Failed to fetch latest products" },
      { status: 500 }
    );
  }
}
