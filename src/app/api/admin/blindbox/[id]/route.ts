import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { Product } from "@/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const blindbox = await Blindbox.findById(params.id).populate(
      "products.product",
      "name images price category"
    );

    if (!blindbox) {
      return NextResponse.json(
        { error: "Blindbox không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      blindbox,
    });
  } catch (error) {
    console.error("Error fetching blindbox:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, price, thumbnailUrl, products } = body;

    // Validate required fields
    if (!title || !price || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Find existing blindbox
    const existingBlindbox = await Blindbox.findById(params.id);
    if (!existingBlindbox) {
      return NextResponse.json(
        { error: "Blindbox không tồn tại" },
        { status: 404 }
      );
    }

    // Validate products and get full product objects
    const productIds = products.map((p: any) => p.product);
    const foundProducts = await Product.find({ _id: { $in: productIds } });

    if (foundProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Một số sản phẩm không tồn tại" },
        { status: 400 }
      );
    }

    // Create products array with full product objects
    const productsWithDetails = products.map((item: any) => {
      const product = foundProducts.find(
        (p) => p._id.toString() === item.product
      );
      return {
        product: product,
        probability: item.probability,
      };
    });

    // Validate total probability
    const totalProbability = productsWithDetails.reduce(
      (sum: number, item: any) => sum + item.probability,
      0
    );
    if (totalProbability !== 100) {
      return NextResponse.json(
        { error: "Tổng xác suất phải bằng 100%" },
        { status: 400 }
      );
    }

    // Update blindbox
    const updatedBlindbox = await Blindbox.findByIdAndUpdate(
      params.id,
      {
        title,
        description: description || "",
        price,
        thumbnailUrl: thumbnailUrl || "",
        products: productsWithDetails,
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Cập nhật blindbox thành công",
      blindbox: updatedBlindbox,
    });
  } catch (error) {
    console.error("Error updating blindbox:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const blindbox = await Blindbox.findByIdAndDelete(params.id);

    if (!blindbox) {
      return NextResponse.json(
        { error: "Blindbox không tồn tại" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Xóa blindbox thành công",
    });
  } catch (error) {
    console.error("Error deleting blindbox:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
