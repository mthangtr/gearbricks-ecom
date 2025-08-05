'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
    '00': 'Giao dịch thành công',
    '24': 'Khách hàng hủy giao dịch',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản đã bị khóa',
    '75': 'Ngân hàng đang bảo trì',
    '79': 'Khách hàng nhập sai mật khẩu quá số lần quy định',
    '99': 'Các lỗi khác',
    'invalid_signature': 'Chữ ký không hợp lệ',
    'order_not_found': 'Không tìm thấy đơn hàng',
    'server_error': 'Lỗi hệ thống',
};

export default function PaymentFailedPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error') || 'unknown';

    const getErrorMessage = (errorCode: string): string => {
        return errorMessages[errorCode] || 'Có lỗi xảy ra trong quá trình thanh toán';
    };

    const getErrorIcon = (errorCode: string) => {
        if (errorCode === '24') {
            return <XCircle className="h-16 w-16 text-orange-600" />;
        }
        return <AlertTriangle className="h-16 w-16 text-red-600" />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {getErrorIcon(error)}
                        </div>
                        <CardTitle className="text-2xl text-red-800">
                            Thanh toán thất bại
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-4">
                                {getErrorMessage(error)}
                            </p>

                            <div className="bg-white p-4 rounded-lg border">
                                <p className="text-sm text-gray-600">Mã lỗi:</p>
                                <p className="font-mono text-lg font-semibold text-gray-800">
                                    {error}
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold text-yellow-800 mb-2">Bạn có thể:</h3>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Thử thanh toán lại với phương thức khác</li>
                                <li>• Kiểm tra lại thông tin thẻ/tài khoản</li>
                                <li>• Liên hệ hỗ trợ khách hàng nếu cần</li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button asChild className="flex-1">
                                <Link href="/checkout">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Thử lại
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="flex-1">
                                <Link href="/cart">
                                    Quay lại giỏ hàng
                                </Link>
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Cần hỗ trợ?{' '}
                                <Link href="/contact" className="text-primary hover:underline">
                                    Liên hệ chúng tôi
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 