// /api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/Product";

await connectDB();

export async function GET(req: NextRequest) {
  const products = await Product.find({}).populate("category", "name").lean();
  return NextResponse.json(products);
}
