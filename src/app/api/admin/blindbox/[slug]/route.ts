import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";

await connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const blindbox = await Blindbox.findOne({ slug })
    .populate("products.product", "name images price")
    .lean();
  if (!blindbox) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ blindbox });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { title, description, price, thumbnailUrl, products } =
    await req.json();
  if (!title || !price || !Array.isArray(products) || products.length === 0) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const updated = await Blindbox.findOneAndUpdate(
      { slug },
      {
        title,
        description,
        price,
        thumbnailUrl,
        products: (
          products as { productId: string; probability: number }[]
        ).map((p) => ({
          product: p.productId,
          probability: p.probability,
        })),
      },
      { new: true }
    ).populate("products.product", "name images price");
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ blindbox: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    const deleted = await Blindbox.findOneAndDelete({ slug });
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
