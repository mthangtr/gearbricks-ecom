import { Cart, CartItem, AddToCartPayload } from "@/types/cart";

const CART_STORAGE_KEY = "cart";

export const cartService = {
  getCart: (): Cart => {
    if (typeof window === "undefined") {
      return { items: [], totalPrice: 0 };
    }
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : { items: [], totalPrice: 0 };
  },

  addToCart: (payload: AddToCartPayload): Cart => {
    const cart = cartService.getCart();
    const existingItemIndex = cart.items.findIndex(
      (item) => item.id === payload.id && item.type === payload.type
    );

    if (existingItemIndex > -1) {
      // Update existing item
      cart.items[existingItemIndex].quantity += payload.quantity || 1;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: payload.id,
        type: payload.type,
        name: payload.name,
        price: payload.price,
        quantity: payload.quantity || 1,
        image: payload.image,
      };
      cart.items.push(newItem);
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  updateCartItem: (
    id: string,
    type: "product" | "blindbox",
    quantity: number
  ): Cart => {
    const cart = cartService.getCart();
    const itemIndex = cart.items.findIndex(
      (item) => item.id === id && item.type === type
    );

    if (itemIndex > -1) {
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

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    return cart;
  },

  removeFromCart: (id: string, type: "product" | "blindbox"): Cart => {
    const cart = cartService.getCart();
    cart.items = cart.items.filter(
      (item) => !(item.id === id && item.type === type)
    );

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart;
  },

  clearCart: (): Cart => {
    const emptyCart = { items: [], totalPrice: 0 };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(emptyCart));
    return emptyCart;
  },
};
