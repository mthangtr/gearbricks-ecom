// app/api/admin/blindbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { Product } from "@/models/Product";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, slug, description, price, thumbnailUrl, products } = body;

    // Validate required fields
    if (!title || !slug || !price || !products || products.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingBlindbox = await Blindbox.findOne({ slug });
    if (existingBlindbox) {
      return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });
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

    // Create new blindbox
    const blindbox = new Blindbox({
      title,
      slug,
      description: description || "",
      price,
      thumbnailUrl: thumbnailUrl || "",
      products: productsWithDetails,
      totalOpens: 0,
    });

    await blindbox.save();

    return NextResponse.json({
      message: "Tạo blindbox thành công",
      blindbox,
    });
  } catch (error) {
    console.error("Error creating blindbox:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
