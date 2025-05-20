import mongoose from "mongoose";

const BlindboxProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  probability: { type: Number, default: 0 },
});

const BlindboxSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    thumbnailUrl: { type: String },
    products: [BlindboxProductSchema],
    totalOpens: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Blindbox =
  mongoose.models.Blindbox || mongoose.model("Blindbox", BlindboxSchema);
