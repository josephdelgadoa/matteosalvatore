'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left: Content */}
            <div className="flex flex-col justify-center items-center p-8 bg-ms-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex justify-center mb-8">
                        <Link href="/" className="font-serif text-2xl tracking-tight">
                            Matteo Salvatore
                        </Link>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right: Image (Hidden on mobile) */}
            <div className="hidden md:block relative bg-ms-stone">
                <Image
                    src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2787&auto=format&fit=crop"
                    alt="Matteo Salvatore Lifestyle"
                    fill
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>
        </div>
    );
}
