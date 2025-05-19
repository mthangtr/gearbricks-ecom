import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/global";

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="hover:shadow-lg transition-all overflow-hidden">
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
            <CardContent className="">
                <Link href={`/product/${product.slug}`}>
                    <CardTitle className="text-base font-semibold truncate hover:underline">
                        {product.name}
                    </CardTitle>
                </Link>
                <p className="text-sm text-muted-foreground">
                    {product.price.toLocaleString()} ₫
                </p>
            </CardContent>
        </Card>
    );
}
