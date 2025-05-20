// app/api/blindbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";

export async function GET(req: NextRequest) {
  await connectDB();
  const blindboxes = await Blindbox.find({})
    .populate("products.product", "name images price")
    .lean();
  return NextResponse.json(blindboxes);
}
