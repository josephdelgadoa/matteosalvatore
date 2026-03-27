import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { AiChatbot } from '@/components/chatbot/AiChatbot';
import { getDictionary } from '../../../get-dictionary';
import { Locale } from '../../../i18n-config';
import { menuApi } from '@/lib/api/menu';

import { ShopDictionaryProvider } from '@/providers/ShopDictionaryProvider';

export default async function ShopLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    const dict = await getDictionary(params.lang);
    const menuItems = await menuApi.getAll().catch(() => []);

    return (
        <div className="flex flex-col min-h-screen relative">
            <ShopDictionaryProvider dictionary={dict}>
                <Header lang={params.lang} dict={dict.nav} commonDict={dict.common} menuItems={menuItems} />
                <main className="flex-grow pt-20">
                    {children}
                </main>
                <Footer lang={params.lang} dict={dict.footer} />
                <AiChatbot lang={params.lang} dict={dict} />
                <CookieConsent dict={dict.cookies} lang={params.lang} />
            </ShopDictionaryProvider>
        </div>
    );
}
