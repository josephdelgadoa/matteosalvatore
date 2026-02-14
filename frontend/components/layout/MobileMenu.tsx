import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Locale } from '../../i18n-config';
import { PRODUCT_CATEGORIES, NAV_STRUCTURE } from '../../lib/constants';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Locale;
    dict: any;
    commonDict: any;
}

export const MobileMenu = ({ isOpen, onClose, lang, dict, commonDict }: MobileMenuProps) => {
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    // ... remainder of component

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const getCategory = (id: string) => PRODUCT_CATEGORIES.find(c => c.id === id);

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 bg-ms-white transform transition-transform duration-300 ease-in-out md:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-ms-fog">
                    <span className="font-serif text-lg font-medium">{commonDict.menu}</span>
                    <button onClick={onClose} className="p-2 -mr-2 text-ms-stone hover:text-ms-black">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-8">
                    <ul className="flex flex-col space-y-6 px-8">
                        {NAV_STRUCTURE.map((item) => {
                            if (item.type === 'dropdown') {
                                const isExpanded = expandedItems.includes(item.id);
                                return (
                                    <li key={item.id} className="space-y-4">
                                        <button
                                            onClick={() => toggleExpand(item.id)}
                                            className="flex items-center justify-between w-full text-xl font-light text-ms-black py-2 border-b border-ms-fog"
                                        >
                                            {item.label[lang] || item.label.en}
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="pl-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                {item.items?.map((catId: string) => {
                                                    const category = getCategory(catId);
                                                    if (!category) return null;

                                                    return (
                                                        <div key={category.id} className="space-y-2">
                                                            <Link
                                                                href={`/${lang}/category/${category.id}`}
                                                                onClick={onClose}
                                                                className="block font-medium text-lg text-ms-black"
                                                            >
                                                                {category.label[lang] || category.label.en}
                                                            </Link>

                                                            {/* Subcategories */}
                                                            {category.subcategories && category.subcategories.length > 0 && (
                                                                <div className="pl-4 space-y-2 border-l border-ms-fog">
                                                                    {category.subcategories.map(sub => (
                                                                        <Link
                                                                            key={sub.id}
                                                                            href={`/${lang}/category/${category.id}?subcategory=${sub.id}`}
                                                                            onClick={onClose}
                                                                            className="block text-base text-ms-stone"
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
                                        )}
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={item.id}>
                                        <Link
                                            href={`/${lang}${item.href}`}
                                            onClick={onClose}
                                            className="text-xl font-light text-ms-black block py-2 border-b border-ms-fog"
                                        >
                                            {/* @ts-ignore */}
                                            {item.label[lang] || item.label.en}
                                        </Link>
                                    </li>
                                );
                            }
                        })}

                        <li>
                            <Link
                                href={`/${lang}/search?q=new`}
                                onClick={onClose}
                                className="text-xl font-light text-ms-black block py-2 border-b border-ms-fog"
                            >
                                {dict.newArrivals}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/${lang}/about`}
                                onClick={onClose}
                                className="text-xl font-light text-ms-black block py-2 border-b border-ms-fog"
                            >
                                {dict.about}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/${lang}/account`}
                                onClick={onClose}
                                className="text-xl font-light text-ms-black block py-2 border-b border-ms-fog"
                            >
                                {commonDict.account}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-8 bg-ms-ivory">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => {
                                const newPath = window.location.pathname.replace(`/${lang}`, '/es');
                                window.location.href = newPath;
                            }}
                            className={cn("text-sm font-medium transition-colors", lang === 'es' ? "text-ms-black underline" : "text-ms-stone hover:text-ms-black")}
                        >
                            ESPAÑOL
                        </button>
                        <span className="text-ms-stone">|</span>
                        <button
                            onClick={() => {
                                const newPath = window.location.pathname.replace(`/${lang}`, '/en');
                                window.location.href = newPath;
                            }}
                            className={cn("text-sm font-medium transition-colors", lang === 'en' ? "text-ms-black underline" : "text-ms-stone hover:text-ms-black")}
                        >
                            ENGLISH
                        </button>
                    </div>

                    <p className="text-sm text-ms-stone mb-4">{dict.contact}</p>
                    <a href="mailto:support@matteosalvatore.pe" className="text-ms-black underline">support@matteosalvatore.pe</a>
                </div>
            </div>
        </div>
    );
};
