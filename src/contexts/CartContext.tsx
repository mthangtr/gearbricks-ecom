'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, AddToCartPayload } from '@/types/cart';
import { cartService } from '@/services/cartService';

interface CartContextType {
    cart: Cart;
    addToCart: (payload: AddToCartPayload) => void;
    updateCartItem: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });

    useEffect(() => {
        // Load cart from localStorage on mount
        setCart(cartService.getCart());
    }, []);

    const addToCart = (payload: AddToCartPayload) => {
        const updatedCart = cartService.addToCart(payload);
        setCart(updatedCart);
    };

    const updateCartItem = (productId: string, quantity: number) => {
        const updatedCart = cartService.updateCartItem(productId, quantity);
        setCart(updatedCart);
    };

    const removeFromCart = (productId: string) => {
        const updatedCart = cartService.removeFromCart(productId);
        setCart(updatedCart);
    };

    const clearCart = () => {
        const emptyCart = cartService.clearCart();
        setCart(emptyCart);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
} 