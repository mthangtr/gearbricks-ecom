"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import SpinBox from '@/components/SpinBox';
import { X } from 'lucide-react';
import type { Product } from '@/types/global';

interface SpinboxWrapperProps {
    blindboxId: string;
    products: Product[];
}

function SpinboxWrapper({ blindboxId, products }: SpinboxWrapperProps) {
    const [showSpin, setShowSpin] = useState(false);

    const visibleItems = 5;
    const itemWidth = 150;

    const containerWidth = itemWidth * visibleItems;

    return (
        <>
            <Button variant="default" size="lg" className="w-full cursor-pointer
                            text-base bg-red-600 hover:bg-red-700"
                onClick={() => setShowSpin(true)}
                disabled={!products?.length}>
                {!products?.length ? 'Đang tải...' : 'Quay'}
            </Button>
            {showSpin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className={`relative p-6 animate-scaleIn`} style={{ width: `${containerWidth}px` }}>
                        <SpinBox products={products} blindboxId={blindboxId} />
                    </div>
                    <Button
                        size="icon"
                        onClick={() => setShowSpin(false)}
                        className="absolute top-4 right-4 cursor-pointer"
                    >
                        <X className="w-6 h-6 text-white" />
                    </Button>
                </div>
            )}
        </>
    );
}

export default SpinboxWrapper;