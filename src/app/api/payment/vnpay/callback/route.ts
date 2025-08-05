import { NextRequest, NextResponse } from "next/server";
import { vnpayService, VNPayCallbackData } from "@/lib/vnpay";
import { Order } from "@/models/Order";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Lấy tất cả tham số từ VNPay callback
    const callbackData: VNPayCallbackData = {
      vnp_Amount: searchParams.get("vnp_Amount") || "",
      vnp_BankCode: searchParams.get("vnp_BankCode") || "",
      vnp_BankTranNo: searchParams.get("vnp_BankTranNo") || "",
      vnp_CardType: searchParams.get("vnp_CardType") || "",
      vnp_OrderInfo: searchParams.get("vnp_OrderInfo") || "",
      vnp_PayDate: searchParams.get("vnp_PayDate") || "",
      vnp_ResponseCode: searchParams.get("vnp_ResponseCode") || "",
      vnp_TmnCode: searchParams.get("vnp_TmnCode") || "",
      vnp_TransactionNo: searchParams.get("vnp_TransactionNo") || "",
      vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus") || "",
      vnp_TxnRef: searchParams.get("vnp_TxnRef") || "",
      vnp_SecureHash: searchParams.get("vnp_SecureHash") || "",
    };

    await connectDB();

    // Xác thực chữ ký từ VNPay
    const isValidSignature = vnpayService.verifyCallback(callbackData);

    if (!isValidSignature) {
      console.error("VNPay callback signature verification failed");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=invalid_signature`
      );
    }

    // Kiểm tra trạng thái thanh toán
    const paymentStatus = vnpayService.checkPaymentStatus(
      callbackData.vnp_ResponseCode
    );

    if (!paymentStatus.success) {
      console.error("VNPay payment failed:", paymentStatus.message);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=${callbackData.vnp_ResponseCode}`
      );
    }

    // Cập nhật thông tin đơn hàng
    const orderId = callbackData.vnp_TxnRef;
    const order = await Order.findById(orderId);

    if (!order) {
      console.error("Order not found:", orderId);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=order_not_found`
      );
    }

    // Cập nhật thông tin thanh toán
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "paid";
    order.vnpayInfo = {
      transactionId: callbackData.vnp_TransactionNo,
      bankCode: callbackData.vnp_BankCode,
      bankTranNo: callbackData.vnp_BankTranNo,
      cardType: callbackData.vnp_CardType,
      responseCode: callbackData.vnp_ResponseCode,
      transactionStatus: callbackData.vnp_TransactionStatus,
      txnRef: callbackData.vnp_TxnRef,
      payDate: new Date(callbackData.vnp_PayDate),
    };

    await order.save();

    // Xóa giỏ hàng sau khi thanh toán thành công
    await Cart.findOneAndDelete({ user: order.user });

    console.log("VNPay payment successful for order:", orderId);

    // Redirect về trang thành công
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${orderId}`
    );
  } catch (error) {
    console.error("VNPay callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed?error=server_error`
    );
  }
}
