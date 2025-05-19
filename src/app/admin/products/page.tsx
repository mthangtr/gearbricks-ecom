"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { AppSidebar } from "@/components/AppSidebar";

// Each image has a URL and an editable index
type ImageItem = { url: string; index: number };

export default function ProductManagementPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [formData, setFormData] = useState({ name: "", price: "", category: "", colors: "" });

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
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    function makeSlug(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/[\s-]+/g, "-");
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const slug = makeSlug(formData.name);
            const payload = {
                ...formData,
                price: Number(formData.price),
                colors: formData.colors.split(",").map(c => c.trim()),
                images: images,
                slug,
            };
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error((await res.json()).error || "Tạo thất bại");
            // Reset form & images on success
            setFormData({ name: "", price: "", category: "", colors: "" });
            setImages([]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-semibold mb-4">Quản lý sản phẩm</h1>
                <section className="mb-6">
                    <h2 className="text-xl font-medium mb-2">Tạo sản phẩm mới</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <p className="text-red-500">{error}</p>}

                        <div>
                            <label className="block text-sm font-medium">Tên</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                className="w-full border rounded p-2"
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Giá</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                className="w-full border rounded p-2"
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Loại</label>
                            <input
                                type="text"
                                value={formData.category}
                                className="w-full border rounded p-2"
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Màu sắc (phẩy)</label>
                            <input
                                type="text"
                                value={formData.colors}
                                className="w-full border rounded p-2"
                                placeholder="red,blue,green"
                                onChange={e => setFormData({ ...formData, colors: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Ảnh</label>
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

                            {loading && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Spinner />
                                    <span>Đang upload...</span>
                                </div>
                            )}

                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4 mt-2">
                                    {images.map((img, idx) => (
                                        <div key={img.url} className="space-y-1">
                                            <div className="relative w-24 h-24 overflow-hidden rounded">
                                                <Image src={img.url} alt="Uploaded" fill className="object-cover" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs">Idx:</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={img.index}
                                                    onChange={e => {
                                                        const newIdx = parseInt(e.target.value) || 0;
                                                        setImages(list =>
                                                            list.map((it, i) =>
                                                                i === idx ? { ...it, index: newIdx } : it
                                                            )
                                                        );
                                                    }}
                                                    className="w-12 border rounded px-1 text-xs"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Đang tạo..." : "Tạo"}
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setFormData({ name: "", price: "", category: "", colors: "" });
                                    setImages([]);
                                    setError(null);
                                }}
                                disabled={loading}
                            >
                                Đặt lại
                            </Button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}
