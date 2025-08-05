import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMethod, shippingAddress, items } = await request.json();

    if (!paymentMethod || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Tính tổng tiền
    const totalPrice = items.reduce((total: number, item: any) => {
      return total + item.price * item.quantity;
    }, 0);

    // Tạo đơn hàng mới
    const order = await Order.create({
      user: session.user._id,
      items: items,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      shippingAddress: shippingAddress,
      status: "pending",
      isPaid: false,
    });

    // Xóa giỏ hàng sau khi tạo đơn hàng thành công
    if (paymentMethod === "vnpay") {
      // Nếu thanh toán VNPay, không xóa giỏ hàng ngay
      // Sẽ xóa sau khi thanh toán thành công
    } else {
      // Nếu COD, xóa giỏ hàng ngay
      await Cart.findOneAndDelete({ user: session.user._id });
    }

    return NextResponse.json({
      success: true,
      order: order,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
