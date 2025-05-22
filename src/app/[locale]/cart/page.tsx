'use client';

import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem as CartItemType } from '@/types/global';

export default function CartPage() {
    const { cart, updateCartItem, removeFromCart } = useCart();
    const router = useRouter();

    const handleCheckout = () => {
        router.push('/checkout');
    };

    return (
        <div className='space-y-6'>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart /> Giỏ hàng của bạn
            </h1>

            {cart.items.length === 0 ? (
                <p className="text-gray-500">Không có sản phẩm nào trong giỏ hàng.</p>
            ) : (
                <>
                    {cart.items.map((item: CartItemType) => (
                        <CartItem
                            key={`${item.type}-${item.id}`}
                            product={item}
                            onQuantityChange={(qty) => updateCartItem(item.id, item.type, qty)}
                            onRemove={() => removeFromCart(item.id, item.type)}
                        />
                    ))}
                    <CartSummary total={cart.totalPrice} onCheckout={handleCheckout} />
                </>
            )}
        </div>
    );
}
