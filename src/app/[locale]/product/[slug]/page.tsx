import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

export default async function ProductDetailServer({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return notFound();

    const related = getRelatedProducts(product.category ?? '', product._id);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>
            <RelatedProducts products={related} />
        </div>
    );
}
