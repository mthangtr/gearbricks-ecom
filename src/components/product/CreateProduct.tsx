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
import { Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

export default function CreateProduct({ onSuccess }: { onSuccess: (product: Product) => void }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [images, setImages] = useState<ImageItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategory, setNewCategory] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",   // sẽ lưu _id
        colors: "",
        inStock: "true",
    })

    // 1) Load categories
    useEffect(() => {
        fetch("/api/category")
            .then((res) => res.json())
            .then((data: { categories: Category[] }) => {
                setCategories(data.categories)
                if (data.categories.length && !formData.category) {
                    setFormData((f) => ({ ...f, category: data.categories[0]._id }))
                }
            })
            .catch(() => setError("Không tải được danh sách loại"))
    }, [])

    // 2) Thêm mới category
    const handleAddCategory = async () => {
        const name = newCategory.trim()
        if (!name) return

        setLoading(true)
        try {
            const res = await fetch("/api/category", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            })
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Thêm loại thất bại")
            }
            const saved: Category = await res.json()
            setCategories((prev) => [...prev, saved])
            setFormData((f) => ({ ...f, category: saved._id }))
            setNewCategory("")
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            else setError("Đã xảy ra lỗi")
        } finally {
            setLoading(false)
        }
    }

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

    function makeSlug(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/[\s-]+/g, "-")
    }

    // 4) Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const slug = makeSlug(formData.name)
            const payload = {
                ...formData,
                price: Number(formData.price),
                colors: formData.colors.split(",").map((c) => c.trim()),
                images,
                slug,
                inStock: formData.inStock === "true",
                category: formData.category, // đúng là ID string
            }
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error((await res.json()).error || "Tạo thất bại")

            // Reset form
            setFormData({
                name: "",
                price: "",
                category: categories[0]?._id || "",
                colors: "",
                inStock: "true",
            })
            setImages([])
            toast.success("Tạo sản phẩm thành công")
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            else setError("Đã xảy ra lỗi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-medium mb-4">Tạo sản phẩm mới</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                {/* Name */}
                <Label htmlFor="name">Tên</Label>
                <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                        setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                />

                {/* Price */}
                <Label htmlFor="price">Giá</Label>
                <Input
                    id="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                        setFormData((f) => ({ ...f, price: e.target.value }))
                    }
                />

                {/* In Stock */}
                <Label>In Stock</Label>
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
                                Có hàng
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

                {/* Category */}
                <Label>Loại</Label>
                {categories.length > 0 && (
                    <Select
                        value={formData.category}
                        onValueChange={(v) =>
                            setFormData((f) => ({ ...f, category: v }))
                        }
                    >
                        <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat._id} value={cat._id} className="cursor-pointer">
                                    {handleCategoryDisplay(cat.name)}
                                </SelectItem>
                            ))}

                            {/* form thêm loại mới cũng cần key */}
                            <div key="add-new" className="flex gap-2 p-2">
                                <Input
                                    placeholder="Thêm loại mới"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="default"
                                    onClick={handleAddCategory}
                                    disabled={!newCategory.trim() || loading}
                                >
                                    <Check />
                                </Button>
                            </div>
                        </SelectContent>
                    </Select>
                )}
                {
                    categories.length === 0 && (
                        <div key="add-new" className="flex gap-2 p-2">
                            <Input
                                placeholder="Thêm loại mới"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleAddCategory}
                                disabled={!newCategory.trim() || loading}
                            >
                                <Check />
                            </Button>
                        </div>
                    )
                }

                {/* Images */}
                <Label>Ảnh</Label>
                <Input
                    className="cursor-pointer"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                />
                {
                    loading && (
                        <div className="flex items-center gap-2 mt-2">
                            <Spinner className="h-4 w-4 animate-spin" />
                            <span>Đang upload...</span>
                        </div>
                    )
                }
                {
                    images.length > 0 && (
                        <div className=" flex flex-wrap gap-2 mt-2">
                            {images.map((img, idx) => (
                                <div key={img.url} className="space-y-1">
                                    <div className="relative w-24 h-24 overflow-hidden rounded border">
                                        <Image
                                            src={img.url}
                                            alt={`img-${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center w-full gap-2">
                                        <Input
                                            id={`idx-${idx}`}
                                            value={img.index.toString()}
                                            onChange={(e) => {
                                                if (e.target.value === "") return;
                                                if (isNaN(parseInt(e.target.value))) return;
                                                if (parseInt(e.target.value) <= 0) return;
                                                const newIndex = parseInt(e.target.value) || 0
                                                setImages((list) =>
                                                    list.map((it, i) =>
                                                        i === idx ? { ...it, index: newIndex } : it
                                                    )
                                                )
                                            }}
                                            className="w-24 text-xs"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Submit */}
                <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setFormData({
                                name: "",
                                price: "",
                                category: categories[0]?._id || "",
                                colors: "",
                                inStock: "true",
                            })
                            setImages([])
                            setError(null)
                        }}
                        disabled={loading}
                    >
                        Đặt lại
                    </Button>
                </div>
            </form >
        </div >
    )
}

const handleCategoryDisplay = (category: string) => {
    return category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}