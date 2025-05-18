// app/[locale]/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/assets/icons/GoogleIcon';

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
        <div className="max-w-md mx-auto py-16 space-y-4">
            <h1 className="text-2xl font-bold flex justify-between items-center">Đăng nhập<span className='text-sm text-blue-600 hover:underline font-normal cursor-pointer'>Chưa có tài khoản?</span></h1>

            {error && (
                <div className="text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="mt-1 block w-full border px-3 py-2 rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Mật khẩu</label>
                    <input
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
                    <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </a>
                </div>

                <Button type="submit" size="lg" className="w-full cursor-pointer">
                    Đăng nhập
                </Button>
            </form>

            <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">— Hoặc —</p>
                <Button variant="outline" size="lg" onClick={onGoogle} className="w-full cursor-pointer">
                    <GoogleIcon />Đăng nhập với Google
                </Button>
            </div>
        </div>
    );
}
