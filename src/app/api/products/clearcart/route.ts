import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const cart = await Cart.findOne({ user: session.user._id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Xóa tất cả items và reset totalPrice
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
