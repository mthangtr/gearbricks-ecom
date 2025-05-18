import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    // images lưu trữ URL của ảnh và thứ tự của các ảnh
    // images: [
    //   {
    //     index: { type: Number, required: true },
    //     url: { type: String, required: true },
    //   },
    // ],
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
