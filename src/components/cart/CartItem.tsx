'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/global';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect, useRef } from 'react';

interface CartItemProps {
    product?: CartItemType;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartItem({ product, onQuantityChange, onRemove }: CartItemProps) {
    const { updateCartItem } = useCart();

    // Local state cho quantity
    const [localQuantity, setLocalQuantity] = useState(product?.quantity || 0);
    const [isUpdating, setIsUpdating] = useState(false);

    // Debounce timer
    const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Cập nhật local state khi product thay đổi
    useEffect(() => {
        setLocalQuantity(product?.quantity || 0);
    }, [product?.quantity]);

    // Cleanup timer khi component unmount
    useEffect(() => {
        return () => {
            if (updateTimerRef.current) {
                clearTimeout(updateTimerRef.current);
            }
        };
    }, []);

    const getItemType = (type: 'product' | 'blindboxProduct' | 'blindbox'): string => {
        return type === 'blindboxProduct' ? 'Sản phẩm trúng thưởng' : type === 'blindbox' ? 'Mystery Box' : 'Sản phẩm';
    }

    const getItemTypeColor = (type: 'product' | 'blindboxProduct' | 'blindbox'): string => {
        return type === 'blindboxProduct' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            type === 'blindbox' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                'bg-primary/10';
    }

    // Kiểm tra xem có phải blindboxProduct không
    const isBlindboxProduct = product?.type === 'blindboxProduct';

    // Hàm debounced để gọi API
    const debouncedUpdate = (newQuantity: number) => {
        // Clear timer cũ nếu có
        if (updateTimerRef.current) {
            clearTimeout(updateTimerRef.current);
        }

        // Set timer mới
        updateTimerRef.current = setTimeout(async () => {
            if (!product) return;

            const productId = typeof product.product === 'string' ? product.product :
                typeof product.product === 'object' ? product.product?._id :
                    typeof product.blindbox === 'string' ? product.blindbox :
                        typeof product.blindbox === 'object' ? product.blindbox?._id : '';

            const itemType = product.type === 'blindboxProduct' || product.type === 'product' ? 'product' : 'blindbox';

            setIsUpdating(true);
            await updateCartItem(productId, itemType, newQuantity);
            setIsUpdating(false);
        }, 500); // Debounce 500ms
    };

    // Hàm xử lý tăng số lượng
    const handleIncrease = () => {
        if (!product || isBlindboxProduct) return;

        const newQuantity = localQuantity + 1;
        setLocalQuantity(newQuantity); // Cập nhật UI ngay lập tức

        // Gọi debounced function để sync với backend
        debouncedUpdate(newQuantity);
    };

    // Hàm xử lý giảm số lượng
    const handleDecrease = () => {
        if (!product || isBlindboxProduct || localQuantity <= 1) return;

        const newQuantity = localQuantity - 1;
        setLocalQuantity(newQuantity); // Cập nhật UI ngay lập tức

        // Gọi debounced function để sync với backend
        debouncedUpdate(newQuantity);
    };

    return (
        <div className={`flex items-center gap-4 p-4 border rounded-lg transition-all duration-200`}>
            <div className="relative w-24 h-24">
                <Image
                    src={product?.thumbnailUrl || ''}
                    alt={product?.name || ''}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 96px) 100vw, 96px"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{product?.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-foreground font-medium ${getItemTypeColor(product?.type || 'product')}`}>
                        {getItemType(product?.type || 'product')}
                    </span>
                </div>
                <p className="text-gray-600">
                    {isBlindboxProduct ? (
                        <span className="text-green-600 font-medium">Miễn phí (từ blindbox)</span>
                    ) : (
                        `${product?.price.toLocaleString('vi-VN')}đ`
                    )}
                </p>
            </div>

            {/* Hiển thị số lượng - khác nhau cho blindboxProduct */}
            <div className="flex items-center gap-2">
                {isBlindboxProduct ? (
                    // Đối với blindboxProduct, chỉ hiển thị số lượng
                    <div className="flex flex-col items-center">
                        <span className="w-8 text-center font-medium text-gray-700">
                            {localQuantity}
                        </span>
                    </div>
                ) : (
                    // Đối với sản phẩm thường, hiển thị nút tăng giảm
                    <>
                        <button
                            onClick={handleDecrease}
                            className={`p-1 rounded transition-colors ${localQuantity <= 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'hover:bg-gray-100'
                                }`}
                            disabled={localQuantity <= 1 || isUpdating}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">{localQuantity}</span>
                        <button
                            onClick={handleIncrease}
                            className={`p-1 rounded transition-colors ${isUpdating ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'
                                }`}
                            disabled={isUpdating}
                        >
                            <Plus size={16} />
                        </button>
                    </>
                )}
            </div>

            {/* Nút xóa - ẩn cho blindboxProduct */}
            {!isBlindboxProduct && (
                <button
                    onClick={onRemove}
                    className={`p-2 rounded transition-colors ${isUpdating ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'
                        }`}
                    disabled={isUpdating}
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>
    );
}
