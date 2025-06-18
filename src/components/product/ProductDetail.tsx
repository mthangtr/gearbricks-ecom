"use client"

import { Product } from "@/types/global"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Calendar, Tag, DollarSign, Package, TrendingUp } from "lucide-react"

interface ProductDetailProps {
    product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            {/* Product Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="relative w-full h-80 overflow-hidden rounded-lg border">
                        <Image
                            src={product.images[0]?.url || '/placeholder-image.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(1).map((image, index) => (
                                <div key={index} className="relative w-full h-20 overflow-hidden rounded border">
                                    <Image
                                        src={image.url}
                                        alt={`${product.name} - ${index + 2}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <p className="text-muted-foreground">{product.slug}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {product.category.name}
                        </Badge>
                        {product.inStock ? (
                            <Badge className="bg-green-100 text-green-800">
                                Còn hàng
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                Hết hàng
                            </Badge>
                        )}
                    </div>

                    <div className="text-3xl font-bold text-primary">
                        {product.price.toLocaleString('vi-VN')} ₫
                    </div>

                    {product.colors.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Màu sắc:</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color, index) => (
                                    <Badge key={index} variant="outline">
                                        {color}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Separator />

            {/* Product Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã bán</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{product.sold}</div>
                        <p className="text-xs text-muted-foreground">
                            Sản phẩm đã được bán
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tình trạng tồn kho
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giá</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {product.price.toLocaleString('vi-VN')} ₫
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Giá bán hiện tại
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Thông tin tạo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                            <span className="text-sm font-medium">
                                {formatDate(product.createdAt)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Cập nhật lần cuối:</span>
                            <span className="text-sm font-medium">
                                {formatDate(product.updatedAt)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Thông tin danh mục
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Danh mục:</span>
                            <Badge variant="secondary">
                                {product.category.name}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">ID danh mục:</span>
                            <span className="text-sm font-mono text-xs">
                                {product.category._id}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Product ID */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Product ID:</span>
                            <span className="text-sm font-mono">{product._id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Slug:</span>
                            <span className="text-sm font-mono">{product.slug}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 