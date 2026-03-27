'use client';

import React, { useState } from 'react';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/useCart';

import { usePathname } from 'next/navigation';
import { useCheckoutDictionary } from '@/providers/CheckoutDictionaryProvider';

export default function CheckoutLayoutClient({ children }: { children: React.ReactNode }) {
    const { dict } = useCheckoutDictionary();
    const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
    const { items, getCartTotal, isLoading } = useCart();
    const pathname = usePathname();
    const router = React.useMemo(() => require('next/navigation').useRouter(), []);
    const total = getCartTotal();

    const isSuccessPage = pathname.endsWith('/success') || pathname.endsWith('/exito');

    // Redirect to cart if empty (and not on success page)
    React.useEffect(() => {
        if (!isLoading && items.length === 0 && !isSuccessPage) {
            // Find current language from path or dict
            const lang = pathname.split('/')[1] || 'es';
            router.push(`/${lang}/cart`);
        }
    }, [items, isLoading, isSuccessPage, pathname, router]);

    return (
        <div className="min-h-screen bg-ms-white flex flex-col md:flex-row">

            {/* Mobile Header & Summary Toggle - Hide on Success */}
            {!isSuccessPage && (
                <div className="md:hidden bg-ms-ivory/30 border-b border-ms-fog">
                    {/* Mobile Toggle Bar */}
                    <button
                        onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                        className="w-full flex justify-between items-center p-4 bg-ms-ivory/50 text-sm"
                    >
                        <div className="flex items-center gap-2 text-ms-brand-primary">
                            <ShoppingBag size={16} />
                            <span className="font-medium">
                                {isMobileSummaryOpen ? dict.layout?.hideSummary || 'Hide order summary' : dict.layout?.showSummary || 'Show order summary'}
                            </span>
                            {isMobileSummaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        <span className="font-medium text-lg">S/. {total.toFixed(2)}</span>
                    </button>

                    {/* Collapsible Summary */}
                    {isMobileSummaryOpen && (
                        <div className="p-4 bg-ms-ivory border-t border-ms-fog animate-fade-in">
                            <OrderSummary />
                        </div>
                    )}
                </div>
            )}

            {/* Left Column: Form Area */}
            <div className={`flex-1 flex flex-col pt-6 md:pt-8 px-4 md:px-12 lg:px-24 pb-12 ${!isSuccessPage ? 'border-r border-ms-fog' : 'items-center mt-12'}`}>
                <div className={`w-full ${!isSuccessPage ? 'max-w-xl mx-auto' : 'max-w-2xl mx-auto text-center'}`}>


                    {/* Breadcrumbs / Progress - Hide on Success */}
                    {!isSuccessPage && (
                        <div className="mb-8">
                            <CheckoutProgress />
                        </div>
                    )}

                    {/* Main Content (Steps) */}
                    <main>
                        {children}
                    </main>

                    {/* Footer Links */}
                    <footer className={`mt-12 pt-6 border-t border-ms-fog text-xs text-ms-stone flex gap-4 flex-wrap ${!isSuccessPage ? 'justify-center md:justify-start' : 'justify-center'}`}>
                        <Link href="/policy/refund" className="hover:underline">{dict.layout?.refundPolicy || 'Refund Policy'}</Link>
                        <Link href="/policy/shipping" className="hover:underline">{dict.layout?.shippingPolicy || 'Shipping Policy'}</Link>
                        <Link href="/policy/privacy" className="hover:underline">{dict.layout?.privacyPolicy || 'Privacy Policy'}</Link>
                    </footer>
                </div>
            </div>

            {/* Right Column: Order Summary (Desktop) - Hide on Success */}
            {!isSuccessPage && (
                <div className="hidden md:flex w-full md:w-[450px] lg:w-[550px] bg-ms-ivory/50 flex-col pt-12 px-8 lg:px-12 border-l border-ms-fog sticky top-0 h-screen overflow-y-auto">
                    <div className="max-w-md w-full">
                        <OrderSummary />
                    </div>
                </div>
            )}

        </div>
    );
}
