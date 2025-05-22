'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import type { SpinResponse, Product } from '@/types/global';

interface SpinBoxProps {
    products?: Product[];
    blindboxId: string;
}

export default function SpinBox({ products = [], blindboxId }: SpinBoxProps) {
    const ITEM_SIZE = 130;
    const GAP = 8;
    const PAD = 16;
    const LOOP_COUNT = 10;
    const SPIN_DURATION = 3000;

    const [visible, setVisible] = useState(5);
    const [offset, setOffset] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [prizeUrl, setPrizeUrl] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    const productImages = products.map(p => p.images?.[0]?.url || '/placeholder.png');
    const items = productImages.length
        ? Array(LOOP_COUNT).fill(productImages).flat()
        : Array(LOOP_COUNT * 5).fill('/placeholder.png');
    const centerSlot = Math.floor(visible / 2);

    useEffect(() => {
        const onResize = () => {
            const w = window.innerWidth;
            setVisible(w < 480 ? 1 : w < 768 ? 3 : 5);
        };
        window.addEventListener('resize', onResize);
        onResize();
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const containerWidth = visible * ITEM_SIZE + (visible - 1) * GAP + PAD;

    const handleSpin = async () => {
        if (spinning || products.length === 0) return;
        setSpinning(true);
        setAnimate(false);
        setShowDialog(false);
        setPrizeUrl(null);
        setOffset(0);

        // Start API call
        const { prizeIndex, prizeProduct } = await fetch('/api/blindbox/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blindboxId })
        }).then(res => {
            if (!res.ok) throw new Error('Spin failed');
            return res.json() as Promise<SpinResponse>;
        });

        const mid = Math.floor(items.length / 2);
        const targetIndex = mid + prizeIndex;
        const step = ITEM_SIZE + GAP;
        const targetOffset = step * (targetIndex - centerSlot);

        setTimeout(() => {
            setAnimate(true);
            setOffset(targetOffset);
        }, 50);
        setTimeout(() => {
            setPrizeUrl(prizeProduct.images?.[0]?.url || '/placeholder.png');
            setShowDialog(true);
            setSpinning(false);
        }, SPIN_DURATION + 50);
    };

    return (
        <div className="space-y-6">
            <div
                className="relative mx-auto overflow-hidden rounded-lg border p-2"
                style={{ width: `${containerWidth}px` }}
            >
                <div className="absolute inset-y-2 left-1/2 transform -translate-x-1/2 pointer-events-none z-10">
                    <div className="w-[132px] h-[130px] border-4 border-red-500 rounded-md" />
                </div>
                <div
                    className={`flex gap-2 ${animate ? 'transition-transform duration-[3000ms] ease-out' : ''}`}
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
            <Button
                onClick={handleSpin}
                disabled={spinning}
                className="w-full text-base bg-red-600 hover:bg-red-700 cursor-pointer"
            >
                {spinning ? 'Đang quay...' : '🎰 Quay ngay'}
            </Button>
            {showDialog && prizeUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="max-w-md rounded-xl bg-white p-6 shadow-lg animate-scaleIn">
                        <div className="text-center">
                            <h2 className="mb-4 flex items-center justify-center gap-2 text-xl font-semibold text-green-600">
                                <PartyPopper className="h-6 w-6" /> Bạn đã trúng!
                            </h2>
                            <Image
                                src={prizeUrl}
                                alt="Prize"
                                width={200}
                                height={200}
                                className="mx-auto mb-4 rounded-xl shadow"
                            />
                            <p className="mb-6 text-sm text-gray-600">Chúc mừng bạn đã quay trúng phần thưởng này!</p>
                            <Button variant="secondary" onClick={() => setShowDialog(false)} className="px-6 py-2 rounded-md cursor-pointer">
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}