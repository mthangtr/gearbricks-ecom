'use client';

import { Button } from "@/components/ui/button";
import RatingStars from "./RatingStars";
import { Product } from "@/types/global";
import QuantityCounter from '../QuantityCounter';

export default function ProductInfo({ product }: { product: Product }) {
    return (
        <div className="space-y-6">
            {/* Tên sản phẩm to, nổi bật */}
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

            {/* Đánh giá */}
            <RatingStars rating={4.5} reviewCount={12} />
            {/* Số lượng đã mua */}
            <p className="text-sm text-muted-foreground">
                Đã bán:{" "}
                <span className="font-medium text-foreground">
                    112 sản phẩm
                </span>
            </p>

            {/* Trạng thái hàng */}
            <p className="text-base text-muted-foreground">
                Tình trạng:{" "}
                <span className="font-medium text-foreground">
                    {product.stock && product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                </span>
            </p>

            {/* Giá */}
            <p className="text-2xl font-semibold text-primary">
                {product.price.toLocaleString()} ₫
            </p>

            {/* Nút hành động lớn hơn */}
            <div className="flex gap-4 mt-4">
                <QuantityCounter />
                <Button size="lg" className="text-base px-6 py-4 cursor-pointer">
                    Thêm vào giỏ
                </Button>
                <Button variant="secondary" size="lg" className="text-base px-6 py-4 cursor-pointer">
                    Mua bằng VNPAY
                </Button>
            </div>

            {/* Mô tả */}
            <p className="text-base text-foreground mt-6 leading-relaxed">
                Đây là mô hình siêu xe tỉ lệ 1:24, chi tiết tinh xảo, phù hợp để trưng bày và sưu tầm. Sản phẩm lắp ráp từ nhiều mảnh nhỏ, kèm hướng dẫn chi tiết.
            </p>

        </div>
    );
}
