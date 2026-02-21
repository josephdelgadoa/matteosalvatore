'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi, Product } from '@/lib/api/products';
import { productCategoriesApi, ProductCategory } from '@/lib/api/productCategories';
import { Spinner } from '@/components/ui/Spinner';

import { PageHero } from '@/components/ui/PageHero';

// @ts-ignore
import { Locale } from '@/i18n-config';

export default function CategoryPage({ params }: { params: { slug: string; lang: Locale } }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<ProductCategory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch all categories to find the matching one by slug
                const categories = await productCategoriesApi.getAll();
                const matchedCategory = categories.find((c: ProductCategory) => c.slug_es === params.slug || c.slug_en === params.slug);
                if (matchedCategory) {
                    setCategory(matchedCategory);
                }

                // Fetch products filtered by category
                const data = await productsApi.getAll({ category: params.slug });
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.slug]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-ms-error">{error}</p>
            </div>
        );
    }

    // Determine Title based on language
    const displayTitle = category
        ? (params.lang === 'es' ? (category.name_es || category.name_en) : (category.name_en || category.name_es))
        : (params.slug.charAt(0).toUpperCase() + params.slug.slice(1));

    // Determine Hero Image
    const heroImage = category?.image_url || '/images/hero-image-01.png';

    return (
        <div className="animate-fade-in">
            <PageHero
                title={displayTitle}
                subtitle="Collection"
                image={heroImage}
            />

            <div className="ms-container py-12 md:py-20">
                <div className="mb-12 text-center">
                    <p className="text-ms-stone max-w-lg mx-auto">
                        Explore our curated selection of premium {displayTitle}.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-ms-stone/5 rounded-lg">
                        <p className="text-xl text-ms-stone">No products found in this category.</p>
                        <Link href={`/${params.lang}/${params.lang === 'es' ? 'productos' : 'products'}`} className="text-ms-black underline mt-4 inline-block hover:opacity-70">
                            View All Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => {
                            // Find primary image or use placeholder
                            const primaryImage = product.product_images?.find(img => img.display_order === 0)?.image_url
                                || product.product_images?.[0]?.image_url
                                || 'https://via.placeholder.com/400x500?text=No+Image';

                            // Localize product name
                            const productName = params.lang === 'es' ? (product.name_es || product.name_en) : (product.name_en || product.name_es);
                            // Localize slug
                            const productSlug = params.lang === 'es' ? (product.slug_es || product.slug_en) : (product.slug_en || product.slug_es);

                            return (
                                <Link href={`/${params.lang}/${params.lang === 'es' ? 'productos' : 'products'}/${productSlug}`} key={product.id} className="group cursor-pointer">
                                    <div className="aspect-[3/4] overflow-hidden bg-ms-pearl mb-4 relative">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${primaryImage})` }}
                                        />
                                        {/* Quick Add overlay could go here */}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-medium text-ms-black group-hover:text-ms-stone transition-colors line-clamp-2" title={productName}>{productName}</h3>
                                        <p className="text-sm font-medium">S/. {product.base_price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
