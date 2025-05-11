'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
                <div className="mt-2 flex items-center gap-2">
                    <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => onQuantityChange(Number(e.target.value))}
                        className="w-20"
                        min={1}
                    />
                    <Button variant="destructive" size="sm" onClick={onRemove}>
                        Xóa
                    </Button>
                </div>
            </div>
        </div>
    );
}
