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
import { createClient } from '@supabase/supabase-js';

// Server-side supabase client for fetching categories
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;

export default async function Home({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    // Fetch Data
    // 0. Content: Hero Slider
    let heroSlides = await contentApi.getHeroSlides(params.lang);

    // Fallback to dictionary if empty (or if migration not run yet)
    if (!heroSlides || heroSlides.length === 0) {
        heroSlides = dict.hero.slides.map((s, i) => ({ ...s, id: i + 1, link: s.link || '/products' }));
    }

    // 0.1 Featured Categories (Dynamic)
    let categories: any[] = [];
    try {
        const { data } = await supabase
            .from('featured_categories')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
            .limit(20); // Fetch more than 5 to handle potential duplicates in display_order

        const rawData = data || [];

        // Map to display structure and place in correct slots
        if (rawData.length > 0) {
            // Initialize array with nulls
            const slots = Array(5).fill(null);

            rawData.forEach(c => {
                if (c.display_order >= 0 && c.display_order < 5) {
                    slots[c.display_order] = {
                        key: c.id,
                        img: c.image_url,
                        // Fallback to Spanish title if English is missing (or vice-versa depending on lang)
                        title: params.lang === 'es' ? (c.title_es || c.title_en) : (c.title_en || c.title_es),
                        link: c.link_url || '#' // Fallback to avoid null pointer
                    };
                }
            });
            categories = slots;
        }
    } catch (e) {
        console.error('Error fetching categories:', e);
    }

    // Check if we have ANY categories to decide whether to show fallback
    const hasCategories = categories.some(c => c !== null);

    // Fallback if no dynamic categories
    if (!hasCategories) {
        // ... (Keep existing fallback if needed, or render nothing)
        categories = [
            { key: 'poloBasico', img: '/images/hero-image-ruso-1.jpeg', link: 'Polo Basico', title: 'Polo Basico' },
            { key: 'setTulum', img: '/images/hero-image-ruso-2.jpeg', link: 'Set Tulum', title: 'Set Tulum' },
            { key: 'conjuntoRangla', img: '/images/hero-image-01.png', link: 'Conjunto Rangla', title: 'Conjunto Rangla' },
            { key: 'hoodiePremium', img: '/images/hero-hoddie.jpeg', link: 'Hoodie Premium', title: 'Hoodie Premium' },
            { key: 'cargoFit', img: '/images/hero-cargo-pants.jpeg', link: 'Cargo Fit', title: 'Cargo Fit' }
        ];
    }

    // Ensure we have exactly 5 items for the grid by padding if necessary (or just rendering what we have safely)
    // The grid usage below depends on index, so it handles < 5 items gracefully but layout might look incomplete.


    // 1. Trending: Newest products
    const trendingProducts = await productsApi.getAll({ limit: 4, sort: 'newest' }).catch(() => []);

    // 1.1 Best Sellers
    const bestSellerIds = [
        '987abbf0-3eca-4ba5-97cd-615af86772d8', // Jogger
        '08c57d73-cdf9-4e98-9e9d-7a37f82dd785', // Polo
        '1b33b970-deee-4f97-8562-32296319f323', // Cargo Pants
        '18a2c717-b596-401c-8010-b79d46dad24f'  // Hoodie
    ];
    let bestSellingProducts = await productsApi.getAll({ ids: bestSellerIds }).catch(() => []);

    // Sort logic to match requested order
    bestSellingProducts = bestSellingProducts.sort((a: any, b: any) => {
        return bestSellerIds.indexOf(a.id) - bestSellerIds.indexOf(b.id);
    });

    // 2. Finishing Touches: Accessories
    const finishingProducts = await productsApi.getAll({ category: 'accessories', limit: 4 }).catch(() => []);

    return (
        <div className="space-y-16 pb-24">
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

            {/* Best Sellers */}
            <ProductGrid
                title={dict.home.bestSellers}
                products={bestSellingProducts}
                lang={params.lang}
                viewAllLink={`/${params.lang}/products`}
            />

            {/* Featured Categories (Custom 5-Item Grid) */}
            <section className="ms-container">
                <h2 className="ms-heading-2 mb-12 text-center text-ms-black">{dict.home.featuredCategories}</h2>

                {/* Desktop: 2 Cols (50/50). Left is 1 item. Right is 2 rows of 2 items. Gap 20px. */}
                <div className="flex flex-col md:flex-row gap-[20px] h-auto md:h-[800px]">

                    {/* Left Column (50%) - Item 0 */}
                    <div className="w-full md:w-1/2 h-[400px] md:h-full">
                        {categories[0] && (
                            <Link href={formatCategoryLink(categories[0].link, params.lang)} className="group block relative w-full h-full overflow-hidden rounded-lg">
                                <CategoryCardContent category={categories[0]} dict={dict} />
                            </Link>
                        )}
                    </div>

                    {/* Right Column (50%) - Items 1-4 */}
                    <div className="w-full md:w-1/2 flex flex-col gap-[20px] h-full">

                        {/* Top Row (50%) - Items 1 & 2 */}
                        <div className="flex flex-col md:flex-row gap-[20px] h-[400px] md:h-1/2">
                            <div className="w-full md:w-1/2 h-full">
                                {categories[1] && (
                                    <Link href={formatCategoryLink(categories[1].link, params.lang)} className="group block relative w-full h-full overflow-hidden rounded-lg">
                                        <CategoryCardContent category={categories[1]} dict={dict} />
                                    </Link>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 h-full">
                                {categories[2] && (
                                    <Link href={formatCategoryLink(categories[2].link, params.lang)} className="group block relative w-full h-full overflow-hidden rounded-lg">
                                        <CategoryCardContent category={categories[2]} dict={dict} />
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Bottom Row (50%) - Items 3 & 4 */}
                        <div className="flex flex-col md:flex-row gap-[20px] h-[400px] md:h-1/2">
                            <div className="w-full md:w-1/2 h-full">
                                {categories[3] && (
                                    <Link href={formatCategoryLink(categories[3].link, params.lang)} className="group block relative w-full h-full overflow-hidden rounded-lg">
                                        <CategoryCardContent category={categories[3]} dict={dict} />
                                    </Link>
                                )}
                            </div>
                            <div className="w-full md:w-1/2 h-full">
                                {categories[4] && (
                                    <Link href={formatCategoryLink(categories[4].link, params.lang)} className="group block relative w-full h-full overflow-hidden rounded-lg">
                                        <CategoryCardContent category={categories[4]} dict={dict} />
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>
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

// Helper to generate clean, safe links
function formatCategoryLink(link: string | null, lang: string): string {
    if (!link) return '#';
    // External links
    if (link.startsWith('http://') || link.startsWith('https://')) return link;
    // Internal absolute paths (user knows what they are doing)
    if (link.startsWith('/')) return link;

    // Default: Slugify and link to category page
    // "Polo Basico" -> "polo-basico"
    const slug = link.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/-+/g, '-');     // Collaborative dashes

    // Fallback if slug is empty
    if (!slug) return `/${lang}/products`;

    return `/${lang}/category/${slug}`;
}

// Helper component for content to reduce duplication
function CategoryCardContent({ category, dict }: { category: any, dict: any }) {
    return (
        <>
            <div className="absolute inset-0 bg-ms-black/20 group-hover:bg-ms-black/10 transition-colors z-10" />
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${category.image_url || category.img}')` }}
            />
            <div className="absolute bottom-4 left-4 z-20">
                <h3 className="text-xl font-serif text-ms-white mb-1 group-hover:translate-x-1 transition-transform">
                    {/* @ts-ignore */}
                    {dict.home.categories?.[category.key] || category.title}
                </h3>
            </div>
        </>
    );
}
