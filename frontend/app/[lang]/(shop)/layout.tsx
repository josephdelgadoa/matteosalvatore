import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="flex flex-col min-h-screen relative">
            <Header lang={params.lang} dict={dict.nav} commonDict={dict.common} />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer lang={params.lang} dict={dict.footer} />
            <CookieConsent dict={dict.cookies} lang={params.lang} />
        </div>
    );
}
