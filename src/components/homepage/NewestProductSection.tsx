import { Product } from "@/types/global";
import ProductCard from "../product/ProductCard";

type NewestProductSectionProps = {
    newestProducts: Product[]
};

function NewestProductSection({ newestProducts }: NewestProductSectionProps) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">Sản phẩm mới
                <span className='text-sm font-normal hover:underline cursor-pointer text-gray-500'>See more</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {newestProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}

export default NewestProductSection;