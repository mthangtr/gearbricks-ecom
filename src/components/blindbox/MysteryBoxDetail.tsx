// components/MysteryBoxDetail.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Gift, PartyPopper } from "lucide-react";
import QuantityCounter from "@/components/QuantityCounter";
import SpinboxWrapper from "@/components/wrapper/SpinboxWrapper";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Blindbox as BlindboxType } from "@/types/global";
import { useState } from "react";
import { Product } from '../../models/Product';

// Nhúng luôn kiểu cho stats tại chỗ
interface MysteryBoxDetailProps {
    blindbox: BlindboxType;
    stats: {
        totalSpins: number;
        winCounts: Record<string, number>;
    };
}

export default function MysteryBoxDetail({
    blindbox,
    stats,
}: MysteryBoxDetailProps) {
    const [showRate, setShowRate] = useState(false);

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
                            Đã có {blindbox.totalOpens.toLocaleString()} lượt mở
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
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-500">
                                Lượt quay: {stats.totalSpins}
                            </span>
                            <Button variant="link" className="text-sm text-gray-500 cursor-pointer">
                                Mua thêm lượt quay ({blindbox.price.toLocaleString()}₫)
                            </Button>
                        </div>
                        <SpinboxWrapper />
                        <div className="flex items-center gap-4">
                            <QuantityCounter />
                            <Button size="lg" className="cursor-pointer">Thêm vào giỏ</Button>
                            <Button variant="secondary" size="lg" className="cursor-pointer">Thanh toán ngay</Button>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p
                            className="text-sm text-gray-500"
                        >{blindbox.description}</p>
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
        </div>
    );
}
