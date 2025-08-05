import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  blindbox: { type: mongoose.Schema.Types.ObjectId, ref: "Blindbox" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },

    // Trạng thái đơn hàng
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Hình thức thanh toán: COD (khi nhận), hoặc VNPay
    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay"],
      required: true,
    },

    // Trạng thái thanh toán
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    // Thông tin thanh toán VNPay
    vnpayInfo: {
      transactionId: String, // Mã giao dịch VNPay
      bankCode: String, // Mã ngân hàng
      bankTranNo: String, // Mã giao dịch ngân hàng
      cardType: String, // Loại thẻ
      responseCode: String, // Mã phản hồi
      transactionStatus: String, // Trạng thái giao dịch
      txnRef: String, // Mã tham chiếu giao dịch
      payDate: Date, // Ngày thanh toán
    },

    // Trạng thái vận chuyển
    shippingProvider: {
      type: String,
      enum: ["ghtk"],
      default: "ghtk", // Có thể mở rộng về sau: GHN, ViettelPost,...
    },
    shippingTrackingCode: { type: String }, // Mã vận đơn
    shippedAt: Date,
    deliveredAt: Date,

    // Địa chỉ giao hàng
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      name: String, // Tên người nhận
    },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
