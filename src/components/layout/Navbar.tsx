"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function Navbar() {
    const t = useTranslations("Navigation");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const switchLocale = (newLocale: string) => {
        // Simple locale switcher logic
        // In a real app with more segments, we'd need to construct the path carefully
        // Assuming structure is /[locale]/...
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");
        router.push(newPath);
    };

    return (
        <nav style={{
            padding: 'var(--spacing-md) 0',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link href={`/${locale}`} style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Matteo Salvatore
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }} className="desktop-menu">
                    <Link href={`/${locale}/shop`}>{t('shop')}</Link>
                    <Link href={`/${locale}/about`}>{t('about')}</Link>
                    <Link href={`/${locale}/contact`}>{t('contact')}</Link>
                    <Link href={`/${locale}/cart`}>{t('cart')}</Link>

                    <div style={{ marginLeft: 'var(--spacing-md)' }}>
                        <button
                            onClick={() => switchLocale('en')}
                            style={{ fontWeight: locale === 'en' ? 'bold' : 'normal', marginRight: '8px' }}
                        >
                            EN
                        </button>
                        |
                        <button
                            onClick={() => switchLocale('es')}
                            style={{ fontWeight: locale === 'es' ? 'bold' : 'normal', marginLeft: '8px' }}
                        >
                            ES
                        </button>
                    </div>
                </div>

                {/* Mobile Toggle (Hidden on Desktop via CSS typically, but inline for now) */}
                {/* We'd typically use a media query to hide/show. For simplicity in quick setup: */}
            </div>
        </nav>
    );
}
