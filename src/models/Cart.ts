import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  blindbox: { type: mongoose.Schema.Types.ObjectId, ref: "Blindbox" },
  thumbnailUrl: { type: String },
  name: { type: String },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["product", "blindboxProduct", "blindbox"],
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    items: [CartItemSchema],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
