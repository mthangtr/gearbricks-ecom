import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import ProductGallery from '@/components/ProductGallery';
import ProductInfo from '@/components/ProductInfo';
import RelatedProducts from '@/components/RelatedProducts';

export default async function ProductDetailServer({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return notFound();

    const related = getRelatedProducts(product.category ?? '', product.id);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <ProductGallery images={product.images} />
                <ProductInfo product={product} />
            </div>
            <RelatedProducts products={related} />
        </main>
    );
}
