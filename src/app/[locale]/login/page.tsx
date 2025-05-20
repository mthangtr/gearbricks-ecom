"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/assets/icons/GoogleIcon';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params?.get('callbackUrl') || '/';

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            remember: remember ? 'true' : 'false',
        });
        if (res?.error) {
            setError(res.error);
        } else {
            router.push(callbackUrl);
        }
    };

    const onGoogle = () => {
        signIn('google', { callbackUrl });
    };

    return (
        <div className="flex justify-center items-center py-16">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Đăng nhập</CardTitle>
                    <CardDescription>
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">
                            Đăng ký ngay
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="mt-1 block w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={e => setRemember(e.target.checked)}
                                    className="mr-2 cursor-pointer"
                                />
                                Ghi nhớ đăng nhập
                            </label>
                            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <Button type="submit" size="lg" className="w-full cursor-pointer">
                            Đăng nhập
                        </Button>
                    </form>
                    <div className="text-center text-sm text-gray-600 my-4">— Hoặc —</div>
                    <Button variant="outline" size="lg" onClick={onGoogle} className="w-full cursor-pointer">
                        <GoogleIcon /> Đăng nhập với Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
