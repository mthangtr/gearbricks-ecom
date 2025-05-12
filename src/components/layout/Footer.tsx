"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Spinner } from "../ui/spinner";
import Image from "next/image";

export default function Footer() {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        colors: "",
    });


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        setError(null);

        const uploadedUrls: string[] = [];

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Upload failed");
                }

                const data = await res.json();
                uploadedUrls.push(data.url);
            }

            setImageUrls((prev) => {
                const updated = [...prev, ...uploadedUrls];
                return updated;
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="border-t bg-background text-muted-foreground text-sm py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} GearBricks.vn – All rights reserved.</p>
                <p className="mt-1">Liên hệ: gearbricks5@gmail.com</p>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button className="mt-4">Tạo sản phẩm mới</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo sản phẩm mới</DialogTitle>
                            <DialogDescription>
                                Nhập thông tin sản phẩm mới vào biểu mẫu bên dưới.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            encType="multipart/form-data"
                            className="space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                setError(null);

                                try {
                                    const res = await fetch("/api/products", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            name: formData.name,
                                            slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
                                            price: Number(formData.price),
                                            category: formData.category,
                                            colors: formData.colors.split(",").map(c => c.trim()),
                                            images: imageUrls,
                                            thumbnailIndex: thumbnailIndex,
                                        }),
                                    });

                                    if (!res.ok) {
                                        const data = await res.json();
                                        throw new Error(data.error || "Tạo sản phẩm thất bại");
                                    }
                                    setOpenDialog(false);
                                } catch (err: any) {
                                    setError(err.message);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            {error && <p className="text-red-500">{error}</p>}
                            <div>
                                <label className="block text-left">Tên sản phẩm</label>
                                <input type="text" name="name" required className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-left">Giá</label>
                                <input type="number" name="price" required className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-left">Loại</label>
                                <input type="text" name="category" className="w-full border rounded p-2"
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-left">Màu sắc (phân cách bởi dấu phẩy)</label>
                                <input type="text" name="colors" className="w-full border rounded p-2" placeholder="red,blue,green"
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-left">Tải ảnh lên</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                                {loading && (
                                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                        <Spinner className="w-4 h-4" />
                                        Đang upload ảnh...
                                    </div>
                                )}
                                {imageUrls.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {imageUrls.map((url, idx) => (
                                            <label key={url} className="relative w-[100px] h-[100px] inline-block overflow-hidden rounded group cursor-pointer">
                                                <Image
                                                    src={url}
                                                    alt="Uploaded"
                                                    width={100}
                                                    height={100}
                                                    className={`object-cover transition-opacity ${thumbnailIndex === idx ? "opacity-100 ring-2 " : "opacity-70 group-hover:opacity-100"
                                                        }`}
                                                />
                                                <input
                                                    type="radio"
                                                    name="thumbnail"
                                                    checked={thumbnailIndex === idx}
                                                    onChange={() => setThumbnailIndex(idx)}
                                                    className="absolute top-2 left-2 w-4 h-4"
                                                />
                                                <div className="absolute bottom-0 w-full text-xs text-center bg-black/50 text-white py-1">
                                                    {thumbnailIndex === idx ? "Thumbnail" : "Chọn thumbnail"}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button className="cursor-pointer" type="submit" disabled={loading}>
                                    {loading ? "Đang tạo..." : "Tạo"}
                                </Button>
                                <Button className="cursor-pointer" variant="secondary" onClick={() => setOpenDialog(false)} disabled={loading}>
                                    Đóng
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </footer>
    );
}
