import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Gift, PartyPopper } from 'lucide-react';
import QuantityCounter from '@/components/QuantityCounter';
import SpinboxWrapper from '@/components/wrapper/SpinboxWrapper';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const boxProducts = [
    'https://minibricks.com/cdn/shop/files/6CA83CCB-A18B-4718-8D04-DB15B09730C6.jpg?v=1745826847&width=800',
    'https://minibricks.com/cdn/shop/files/472FBA36-A090-4473-9591-BC6F313DB32E.jpg?v=1744303843&width=800',
    'https://minibricks.com/cdn/shop/files/CBD0A633-F855-4AC8-B216-94712FC12948.jpg?v=1743789249&width=800',
    'https://minibricks.com/cdn/shop/files/9DEF02DE-B2DE-4393-B43D-A3E011FF9D76.jpg?v=1743495928&width=800',
    "https://minibricks.com/cdn/shop/files/FADFAEB2-E9CF-456D-B722-A073CB57A01E.jpg?v=1742554183&width=800",
    "https://minibricks.com/cdn/shop/files/FA2E9278-D51E-419A-92B3-964E44835340.jpg?v=1739889067&width=800",
    "https://minibricks.com/cdn/shop/files/3BF55F4B-C8D4-4679-BEC0-07A490C7B8D3.jpg?v=1739432195&width=800",
];

const recentSpins = [
    { user: 'Nam Hoàng', prize: 'Lamborghini Aventador' },
    { user: 'Minh Trí', prize: 'Porsche GT3 RS' },
    { user: 'Thảo Nguyên', prize: 'Ferrari LaFerrari' },
];

export default function MysteryBoxDetailPage() {

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Image + Categories */}
                <div>
                    <Image
                        src="/images/blindboxbanner.webp"
                        alt="Blind Box"
                        width={400}
                        height={400}
                        className="w-full rounded-xl object-cover"
                    />
                </div>

                {/* Right: Info + Actions */}
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2"><Gift /> Blindbox Cars Edition</h1>
                    <p className="text-sm text-gray-500 mt-1">Đã có 2,314 lượt mở</p>

                    {/* Images of possible prizes - scrollable row */}
                    <div className="mt-4">
                        <ScrollArea className="w-full max-w-full rounded-md border pb-2">
                            <div className="flex w-max space-x-3 p-2">
                                {boxProducts.map((src, idx) => (
                                    <Image
                                        key={idx}
                                        src={src}
                                        alt={`Prize ${idx}`}
                                        width={120}
                                        height={120}
                                        className="rounded-md object-cover flex-shrink-0"
                                    />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <a className='font-medium text-gray-500'>Lượt quay: 2</a>
                            <Button variant="link" className='text-sm font-normal hover:underline cursor-pointer text-gray-500'>Mua thêm lượt quay (210k)</Button>
                        </div>
                        <SpinboxWrapper />
                        <div className="flex items-center gap-4">
                            <QuantityCounter />
                            <Button size="lg" className="text-base cursor-pointer ">
                                Thêm vào giỏ
                            </Button>
                            <Button variant="secondary" size="lg" className="text-base  cursor-pointer">
                                Thanh toán ngay
                            </Button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 text-sm text-gray-600 leading-relaxed space-y-3">
                        <p>
                            Hộp <strong>Blindbox</strong> bao gồm những mẫu xe mô hình thể thao thuộc dòng như Ferrari, McLaren, Koenigsegg và nhiều hơn nữa.
                            Bạn có thể <span className="text-blue-600 font-medium">quay thử</span> hoặc <span className="text-blue-600 font-medium">mua về nhà</span> để giữ nguyên sự bất ngờ.
                        </p>

                        <div className="border rounded-md p-4 bg-gray-50">
                            <h3 className="font-semibold mb-2 text-gray-800">🎯 Tỷ lệ trúng phần thưởng</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li><span className="text-yellow-600 font-medium">Cơ bản</span>: 60% — Xe phổ thông (Porsche, BMW, v.v.)</li>
                                <li><span className="text-orange-600 font-medium">Hiếm</span>: 30% — Siêu xe (Ferrari, McLaren, v.v.)</li>
                                <li><span className="text-purple-600 font-medium">Cực hiếm</span>: 10% — Phiên bản giới hạn (Koenigsegg, Bugatti, v.v.)</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* User who spun what */}
            <div className="mt-16">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PartyPopper className="w-5 h-5 text-yellow-500" /> Lượt quay gần đây</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                    {recentSpins.map((spin, idx) => (
                        <li key={idx} className="border-b pb-2">
                            <strong>{spin.user}</strong> vừa quay trúng <span className="font-medium text-green-600">{spin.prize}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
