'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import type { SpinResponse, Product } from '@/types/global';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

interface SpinBoxProps {
    products?: Product[];
    blindboxId: string;
    onSpinComplete?: () => void;
}

export default function SpinBox({ products = [], blindboxId, onSpinComplete }: SpinBoxProps) {
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
    const [wonProduct, setWonProduct] = useState<Product | null>(null);

    const { cart, refreshCart } = useCart();
    const router = useRouter();

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
        setWonProduct(null);
        setOffset(0);

        try {
            const res = await fetch('/api/blindbox/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blindboxId })
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.message || 'Có lỗi xảy ra khi quay');
                setSpinning(false);
                return;
            }

            const { prizeIndex, prizeProduct }: SpinResponse = await res.json();
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
                setWonProduct(prizeProduct);
                setShowDialog(true);
                setSpinning(false);

                // Cập nhật spin count
                onSpinComplete?.();

                // Cập nhật giỏ hàng ngay lập tức
                refreshCart();

                // Hiển thị thông báo thành công với thông tin chi tiết
                toast.success(
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-green-700 flex items-center gap-2">
                            <span className="text-xl">🎉</span>
                            Chúc mừng! Bạn đã trúng thưởng!
                        </div>
                        <div className="text-sm">
                            <strong>{prizeProduct.name}</strong> đã được tự động thêm vào giỏ hàng.
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="text-green-500">✓</span>
                            Sản phẩm này miễn phí vì bạn đã trả tiền cho blindbox.
                        </div>
                    </div>,
                    {
                        duration: 6000,
                        action: {
                            label: 'Xem giỏ hàng',
                            onClick: () => router.push('/cart')
                        }
                    }
                );
            }, SPIN_DURATION + 50);
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi quay');
            setSpinning(false);
        }
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setWonProduct(null);
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
            {showDialog && prizeUrl && wonProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="max-w-md rounded-xl bg-white p-6 shadow-lg animate-scaleIn">
                        <div className="text-center">
                            <div className="mb-4 flex items-center justify-center gap-2 text-xl font-semibold text-green-600">
                                <PartyPopper className="h-6 w-6" />
                                <span>Bạn đã trúng!</span>
                            </div>
                            <div className="relative mb-4">
                                <Image
                                    src={prizeUrl}
                                    alt="Prize"
                                    width={200}
                                    height={200}
                                    className="mx-auto rounded-xl shadow"
                                />
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    🎁 Miễn phí
                                </div>
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">{wonProduct.name}</h3>
                            <p className="mb-4 text-sm text-gray-600">
                                Chúc mừng bạn đã quay trúng phần thưởng này!
                                Sản phẩm đã được tự động thêm vào giỏ hàng.
                            </p>
                            <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="text-xs text-green-700 flex items-center gap-1">
                                    <span className="text-green-500">✓</span>
                                    Sản phẩm này miễn phí vì bạn đã trả tiền cho blindbox
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="secondary"
                                    onClick={handleCloseDialog}
                                    className="px-6 py-2 rounded-md cursor-pointer"
                                >
                                    Đóng
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        handleCloseDialog();
                                        router.push('/cart');
                                    }}
                                    className="px-6 py-2 rounded-md cursor-pointer bg-blue-600 hover:bg-blue-700"
                                >
                                    Xem giỏ hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}