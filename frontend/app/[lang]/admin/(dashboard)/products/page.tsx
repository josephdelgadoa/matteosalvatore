'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Copy, Search } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { productsApi, Product } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Input } from '@/components/ui/Input';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function AdminProductsPage({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSort, setCurrentSort] = useState<string>('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToast } = useToast();
 
    const fetchProducts = async (sort?: string) => {
        try {
            const data = await productsApi.getAll({ 
                includeInactive: true, 
                limit: 100,
                sort: (sort || currentSort) as any
            });
            setProducts(data);
        } catch (err: any) {
            console.error('Error loading products:', err);
            addToast(`${dict.products.loadError}: ${err.message || 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };
 
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSort = (key: string) => {
        let newSort = `${key}-asc`;
        if (currentSort === `${key}-asc`) {
            newSort = `${key}-desc`;
        } else if (currentSort === `${key}-desc`) {
            newSort = 'newest'; // Cycle back to default or toggle
        }
        
        setCurrentSort(newSort);
        fetchProducts(newSort);
    };
 
    const handleDelete = async (item: Product) => {
        if (!confirm(`${dict.products.confirmDelete} ${item.name_es}?`)) return;
 
        try {
            await productsApi.delete(item.id);
            addToast(dict.products.deleteSuccess, 'success');
            // Refresh
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            addToast(dict.products.deleteError, 'error');
        }
    };
 
    const handleDuplicate = async (item: Product) => {
        try {
            addToast(dict.products.duplicating, 'info');
 
            // 1. Get full product details
            const fullProduct = await productsApi.getBySlug(item.slug_es);
 
            // 2. Prepare duplicated data
            const suffix = ` (${dict.products.copy})`;
            const duplicateData: Partial<Product> = {
                ...fullProduct,
                name_es: `${fullProduct.name_es}${suffix}`.substring(0, 255),
                name_en: `${fullProduct.name_en}${suffix}`.substring(0, 255),
                slug_es: `${fullProduct.slug_es}-copy-${Math.floor(Math.random() * 1000)}`,
                slug_en: `${fullProduct.slug_en}-copy-${Math.floor(Math.random() * 1000)}`,
                is_active: false, // Default to inactive
            };
 
            // Remove internal IDs and fields that should not be copied directly
            delete (duplicateData as any).id;
            delete (duplicateData as any).sku; // Let backend regenerate SKU
            delete (duplicateData as any).created_at;
            delete (duplicateData as any).updated_at;
            delete (duplicateData as any).reviews;
 
            // Strip IDs from variants
            if (duplicateData.product_variants) {
                duplicateData.product_variants = duplicateData.product_variants.map(v => {
                    const { id, ...variantData } = v;
                    return { ...variantData, sku_variant: undefined } as any; // Let backend regenerate SKUs
                });
            }
 
            // Strip IDs from images
            if (duplicateData.product_images) {
                duplicateData.product_images = duplicateData.product_images.map(img => {
                    const { id, product_id, ...imageData } = img;
                    return imageData as any;
                });
            }
 
            // 3. Create duplicate
            await productsApi.create(duplicateData);
 
            addToast(dict.products.duplicateSuccess, 'success');
            fetchProducts();
        } catch (err: any) {
            console.error('Error duplicating product:', err);
            addToast(`${dict.products.duplicateError}: ${err.message || 'Unknown error'}`, 'error');
        }
    };
 
    const filteredProducts = React.useMemo(() => {
        if (!searchQuery.trim()) return products;
        
        const query = searchQuery.toLowerCase().trim();
        return products.filter(p => 
            (p.short_name_es && p.short_name_es.toLowerCase().includes(query)) ||
            (p.short_name_en && p.short_name_en.toLowerCase().includes(query)) ||
            p.name_es.toLowerCase().includes(query) ||
            p.name_en.toLowerCase().includes(query) ||
            (p.sku && p.sku.toLowerCase().includes(query)) ||
            p.category.toLowerCase().includes(query) ||
            (p.subcategory && p.subcategory.toLowerCase().includes(query))
        );
    }, [products, searchQuery]);

    const columns = [
        {
            header: dict.products.tableProduct,
            sortKey: 'name',
            accessorKey: (item: Product) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ms-pearl flex-shrink-0">
                        {/* Simplified Image preview */}
                        {item.product_images?.[0] && (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${item.product_images[0].image_url})` }}
                            />
                        )}
                    </div>
                    <div>
                        <span className="font-medium block">{item.short_name_es || item.name_es}</span>
                        <span className="text-xs text-ms-stone block">{item.slug_es} / {item.slug_en}</span>
                    </div>
                </div>
            )
        },
        {
            header: "Código de Estilo",
            sortKey: 'sku',
            accessorKey: (item: Product) => (
                <code className="text-[10px] font-mono bg-ms-fog/30 px-1.5 py-0.5 rounded text-ms-stone">
                    {item.sku || '-'}
                </code>
            )
        },
        {
            header: dict.products.tableCategory,
            sortKey: 'category',
            accessorKey: (item: Product) => (
                <span className="capitalize">{item.category}</span>
            )
        },
        {
            header: dict.products.tableSubcategory,
            sortKey: 'subcategory',
            accessorKey: (item: Product) => (
                <span className="capitalize">{item.subcategory || '-'}</span>
            )
        },
        {
            header: dict.products.tablePrice,
            sortKey: 'price',
            accessorKey: (item: Product) => `S/. ${item.base_price.toFixed(2)}`
        },
        {
            header: dict.products.tableStock,
            accessorKey: (item: Product) => {
                const totalStock = item.product_variants?.reduce((acc, v) => acc + v.stock_quantity, 0) || 0;
                return (
                    <span className={totalStock < 10 ? 'text-ms-error' : 'text-ms-success'}>
                        {totalStock} {dict.products.items}
                    </span>
                );
            }
        }
    ];

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div>
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">{dict.products.title}</h1>
                    <p className="text-ms-stone">{dict.products.subtitle}</p>
                </div>
                <Link href={`/${params.lang}/admin/products/new`}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {dict.products.add}
                    </Button>
                </Link>
            </div>

            <div className="mb-6 relative max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ms-stone pointer-events-none">
                    <Search className="w-4 h-4" />
                </div>
                <Input
                    placeholder={dict.products.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 py-3 bg-ms-pearl/30 border-ms-fog/50 focus:bg-ms-white transition-all shadow-none"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-ms-stone hover:text-ms-black"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            <DataTable
                data={filteredProducts}
                columns={columns}
                editPath={(item) => `/admin/products/${item.slug_es || item.slug_en}`}
                onDelete={handleDelete}
                onSort={handleSort}
                currentSort={currentSort}
                extraActions={(item) => (
                    <Button
                        variant="text"
                        size="sm"
                        className="p-2 h-8 w-8"
                        onClick={() => handleDuplicate(item)}
                        title={dict.products.duplicate}
                    >
                        <Copy className="w-4 h-4 text-ms-stone hover:text-ms-black" />
                    </Button>
                )}
            />
        </div>
    );
}
