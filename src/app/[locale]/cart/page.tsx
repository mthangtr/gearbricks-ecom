'use client';

import { useState } from 'react';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';

const mockCart = [
    {
        id: '1',
        name: 'Porsche GT3 RS | Pink Edition',
        price: 290000,
        quantity: 1,
        image: 'https://minibricks.com/cdn/shop/files/IMG-3132.jpg?v=1698154480&width=800',
    },
    {
        id: '2',
        name: 'Porsche 911 (930) RWB',
        price: 305000,
        quantity: 2,
        image: 'https://minibricks.com/cdn/shop/files/D0925094-6411-40D3-A687-AB5D7BF789DA.jpg?v=1698577908&width=800',
    },
];

export default function CartPage() {
    const [cart, setCart] = useState(mockCart);

    const updateQuantity = (id: string, newQty: number) => {
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)),
        );
    };

    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const router = useRouter();
    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><ShoppingCart /> Giỏ hàng của bạn</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500">Không có sản phẩm nào trong giỏ hàng.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem
                            key={item.id}
                            product={item}
                            onQuantityChange={(qty) => updateQuantity(item.id, qty)}
                            onRemove={() => removeItem(item.id)}
                        />
                    ))}
                    <CartSummary total={total} onCheckout={() => handleCheckout()} />
                </>
            )}
        </main>
    );
}
