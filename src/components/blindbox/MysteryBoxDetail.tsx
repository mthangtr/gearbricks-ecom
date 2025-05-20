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
    const boxProducts = blindbox.products.map(
        ({ product }) => product.images[0]?.url || ""
    );

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
                    <p className="text-sm text-gray-500 mt-1">
                        Đã có {blindbox.totalOpens.toLocaleString()} lượt mở
                    </p>

                    {/* Carousel */}
                    <div className="mt-4">
                        <ScrollArea className="w-full rounded-md border pb-2">
                            <div className="flex w-max space-x-3 p-2">
                                {boxProducts.map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt={`Prize ${i}`}
                                        width={120}
                                        height={120}
                                        className="rounded-md object-cover flex-shrink-0"
                                    />
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

                    {/* Description & Odds */}
                    <div className="mt-6 text-sm text-gray-600 space-y-4">
                        <p>{blindbox.description}</p>
                        <div className="border rounded-md p-4 bg-gray-50">
                            <h3 className="font-semibold mb-2 text-gray-800">
                                🎯 Tỷ lệ trúng phần thưởng
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                                {blindbox.products.map(({ product, probability }, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{probability}%</span> —{" "}
                                        {product.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
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
