'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getCartTotal, isLoading } = useCart();
    const subtotal = getCartTotal();

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size="lg" />
                    <p className="text-ms-stone animate-pulse">Loading cart...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
                <div className="text-center max-w-md px-4">
                    <h1 className="ms-heading-2 mb-4">Your Bag is Empty</h1>
                    <p className="text-ms-stone mb-8 leading-relaxed">
                        Looks like you haven't found the perfect piece yet.
                        Explore our new collection of premium Peruvian essentials.
                    </p>
                    <Link href="/category/clothing">
                        <Button size="lg">Start Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ms-ivory/30 pt-12 pb-24 animate-fade-in">
            <div className="ms-container max-w-5xl">
                <h1 className="ms-heading-2 mb-12">Shopping Bag ({items.length})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-8">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-6 py-6 border-b border-ms-fog first:pt-0">
                                {/* Product Image */}
                                <div className="relative w-24 h-32 md:w-32 md:h-40 bg-ms-pearl shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-ms-fog/20 text-ms-stone text-xs">No Image</div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <Link href={`/products/${item.slug}`} className="font-medium hover:text-ms-stone transition-colors">
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-ms-stone hover:text-ms-error transition-colors p-1"
                                                aria-label="Remove item"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <p className="text-ms-stone text-sm mb-4">
                                            Size: {item.size} / Color: {item.color}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center border border-ms-fog">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="p-2 hover:bg-ms-fog/20 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-ms-fog/20 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <p className="font-medium">
                                            S/ {(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-ms-white p-8 border border-ms-fog sticky top-24">
                            <h2 className="text-lg font-medium mb-6 uppercase tracking-wide">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-sm text-ms-stone">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-ms-black font-medium">S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-ms-black">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-ms-fog pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="font-medium text-lg">Total</span>
                                    <span className="font-medium text-xl">S/ {subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link href="/checkout/information" className="block w-full">
                                <Button size="lg" className="w-full flex justify-between items-center group">
                                    <span>Checkout</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-ms-stone mb-2">Secure Checkout</p>
                                {/* Payment Icons could go here */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
