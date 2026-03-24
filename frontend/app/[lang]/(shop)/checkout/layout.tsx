import React from 'react';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { CheckoutDictionaryProvider } from '@/providers/CheckoutDictionaryProvider';
import CheckoutLayoutClient from '@/components/checkout/CheckoutLayoutClient';

export default async function CheckoutLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { lang: string };
}) {
    // Force cache invalidation trigger
    const dict = await getDictionary(params.lang as Locale);

    return (
        <CheckoutDictionaryProvider dictionary={dict.checkout} lang={params.lang}>
            <CheckoutLayoutClient>
                {children}
            </CheckoutLayoutClient>
        </CheckoutDictionaryProvider>
    );
}
