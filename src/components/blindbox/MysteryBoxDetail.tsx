// components/MysteryBoxDetail.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Gift, PartyPopper } from "lucide-react";
import QuantityCounter from "@/components/QuantityCounter";
import SpinboxWrapper from "@/components/blindbox/SpinboxWrapper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Blindbox as BlindboxType } from "@/types/global";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface MysteryBoxDetailProps {
    blindbox: BlindboxType;
    isAuthenticated: boolean;
}

export default function MysteryBoxDetail({
    blindbox,
    isAuthenticated,
}: MysteryBoxDetailProps) {
    const { addToCart } = useCart();
    const [showRate, setShowRate] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [spinCount, setSpinCount] = useState(0);

    useEffect(() => {
        const fetchSpinCount = async () => {
            const response = await fetch("/api/blindbox/get-spin-count");
            const data = await response.json();
            setSpinCount(data.spinCount);
        };
        fetchSpinCount();
    }, []);

    const handleAddToCart = () => {
        addToCart({
            blindbox: blindbox._id,
            type: 'blindbox',
            name: blindbox.title,
            price: blindbox.price,
            thumbnailUrl: blindbox.thumbnailUrl,
            quantity: quantity
        });

        toast.success('Đã thêm vào giỏ hàng');
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left */}
                <div>
                    <Image
                        src={blindbox.thumbnailUrl}
                        alt={blindbox.title}
                        width={400}
                        height={400}
                        className="w-full rounded-xl object-cover"
                        priority
                    />
                </div>

                {/* Right */}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Gift /> {blindbox.title}
                    </h1>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 mt-1">
                            Đã có 100 lượt mở
                        </p>

                        {/* Container tương đối để định vị popup */}
                        <div className="relative">
                            <button
                                onClick={() => setShowRate(!showRate)}
                                className="font-normal text-sm hover:underline cursor-pointer mb-2 text-gray-800"
                            >
                                <span role="img" aria-label="target">🎯</span> Tỷ lệ trúng phần thưởng
                            </button>

                            {showRate && (
                                <div className="absolute top-full left-0 mt-2 w-max min-w-[200px] z-10 text-sm text-gray-600">
                                    <div className="border rounded-md p-4 bg-white shadow-md">
                                        <ul className=" space-y-1 list-none">
                                            {blindbox.products.map(({ product, probability }, i) => (
                                                <li key={i}>
                                                    <span className="font-medium">{probability}%</span> — {product.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Carousel */}
                    <div className="mt-4">
                        <ScrollArea className="w-full rounded-md border pb-2">
                            <div className="flex w-max space-x-3 p-2">
                                {blindbox.products.map(({ product }, i) => (
                                    <div key={i} className="relative group">
                                        <Image
                                            src={product.images[0]?.url || ""}
                                            alt={product.name}
                                            width={120}
                                            height={120}
                                            className="rounded-md object-cover flex-shrink-0"
                                            priority
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white text-xs px-2 py-1 rounded-b-md text-center">
                                            {product.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>


                    {/* Actions */}
                    <div className="mt-6 space-y-6">
                        {isAuthenticated && <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">
                                Lượt quay: {spinCount}
                            </span>
                            <Button variant="link" className="text-sm text-gray-500 cursor-pointer">
                                Mua thêm lượt quay ({blindbox.price.toLocaleString()}₫)
                            </Button>
                        </div>}
                        <SpinboxWrapper
                            blindboxId={blindbox._id}
                            products={blindbox.products.map(({ product }) => product)}
                            isAuthenticated={isAuthenticated}
                            spinCount={spinCount}
                            onSpinComplete={() => {
                                fetch("/api/blindbox/get-spin-count")
                                    .then((res) => res.json())
                                    .then((data) => setSpinCount(data.spinCount));
                            }}
                        />
                        <div className="flex items-center gap-4">
                            <QuantityCounter value={quantity} onChange={setQuantity} />
                            <Button
                                size="lg"
                                className="text-base px-6 py-4 cursor-pointer"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="text-base px-6 py-4 cursor-pointer"
                            >
                                Mua bằng VNPAY
                            </Button>
                        </div>
                    </div>
                    <div className="mt-6 text-sm text-gray-600 leading-relaxed space-y-3">
                        <p>
                            Hộp <strong>Blindbox</strong> bao gồm những mẫu xe mô hình thể thao thuộc dòng như Ferrari, McLaren, Koenigsegg và nhiều hơn nữa.
                            Bạn có thể <span className="text-blue-600 font-medium">quay thử</span> hoặc <span className="text-blue-600 font-medium">mua về nhà</span> để giữ nguyên sự bất ngờ.
                        </p>
                    </div>
                    <div className="mt-2">
                        <h2 className="text-lg font-semibold">Có gì bên trong</h2>
                        <ul className="list-disc list-inside mt-2">
                            <li>1 mô hình xe</li>
                            <li>1 bộ dụng cụ lắp ráp</li>
                            <li>Hướng dẫn lắp ráp chi tiết</li>
                        </ul>
                        <p className="text-base text-foreground mt-2 leading-relaxed">
                            Sản phẩm được đóng gói cẩn thận, đảm bảo an toàn trong quá trình vận chuyển.
                        </p>
                    </div>
                </div>
            </div>
            {/* Recent Spins */}
            <div className="mt-16">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <PartyPopper className="w-5 h-5 text-yellow-500" /> Lượt quay gần đây
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                    {/* Thay bằng dữ liệu thật nếu có */}
                    <li className="border-b pb-2">
                        <strong>user123</strong> vừa quay trúng{" "}
                        <span className="font-medium text-green-600">Ferrari F8</span>
                    </li>
                    <li className="border-b pb-2">
                        <strong>nguyenvana</strong> vừa quay trúng{" "}
                        <span className="font-medium text-green-600">Porsche 911</span>
                    </li>
                </ul>
            </div>
        </div >
    );
}
