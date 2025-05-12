import NewestProductSection from "@/components/homepage/NewestProductSection";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BestSellerProductsSection from "@/components/homepage/BestSellerProductsSection";

export default async function HomePageServer() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/latest`, {
        cache: "no-cache",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const newestProducts = await res.json();

    return (
        <div className="space-y-12">
            {/* Blindbox Promotion */}
            <section className="rounded-xl bg-gradient-to-r from-pink-100 via-red-100 to-yellow-100 p-6 shadow-md text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800">🎁 Blindbox Siêu Xe Mô Hình</h2>
                    <p className="mt-2 text-gray-600">
                        Mỗi hộp là một bất ngờ! Mua với giá chỉ <strong>250.000đ</strong> và nhận một siêu xe bất kỳ.
                    </p>
                    <p className="mt-1 text-gray-500 text-sm">Cơ hội nhận được các mẫu giới hạn hoặc phiên bản đặc biệt.</p>
                    <Link href="/mystery-box">
                        <Button size="lg" className="mt-4 text-base px-6 py-3 cursor-pointer">
                            Khám phá Blindbox
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Newest products */}
            <NewestProductSection newestProducts={newestProducts} />

            {/* Best sellers */}
            <BestSellerProductsSection bestSellers={newestProducts} />

            {/* Banner + CTA */}
            <section className="relative rounded-xl overflow-hidden shadow-md text-center py-96">
                {/* Black overlay */}
                <div className="absolute inset-0 z-[1] bg-black/60" />

                {/* Background image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/mystery-box-banner.png"
                        alt="Mystery Box Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Overlay content */}
                <div className="relative z-10 max-w-3xl mx-auto text-white">
                    <h1 className="text-3xl md:text-5xl font-extrabold">
                        🚗 GearBricks Mystery Box
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-100">
                        Khám phá các siêu xe mô hình độc đáo, mở hộp bất ngờ & nhận quà cực hiếm!
                    </p>
                    <Link href="/mystery-box">
                        <Button size="lg" className="mt-6 text-base px-8 py-4 cursor-pointer">
                            Mở hộp ngay
                        </Button>
                    </Link>
                </div>
            </section>

        </div>
    );
}

const bestSellers = [
    {
        _id: '4',
        slug: 'Porsche-911-(930)-RWB',
        name: 'Porsche 911 (930) RWB',
        price: 305000,
        images: ['https://minibricks.com/cdn/shop/files/D0925094-6411-40D3-A687-AB5D7BF789DA.jpg?v=1698577908&width=800'],
    },
    {
        _id: '5',
        slug: 'Porsche-911-(930)-RWB',
        name: 'Porsche 911 (930) RWB',
        price: 300000,
        images: ['https://minibricks.com/cdn/shop/files/D0925094-6411-40D3-A687-AB5D7BF789DA.jpg?v=1698577908&width=800'],
    },
];