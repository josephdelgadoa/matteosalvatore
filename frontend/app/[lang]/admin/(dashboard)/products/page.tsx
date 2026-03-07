'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Copy } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { productsApi, Product } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function AdminProductsPage({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const fetchProducts = async () => {
        try {
            const data = await productsApi.getAll({ includeInactive: true, limit: 100 });
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

    const columns = [
        {
            header: dict.products.tableProduct,
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
                        <span className="font-medium block">{item.name_es}</span>
                        <span className="text-xs text-ms-stone block">{item.slug_es} / {item.slug_en}</span>
                    </div>
                </div>
            )
        },
        {
            header: dict.products.tableCategory,
            accessorKey: (item: Product) => (
                <span className="capitalize">{item.category}</span>
            )
        },
        {
            header: dict.products.tablePrice,
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

            <DataTable
                data={products}
                columns={columns}
                editPath={(item) => `/admin/products/${item.slug_es || item.slug_en}`}
                onDelete={handleDelete}
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
