'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            // Có thể fetch thông tin đơn hàng từ API nếu cần
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Đang xử lý...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card className="border-green-200 bg-green-50">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-800">
                            Thanh toán thành công!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
                            </p>

                            {orderId && (
                                <div className="bg-white p-4 rounded-lg border">
                                    <p className="text-sm text-gray-600">Mã đơn hàng:</p>
                                    <p className="font-mono text-lg font-semibold text-gray-800">
                                        {orderId}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                <CreditCard className="h-8 w-8 text-blue-600" />
                                <div>
                                    <p className="font-semibold">Thanh toán</p>
                                    <p className="text-sm text-gray-600">Đã hoàn tất</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                <Package className="h-8 w-8 text-orange-600" />
                                <div>
                                    <p className="font-semibold">Vận chuyển</p>
                                    <p className="text-sm text-gray-600">Đang chuẩn bị</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">Những gì tiếp theo?</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Chúng tôi sẽ xác nhận đơn hàng trong vòng 24 giờ</li>
                                <li>• Bạn sẽ nhận được email cập nhật trạng thái đơn hàng</li>
                                <li>• Sản phẩm sẽ được giao trong 3-5 ngày làm việc</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex-1">
                                <Link href="/profile">
                                    Xem đơn hàng của tôi
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="flex-1">
                                <Link href="/">
                                    Tiếp tục mua sắm
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 