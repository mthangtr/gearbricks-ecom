'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem } from '@/types/global';
import { cartService } from '@/services/cartService';
import { useSession } from 'next-auth/react';

interface CartContextType {
    cart: Cart;
    addToCart: (payload: CartItem) => void;
    updateCartItem: (id: string, type: 'product' | 'blindbox', quantity: number) => void;
    removeFromCart: (id: string, type: 'product' | 'blindbox') => void;
    clearCart: () => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const loadCart = async () => {
            try {
                setIsLoading(true);
                if (session?.user?.email) {
                    // Nếu user đã login
                    const localCart = cartService.getCart();

                    // Nếu có sản phẩm trong localStorage, thêm vào DB
                    if (localCart.items.length > 0) {
                        for (const item of localCart.items) {
                            await fetch('/api/products/addtocart', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(item),
                            });
                        }
                        // Xóa localStorage sau khi đã thêm vào DB
                        cartService.clearCart();
                    }

                    // Lấy cart từ database
                    const response = await fetch('/api/products/listcartproducts');
                    if (response.ok) {
                        const dbCart = await response.json();
                        setCart(dbCart);
                    }
                } else {
                    // Nếu user chưa login, lấy từ localStorage
                    const localCart = cartService.getCart();
                    setCart(localCart);
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                setCart(cartService.getCart());
            } finally {
                setIsLoading(false);
            }
        };

        loadCart();
    }, [session]);

    const addToCart = async (payload: CartItem) => {
        if (session?.user?.email) {
            // Nếu đã login, thêm vào DB
            try {
                const response = await fetch('/api/products/addtocart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                }
            } catch (error) {
                console.error('Error syncing cart to database:', error);
            }
        } else {
            // Nếu chưa login, thêm vào localStorage
            const updatedCart = cartService.addToCart(payload);
            setCart(updatedCart);
        }
    };

    const updateCartItem = async (id: string, type: 'product' | 'blindbox', quantity: number) => {
        if (session?.user?.email) {
            // Nếu đã login, cập nhật trong DB
            try {
                const response = await fetch('/api/products/updatecart', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, type, quantity }),
                });
                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                }
            } catch (error) {
                console.error('Error syncing cart to database:', error);
            }
        } else {
            // Nếu chưa login, cập nhật trong localStorage
            const updatedCart = cartService.updateCartItem(id, type, quantity);
            setCart(updatedCart);
        }
    };

    const removeFromCart = async (id: string, type: 'product' | 'blindbox') => {
        if (session?.user?.email) {
            // Nếu đã login, xóa trong DB
            try {
                const response = await fetch('/api/products/removefromcart', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, type }),
                });
                if (response.ok) {
                    const updatedCart = await response.json();
                    setCart(updatedCart);
                }
            } catch (error) {
                console.error('Error syncing cart to database:', error);
            }
        } else {
            // Nếu chưa login, xóa trong localStorage
            const updatedCart = cartService.removeFromCart(id, type);
            setCart(updatedCart);
        }
    };

    const clearCart = async () => {
        if (session?.user?.email) {
            // Nếu đã login, xóa trong DB
            try {
                await fetch('/api/products/clearcart', {
                    method: 'DELETE',
                });
                setCart({ items: [], totalPrice: 0 });
            } catch (error) {
                console.error('Error syncing cart to database:', error);
            }
        } else {
            // Nếu chưa login, xóa trong localStorage
            const emptyCart = cartService.clearCart();
            setCart(emptyCart);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                isLoading,
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