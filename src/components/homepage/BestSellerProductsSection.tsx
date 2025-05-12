import ProductCard from "../product/ProductCard";
import { Product } from "@/types/global";

type BestSellerProductsSectionProps = {
    bestSellers: Product[]
}

function BestSellerProductsSection({ bestSellers }: BestSellerProductsSectionProps) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">Bán chạy nhất
                <span className='text-sm font-normal hover:underline cursor-pointer text-gray-500'>See more</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {bestSellers.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default BestSellerProductsSection;