'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { productsApi } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch all products and filter client-side for now
                const { data } = await productsApi.getAll();

                const filtered = data.products.filter((product: any) =>
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.description.toLowerCase().includes(query.toLowerCase())
                );

                setResults(filtered);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-[60vh] animate-fade-in">
            <h1 className="ms-heading-2 mb-8 text-center border-b border-ms-fog pb-4">
                Search Results
            </h1>

            <div className="text-center mb-12">
                <p className="text-ms-stone">Did you search for: <span className="text-ms-black font-medium">"{query}"</span></p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Spinner /></div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {results.map((product) => (
                        <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                            <div className="relative aspect-[3/4] mb-4 bg-ms-ivory overflow-hidden">
                                {product.images && product.images[0] ? (
                                    <Image
                                        src={product.images[0].url}
                                        alt={product.images[0].alt_text || product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-ms-stone bg-ms-ivory">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-ms-black group-hover:text-ms-taupe transition-colors">{product.name}</h3>
                            <p className="text-sm text-ms-stone mt-1">S/. {product.price.toFixed(2)}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-ms-ivory/30 rounded-lg">
                    <Search className="w-12 h-12 text-ms-stone mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-medium mb-2">No results found</h3>
                    <p className="text-ms-stone mb-8">We couldn't find any products matching your search.</p>
                    <Link href="/products">
                        <Button variant="outline">Browse All Products</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
            <SearchContent />
        </Suspense>
    );
}
