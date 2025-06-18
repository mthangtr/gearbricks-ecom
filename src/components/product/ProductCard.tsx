import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/global";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div className="hover:shadow-lg transition-all overflow-hidden border-2 rounded-2xl">
            <Link href={`/product/${product.slug}`} className="block">
                <div className="relative w-full aspect-[4/3]">
                    <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                    />
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/product/${product.slug}`}>
                    <div className="text-base font-semibold truncate hover:underline">
                        {product.name}
                    </div>
                </Link>
                <p className="text-sm text-muted-foreground">
                    {product.price.toLocaleString()} ₫
                </p>
            </div>
        </div>
    );
}
