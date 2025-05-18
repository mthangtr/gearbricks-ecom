'use client';

import { useState, useEffect, useRef } from 'react';
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
    const ITEM_SIZE = 130;     // px
    const GAP = 8;             // px between items
    const PAD = 16;            // px total horizontal padding (p-2)
    const LOOP_COUNT = 10;

    const [visible, setVisible] = useState(5);
    const [offset, setOffset] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [prize, setPrize] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [animate, setAnimate] = useState(false);

    const items = Array(LOOP_COUNT).fill(boxProducts).flat();
    const centerSlot = Math.floor(visible / 2);

    // responsive breakpoints
    useEffect(() => {
        const onResize = () => {
            const w = window.innerWidth;
            if (w < 480) setVisible(1);
            else if (w < 768) setVisible(3);
            else setVisible(5);
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // calculate container width exactly
    const containerWidth =
        visible * ITEM_SIZE +
        (visible - 1) * GAP +
        PAD;

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setAnimate(false);
        setOffset(0);

        // pick random prize index and compute target offset
        const prizeIdx = Math.floor(Math.random() * boxProducts.length);
        const mid = Math.floor(items.length / 2);
        const targetIndex = mid + prizeIdx;
        const step = ITEM_SIZE + GAP;
        const targetOffset = step * (targetIndex - centerSlot);

        // small timeout to ensure reset applies without transition
        setTimeout(() => {
            setAnimate(true);
            setOffset(targetOffset);
        }, 50);

        // show prize dialog after animation
        setTimeout(() => {
            setPrize(boxProducts[prizeIdx]);
            setShowDialog(true);
            setSpinning(false);
        }, 3050);
    };

    return (
        <div className="space-y-6">
            {/* spinner container */}
            <div
                className="relative mx-auto overflow-hidden rounded-lg border p-2"
                style={{ width: `${containerWidth}px` }}
            >
                {/* static overlay ring at center */}
                <div className="absolute inset-y-2 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
                    <div
                        className="w-[132px] h-[130px] border-4 border-red-500 rounded-md"
                    />
                </div>

                {/* strip of items */}
                <div
                    className={`flex gap-2 ${animate ? 'transition-transform duration-[3000ms] ease-out' : ''
                        }`}
                    style={{ transform: `translateX(${-offset}px)` }}
                >
                    {items.map((src, idx) => (
                        <div
                            key={idx}
                            className="flex-shrink-0"
                            style={{ width: `${ITEM_SIZE}px`, height: `${ITEM_SIZE}px` }}
                        >
                            <Image
                                src={src}
                                alt={`Item ${idx}`}
                                width={ITEM_SIZE}
                                height={ITEM_SIZE}
                                className="rounded-md object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* spin button */}
            <Button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full text-base cursor-pointer bg-red-600 hover:bg-red-700"
            >
                {spinning ? 'Đang quay...' : '🎰 Quay ngay'}
            </Button>

            {/* prize dialog */}
            {showDialog && prize && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="max-w-md rounded-xl bg-white p-6 shadow-lg animate-scaleIn">
                        <div className="text-center">
                            <h2 className="mb-4 flex items-center justify-center gap-2 text-xl font-semibold text-green-600">
                                <PartyPopper className="h-6 w-6" /> Bạn đã trúng!
                            </h2>
                            <Image
                                src={prize}
                                alt="Prize"
                                width={200}
                                height={200}
                                className="mx-auto mb-4 rounded-xl shadow"
                            />
                            <p className="mb-6 text-sm text-gray-600">
                                Chúc mừng bạn đã quay trúng phần thưởng này!
                            </p>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDialog(false)}
                                className="px-6 py-2 rounded-md cursor-pointer"
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
