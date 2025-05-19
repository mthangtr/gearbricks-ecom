import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Category } from "@/models/Product";

await connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    const category = await Category.findOne({ name });
    if (category) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }
    const newCategory = new Category({ name });
    const savedCategory = await newCategory.save();
    return NextResponse.json(savedCategory, { status: 201 });
  } catch (err) {
    console.error("Error creating category:", err);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cats = await Category.find().sort({ name: 1 }).lean();
    return NextResponse.json({ categories: cats });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
