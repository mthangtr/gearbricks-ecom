// app/api/debug/compare/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

await connectDB();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email")!;
  const password = searchParams.get("password")!; // đổi thành 'password'

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ ok: false, msg: "Không tìm user" });
  }

  const match = await user.comparePassword(password);
  return NextResponse.json({ ok: match, storedHash: user.password });
}
