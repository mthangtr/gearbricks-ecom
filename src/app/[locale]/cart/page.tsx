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
        // Xử lý product
        if (item.product) {
            if (typeof item.product === 'string') {
                return item.product;
            }
            if (typeof item.product === 'object' && item.product._id) {
                return item.product._id;
            }
        }

        // Xử lý blindbox
        if (item.blindbox) {
            if (typeof item.blindbox === 'string') {
                return item.blindbox;
            }
            if (typeof item.blindbox === 'object' && item.blindbox._id) {
                return item.blindbox._id;
            }
        }

        // Fallback
        return item._id || '';
    };

    const getItemType = (type: 'product' | 'blindboxProduct' | 'blindbox'): 'product' | 'blindbox' => {
        if (type === 'blindboxProduct' || type === 'product') {
            return 'product';
        }
        return 'blindbox';
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
                        const isBlindboxProduct = item.type === 'blindboxProduct';

                        return (
                            <CartItem
                                key={item._id}
                                product={item}
                                onQuantityChange={(qty) => {
                                    // Chỉ cho phép thay đổi số lượng nếu không phải blindboxProduct
                                    if (!isBlindboxProduct) {
                                        updateCartItem(productId, itemType, qty);
                                    }
                                }}
                                onRemove={() => {
                                    // Chỉ cho phép xóa nếu không phải blindboxProduct
                                    if (!isBlindboxProduct) {
                                        removeFromCart(productId, itemType);
                                    }
                                }}
                            />
                        );
                    })}
                    <CartSummary total={cart.totalPrice} onCheckout={handleCheckout} />
                </div>
            )}
        </div>
    );
}
