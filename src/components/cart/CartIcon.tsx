'use client';

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartIcon() {
    const { cart } = useCart();

    // Tính tổng số lượng sản phẩm (bao gồm cả blindboxProduct)
    const totalItems = cart.items.reduce((total, item) => total + (item.quantity || 0), 0);

    return (
        <Link href="/cart">
            <Button className="cursor-pointer relative" variant="ghost" size="icon">
                <ShoppingCart />
                {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] font-semibold text-white bg-red-500 px-1 py-0.5 rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                        {totalItems}
                    </span>
                )}
            </Button>
        </Link>
    );
}
