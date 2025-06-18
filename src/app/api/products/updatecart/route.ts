import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function PUT(request: NextRequest) {
  const { id, type, quantity } = await request.json();

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

    // Tìm item cần update
    const itemIndex = cart.items.findIndex((item) => {
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

      if (type === "product") {
        return item.type === "product" && itemProductId === id;
      } else if (type === "blindbox") {
        return item.type === "blindbox" && itemBlindboxId === id;
      }
      return false;
    });

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    // Kiểm tra xem có phải blindboxProduct không
    const item = cart.items[itemIndex];
    if (item.type === "blindboxProduct") {
      return NextResponse.json(
        { error: "Không thể chỉnh sửa sản phẩm blindbox" },
        { status: 400 }
      );
    }

    // Update số lượng
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Tính lại tổng giá
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}
