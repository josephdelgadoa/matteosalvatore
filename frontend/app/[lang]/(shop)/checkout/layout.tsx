'use client';

import React, { useState } from 'react';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/useCart';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
    const { getCartTotal } = useCart();
    const total = getCartTotal();

    return (
        <div className="min-h-screen bg-ms-white flex flex-col md:flex-row">

            {/* Mobile Header & Summary Toggle */}
            <div className="md:hidden bg-ms-ivory/30 border-b border-ms-fog">
                {/* Logo Bar */}
                <div className="p-4 flex justify-center border-b border-ms-fog/50">
                    <Link href="/">
                        <Image
                            src="/images/logo.svg"
                            alt="Matteo Salvatore"
                            width={140}
                            height={32}
                            className="h-8 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Toggle Bar */}
                <button
                    onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                    className="w-full flex justify-between items-center p-4 bg-ms-ivory/50 text-sm"
                >
                    <div className="flex items-center gap-2 text-ms-brand-primary">
                        <ShoppingBag size={16} />
                        <span className="font-medium">
                            {isMobileSummaryOpen ? 'Hide order summary' : 'Show order summary'}
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

            {/* Left Column: Form Area */}
            <div className="flex-1 flex flex-col pt-6 md:pt-8 px-4 md:px-12 lg:px-24 pb-12 border-r border-ms-fog">
                <div className="max-w-xl mx-auto w-full">
                    {/* Desktop Logo (Hidden on Mobile) */}
                    <div className="hidden md:block mb-8">
                        <Link href="/">
                            <Image
                                src="/images/logo.svg"
                                alt="Matteo Salvatore"
                                width={180}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Breadcrumbs / Progress */}
                    <div className="mb-8">
                        <CheckoutProgress />
                    </div>

                    {/* Main Content (Steps) */}
                    <main>
                        {children}
                    </main>

                    {/* Footer Links */}
                    <footer className="mt-12 pt-6 border-t border-ms-fog text-xs text-ms-stone flex gap-4 flex-wrap justify-center md:justify-start">
                        <Link href="/policy/refund" className="hover:underline">Refund Policy</Link>
                        <Link href="/policy/shipping" className="hover:underline">Shipping Policy</Link>
                        <Link href="/policy/privacy" className="hover:underline">Privacy Policy</Link>
                    </footer>
                </div>
            </div>

            {/* Right Column: Order Summary (Desktop) */}
            <div className="hidden md:flex w-full md:w-[450px] lg:w-[550px] bg-ms-ivory/50 flex-col pt-12 px-8 lg:px-12 border-l border-ms-fog sticky top-0 h-screen overflow-y-auto">
                <div className="max-w-md w-full">
                    <OrderSummary />
                </div>
            </div>

        </div>
    );
}
