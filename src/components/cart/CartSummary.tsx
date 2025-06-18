'use client';

import { Button } from '@/components/ui/button';

type CartSummaryProps = {
    total: number;
    onCheckout: () => void;
};

export default function CartSummary({ total, onCheckout }: CartSummaryProps) {
    console.log('CartSummary received total:', total);

    return (
        <div className="mt-8 border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}đ</span>
            </div>
            <Button size="lg" className="w-full mt-4 cursor-pointer" onClick={onCheckout}>
                Check out
            </Button>
        </div>
    );
}
