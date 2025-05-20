"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, Minus } from "lucide-react";
import { toast } from "sonner";

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


export default function CreateBlindBox() {
    const router = useRouter();

    // state để load products
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productsError, setProductsError] = useState<string | null>(null);

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

    // form state
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
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

    // handlers thêm/bớt product
    const addItem = () =>
        setItems([...items, { productId: "", probability: 0 }]);
    const removeItem = (idx: number) =>
        setItems(items.filter((_, i) => i !== idx));
    const onChangeItem = (
        idx: number,
        field: keyof FormProduct,
        value: string | number
    ) => {
        const next = [...items];
        // @ts-ignore
        next[idx][field] = value;
        setItems(next);
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
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSubmitting(true);

        if (!thumbnailUrl) {
            setErrorMsg("Bạn cần upload ảnh thumbnail trước khi tạo.");
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
            const res = await fetch("/api/admin/blindbox", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Unknown error");
            toast.success("Tạo mới thành công");
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // render
    if (loadingProducts) return <p>Loading products…</p>;
    if (productsError)
        return <p className="text-red-500">Error: {productsError}</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold">Tạo mới Blindbox</h2>
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
                    <img
                        src={thumbnailUrl}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover rounded"
                    />
                )}
            </div>

            {/* Products & Probability */}
            <div>
                <Label className="block mb-1">Products & Probability</Label>
                {items.map((it, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <Select
                            value={it.productId}
                            onValueChange={(v) => onChangeItem(idx, "productId", v)}
                            required
                        >
                            <SelectTrigger className="cursor-pointer">
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
                        <Input
                            placeholder="%"
                            value={it.probability}
                            onChange={(e) =>
                                onChangeItem(idx, "probability", Number(e.target.value))
                            }
                            required
                        />
                        <Button variant="outline" className="cursor-pointer" onClick={() => removeItem(idx)}>
                            <Minus />
                        </Button>
                    </div>
                ))}
                <Button className="w-full cursor-pointer" variant={"outline"} onClick={addItem}>
                    <Plus />
                </Button>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={submitting} className="w-full cursor-pointer">
                {submitting ? "Đang tạo…" : "Tạo mới Blindbox"}
            </Button>
        </form>
    );
}
