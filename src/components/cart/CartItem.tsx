'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/global';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
    product?: CartItemType;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartItem({ product, onQuantityChange, onRemove }: CartItemProps) {

    const getItemType = (type: 'product' | 'blindboxProduct' | 'blindbox'): string => {
        return type === 'blindboxProduct' ? 'Award Product' : type === 'blindbox' ? 'Mystery Box' : 'Product';
    }

    // Kiểm tra xem có phải blindboxProduct không
    const isBlindboxProduct = product?.type === 'blindboxProduct';

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
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
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {getItemType(product?.type || 'product')}
                    </span>
                </div>
                <p className="text-gray-600">{product?.price.toLocaleString('vi-VN')}đ</p>
            </div>

            {/* Hiển thị số lượng - khác nhau cho blindboxProduct */}
            <div className="flex items-center gap-2">
                {isBlindboxProduct ? (
                    // Đối với blindboxProduct, chỉ hiển thị số lượng
                    <div className="flex flex-col items-center">
                        <span className="w-8 text-center font-medium text-gray-700">
                            {product?.quantity}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Không thể chỉnh sửa</span>
                    </div>
                ) : (
                    // Đối với sản phẩm thường, hiển thị nút tăng giảm
                    <>
                        <button
                            onClick={() => onQuantityChange((product?.quantity ?? 0) - 1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{product?.quantity}</span>
                        <button
                            onClick={() => onQuantityChange((product?.quantity ?? 0) + 1)}
                            className="p-1 hover:bg-gray-100 rounded"
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
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                    <Trash2 size={20} />
                </button>
            )}
        </div>
    );
}
