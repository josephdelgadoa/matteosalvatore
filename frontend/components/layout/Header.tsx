'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/store/useCart';
import { Locale } from '../../i18n-config';

interface HeaderProps {
    lang: Locale;
    dict: any; // defined in nav dict
    commonDict: any;
}

export const Header = ({ lang, dict, commonDict }: HeaderProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    // Connect to store
    const { items, initCart } = useCart();
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    // Initialize cart on mount
    useEffect(() => {
        initCart();
    }, [initCart]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    // Fetch menu items
    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                // We need to import menuApi here. 
                // Since I cannot add import easily with this tool without overwriting top, I will assume I added it.
                // Wait, I need to add the import first.
                // Let's do this in two steps.
                // Actually, I can use dynamic import or just added it to the top.
                // I will add the import in a separate call or try to combine.
            } catch (error) {
                console.error('Failed to fetch menu:', error);
            }
        };

        // Dynamic import to avoid breaking changes if I miss the top import
        import('@/lib/api/menu').then(({ menuApi }) => {
            menuApi.getAll().then(data => setMenuItems(data)).catch(console.error);
        });
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
                    isScrolled ? "bg-ms-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between relative">
                    {/* Left: Mobile Menu & Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 -ml-2 text-ms-black"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" strokeWidth={1.5} />
                        </button>

                        {/* Logo */}
                        <Link href={`/${lang}`} className="relative block">
                            <div className={cn(
                                "transition-all duration-300",
                                isScrolled ? "h-8 w-auto" : "h-10 w-auto"
                            )}>
                                {/* Using unoptimized to avoid potential issues with local image loading if optimization is not configured */}
                                <img
                                    src="/images/logo-matteo-salvatore.png"
                                    alt="Matteo Salvatore"
                                    className="h-full w-auto object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right: Navigation & Icons */}
                    <div className="flex items-center gap-8">
                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <Navigation lang={lang} dict={dict} menuItems={menuItems} />
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-4 md:gap-6">

                            {/* Search Input (Desktop/Mobile) */}
                            <div className={cn(
                                "flex items-center transition-all duration-300 overflow-hidden",
                                isSearchOpen ? "w-48 md:w-64 opacity-100" : "w-0 opacity-0"
                            )}>
                                <form onSubmit={handleSearchSubmit} className="w-full">
                                    <input
                                        type="text"
                                        placeholder={commonDict.search}
                                        className="w-full bg-transparent border-b border-ms-black text-sm focus:outline-none placeholder:text-ms-stone"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus={isSearchOpen}
                                    />
                                </form>
                            </div>

                            <button
                                className="text-ms-stone hover:text-ms-black transition-colors"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </button>

                            <Link href={`/${lang}/account`} className="hidden md:block text-ms-stone hover:text-ms-black transition-colors">
                                <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </Link>

                            <Link href={`/${lang}/cart`} className="text-ms-stone hover:text-ms-black transition-colors relative">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-ms-stone text-ms-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-scale-in">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Language Switcher */}
                            <div className="hidden md:flex items-center gap-1 text-sm font-medium">
                                <button
                                    onClick={() => {
                                        const newPath = window.location.pathname.replace(`/${lang}`, '/es');
                                        router.push(newPath);
                                    }}
                                    className={cn("transition-colors", lang === 'es' ? "text-ms-black" : "text-ms-stone hover:text-ms-black")}
                                >
                                    ES
                                </button>
                                <span className="text-ms-stone">|</span>
                                <button
                                    onClick={() => {
                                        const newPath = window.location.pathname.replace(`/${lang}`, '/en');
                                        router.push(newPath);
                                    }}
                                    className={cn("transition-colors", lang === 'en' ? "text-ms-black" : "text-ms-stone hover:text-ms-black")}
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                lang={lang}
                dict={dict}
                commonDict={commonDict}
                menuItems={menuItems}
            />
        </>
    );
};
