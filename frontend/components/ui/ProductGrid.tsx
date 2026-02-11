'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api/products';
import { Locale } from '@/i18n-config';

interface ProductGridProps {
    title: string;
    products: Product[];
    lang: Locale;
    viewAllLink?: string;
}

export const ProductGrid = ({ title, products, lang, viewAllLink }: ProductGridProps) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 md:py-24 animate-fade-in">
            <div className="ms-container">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="ms-heading-2">{title}</h2>
                    {viewAllLink && (
                        <Link href={viewAllLink} className="text-sm font-medium border-b border-ms-black pb-0.5 hover:text-ms-stone hover:border-ms-stone transition-colors">
                            View All
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product) => {
                        const primaryImage = product.product_images?.find(img => img.display_order === 0)?.image_url
                            || product.product_images?.[0]?.image_url
                            || 'https://via.placeholder.com/400x500?text=No+Image';

                        // Determine name based on lang, fallback to other if missing
                        const name = lang === 'es' ? (product.name_es || product.name_en) : (product.name_en || product.name_es);

                        return (
                            <Link href={`/${lang}/products/${product.slug}`} key={product.id} className="group cursor-pointer">
                                <div className="aspect-[3/4] overflow-hidden bg-ms-pearl mb-4 relative">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url(${primaryImage})` }}
                                    />
                                    {/* Optional: Add 'New' or 'Trending' badge here if needed */}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-medium text-ms-black group-hover:text-ms-stone transition-colors truncate">{name}</h3>
                                    <p className="text-sm font-medium">S/. {product.base_price.toFixed(2)}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
