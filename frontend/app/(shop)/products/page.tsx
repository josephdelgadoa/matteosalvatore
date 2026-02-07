'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { productsApi, Product } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';

export default function ProductListingPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsApi.getAll();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

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

    return (
        <div className="ms-container py-12 md:py-20">
            <div className="mb-12 md:mb-20 text-center">
                <h1 className="ms-heading-1 mb-4">All Products</h1>
                <p className="text-ms-stone max-w-lg mx-auto">Explore our complete collection of premium menswear.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {products.map((product) => {
                    // Find primary image or use placeholder
                    const primaryImage = product.product_images?.find(img => img.display_order === 0)?.image_url
                        || product.product_images?.[0]?.image_url
                        || 'https://via.placeholder.com/400x500?text=No+Image';

                    return (
                        <Link href={`/products/${product.slug}`} key={product.id} className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden bg-ms-pearl mb-4 relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${primaryImage})` }}
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-medium text-ms-black group-hover:text-ms-stone transition-colors">{product.name_es}</h3>
                                <p className="text-sm text-ms-stone capitalize">{product.category}</p>
                                <p className="text-sm font-medium">S/ {product.base_price.toFixed(2)}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
