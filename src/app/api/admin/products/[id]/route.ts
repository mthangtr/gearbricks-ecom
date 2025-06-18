import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product, Category } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

await connectDB();

// DELETE - Xóa sản phẩm
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật sản phẩm
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { name, slug, price, images, inStock, category, colors } = body;

    // Kiểm tra category có tồn tại không
    const catDoc = await Category.findById(category);
    if (!catDoc) {
      return NextResponse.json(
        { error: "Category không hợp lệ" },
        { status: 400 }
      );
    }

    // Chuẩn hóa images
    const normalizedImages = Array.isArray(images)
      ? images
          .map((img: { url: string; index: number }) => ({
            url: String(img.url),
            index: Number(img.index) || 0,
          }))
          .sort((a, b) => a.index - b.index)
      : [];

    // Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        price,
        images: normalizedImages,
        inStock,
        category: catDoc._id,
        colors,
      },
      { new: true }
    ).populate("category");

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
