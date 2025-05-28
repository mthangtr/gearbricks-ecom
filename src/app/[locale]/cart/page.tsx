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

    const getProductId = (item: CartItemType): string => {
        if (typeof item.product === 'string') {
            return item.product;
        }
        if (typeof item.blindbox === 'string') {
            return item.blindbox;
        }
        return item._id || '';
    };

    const getItemType = (type: 'product' | 'blindboxProduct' | 'blindbox'): 'product' | 'blindbox' => {
        return type === 'blindboxProduct' ? 'product' : 'blindbox';
    };

    return (
        <div className='space-y-6'>
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCart /> Giỏ hàng của bạn
            </h1>

            {cart.items.length === 0 ? (
                <p className="text-gray-500">Không có sản phẩm nào trong giỏ hàng.</p>
            ) : (
                <div className="space-y-4">
                    {cart.items.map((item: CartItemType) => {
                        const productId = getProductId(item);
                        const itemType = getItemType(item.type);
                        return (
                            <CartItem
                                key={item._id}
                                product={item}
                                onQuantityChange={(qty) => updateCartItem(productId, itemType, qty)}
                                onRemove={() => removeFromCart(productId, itemType)}
                            />
                        );
                    })}
                    <CartSummary total={cart.totalPrice} onCheckout={handleCheckout} />
                </div>
            )}
        </div>
    );
}
