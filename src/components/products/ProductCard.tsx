"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

interface Product {
    id: string;
    slug: string;
    name_en: string;
    name_es: string;
    price: number;
    // images: string[]; // Simplification for now
}

export default function ProductCard({ product }: { product: Product }) {
    const locale = useLocale();
    const name = locale === 'es' ? product.name_es : product.name_en;

    return (
        <div style={{
            border: '1px solid #eee',
            borderRadius: 'var(--border-radius-md)',
            overflow: 'hidden',
            transition: 'transform 0.2s',
            backgroundColor: 'var(--color-white)'
        }}>
            <Link href={`/${locale}/products/${product.slug}`}>
                <div style={{
                    height: '300px',
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#aaa'
                }}>
                    {/* Placeholder for now since images are missing */}
                    <span>No Image Available</span>
                </div>
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-sm)' }}>{name}</h3>
                    <p style={{ fontWeight: 'bold' }}>S/ {product.price.toFixed(2)}</p>
                </div>
            </Link>
        </div>
    );
}
