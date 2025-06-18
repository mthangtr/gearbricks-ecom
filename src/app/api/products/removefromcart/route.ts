import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function DELETE(request: NextRequest) {
  const { id, type } = await request.json();

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

    // Tìm và xóa item
    cart.items = cart.items.filter((item) => {
      if (!item) return false;

      // Lấy ID từ product hoặc blindbox object
      const itemProductId =
        typeof item.product === "object"
          ? item.product?._id?.toString()
          : item.product?.toString();
      const itemBlindboxId =
        typeof item.blindbox === "object"
          ? item.blindbox?._id?.toString()
          : item.blindbox?.toString();

      // Kiểm tra xem có phải blindboxProduct không
      if (item.type === "blindboxProduct") {
        // Không cho phép xóa blindboxProduct
        return true; // Giữ lại item
      }

      if (type === "product") {
        return !(item.type === "product" && itemProductId === id);
      } else if (type === "blindbox") {
        return !(item.type === "blindbox" && itemBlindboxId === id);
      }
      return true;
    });

    // Tính lại tổng giá
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
