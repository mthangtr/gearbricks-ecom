"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import type { Blindbox, Product } from "@/types/global"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { X, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface EditBlindBoxProps {
    blindbox: Blindbox
    onSuccess: (updatedBlindbox: Blindbox) => void
    onCancel: () => void
}

export default function EditBlindBox({ blindbox, onSuccess, onCancel }: EditBlindBoxProps) {
    const [formData, setFormData] = useState({
        title: blindbox.title,
        description: blindbox.description,
        price: blindbox.price,
        thumbnailUrl: blindbox.thumbnailUrl,
        products: blindbox.products
    })
    const [availableProducts, setAvailableProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)

    // Fetch available products
    useEffect(() => {
        setIsLoadingProducts(true)
        fetch("/api/products")
            .then((res) => res.json())
            .then((data: { products: Product[] }) => {
                setAvailableProducts(data.products)
            })
            .catch(error => {
                console.error("Error fetching products:", error)
                toast.error("Không thể tải danh sách sản phẩm")
            })
            .finally(() => setIsLoadingProducts(false))
    }, [])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAddProduct = () => {
        if (availableProducts.length > 0) {
            const newProduct = {
                product: availableProducts[0],
                probability: 1
            }
            setFormData(prev => ({
                ...prev,
                products: [...prev.products, newProduct]
            }))
        }
    }

    const handleRemoveProduct = (index: number) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }))
    }

    const handleProductChange = (index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map((productItem, i) =>
                i === index ? { ...productItem, [field]: value } : productItem
            )
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch(`/api/admin/blindbox/${blindbox._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const updatedBlindbox = await response.json()
                onSuccess(updatedBlindbox.blindbox)
            } else {
                throw new Error("Cập nhật blindbox thất bại")
            }
        } catch (error) {
            console.error("Error updating blindbox:", error)
            toast.error("Không thể cập nhật blindbox")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tên blindbox *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Nhập tên blindbox"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Giá (VNĐ) *</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
                                placeholder="Nhập giá"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Nhập mô tả blindbox"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="thumbnailUrl">URL ảnh đại diện</Label>
                        <Input
                            id="thumbnailUrl"
                            value={formData.thumbnailUrl}
                            onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
                            placeholder="Nhập URL ảnh"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Products Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Quản lý sản phẩm
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddProduct}
                            disabled={isLoadingProducts || availableProducts.length === 0}
                        >
                            <Plus size={16} className="mr-2" />
                            Thêm sản phẩm
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {formData.products.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Chưa có sản phẩm nào. Hãy thêm sản phẩm vào blindbox.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {formData.products.map((productItem, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Sản phẩm {index + 1}</h4>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveProduct(index)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Sản phẩm</Label>
                                            <select
                                                value={productItem.product._id}
                                                onChange={(e) => {
                                                    const selectedProduct = availableProducts.find(p => p._id === e.target.value)
                                                    if (selectedProduct) {
                                                        handleProductChange(index, "product", selectedProduct)
                                                    }
                                                }}
                                                className="w-full p-2 border rounded-md"
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {availableProducts.map((product) => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Xác suất (1-100)</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={productItem.probability}
                                                onChange={(e) => handleProductChange(index, "probability", parseInt(e.target.value))}
                                                placeholder="Xác suất"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            {productItem.product.images?.[0] && (
                                                <Image
                                                    src={productItem.product.images[0].url}
                                                    alt={productItem.product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">{productItem.product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {productItem.product.price.toLocaleString("vi-VN")} ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật blindbox"}
                </Button>
            </div>
        </form>
    )
} 