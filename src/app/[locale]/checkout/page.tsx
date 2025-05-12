'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ReceiptText, ShoppingCart } from 'lucide-react';

const mockCart = [
    {
        id: '1',
        name: 'Porsche GT3 RS | Pink Edition',
        price: 290000,
        quantity: 1,
        image: 'https://minibricks.com/cdn/shop/files/IMG-3132.jpg?v=1698154480&width=800',
    },
    {
        id: '2',
        name: 'Porsche 911 (930) RWB',
        price: 305000,
        quantity: 2,
        image: 'https://minibricks.com/cdn/shop/files/D0925094-6411-40D3-A687-AB5D7BF789DA.jpg?v=1698577908&width=800',
    },
];

const paymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)' },
    { id: 'vnpay', label: 'Thanh toán qua VNPay' },
    { id: 'paypal', label: 'Thanh toán bằng PayPal' },
];

export default function CheckoutPage() {
    const router = useRouter();

    const [address, setAddress] = useState('');
    const [payment, setPayment] = useState('cod');

    const handleSubmit = () => {
        if (!address) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        // Giả lập xử lý đơn hàng
        alert(`Đặt hàng thành công với phương thức: ${payment.toUpperCase()}`);
        router.push('/thank-you'); // hoặc redirect trang xác nhận
    };

    return (
        <div className='space-y-6'>
            <h1 className="text-2xl font-bold flex items-center gap-2"><ReceiptText /> Thanh toán</h1>
            {/* Danh sách sản phẩm trong giỏ hàng */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4 flex item-center gap-2"><ShoppingCart /> Sản phẩm đã chọn</h2>
                <div className="space-y-3">
                    {mockCart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border p-3 rounded-md">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Số lượng: {item.quantity}
                                    </p>
                                </div>
                            </div>
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString()}đ</p>
                        </div>
                    ))}
                </div>

                {/* Tổng tiền */}
                <div className="flex justify-between items-center mt-4 text-base font-semibold border-t pt-4">
                    <span>Tổng cộng</span>
                    <span>
                        {mockCart
                            .reduce((total, item) => total + item.price * item.quantity, 0)
                            .toLocaleString()}
                        đ
                    </span>
                </div>
            </div>

            {/* Tên khách hàng */}
            <div>
                <Label htmlFor="name">Tên khách hàng</Label>
                <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    className="mt-2"
                />
            </div>
            {/* Số điện thoại */}
            <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                    id="phone"
                    placeholder="0901234567"
                    className="mt-2"
                />
            </div>
            {/* Địa chỉ giao hàng */}
            <div>
                <Label htmlFor="address">Địa chỉ giao hàng</Label>
                <Input
                    id="address"
                    placeholder="123 đường ABC, Quận X, TP.HCM"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2"
                />
            </div>

            {/* Phương thức thanh toán */}
            <div>
                <Label className="mb-2 block">Chọn phương thức thanh toán</Label>
                <RadioGroup defaultValue="cod" onValueChange={setPayment}>
                    {paymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={method.id} id={method.id} className=' cursor-pointer' />
                            <Label htmlFor={method.id} className=' cursor-pointer'>{method.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Button size="lg" className="w-full mt-4" onClick={handleSubmit}>
                Xác nhận đặt hàng
            </Button>
        </div>
    );
}
