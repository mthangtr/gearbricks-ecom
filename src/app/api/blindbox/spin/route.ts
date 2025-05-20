// app/api/blindbox/[slug]/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { SpinRecord } from "@/models/spinRecord";
import { getServerSession } from "next-auth";

await connectDB();

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const session = await getServerSession();
  if (!session?.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user._id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // 1) Lấy blindbox và danh sách products kèm probability
  const blindbox = await Blindbox.findOne({ slug }).lean();
  if (!blindbox || Array.isArray(blindbox)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 2) Weighted random
  const items = blindbox.products;
  const totalWeight = items.reduce(({ sum, i }: any) => sum + i.probability, 0);
  let r = Math.random() * totalWeight;
  let picked = items[0].product; // default
  for (const { product, probability } of items) {
    if (r < probability) {
      picked = product;
      break;
    }
    r -= probability;
  }

  // 3) Ghi record
  const record = await SpinRecord.create({
    user: userId,
    blindbox: blindbox._id,
    product: picked,
    success: true,
  });

  // 4) Tăng tổng số lần mở
  await Blindbox.updateOne({ _id: blindbox._id }, { $inc: { totalOpens: 1 } });

  return NextResponse.json({ prize: picked, recordId: record._id });
}
