'use client';

import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import { Product } from "@/types/global";
import QuantityCounter from '../QuantityCounter';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';

const handleCategoryDisplay = (category: string) => {
    return category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function ProductInfo({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!product.inStock) {
            toast.error('Sản phẩm đã hết hàng');
            return;
        }

        addToCart({
            product: product._id,
            type: 'product',
            name: product.name,
            price: product.price,
            thumbnailUrl: product.images[0].url,
            quantity: quantity
        });

        toast.success('Đã thêm vào giỏ hàng');
    };

    return (
        <div className="space-y-6">
            {/* Tên sản phẩm to, nổi bật */}
            <div>
                <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>

                {/* Category */}
                <p className="text-md text-muted-foreground">
                    Danh mục:{" "}
                    <span className="font-medium text-foreground">
                        {handleCategoryDisplay(product.category.name)}
                    </span>
                </p>
            </div>

            {/* Đánh giá */}
            <RatingStars rating={4.5} reviewCount={12} />
            {/* Số lượng đã mua */}
            <p className="text-md text-muted-foreground">
                Đã bán:{" "}
                <span className="font-medium text-foreground">
                    112 sản phẩm
                </span>
            </p>

            {/* Trạng thái hàng */}
            <p className="text-base text-muted-foreground">
                Tình trạng:{" "}
                <span className="font-medium text-foreground">
                    {handleInStockDisplay(product.inStock)}
                </span>
            </p>

            {/* Giá */}
            <p className="text-2xl font-semibold text-primary">
                {product.price.toLocaleString()} ₫
            </p>

            {/* Nút hành động lớn hơn */}
            <div className="flex gap-4 mt-4 flex-wrap">
                <QuantityCounter value={quantity} onChange={setQuantity} />
                <Button
                    size="lg"
                    className="text-base px-6 py-4 cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                >
                    Thêm vào giỏ
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    className="text-base px-6 py-4 cursor-pointer"
                    disabled={!product.inStock}
                >
                    Mua bằng VNPAY
                </Button>
            </div>

            {/* Có gì bên trong */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold">Có gì bên trong</h2>
                <ul className="list-disc list-inside mt-2">
                    <li>1 mô hình xe</li>
                    <li>1 bộ dụng cụ lắp ráp</li>
                    <li>Hướng dẫn lắp ráp chi tiết</li>
                </ul>
                <p className="text-base text-foreground mt-2 leading-relaxed">
                    Sản phẩm được đóng gói cẩn thận, đảm bảo an toàn trong quá trình vận chuyển.
                </p>
            </div>
        </div>
    );
}

const handleInStockDisplay = (inStock: boolean) => {
    return inStock ? (
        <span className="text-green-500">Còn hàng</span>
    ) : (
        <span className="text-red-500">Hết hàng</span>
    )
}