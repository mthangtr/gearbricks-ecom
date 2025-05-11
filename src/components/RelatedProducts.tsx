import ProductCard from "./ProductCard";
import { Product } from "@/types/global";

export default function RelatedProducts({ products }: { products: Product[] }) {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-4">Sản phẩm tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
}
