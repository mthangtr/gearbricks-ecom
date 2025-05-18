import ProductCard from './ProductCard'
import { Product } from '@/types/global'
import { notFound } from 'next/navigation'

interface RelatedProductsProps {
    category: string
    slug: string
}

export default async function RelatedProducts({
    category,
    slug,
}: RelatedProductsProps) {
    // xây dựng URL tương tự như API route
    const baseUrl =
        process.env.NODE_ENV === 'development'
            ? `http://localhost:${process.env.PORT || 3000}`
            : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

    const url = `${baseUrl}/api/products/related?category=${encodeURIComponent(
        category
    )}&slug=${encodeURIComponent(slug)}`

    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
        // nếu API trả về 400/404 thì văng 404 page
        return notFound()
    }

    const products: Product[] = await res.json()
    if (products.length === 0) {
        return null  // hoặc trả về <p>Không có sản phẩm tương tự</p>
    }

    return (
        <section className="mt-10">
            <h1 className="text-2xl font-semibold mb-4">Sản phẩm tương tự</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>
        </section>
    )
}
