import { Cart, CartItem } from "@/types/global";

const CART_STORAGE_KEY = "cart";

function getCartItemId(item: CartItem): string {
  if (typeof item.product === "string") {
    return item.product;
  }
  if (typeof item.blindbox === "string") {
    return item.blindbox;
  }
  if (typeof item.product === "object" && item.product?._id) {
    return item.product._id;
  }
  if (typeof item.blindbox === "object" && item.blindbox?._id) {
    return item.blindbox._id;
  }
  return item._id || "";
}

function getProductIdByType(item: CartItem): string {
  switch (item.type) {
    case "product":
      return getCartItemId(item);
    case "blindbox":
      return getCartItemId(item);
    case "blindboxProduct":
      return getCartItemId(item);
    default:
      return "";
  }
}

export const cartService = {
  getCart: (): Cart => {
    if (typeof window === "undefined") {
      return { items: [], totalPrice: 0 };
    }
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : { items: [], totalPrice: 0 };
  },

  saveCart: (cart: Cart): Cart => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
    return cart;
  },

  addToCart: (payload: CartItem): Cart => {
    const cart = cartService.getCart();

    // Lấy ID của sản phẩm mới
    const newItemId = getProductIdByType(payload);

    // Kiểm tra sản phẩm trùng lặp dựa trên type và ID
    const existingIndex = cart.items.findIndex((item) => {
      if (!item) return false;
      const itemId = getCartItemId(item);
      return itemId === newItemId && item.type === payload.type;
    });

    if (existingIndex > -1) {
      // Nếu sản phẩm đã tồn tại và không phải blindboxProduct, tăng số lượng
      if (payload.type !== "blindboxProduct") {
        cart.items[existingIndex].quantity += payload.quantity || 1;
      }
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      const newItem: CartItem = {
        product: payload.type !== "blindbox" ? newItemId : undefined,
        blindbox: payload.type === "blindbox" ? newItemId : undefined,
        type: payload.type,
        quantity: payload.quantity || 1,
        price: payload.price,
        name: payload.name,
        thumbnailUrl: payload.thumbnailUrl,
      };
      cart.items.push(newItem);
    }

    // Tính lại tổng giá
    cart.totalPrice = cart.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    return cartService.saveCart(cart);
  },

  updateCartItem: (
    id: string,
    type: "product" | "blindbox",
    quantity: number
  ): Cart => {
    const cart = cartService.getCart();
    const itemIndex = cart.items.findIndex((item) => {
      if (!item) return false;
      const itemId = getCartItemId(item);
      return itemId === id && item.type === type;
    });

    if (itemIndex > -1) {
      // Kiểm tra xem có phải blindboxProduct không
      const item = cart.items[itemIndex];
      if (item.type === "blindboxProduct") {
        // Không cho phép chỉnh sửa blindboxProduct
        return cart;
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      return cartService.saveCart(cart);
    }

    return cart;
  },

  removeFromCart: (id: string, type: "product" | "blindbox"): Cart => {
    const cart = cartService.getCart();
    cart.items = cart.items.filter((item) => {
      if (!item) return false;

      // Kiểm tra xem có phải blindboxProduct không
      if (item.type === "blindboxProduct") {
        // Không cho phép xóa blindboxProduct
        return true; // Giữ lại item
      }

      const itemId = getCartItemId(item);
      return !(itemId === id && item.type === type);
    });

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return cartService.saveCart(cart);
  },

  clearCart: (): Cart => {
    const emptyCart = { items: [], totalPrice: 0 };
    return cartService.saveCart(emptyCart);
  },
};
