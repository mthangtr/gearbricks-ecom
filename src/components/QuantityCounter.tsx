// components/QuantityCounter.tsx
'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function QuantityCounter({ value = 1, onChange }: { value?: number, onChange?: (val: number) => void }) {
    const [count, setCount] = useState(value);

    const handleDecrement = () => {
        if (count > 1) {
            const newVal = count - 1;
            setCount(newVal);
            onChange?.(newVal);
        }
    };

    const handleIncrement = () => {
        const newVal = count + 1;
        setCount(newVal);
        onChange?.(newVal);
    };

    return (
        <div className="flex items-center border rounded-md overflow-hidden w-fit">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                className="rounded-none cursor-pointer"
            >
                <Minus className="w-4 h-4" />
            </Button>
            <div className="px-4 text-base font-medium">{count}</div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                className="rounded-none cursor-pointer"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}
