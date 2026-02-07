'use client';

import React from 'react';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

export const OrderSummary = () => {
    const { items, getCartTotal, isLoading } = useCart();
    const subtotal = getCartTotal();
    // Mock shipping for now, will calculate later
    const shipping = subtotal > 300 ? 0 : 15.00;
    const total = subtotal + shipping;

    if (isLoading) return <div className="py-10 flex justify-center"><Spinner /></div>;

    return (
        <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 border border-ms-fog bg-ms-white rounded-md overflow-hidden flex-shrink-0">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <span className="absolute -top-2 -right-2 bg-ms-stone/90 text-ms-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-sm text-ms-black">{item.name}</h4>
                            <p className="text-xs text-ms-stone">{item.size} / {item.color}</p>
                        </div>
                        <div className="text-sm font-medium text-ms-black">
                            S/ {(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            <hr className="border-ms-fog" />

            {/* Calculations */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-ms-stone">Subtotal</span>
                    <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-ms-stone">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? 'Free' : `S/ ${shipping.toFixed(2)}`}
                    </span>
                </div>
            </div>

            <hr className="border-ms-fog" />

            <div className="flex justify-between items-baseline">
                <span className="font-medium text-lg">Total</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-ms-stone">PEN</span>
                    <span className="font-bold text-2xl">S/ {total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
