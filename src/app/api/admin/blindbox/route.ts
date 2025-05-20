// app/api/admin/blindbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";

await connectDB();

export async function POST(req: NextRequest) {
  const { title, slug, description, price, thumbnailUrl, products } =
    await req.json();

  if (
    !title ||
    !slug ||
    !price ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newBox = await Blindbox.create({
      title,
      slug,
      description,
      price,
      thumbnailUrl,
      products: products.map((p: any) => ({
        product: p.productId,
        probability: p.probability,
      })),
    });

    return NextResponse.json({ blindbox: newBox }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Creation failed" },
      { status: 500 }
    );
  }
}
