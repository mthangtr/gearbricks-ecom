import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getMessages } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';

import "@/app/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "GearBricks",
    description: "Resell bricks and own designs",
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <NextTopLoader
                    color="#6366f1"
                    height={3}
                    showSpinner={false}
                />
                <Header />
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <main className='max-w-7xl mx-auto px-4 py-8 min-h-screen'>
                        {children}
                    </main>
                </NextIntlClientProvider>
                <Footer />
            </body>
        </html>
    );
}