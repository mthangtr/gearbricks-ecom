import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  blindbox: { type: mongoose.Schema.Types.ObjectId, ref: "Blindbox" },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }, // Giá tại thời điểm thêm vào giỏ
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [CartItemSchema],
    totalPrice: { type: Number, default: 0 }, // Tự động tính lại khi thêm / sửa
  },
  { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
