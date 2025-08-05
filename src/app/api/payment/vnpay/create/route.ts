import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { vnpayService } from "@/lib/vnpay";
import { Order } from "@/models/Order";
import { connectDB } from "@/lib/mongoose";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount, orderInfo } = await request.json();

    if (!orderId || !amount || !orderInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Kiểm tra order có tồn tại và thuộc về user không
    const order = await Order.findOne({
      _id: orderId,
      user: session.user._id,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Kiểm tra order chưa được thanh toán
    if (order.isPaid) {
      return NextResponse.json(
        { error: "Order already paid" },
        { status: 400 }
      );
    }

    // Tạo URL thanh toán VNPay
    const paymentUrl = vnpayService.createPaymentUrl({
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      orderType: "other",
      locale: "vn",
      currCode: "VND",
    });

    return NextResponse.json({
      success: true,
      paymentUrl,
      orderId,
    });
  } catch (error) {
    console.error("VNPay create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
