"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import { ImageItem, Category, Product } from "@/types/global"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Check, X, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

interface EditProductProps {
    product: Product
    onSuccess: (updatedProduct: Product) => void
    onCancel: () => void
}

export default function EditProduct({ product, onSuccess, onCancel }: EditProductProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [images, setImages] = useState<ImageItem[]>(product.images || [])
    const [categories, setCategories] = useState<Category[]>([])

    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price.toString(),
        category: product.category._id,
        colors: product.colors.join(", "),
        inStock: product.inStock ? "true" : "false",
    })

    // Load categories
    useEffect(() => {
        fetch("/api/category")
            .then((res) => res.json())
            .then((data: { categories: Category[] }) => {
                setCategories(data.categories)
            })
            .catch(() => setError("Không tải được danh sách loại"))
    }, [])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        setLoading(true);
        setError(null);
        const uploaded: string[] = [];
        try {
            for (const file of Array.from(files)) {
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
                const data = await res.json();
                uploaded.push(data.url);
            }
            setImages(prev => [
                ...prev,
                ...uploaded.map((url, i) => ({ url, index: prev.length + i }))
            ]);
            toast.success("Upload thành công")
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            else setError("Đã xảy ra lỗi")
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const slug = makeSlug(formData.name)
            const payload = {
                ...formData,
                price: Number(formData.price),
                colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
                images,
                slug,
                inStock: formData.inStock === "true",
                category: formData.category,
            }

            const res = await fetch(`/api/admin/products/${product._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error((await res.json()).error || "Cập nhật thất bại")

            const updatedProduct = await res.json()
            onSuccess(updatedProduct)
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            else setError("Đã xảy ra lỗi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                            setFormData((f) => ({ ...f, name: e.target.value }))
                        }
                    />
                </div>

                {/* Price */}
                <div>
                    <Label htmlFor="price">Giá (VNĐ)</Label>
                    <Input
                        id="price"
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                            setFormData((f) => ({ ...f, price: e.target.value }))
                        }
                    />
                </div>

                {/* Colors */}
                <div>
                    <Label htmlFor="colors">Màu sắc (phân cách bằng dấu phẩy)</Label>
                    <Input
                        id="colors"
                        type="text"
                        value={formData.colors}
                        onChange={(e) =>
                            setFormData((f) => ({ ...f, colors: e.target.value }))
                        }
                        placeholder="Đỏ, Xanh, Vàng"
                    />
                </div>

                {/* In Stock */}
                <div>
                    <Label>Trạng thái hàng</Label>
                    <RadioGroup
                        value={formData.inStock}
                        onValueChange={(v) =>
                            setFormData((f) => ({ ...f, inStock: v }))
                        }
                    >
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <RadioGroupItem value="true" id="inStock-true" />
                                <Label htmlFor="inStock-true" className="ml-2">
                                    Còn hàng
                                </Label>
                            </div>
                            <div className="flex items-center">
                                <RadioGroupItem value="false" id="inStock-false" />
                                <Label htmlFor="inStock-false" className="ml-2">
                                    Hết hàng
                                </Label>
                            </div>
                        </div>
                    </RadioGroup>
                </div>

                {/* Category */}
                <div>
                    <Label>Danh mục</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(v) =>
                            setFormData((f) => ({ ...f, category: v }))
                        }
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id} className="cursor-pointer">
                                    {handleCategoryDisplay(cat.name)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Images */}
                <div>
                    <Label>Hình ảnh</Label>
                    <Input
                        className="cursor-pointer"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                    {loading && (
                        <div className="flex items-center gap-2 mt-2">
                            <Spinner className="h-4 w-4 animate-spin" />
                            <span>Đang upload...</span>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {images.map((img, idx) => (
                                <div key={img.url} className="space-y-2">
                                    <div className="relative w-full h-32 overflow-hidden rounded border">
                                        <Image
                                            src={img.url}
                                            alt={`img-${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 p-0"
                                            onClick={() => removeImage(idx)}
                                        >
                                            <X size={12} />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={img.index.toString()}
                                            onChange={(e) => {
                                                const newIndex = parseInt(e.target.value) || 0
                                                if (newIndex > 0) {
                                                    setImages((list) =>
                                                        list.map((it, i) =>
                                                            i === idx ? { ...it, index: newIndex } : it
                                                        )
                                                    )
                                                }
                                            }}
                                            className="w-16 text-xs"
                                            placeholder="Thứ tự"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                </div>
            </form>
        </div>
    )
}

const handleCategoryDisplay = (category: string) => {
    return category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
} 