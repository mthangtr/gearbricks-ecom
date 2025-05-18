"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Đăng ký thất bại");
            }
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogle = () => {
        signIn("google", { callbackUrl: "/login" });
    };

    return (
        <div className="flex justify-center items-center py-16">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Đăng ký</CardTitle>
                    <CardDescription>
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Đăng nhập
                        </Link>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                className="mt-1 block w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full border px-3 py-2 rounded-md"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                        <div className="text-center text-sm text-gray-600">— Hoặc —</div>
                        <Button variant="outline" size="lg" onClick={handleGoogle} className="w-full cursor-pointer">
                            <GoogleIcon /> Đăng ký với Google
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}