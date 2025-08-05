'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ReceiptText, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem as CartItemType } from '@/types/global';

const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { id: 'vnpay', label: 'Thanh toán qua VNPay' },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [payment, setPayment] = useState('cod');
    const [loading, setLoading] = useState(false);

    // Redirect nếu giỏ hàng trống
    useEffect(() => {
        if (cart.items.length === 0) {
            router.push('/cart');
        }
    }, [cart.items.length, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.name || !formData.phone || !formData.address) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (cart.items.length === 0) {
            alert('Giỏ hàng trống');
            return;
        }

        setLoading(true);

        try {
            // Tạo đơn hàng
            const orderResponse = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod: payment,
                    shippingAddress: {
                        name: formData.name,
                        phone: formData.phone,
                        street: formData.address,
                        city: 'TP.HCM', // Có thể thêm field để user chọn
                        state: 'TP.HCM',
                        zip: '700000',
                    },
                    items: cart.items.map((item: CartItemType) => ({
                        product: item.product,
                        blindbox: item.blindbox,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                }),
            });

            const orderResult = await orderResponse.json();

            if (!orderResult.success) {
                throw new Error(orderResult.error || 'Tạo đơn hàng thất bại');
            }

            if (payment === 'vnpay') {
                // Tạo URL thanh toán VNPay
                const vnpayResponse = await fetch('/api/payment/vnpay/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        orderId: orderResult.orderId,
                        amount: cart.totalPrice,
                        orderInfo: `Thanh toan don hang ${orderResult.orderId}`,
                    }),
                });

                const vnpayResult = await vnpayResponse.json();

                if (!vnpayResult.success) {
                    throw new Error(vnpayResult.error || 'Tạo thanh toán VNPay thất bại');
                }

                // Redirect đến trang thanh toán VNPay
                window.location.href = vnpayResult.paymentUrl;
            } else {
                // COD - chuyển đến trang thành công
                router.push('/payment/success?orderId=' + orderResult.orderId);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Có lỗi xảy ra: ' + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Đang chuyển hướng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <ReceiptText /> Thanh toán
            </h1>

            {/* Danh sách sản phẩm trong giỏ hàng */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart /> Sản phẩm đã chọn
                </h2>
                <div className="space-y-3">
                    {cart.items.map((item: CartItemType, index: number) => (
                        <div key={index} className="flex items-center justify-between border p-3 rounded-md">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.thumbnailUrl || '/placeholder-image.jpg'}
                                    alt={item.name || 'Product'}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Số lượng: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold">
                                {(item.price * item.quantity).toLocaleString()}đ
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tổng tiền */}
                <div className="flex justify-between items-center mt-4 text-base font-semibold border-t pt-4">
                    <span>Tổng cộng</span>
                    <span>{cart.totalPrice.toLocaleString()}đ</span>
                </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin giao hàng</h3>

                <div>
                    <Label htmlFor="name">Tên khách hàng *</Label>
                    <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="mt-2"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                        id="phone"
                        placeholder="0901234567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-2"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                    <Input
                        id="address"
                        placeholder="123 đường ABC, Quận X, TP.HCM"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-2"
                        required
                    />
                </div>
            </div>

            {/* Phương thức thanh toán */}
            <div>
                <Label className="mb-2 block">Chọn phương thức thanh toán</Label>
                <RadioGroup defaultValue="cod" onValueChange={setPayment}>
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem
                                value={method.id}
                                id={method.id}
                                className='cursor-pointer'
                            />
                            <Label htmlFor={method.id} className='cursor-pointer'>
                                {method.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Button
                size="lg"
                className="w-full mt-4"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                    </>
                ) : (
                    'Xác nhận đặt hàng'
                )}
            </Button>
        </div>
    );
}
