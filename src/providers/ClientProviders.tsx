'use client';

import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider } from 'next-intl';

export default function ClientProviders({
    children,
    locale,
}: {
    children: React.ReactNode;
    locale: string;
}) {
    return (
        <SessionProvider>
            <NextIntlClientProvider locale={locale}>
                {children}
            </NextIntlClientProvider>
        </SessionProvider>
    );
}
