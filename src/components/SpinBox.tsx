'use client';

import { useState } from 'react';
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
    const [spinning, setSpinning] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const [prize, setPrize] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleSpin = () => {
        if (spinning) return;

        setSpinning(true);
        setPrize(null);
        setAnimationClass('animate-infinite-scroll');

        const randomIndex = Math.floor(Math.random() * boxProducts.length);
        const selected = boxProducts[randomIndex];

        setTimeout(() => {
            setAnimationClass(''); // stop animation
            setPrize(selected);
            setShowDialog(true);
            setSpinning(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            {/* Strip animation */}
            <div className="overflow-hidden border rounded-lg h-[140px] relative">
                <div
                    className={`flex gap-4 px-4 py-2 w-max ${animationClass}`}
                >
                    {[...boxProducts, ...boxProducts].map((src, idx) => (
                        <Image
                            key={idx}
                            src={src}
                            alt={`Item ${idx}`}
                            width={120}
                            height={120}
                            className="rounded-md flex-shrink-0 object-cover"
                        />
                    ))}
                </div>
            </div>

            <Button onClick={handleSpin} disabled={spinning} className="w-full cursor-pointer">
                {spinning ? 'Đang quay...' : '🎰 Quay ngay'}
            </Button>

            {/* Kết quả trúng */}
            {showDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative rounded-xl shadow-lg p-6 w-full max-w-md animate-scaleIn bg-white">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold flex items-center justify-center gap-2 text-green-600 mb-4">
                                <PartyPopper className="w-6 h-6" /> Bạn đã trúng!
                            </h2>

                            {prize && (
                                <Image
                                    src={prize}
                                    alt="Prize"
                                    width={200}
                                    height={200}
                                    className="rounded-xl mx-auto shadow"
                                />
                            )}

                            <p className="mt-4 text-sm text-gray-600">
                                Chúc mừng bạn đã quay trúng phần thưởng này!
                            </p>

                            <button
                                onClick={() => setShowDialog(false)}
                                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
