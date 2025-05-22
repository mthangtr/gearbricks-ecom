'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/global';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
    product: CartItemType;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function CartItem({ product, onQuantityChange, onRemove }: CartItemProps) {
    const { name, price, quantity, image, type } = product;

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="relative w-24 h-24">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{name}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {type === 'blindbox' ? 'Mystery Box' : 'Product'}
                    </span>
                </div>
                <p className="text-gray-600">{price.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onQuantityChange(quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                    onClick={() => onQuantityChange(quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <Plus size={16} />
                </button>
            </div>
            <button
                onClick={onRemove}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
}
