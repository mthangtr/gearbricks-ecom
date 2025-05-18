// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

// 1. Kết nối DB (nếu chưa connect lần nào)
await connectDB();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 2. Validate cơ bản
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Vui lòng điền đủ tên, email và mật khẩu." },
        { status: 400 }
      );
    }

    // 3. Check xem email đã tồn tại chưa
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email đã được sử dụng." },
        { status: 409 }
      );
    }

    // 4. Hash password với bcrypt (ví dụ 10 rounds)
    const newUser = new User({ name, email, password });
    await newUser.save();

    return NextResponse.json(
      { ok: true, userId: newUser._id.toString() },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
