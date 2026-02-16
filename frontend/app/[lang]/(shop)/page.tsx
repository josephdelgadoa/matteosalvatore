import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HeroSlider } from '@/components/ui/HeroSlider';
import { Mountain, Clock, Leaf } from 'lucide-react';
import { Testimonials } from '@/components/sections/Testimonials';
import { ProductGrid } from '@/components/ui/ProductGrid';
import { NewsletterPopup } from '@/components/ui/NewsletterPopup';
import { productsApi } from '@/lib/api/products';
// @ts-ignore
import { Locale } from '@/i18n-config';
import { getDictionary } from '../../../get-dictionary';

import { contentApi } from '@/lib/api/content';

export const revalidate = 0;

export default async function Home({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    // Fetch Data
    // 0. Content: Hero Slider
    let heroSlides = await contentApi.getHeroSlides(params.lang);
    console.log(`[Homepage] Fetched ${heroSlides?.length || 0} slides for ${params.lang}`);
    if (heroSlides && heroSlides.length > 0) {
        console.log('[Homepage] First Slide ID:', heroSlides[0].id, 'Image:', heroSlides[0].image);
    }

    // Fallback to dictionary if empty (or if migration not run yet)
    if (!heroSlides || heroSlides.length === 0) {
        console.log('[Homepage] Using fallback slides from dictionary');
        heroSlides = dict.hero.slides.map((s, i) => ({ ...s, id: i + 1, link: s.link || '/products' }));
    }

    // 1. Trending: Newest products
    const trendingProducts = await productsApi.getAll({ limit: 4, sort: 'newest' }).catch(() => []);

    // 2. Finishing Touches: Accessories
    const finishingProducts = await productsApi.getAll({ category: 'accessories', limit: 4 }).catch(() => []);

    return (
        <div className="space-y-32 pb-24">
            <NewsletterPopup />

            {/* Hero Section */}
            <HeroSlider slides={heroSlides} lang={params.lang} />

            {/* Trending Now */}
            <ProductGrid
                title={dict.home.trending}
                products={trendingProducts}
                lang={params.lang}
                viewAllLink={`/${params.lang}/products`}
            />

            {/* Featured Categories */}
            <section className="ms-container">
                <h2 className="ms-heading-2 mb-12 text-center text-ms-black">{dict.home.featuredCategories}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {[
                        { key: 'poloBasico', img: '/images/hero-image-ruso-1.jpeg', link: 'Polo Basico' }, // Reusing hero image
                        { key: 'setTulum', img: '/images/hero-image-ruso-2.jpeg', link: 'Set Tulum' }, // Reusing hero image
                        { key: 'conjuntoRangla', img: '/images/hero-image-01.png', link: 'Conjunto Rangla' }, // Reusing hero image
                        { key: 'hoodiePremium', img: '/images/hero-hoddie.jpeg', link: 'Hoodie Premium' },
                        { key: 'cargoFit', img: '/images/hero-cargo-pants.jpeg', link: 'Cargo Fit' },
                        { key: 'skinnyFit', img: '/images/hero-image-ruso-2.jpeg', link: 'Skinny Fit' }, // Reusing existing
                        { key: 'joggerCargoFit', img: '/images/hero-jogger.jpeg', link: 'Jogger Cargo Fit' },
                        { key: 'calzado', img: '/images/matteo-salvatore-joggers.jpeg', link: 'Calzado' } // Reusing existing
                    ].map((category) => (
                        <Link key={category.key} href={`/${params.lang}/products?q=${encodeURIComponent(category.link)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-lg">
                            <div className="absolute inset-0 bg-ms-black/20 group-hover:bg-ms-black/10 transition-colors z-10" />
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url('${category.img}')` }}
                            />
                            <div className="absolute bottom-4 left-4 z-20">
                                <h3 className="text-xl font-serif text-ms-white mb-1 group-hover:translate-x-1 transition-transform">
                                    {/* @ts-ignore */}
                                    {dict.home.categories[category.key]}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Finishing Touches */}
            <ProductGrid
                title={dict.home.finishingTouches}
                products={finishingProducts}
                lang={params.lang}
                viewAllLink={`/${params.lang}/category/accessories`}
            />

            {/* Testimonials */}
            {/* @ts-ignore */}
            <Testimonials dict={dict.testimonials} />

            {/* Brand Values */}
            <section className="bg-ms-white py-24 border-y border-ms-fog">
                <div className="ms-container text-center">
                    <h2 className="ms-heading-2 mb-8 block text-ms-black">{dict.home.philosophy.title}</h2>
                    <p className="font-serif text-xl md:text-2xl leading-relaxed text-ms-black/80 max-w-2xl mx-auto mb-16">
                        {dict.home.philosophy.text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Column 1 */}
                        <div className="flex flex-col items-center space-y-6 group">
                            <div className="w-16 h-16 rounded-full bg-ms-pearl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                <Mountain className="w-8 h-8 text-ms-brand-primary/80 stroke-[1.5]" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-serif font-medium">{dict.home.philosophy.origins.title}</h3>
                                <p className="text-ms-stone leading-relaxed max-w-xs mx-auto">
                                    {dict.home.philosophy.origins.text}
                                </p>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col items-center space-y-6 group">
                            <div className="w-16 h-16 rounded-full bg-ms-pearl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                <Clock className="w-8 h-8 text-ms-brand-primary/80 stroke-[1.5]" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-serif font-medium">{dict.home.philosophy.design.title}</h3>
                                <p className="text-ms-stone leading-relaxed max-w-xs mx-auto">
                                    {dict.home.philosophy.design.text}
                                </p>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="flex flex-col items-center space-y-6 group">
                            <div className="w-16 h-16 rounded-full bg-ms-pearl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                                <Leaf className="w-8 h-8 text-ms-brand-primary/80 stroke-[1.5]" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-serif font-medium">{dict.home.philosophy.sustainable.title}</h3>
                                <p className="text-ms-stone leading-relaxed max-w-xs mx-auto">
                                    {dict.home.philosophy.sustainable.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

