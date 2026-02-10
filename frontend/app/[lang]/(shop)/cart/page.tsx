import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

// @ts-ignore
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';

// We need to fetch dictionary on server, but cart logic uses client hook.
// Since CartPage uses useCart which is client-side only (likely using local storage/context),
// the component must be 'use client'.
// However, getDictionary is async and typically server-side (fs access).
// If getDictionary uses 'fs', it cannot run in client component.
// We must fetch dictionary in a Server Component wrapper and pass it to Client Component.

// Let's create a Client Component wrapper for the cart content.
import { CartContent } from '@/components/shop/CartContent';

export default async function CartPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);
    return <CartContent lang={params.lang} dict={dict.cart} />;
}
