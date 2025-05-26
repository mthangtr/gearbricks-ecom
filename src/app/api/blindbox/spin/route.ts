// app/api/blindbox/[slug]/spin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Blindbox } from "@/models/blindbox";
import { SpinRecord } from "@/models/spinRecord";
import { getServerSession } from "next-auth";
import type { Product } from "@/types/global";
import { User } from "@/models/User";
import { IUser } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get or create user
    const user: IUser | null = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.blindboxSpinCount <= 0) {
      return NextResponse.json(
        { message: "You have no more spins" },
        { status: 400 }
      );
    }

    const { blindboxId } = await req.json();

    // Get blindbox data with product probabilities
    const blindbox = await Blindbox.findById(blindboxId)
      .populate("products.product")
      .exec();

    if (!blindbox) {
      return NextResponse.json(
        { error: "Blindbox not found" },
        { status: 404 }
      );
    }

    // Calculate prize based on probabilities
    const random = Math.random() * 100; // Random from 0-100 instead of 0-1
    let cumulativeProbability = 0;
    let selectedProduct: Product | null = null;
    let prizeIndex = 0;

    // Debug log probabilities
    const totalProbability = blindbox.products.reduce(
      (sum, { probability }) => {
        return sum + (probability || 0);
      },
      0
    );

    // Check if total probability is approximately 100%
    if (Math.abs(totalProbability - 100) > 1) {
      return NextResponse.json(
        { error: `Invalid probabilities: total ${totalProbability}` },
        { status: 500 }
      );
    }

    // Random selection using percentage probabilities
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

    try {
      // Create spin record with user's MongoDB _id
      await SpinRecord.create({
        user: user._id, // Use MongoDB user _id
        blindbox: blindboxId,
        product: selectedProduct!._id,
        success: true,
      });

      await User.findByIdAndUpdate(user._id, {
        $inc: { blindboxSpinCount: -1 },
      });
    } catch (dbError) {
      console.error("Failed to create spin record:", dbError);
      return NextResponse.json(
        { error: "Failed to save spin record" },
        { status: 500 }
      );
    }

    // Increment total opens
    await Blindbox.findByIdAndUpdate(blindboxId, {
      $inc: { totalOpens: 1 },
    });

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
