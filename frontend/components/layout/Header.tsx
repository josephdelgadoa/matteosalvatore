'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useCart } from '@/store/useCart';

export const Header = () => {
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
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
                    isScrolled ? "bg-ms-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between relative">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 -ml-2 text-ms-black"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" strokeWidth={1.5} />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <Navigation />
                    </div>

                    {/* Logo */}
                    <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                        <span className={cn(
                            "font-serif font-medium tracking-tight transition-all",
                            isScrolled ? "text-2xl" : "text-3xl"
                        )}>
                            Matteo Salvatore
                        </span>
                    </Link>

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
                                    placeholder="Search..."
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

                        <Link href="/account" className="hidden md:block text-ms-stone hover:text-ms-black transition-colors">
                            <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                        </Link>

                        <Link href="/cart" className="text-ms-stone hover:text-ms-black transition-colors relative">
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-ms-stone text-ms-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-scale-in">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </>
    );
};
