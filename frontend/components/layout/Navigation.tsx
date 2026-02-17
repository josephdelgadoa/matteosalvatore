import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Locale } from '../../i18n-config';
import { PRODUCT_CATEGORIES, NAV_STRUCTURE } from '../../lib/constants';
import { cn } from '@/lib/utils';

interface NavigationProps {
    lang: Locale;
    dict: any;
    menuItems?: any[];
}

export const Navigation = ({ lang, dict, menuItems }: NavigationProps) => {
    // Helper to find category by ID
    const getCategory = (id: string) => PRODUCT_CATEGORIES.find(c => c.id === id);

    // Use menuItems if available, otherwise fallback to NAV_STRUCTURE
    const itemsToRender = menuItems && menuItems.length > 0 ? menuItems : NAV_STRUCTURE;

    return (
        <nav className="hidden md:flex items-center gap-8">
            {itemsToRender.map((item: any) => {
                // Determine if dropdown or link based on type property or structure
                // API Items have 'type' property. NAV_STRUCTURE items have 'type' property.
                // Adapting API structure to match if needed, but they are similar enough.

                if (item.type === 'dropdown') {
                    // Dropdown Menu (e.g. ROPA)
                    return (
                        <div key={item.id} className="group relative">
                            <button className="flex items-center gap-1 text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors py-2">
                                {lang === 'es' ? (item.label_es || item.label?.es) : (item.label_en || item.label?.en)}
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {/* Dropdown Content */}
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                                <div className="bg-ms-white border border-ms-fog shadow-lg p-4 grid gap-6 rounded-sm">
                                    {/* Handle difference between API children and Legacy items */}
                                    {(item.children || item.items)?.map((childOrId: any) => {
                                        // Legacy: child is string ID. New: child is object.
                                        let category: any = null;
                                        if (typeof childOrId === 'string') {
                                            category = getCategory(childOrId);
                                        } else {
                                            category = childOrId; // It's a menu item object
                                        }

                                        if (!category) return null;

                                        return (
                                            <div key={category.id} className="space-y-2">
                                                <Link
                                                    href={category.link_url || `/${lang}/category/${category.id}`}
                                                    className="font-medium text-ms-black hover:text-ms-gold transition-colors block"
                                                >
                                                    {lang === 'es' ? (category.label_es || category.label?.es) : (category.label_en || category.label?.en)}
                                                </Link>

                                                {/* Subcategories (Only for Legacy structure or deep nesting if needed) */}
                                                {/* For v1 Menu Bar we assume 2 levels. If User adds 3rd level it would be category.children */}
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
                            href={item.link_url || `/${lang}${item.href}`}
                            className="text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors"
                        >
                            {lang === 'es' ? (item.label_es || item.label?.es) : (item.label_en || item.label?.en)}
                        </Link>
                    );
                }
            })}

            {/* Static Links - kept for now or should be in DB? User said "Menu Bar", likely wants full control. 
                But for safety I will keep them if they are NOT in the database to avoid losing them.
                Actually, the user can add them via Admin Panel. 
                If menuItems is present, we assume it's the full menu.
            */}
            {(!menuItems || menuItems.length === 0) && (
                <>
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
                </>
            )}
        </nav>
    );
};
