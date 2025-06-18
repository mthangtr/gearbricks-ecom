"use client";
import React, { useState, useEffect } from "react";
import { Product } from "@/types/global";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Blindbox } from "@/types/global";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreateBlindBoxProps {
    onSuccess: (newBlindbox: Blindbox) => void
}

type FormProduct = {
    product: Product | null
    probability: number
}

function makeSlug(str: string) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s-]+/g, "-")
}

const validateProbability = (items: FormProduct[]) => {
    const totalProbability = items.reduce((acc, item) => {
        return acc + (item.probability || 0)
    }, 0)
    return totalProbability === 100
}

export default function CreateBlindBox({ onSuccess }: CreateBlindBoxProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        thumbnailUrl: "",
        products: [{ product: null, probability: 0 }] as FormProduct[]
    })
    const [availableProducts, setAvailableProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProducts, setIsLoadingProducts] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

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
        setFormData(prev => ({
            ...prev,
            products: [...prev.products, { product: null, probability: 0 }]
        }))
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

    // Handle thumbnail upload
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setUploadError(null)

        try {
            const fd = new FormData()
            fd.append("file", file)
            const res = await fetch("/api/upload", { method: "POST", body: fd })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Upload failed")
            }

            const data = await res.json()
            handleInputChange("thumbnailUrl", data.url)
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    // Auto calculate probability
    const handleAutoCalculateProbability = () => {
        const selectedProducts = formData.products.filter(item => item.product)

        if (selectedProducts.length === 0) {
            toast.error("Hãy chọn ít nhất một sản phẩm")
            return
        }

        const categoryWeights: Record<string, number> = {
            "super-car": 3,
            "race-car": 2,
            "classic-car": 1,
        }

        const weighted = selectedProducts.map(item => {
            const product = item.product!
            const catKey = product.category?.name?.toLowerCase().replace(/\s+/g, '') ?? ''
            const weight = categoryWeights[catKey] || 1
            return { product, weight }
        })

        const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0)

        const updatedProducts = formData.products.map(item => {
            if (!item.product) return item

            const weightedItem = weighted.find(w => w.product._id === item.product!._id)
            if (!weightedItem) return item

            const probability = Math.round((weightedItem.weight / totalWeight) * 100)
            return { ...item, probability }
        })

        setFormData(prev => ({
            ...prev,
            products: updatedProducts
        }))

        toast.success("Đã tính toán xác suất tự động")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!formData.thumbnailUrl) {
            toast.error("Bạn cần upload ảnh thumbnail trước khi lưu")
            setIsLoading(false)
            return
        }

        if (!validateProbability(formData.products)) {
            toast.error("Tổng xác suất phải bằng 100%")
            setIsLoading(false)
            return
        }

        const validProducts = formData.products.filter(item => item.product && item.probability > 0)
        if (validProducts.length === 0) {
            toast.error("Hãy chọn ít nhất một sản phẩm")
            setIsLoading(false)
            return
        }

        try {
            const payload = {
                title: formData.title,
                slug: makeSlug(formData.title),
                description: formData.description,
                price: formData.price,
                thumbnailUrl: formData.thumbnailUrl,
                products: validProducts.map(item => ({
                    product: item.product!._id,
                    probability: item.probability
                }))
            }

            const response = await fetch("/api/admin/blindbox", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (response.ok) {
                const result = await response.json()
                onSuccess(result.blindbox)

                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    price: 0,
                    thumbnailUrl: "",
                    products: [{ product: null, probability: 0 }]
                })
            } else {
                throw new Error("Tạo blindbox thất bại")
            }
        } catch (error) {
            console.error("Error creating blindbox:", error)
            toast.error("Không thể tạo blindbox")
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
                        <Label htmlFor="thumbnail">Ảnh đại diện *</Label>
                        <Input
                            id="thumbnail"
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            className="cursor-pointer"
                        />
                        {uploading && <p className="text-sm text-muted-foreground">Đang upload...</p>}
                        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                        {formData.thumbnailUrl && (
                            <Image
                                src={formData.thumbnailUrl}
                                alt="Preview"
                                width={128}
                                height={128}
                                className="mt-2 rounded-lg object-cover"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Products Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Quản lý sản phẩm
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAutoCalculateProbability}
                                disabled={isLoadingProducts}
                            >
                                Tự động tính xác suất
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddProduct}
                                disabled={isLoadingProducts}
                            >
                                <Plus size={16} className="mr-2" />
                                Thêm sản phẩm
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                                            value={productItem.product?._id || ""}
                                            onChange={(e) => {
                                                const selectedProduct = availableProducts.find(p => p._id === e.target.value)
                                                handleProductChange(index, "product", selectedProduct || null)
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
                                {productItem.product && (
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
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Probability Summary */}
                    {formData.products.some(item => item.product) && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm font-medium">
                                Tổng xác suất: {formData.products.reduce((sum, item) => sum + item.probability, 0)}%
                            </p>
                            {!validateProbability(formData.products) && (
                                <p className="text-sm text-red-600 mt-1">
                                    Tổng xác suất phải bằng 100%
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang tạo..." : "Tạo blindbox"}
                </Button>
            </div>
        </form>
    )
}



