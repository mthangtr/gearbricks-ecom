// app/api/blindbox/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { SpinRecord } from "@/models/spinRecord";
import { getServerSession } from "next-auth";

await connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;

  const blindbox = (await Blindbox.findOne({ slug })
    .populate("products.product", "name images price")
    .lean()) as Record<string, unknown> | null;
  if (!blindbox) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Lấy session để biết user hiện tại
  const session = await getServerSession();
  const userId = session?.user?._id;
  let totalSpins = 0;
  let winCounts: Record<string, number> = {};

  if (userId) {
    const records = await SpinRecord.find({
      user: userId,
      blindbox: blindbox._id,
    }).lean();
    totalSpins = records.length;
    winCounts = records
      .filter((r) => r.success)
      .reduce((acc, r) => {
        const pid = r.product.toString();
        acc[pid] = (acc[pid] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  }

  return NextResponse.json({ blindbox, stats: { totalSpins, winCounts } });
}
