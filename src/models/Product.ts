import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    thumbnailIndex: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    category: { type: String },
    colors: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
