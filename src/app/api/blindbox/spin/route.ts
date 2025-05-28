// app/api/blindbox/[slug]/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { SpinRecord } from "@/models/spinRecord";
import { getServerSession } from "next-auth";
import type { Product } from "@/types/global";
import { User } from "@/models/User";
import { IUser } from "@/models/User";
import { Cart } from "@/models/Cart";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user: IUser | null = await User.findOne({
      email: session.user.email,
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.blindboxSpinCount <= 0) {
      return NextResponse.json(
        { message: "You have no more spins" },
        { status: 400 }
      );
    }

    const { blindboxId } = await req.json();
    const blindbox = await Blindbox.findById(blindboxId)
      .populate("products.product")
      .exec();
    if (!blindbox)
      return NextResponse.json(
        { error: "Blindbox not found" },
        { status: 404 }
      );

    // Random selection logic
    const totalProbability = blindbox.products.reduce(
      (sum, { probability }) => sum + (probability || 0),
      0
    );
    if (Math.abs(totalProbability - 100) > 1) {
      return NextResponse.json(
        { error: `Invalid probabilities: total ${totalProbability}` },
        { status: 500 }
      );
    }

    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedProduct: Product | null = null;
    let prizeIndex = 0;

    for (let i = 0; i < blindbox.products.length; i++) {
      const { product, probability } = blindbox.products[i];
      cumulativeProbability += probability || 0;

      if (random <= cumulativeProbability) {
        selectedProduct = product;
        prizeIndex = i;
        break;
      }
    }

    if (!selectedProduct) {
      selectedProduct = blindbox.products[blindbox.products.length - 1].product;
      prizeIndex = blindbox.products.length - 1;
    }

    // Transaction-like block
    try {
      await SpinRecord.create({
        user: user._id,
        blindbox: blindboxId,
        product: selectedProduct!._id,
        success: true,
      });

      await User.findByIdAndUpdate(user._id, {
        $inc: { blindboxSpinCount: -1 },
      });

      const cart = await Cart.findOne({ user: user._id });
      const newItem = {
        product: selectedProduct!._id,
        type: "blindboxProduct",
        quantity: 1,
        price: 0,
        name: selectedProduct?.name || "",
        thumbnailUrl: selectedProduct?.images?.[0]?.url || "",
      };

      if (!cart) {
        await Cart.create({
          user: user._id,
          items: [newItem],
          totalPrice: 0,
        });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) =>
            item.type === "blindboxProduct" &&
            item.product?.toString() === selectedProduct!._id.toString()
        );

        if (existingItemIndex > -1) {
          cart.items[existingItemIndex].quantity += 1;
        } else {
          cart.items.push(newItem);
        }

        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        await cart.save();
      }
    } catch (dbError) {
      console.error("Failed to create spin record or update cart:", dbError);
      return NextResponse.json(
        { error: "Failed to save spin record or update cart" },
        { status: 500 }
      );
    }

    await Blindbox.findByIdAndUpdate(blindboxId, { $inc: { totalOpens: 1 } });

    return NextResponse.json({
      prizeIndex,
      prizeProduct: selectedProduct,
    });
  } catch (error) {
    console.error("Spin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
