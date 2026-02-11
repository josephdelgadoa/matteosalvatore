'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CheckoutShippingPage() {
    const router = useRouter();
    const [info, setInfo] = useState<any>(null);
    const [shippingMethod, setShippingMethod] = useState('standard');

    useEffect(() => {
        const saved = localStorage.getItem('checkout_info');
        if (!saved) {
            router.push('/checkout/information');
        } else {
            setInfo(JSON.parse(saved));
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save shipping selection
        localStorage.setItem('checkout_shipping', shippingMethod);
        router.push('/checkout/payment');
    };

    if (!info) return null;

    return (
        <div className="animate-fade-in space-y-8">

            {/* Review Information */}
            <div className="border border-ms-fog rounded-md text-sm">
                <div className="flex justify-between p-4 border-b border-ms-fog">
                    <div className="flex gap-4">
                        <span className="text-ms-stone w-16">Contact</span>
                        <span>{info.email}</span>
                    </div>
                    <Link href="/checkout/information" className="text-ms-stone hover:text-ms-black font-medium text-xs underline">
                        Change
                    </Link>
                </div>
                <div className="flex justify-between p-4">
                    <div className="flex gap-4">
                        <span className="text-ms-stone w-16">Ship to</span>
                        <span className="truncate max-w-[200px] md:max-w-xs">{info.address}, {info.city}</span>
                    </div>
                    <Link href="/checkout/information" className="text-ms-stone hover:text-ms-black font-medium text-xs underline">
                        Change
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-medium mb-4">Shipping Method</h2>
                <form onSubmit={handleSubmit}>
                    <div className="border border-ms-fog rounded-md overflow-hidden">
                        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-ms-ivory/30 transition-colors border-b border-ms-fog last:border-0">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="standard"
                                    checked={shippingMethod === 'standard'}
                                    onChange={() => setShippingMethod('standard')}
                                    className="w-4 h-4 text-ms-black focus:ring-ms-stone"
                                />
                                <div className="text-sm">
                                    <span className="font-medium block">Standard Shipping</span>
                                    <span className="text-ms-stone text-xs">3 to 5 business days</span>
                                </div>
                            </div>
                            <span className="font-medium text-sm">S/. 15.00</span>
                        </label>
                        <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-ms-ivory/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <input
                                    type="radio"
                                    name="shipping"
                                    value="express"
                                    checked={shippingMethod === 'express'}
                                    onChange={() => setShippingMethod('express')}
                                    className="w-4 h-4 text-ms-black focus:ring-ms-stone"
                                />
                                <div className="text-sm">
                                    <span className="font-medium block">Express Shipping</span>
                                    <span className="text-ms-stone text-xs">1 to 2 business days</span>
                                </div>
                            </div>
                            <span className="font-medium text-sm">S/. 25.00</span>
                        </label>
                    </div>

                    <div className="flex justify-between items-center pt-8">
                        <Link href="/checkout/information" className="text-ms-black hover:text-ms-stone transition-colors flex items-center gap-2 text-sm">
                            <ChevronLeft className="w-4 h-4" /> Return to information
                        </Link>
                        <Button type="submit" className="min-w-[200px]">
                            Continue to Payment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
