'use client';

import React from 'react';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { OrderSummary } from '@/components/checkout/OrderSummary'; // Will create next
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-ms-white flex flex-col md:flex-row">

            {/* Left Column: Form Area */}
            <div className="flex-1 flex flex-col pt-8 px-4 md:px-12 lg:px-24 pb-12 border-r border-ms-fog">
                <div className="max-w-xl mx-auto w-full">
                    {/* Logo */}
                    <div className="mb-8">
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
                    <footer className="mt-12 pt-6 border-t border-ms-fog text-xs text-ms-stone flex gap-4">
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
