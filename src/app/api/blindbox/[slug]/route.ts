// app/api/blindbox/[slug]/route.ts
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
    .populate("products.product", "name images price") // <- Lấy thông tin sản phẩm đầy đủ
    .lean();

  if (!blindbox) {
    return NextResponse.json(
      { message: "Blindbox not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(blindbox); // Trả về đơn giản
}
