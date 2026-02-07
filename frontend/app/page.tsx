import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HeroSlider } from '@/components/ui/HeroSlider';

export default function Home() {
    return (
        <div className="space-y-32 pb-24">
            {/* Hero Section */}
            {/* Hero Section */}
            <HeroSlider />

            {/* Featured Categories */}
            <section className="ms-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    <Link href="/category/clothing" className="group block overflow-hidden relative aspect-[4/5] md:aspect-[3/2]">
                        <div className="absolute inset-0 bg-ms-black/10 group-hover:bg-ms-black/0 transition-colors z-10" />
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594938298603-c8148c47e356?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-8 left-8 z-20">
                            <h3 className="text-3xl font-serif text-ms-white mb-2">Clothing</h3>
                            <span className="text-sm uppercase tracking-widest text-ms-white border-b border-white pb-1">Explore</span>
                        </div>
                    </Link>
                    <Link href="/category/footwear" className="group block overflow-hidden relative aspect-[4/5] md:aspect-[3/2]">
                        <div className="absolute inset-0 bg-ms-black/10 group-hover:bg-ms-black/0 transition-colors z-10" />
                        {/* Placeholder Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613504496739-65005ac94af0?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-8 left-8 z-20">
                            <h3 className="text-3xl font-serif text-ms-white mb-2">Footwear</h3>
                            <span className="text-sm uppercase tracking-widest text-ms-white border-b border-white pb-1">Explore</span>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Brand Values */}
            <section className="bg-ms-white py-24 border-y border-ms-fog">
                <div className="ms-container text-center">
                    <span className="ms-label mb-4 block">Our Philosophy</span>
                    <h2 className="ms-heading-2 mb-16 max-w-2xl mx-auto">
                        "We believe true luxury lies in simplicity, quality materials, and ethical craftsmanship."
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium uppercase tracking-wide">Peruvian Origins</h3>
                            <p className="text-ms-stone leading-relaxed">Sourced from the Andes, our alpaca and cotton fibers are world-renowned for their softness and durability.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium uppercase tracking-wide">Timeless Design</h3>
                            <p className="text-ms-stone leading-relaxed">Pieces designed to transcend trends. Wardrobe staples that you will wear for years to come.</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium uppercase tracking-wide">Sustainable</h3>
                            <p className="text-ms-stone leading-relaxed">Committed to ethical production practices and minimizing our environmental footprint.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
