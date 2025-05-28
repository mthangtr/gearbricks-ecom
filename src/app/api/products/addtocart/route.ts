import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/models/Cart";
import { connectDB } from "@/lib/mongoose";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

await connectDB();

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
  const { productId, blindboxId, quantity, type, thumbnailUrl, name, price } =
    await request.json();

  console.log("productId", productId);
  console.log("blindboxId", blindboxId);
  console.log("quantity", quantity);
  console.log("type", type);
  console.log("thumbnailUrl", thumbnailUrl);
  console.log("name", name);
  console.log("price", price);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    let cart = await Cart.findOne({ user: session.user._id });

    const newItem = {
      product: type === "product" ? productId : undefined,
      blindbox: type === "blindbox" ? blindboxId : undefined,
      thumbnailUrl,
      name,
      quantity: quantity || 1,
      price: type === "blindboxProduct" ? 0 : price,
      type,
    };

    if (!cart) {
      cart = await Cart.create({
        user: session.user._id,
        items: [newItem],
        totalPrice: 0,
      });
    } else {
      // Kiểm tra sản phẩm trùng lặp dựa trên type và product._id
      const existingItemIndex = cart.items.findIndex((item) => {
        if (!item) return false;

        console.log("item", item);

        // Lấy ID từ product hoặc blindbox object
        const itemProductId =
          typeof item.product === "object"
            ? item.product?._id?.toString()
            : item.product?.toString();
        const itemBlindboxId =
          typeof item.blindbox === "object"
            ? item.blindbox?._id?.toString()
            : item.blindbox?.toString();

        console.log("itemProductId", itemProductId);
        console.log("itemBlindboxId", itemBlindboxId);

        if (type === "product") {
          return (
            item.type === "product" && itemProductId === productId?.toString()
          );
        } else if (type === "blindbox") {
          return (
            item.type === "blindbox" &&
            itemBlindboxId === blindboxId?.toString()
          );
        } else if (type === "blindboxProduct") {
          return (
            item.type === "blindboxProduct" &&
            itemProductId === productId?.toString()
          );
        }
        return false;
      });

      if (existingItemIndex > -1) {
        // Chỉ tăng số lượng nếu không phải blindboxProduct
        if (type !== "blindboxProduct") {
          cart.items[existingItemIndex].quantity += quantity || 1;
        }
      } else {
        cart.items.push(newItem);
      }

      // Tính lại tổng giá
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

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
