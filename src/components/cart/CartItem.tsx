'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import QuantityCounter from '@/components/QuantityCounter';
import { Minus } from 'lucide-react';

type CartItemProps = {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        quantity: number;
    };
    onQuantityChange: (newQty: number) => void;
    onRemove: () => void;
};

export default function CartItem({ product, onQuantityChange, onRemove }: CartItemProps) {
    return (
        <div className="flex items-center gap-4 border-b py-4">
            <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-md object-cover"
            />
            <div className="flex-1">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.price.toLocaleString()}đ</p>
                <div className="mt-2 flex justify-between items-center gap-4">
                    <QuantityCounter
                        value={product.quantity}
                        onChange={(val) => onQuantityChange(val)}
                    />
                    <Button className='cursor-pointer' variant="outline" size="icon" onClick={onRemove}>
                        <Minus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
