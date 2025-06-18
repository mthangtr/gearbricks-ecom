"use client"

import * as React from "react"
import type { Blindbox } from "@/types/global"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Gift,
    DollarSign,
    Package,
    TrendingUp,
    Calendar,
    Hash
} from "lucide-react"
import Image from "next/image"

interface BlindboxDetailProps {
    blindbox: Blindbox
}

export default function BlindboxDetail({ blindbox }: BlindboxDetailProps) {
    const totalProbability = blindbox.products.reduce((sum, item) => sum + item.probability, 0)

    return (
        <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-start gap-4">
                {blindbox.thumbnailUrl ? (
                    <Image
                        src={blindbox.thumbnailUrl}
                        alt={blindbox.title}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                    />
                ) : (
                    <div className="w-30 h-30 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Gift size={40} className="text-gray-400" />
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold">{blindbox.title}</h2>
                    <p className="text-muted-foreground mt-1">{blindbox.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Hash size={14} />
                            {blindbox.slug}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                            Hoạt động
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <DollarSign size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Giá</p>
                                <p className="text-xl font-bold">
                                    {blindbox.price.toLocaleString("vi-VN")} ₫
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Package size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sản phẩm</p>
                                <p className="text-xl font-bold">{blindbox.products.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <TrendingUp size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Lượt quay</p>
                                <p className="text-xl font-bold">{blindbox.totalOpens}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Products List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package size={20} />
                        Danh sách sản phẩm ({blindbox.products.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {blindbox.products.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                            Chưa có sản phẩm nào trong blindbox này.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {blindbox.products.map((productItem, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center gap-4">
                                        {productItem.product.images?.[0] && (
                                            <Image
                                                src={productItem.product.images[0].url}
                                                alt={productItem.product.name}
                                                width={60}
                                                height={60}
                                                className="rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium">{productItem.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {productItem.product.price.toLocaleString("vi-VN")} ₫
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline">
                                                    Xác suất: {productItem.probability}%
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {((productItem.probability / totalProbability) * 100).toFixed(1)}% tổng
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar size={20} />
                        Thông tin bổ sung
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Ngày tạo</p>
                            <p className="font-medium">
                                {new Date(blindbox.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                            <p className="font-medium">
                                {new Date(blindbox.updatedAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 