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

type FormProduct = {
    productId: string;
    probability: number;
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

const validateProbability = (items: FormProduct[]) => {
    const totalProbability = items.reduce((acc, item) => {
        return acc + (item.probability || 0);
    }, 0);
    return totalProbability === 100;
}

export default function ManageBlindBox() {
    // const router = useRouter();

    // state để load products
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState<string | null>(null);

    const [blindboxes, setBlindboxes] = useState<Blindbox[]>([]);
    const [loadingBoxes, setLoadingBoxes] = useState(true);
    const [boxesError, setBoxesError] = useState<string | null>(null);

    // fetch danh sách products khi mount
    useEffect(() => {
        fetch("/api/admin/products")
            .then(async (res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((data: Product[]) => {
                setProducts(data);
                setLoadingProducts(false);
            })
            .catch((err) => {
                setProductsError(err.message);
                setLoadingProducts(false);
            });
    }, []);

    // fetch danh sách blindboxes khi mount hoặc khi update
    const fetchBlindboxes = () => {
        setLoadingBoxes(true);
        fetch("/api/blindbox")
            .then(async (res) => {
                if (!res.ok) throw new Error(`Error ${res.status}`);
                return res.json();
            })
            .then((data: Blindbox[]) => {
                setBlindboxes(data);
                setLoadingBoxes(false);
            })
            .catch((err) => {
                setBoxesError(err.message);
                setLoadingBoxes(false);
            });
    };
    useEffect(fetchBlindboxes, []);

    // form state
    const [selectedBox, setSelectedBox] = useState<string | null>(null); // slug
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [items, setItems] = useState<FormProduct[]>([
        { productId: "", probability: 0 },
    ]);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Khi chọn 1 blindbox để sửa
    const handleSelectBox = async (boxSlug: string | null) => {
        if (boxSlug === "new" || boxSlug === null) {
            setSelectedBox(null);
            return;
        }
        setSelectedBox(boxSlug);
        setErrorMsg("");
        if (!boxSlug) {
            // reset form cho tạo mới
            setTitle("");
            setDescription("");
            setPrice(0);
            setThumbnailUrl("");
            setItems([{ productId: "", probability: 0 }]);
            return;
        }
        // fetch detail
        const res = await fetch(`/api/admin/blindbox/${boxSlug}`);
        const data = await res.json();
        if (!res.ok) {
            setErrorMsg(data.error || "Không lấy được dữ liệu");
            return;
        }
        const box = data.blindbox;
        setTitle(box.title);
        setDescription(box.description || "");
        setPrice(box.price);
        setThumbnailUrl(box.thumbnailUrl || "");
        setItems(
            box.products.map((p: { product: string | { _id: string }; probability: number }) => ({
                productId: typeof p.product === "string" ? p.product : p.product._id,
                probability: p.probability,
            }))
        );
    };

    // chỉ upload 1 file
    const handleThumbnailUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upload failed");
            }
            const data = await res.json();
            setThumbnailUrl(data.url);
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // handlers thêm/bớt product
    const addItem = () => setItems([...items, { productId: "", probability: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
    const onChangeItem = (
        idx: number,
        field: keyof FormProduct,
        value: string | number
    ) => {
        const next = [...items];
        // @ts-expect-error: FormProduct is a simple object, dynamic key assignment is safe here
        next[idx][field] = value;
        setItems(next);
    };

    // submit form (tạo mới hoặc update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSubmitting(true);

        if (!thumbnailUrl) {
            setErrorMsg("Bạn cần upload ảnh thumbnail trước khi lưu.");
            setSubmitting(false);
            return;
        }
        if (!validateProbability(items)) {
            setErrorMsg("Tổng xác suất phải bằng 100%");
            setSubmitting(false);
            return;
        }
        const payload = {
            title,
            slug: makeSlug(title),
            description,
            price,
            thumbnailUrl,
            products: items
                .filter((i) => i.productId && i.probability > 0)
                .map((i) => ({ productId: i.productId, probability: i.probability })),
        };
        try {
            let res, json;
            if (selectedBox) {
                // update
                res = await fetch(`/api/admin/blindbox/${selectedBox}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                json = await res.json();
                if (!res.ok) throw new Error(json.error || "Unknown error");
                toast.success("Cập nhật thành công");
            } else {
                // create
                res = await fetch("/api/admin/blindbox", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                json = await res.json();
                if (!res.ok) throw new Error(json.error || "Unknown error");
                toast.success("Tạo mới thành công");
            }
            fetchBlindboxes();
            setSelectedBox(null);
            setTitle("");
            setDescription("");
            setPrice(0);
            setThumbnailUrl("");
            setItems([{ productId: "", probability: 0 }]);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Có lỗi khi lưu");
        } finally {
            setSubmitting(false);
        }
    };

    // Xóa blindbox
    const handleDelete = async () => {
        if (!selectedBox) return;
        if (!window.confirm("Bạn chắc chắn muốn xóa blindbox này?")) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/blindbox/${selectedBox}`, {
                method: "DELETE",
                credentials: "include",
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Delete failed");
            toast.success("Đã xóa thành công");
            fetchBlindboxes();
            setSelectedBox(null);
            setTitle("");
            setDescription("");
            setPrice(0);
            setThumbnailUrl("");
            setItems([{ productId: "", probability: 0 }]);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Có lỗi khi xóa");
        } finally {
            setDeleting(false);
        }
    };

    // render
    if (loadingProducts || loadingBoxes) return <p>Loading…</p>;
    if (productsError) return <p className="text-red-500">Error: {productsError}</p>;
    if (boxesError) return <p className="text-red-500">Error: {boxesError}</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-2">Quản lý Blindbox</h2>
            {/* Danh sách blindbox */}
            <div className="mb-4">
                <Label>Chọn Blindbox để sửa</Label>
                <Select value={selectedBox ?? "new"} onValueChange={v => handleSelectBox(v === "" ? null : v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="-- Chọn blindbox --" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new">Tạo mới</SelectItem>
                        {blindboxes.map((b) => (
                            <SelectItem key={b._id} value={b.slug}>
                                {b.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                {/* Title */}
                <div>
                    <Label>Title</Label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                {/* Description */}
                <div>
                    <Label>Description</Label>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>
                {/* Price */}
                <div>
                    <Label>Price (₫)</Label>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                    />
                </div>
                {/* Thumbnail Upload */}
                <div>
                    <Label>Thumbnail Image</Label>
                    <Input className="cursor-pointer" type="file" accept="image/*" onChange={handleThumbnailUpload} />
                    {uploading && <p>Uploading...</p>}
                    {uploadError && <p className="text-red-500">{uploadError}</p>}
                    {thumbnailUrl && (
                        <Image
                            src={thumbnailUrl}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded"
                            width={128}
                            height={128}
                            priority
                        />
                    )}
                </div>
                {/* Products & Probability */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <Label className="block">Products & Probability</Label>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const updatedItems = handleAutoCountProbability(items, products);
                                if (updatedItems) {
                                    setItems(updatedItems);
                                }
                            }}
                            className="text-sm"
                        >
                            Auto Calculate Probability
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <div className="font-medium">Product</div>
                        <div className="font-medium">Probability (%)</div>
                    </div>
                    {items.map((it, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
                            <div className="flex gap-2 w-full">
                                <Select
                                    value={it.productId}
                                    onValueChange={(v) => onChangeItem(idx, "productId", v)}
                                    required
                                >
                                    <SelectTrigger className="cursor-pointer w-full">
                                        <SelectValue placeholder="-- Chọn product --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p._id} value={p._id} className="cursor-pointer">
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="0.00"
                                    value={it.probability || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string, numbers, and one decimal point
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            const numValue = value === '' ? 0 : parseFloat(value);
                                            if (!isNaN(numValue)) {
                                                onChangeItem(idx, "probability", numValue);
                                            }
                                        }
                                    }}
                                    required
                                />
                                <Button variant="outline" className="cursor-pointer" onClick={() => removeItem(idx)}>
                                    <Minus />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button className="w-full cursor-pointer" variant={"outline"} onClick={addItem} type="button">
                        <Plus />
                    </Button>
                </div>
                {/* Submit & Delete */}
                <div className="flex gap-2">
                    <Button type="submit" disabled={submitting} className="w-full cursor-pointer">
                        {submitting ? (selectedBox ? "Đang cập nhật…" : "Đang tạo…") : (selectedBox ? "Lưu thay đổi" : "Tạo mới Blindbox")}
                    </Button>
                    {selectedBox && (
                        <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting}>
                            <Trash2 className="mr-1" /> Xóa
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

const handleAutoCountProbability = (items: FormProduct[], products: Product[]) => {
    // Lọc ra những item đã chọn productId
    const selected = items.filter(it => it.productId);
    if (selected.length === 0) {
        // Nếu chưa chọn gì, trả nguyên items với probability = 0
        return items.map(it => ({ ...it, probability: 0 }));
    }

    // Định nghĩa trọng số cho mỗi category (key phải trùng với product.category)
    const categoryWeights: Record<string, number> = {
        "super-car": 3,
        "race-car": 2,
        "classic-car": 1,
    };

    // Build mảng { productId, weight }
    const weighted = selected.map(it => {
        const prod = products.find(p => p._id === it.productId);
        // Chuẩn hóa category về lowercase, bỏ dấu, remove space nếu cần
        const catKey = prod?.category?.toString().toLowerCase().replace(/\s+/g, '') ?? '';
        // Dùng fallback = 1 nếu không tìm thấy
        const weight = categoryWeights[catKey] ?? 1;
        return { productId: it.productId, weight };
    });

    // Tính tổng weight
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    if (!isFinite(totalWeight) || totalWeight <= 0) {
        // phòng trường hợp NaN hoặc =0
        return items.map(it => ({ ...it, probability: 0 }));
    }

    // Tính probability, round 2 chữ số
    const withProb = weighted.map(w => ({
        productId: w.productId,
        probability: Math.round((w.weight / totalWeight * 100) * 100) / 100
    }));

    // Điều chỉnh cho tổng đúng 100%
    const sumProb = withProb.reduce((s, w) => s + w.probability, 0);
    const diff = Math.round((100 - sumProb) * 100) / 100;
    withProb[withProb.length - 1].probability += diff;

    // Merge lại theo đúng order ban đầu, những item chưa chọn thì probability = 0
    return items.map(it => {
        const found = withProb.find(w => w.productId === it.productId);
        return {
            ...it,
            probability: found ? found.probability : 0
        };
    });
};



