"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { AppSidebar } from "@/components/AppSidebar";


export default function ProductManagementPage() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState(0);
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
            setImageUrls((prev) => [...prev, ...uploaded]);
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

    return (
        <div className="flex">
            <AppSidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-semibold mb-4">Quản lý sản phẩm</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>+ Tạo sản phẩm mới</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo sản phẩm mới</DialogTitle>
                            <DialogDescription>Nhập thông tin sản phẩm.</DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                setError(null);
                                try {
                                    const slug = makeSlug(formData.name);
                                    const res = await fetch("/api/products", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            ...formData,
                                            price: Number(formData.price),
                                            colors: formData.colors.split(",").map((c) => c.trim()),
                                            images: imageUrls,
                                            thumbnailIndex,
                                            slug,
                                        }),
                                    });
                                    if (!res.ok) throw new Error((await res.json()).error || "Tạo thất bại");
                                    setOpen(false);
                                } catch (err: any) {
                                    setError(err.message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="space-y-4"
                        >
                            {error && <p className="text-red-500">{error}</p>}
                            <div>
                                <label className="block text-sm font-medium">Tên</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Giá</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Loại</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Màu sắc (phẩy)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    placeholder="red,blue,green"
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
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
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {imageUrls.map((url, idx) => (
                                            <label
                                                key={url}
                                                className="relative w-24 h-24 overflow-hidden rounded cursor-pointer"
                                            >
                                                <Image src={url} alt="Uploaded" fill className="object-cover" />
                                                <input
                                                    type="radio"
                                                    name="thumbnail"
                                                    checked={thumbnailIndex === idx}
                                                    onChange={() => setThumbnailIndex(idx)}
                                                    className="absolute top-2 left-2 w-4 h-4"
                                                />
                                                <div className="absolute bottom-0 w-full text-xs text-center bg-black/50 text-white py-1">
                                                    {thumbnailIndex === idx ? "Thumbnail" : "Chọn"}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Đang tạo..." : "Tạo"}
                                </Button>
                                <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
                                    Đóng
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
