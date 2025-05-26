import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/models/Cart";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/mongoose";
import { CartItem } from "@/types/global";

await connectDB();

export async function getUserFromRequest(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token?.id) return null;

  return {
    _id: token.id as string,
    name: token.name as string,
    isAdmin: token.isAdmin as boolean,
  };
}

/**
This route is used to add a product that achieved from blindbox to the cart
These product are gonna be added to the cart with the price 0 because they are not for sale, user paied for the blindbox
First, we need to check if the product is already in the cart, if it is, we need to update the quantity
If not, we need to create a new cart item
Then, we need to update the cart total price
Then, we need to return the cart
Let's do a check if the user is authenticated, if not, we need to return a error
*/

export async function POST(request: NextRequest) {
  const { productId, blindboxId, quantity } = await request.json();

  try {
    await connectDB();
  } catch (error: unknown) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }

  // Giả định bạn có hàm để lấy user từ request, có thể dùng token/cookie...
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Tìm cart của user hoặc tạo mới nếu chưa có
    let cart = await Cart.findOne({ user: user._id });

    const newItem = {
      product: productId,
      blindbox: blindboxId,
      quantity: quantity || 1,
      price: 0,
      type: "blindboxProduct",
    };

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [newItem],
        totalPrice: 0,
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item: CartItem) =>
          item.product.toString() === productId &&
          item.type === "blindboxProduct"
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity || 1;
      } else {
        cart.items.push(newItem);
      }

      // Giá sản phẩm blindbox là 0, nên totalPrice không cần tăng
      await cart.save();
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}
