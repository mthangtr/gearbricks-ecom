import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { User } from "@/types/global";
import { User as UserModel } from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get or create user
    const user: User | null = await UserModel.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: "items.product",
        model: "Product",
      })
      .populate({
        path: "items.blindbox",
        model: "Blindbox",
      });

    if (!cart) {
      return NextResponse.json({ items: [], totalPrice: 0 });
    }

    return NextResponse.json({
      items: cart.items,
      totalPrice: cart.totalPrice,
    });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
