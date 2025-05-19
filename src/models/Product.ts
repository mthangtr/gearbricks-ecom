import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: [
      {
        index: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
    inStock: { type: Boolean, default: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    colors: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
