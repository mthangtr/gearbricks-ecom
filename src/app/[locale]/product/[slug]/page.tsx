import { notFound } from 'next/navigation';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Product } from '@/types/global';
import ProductGallery from '@/components/product/ProductGallery';

async function ProductDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = await params;

    const baseUrl =
        process.env.NODE_ENV === 'development'
            ? `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    const res = await fetch(
        `${baseUrl}/api/products/detail?slug=${encodeURIComponent(slug)}`,
        { cache: 'no-store' }
    );
    if (!res.ok) {
        return notFound();
    }
    const product: Product = await res.json();
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <ProductGallery images={product.images.map(img => img.url)} />
                <ProductInfo product={product} />
            </div>
            <RelatedProducts category={product.category} slug={slug} />
        </div>
    );
}

export default ProductDetailPage;
