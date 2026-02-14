import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Locale } from '../../i18n-config';
import { PRODUCT_CATEGORIES, NAV_STRUCTURE } from '../../lib/constants';
import { cn } from '@/lib/utils';

interface NavigationProps {
    lang: Locale;
    dict: any;
}

export const Navigation = ({ lang, dict }: NavigationProps) => {
    // Helper to find category by ID
    const getCategory = (id: string) => PRODUCT_CATEGORIES.find(c => c.id === id);

    return (
        <nav className="hidden md:flex items-center gap-8">
            {NAV_STRUCTURE.map((item) => {
                if (item.type === 'dropdown') {
                    // Dropdown Menu (e.g. ROPA)
                    return (
                        <div key={item.id} className="group relative">
                            <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors py-2">
                                {item.label[lang] || item.label.en}
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {/* Dropdown Content */}
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                                <div className="bg-ms-white border border-ms-fog shadow-lg p-4 grid gap-6 rounded-sm">
                                    {item.items?.map((catId: string) => {
                                        const category = getCategory(catId);
                                        if (!category) return null;

                                        return (
                                            <div key={category.id} className="space-y-2">
                                                <Link
                                                    href={`/${lang}/category/${category.id}`}
                                                    className="font-medium text-ms-black hover:text-ms-gold transition-colors block"
                                                >
                                                    {category.label[lang] || category.label.en}
                                                </Link>

                                                {/* Subcategories */}
                                                {category.subcategories && category.subcategories.length > 0 && (
                                                    <div className="pl-3 space-y-1 border-l border-ms-fog">
                                                        {category.subcategories.map(sub => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/${lang}/category/${category.id}?subcategory=${sub.id}`}
                                                                className="block text-sm text-ms-stone hover:text-ms-black transition-colors"
                                                            >
                                                                {sub.label[lang] || sub.label.en}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    // Standard Link
                    return (
                        <Link
                            key={item.id}
                            href={`/${lang}${item.href}`}
                            className="text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors"
                        >
                            {/* @ts-ignore */}
                            {item.label[lang] || item.label.en}
                        </Link>
                    );
                }
            })}

            {/* Static Links */}
            <Link
                href={`/${lang}/search?q=new`}
                className="text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors"
            >
                {dict.newArrivals}
            </Link>
            <Link
                href={`/${lang}/about`}
                className="text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors"
            >
                {dict.about}
            </Link>
        </nav>
    );
};
