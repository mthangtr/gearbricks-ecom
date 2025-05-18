'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';

const boxProducts = [
    'https://minibricks.com/cdn/shop/files/6CA83CCB-A18B-4718-8D04-DB15B09730C6.jpg?v=1745826847&width=800',
    'https://minibricks.com/cdn/shop/files/472FBA36-A090-4473-9591-BC6F313DB32E.jpg?v=1744303843&width=800',
    'https://minibricks.com/cdn/shop/files/CBD0A633-F855-4AC8-B216-94712FC12948.jpg?v=1743789249&width=800',
    'https://minibricks.com/cdn/shop/files/9DEF02DE-B2DE-4393-B43D-A3E011FF9D76.jpg?v=1743495928&width=800',
    'https://minibricks.com/cdn/shop/files/FADFAEB2-E9CF-456D-B722-A073CB57A01E.jpg?v=1742554183&width=800',
    'https://minibricks.com/cdn/shop/files/FA2E9278-D51E-419A-92B3-964E44835340.jpg?v=1739889067&width=800',
    'https://minibricks.com/cdn/shop/files/3BF55F4B-C8D4-4679-BEC0-07A490C7B8D3.jpg?v=1739432195&width=800',
];

export default function SpinBox() {
    const itemWidth = 138; // 130px image + 8px gap
    const visibleItems = 5;
    const centerIndex = Math.floor(visibleItems / 2);
    const loopCount = 10;

    const extendedProducts = Array(loopCount).fill(boxProducts).flat();
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [translateX, setTranslateX] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setPrize(null);
        setShowDialog(false);

        // Reset position without transition
        setTransitionEnabled(false);
        setTranslateX(0);

        // Calculate target
        const finalIndex = Math.floor(Math.random() * boxProducts.length);
        const middleOfLoop = Math.floor(extendedProducts.length / 2);
        const targetIndex = middleOfLoop + finalIndex;
        const targetTranslateX = itemWidth * (targetIndex - centerIndex);

        // Next frame: enable transition & spin
        requestAnimationFrame(() => {
            setTransitionEnabled(true);
            setTranslateX(targetTranslateX);
        });

        // After animation ends
        setTimeout(() => {
            setPrize(boxProducts[finalIndex]);
            setShowDialog(true);
            setSpinning(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div
                className="relative border rounded-lg h-[150px] overflow-hidden p-2"
                style={{ width: `${visibleItems * itemWidth + 16}px` }}  // +16 = 8px padding trái + 8px phải
            >
                {/* 2) Frame ở giữa, width = chính xác itemWidth */}
                <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full z-10 pointer-events-none"
                    style={{ width: `${itemWidth}px` }}
                >
                    <div className="border-4 border-red-500 h-full rounded-md" />
                </div>

                {/* 3) Strip như cũ */}
                <div
                    ref={containerRef}
                    className={`${transitionEnabled ? 'transition-transform duration-[3000ms] ease-out ' : ''}flex gap-2`}
                    style={{ transform: `translateX(${-translateX}px)` }}
                >
                    {extendedProducts.map((src, idx) => (
                        <Image
                            key={idx}
                            src={src}
                            alt={`Item ${idx}`}
                            width={130}
                            height={130}
                            className="rounded-md object-cover flex-shrink-0"
                        />
                    ))}
                </div>
            </div>

            <Button onClick={handleSpin} disabled={spinning} className="w-full cursor-pointer text-base">
                {spinning ? 'Đang quay...' : '🎰 Quay ngay'}
            </Button>

            {showDialog && prize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-6 shadow-lg max-w-md animate-scaleIn">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold flex items-center justify-center gap-2 text-green-600 mb-4">
                                <PartyPopper className="w-6 h-6" /> Bạn đã trúng!
                            </h2>
                            <Image
                                src={prize}
                                alt="Prize"
                                width={200}
                                height={200}
                                className="rounded-xl mx-auto shadow"
                            />
                            <p className="mt-4 text-sm text-gray-600">
                                Chúc mừng bạn đã quay trúng phần thưởng này!
                            </p>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDialog(false)}
                                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md cursor-pointer"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}