'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { productsApi, Product } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const fetchProducts = async () => {
        try {
            const data = await productsApi.getAll();
            setProducts(data);
        } catch (err) {
            console.error(err);
            addToast('Failed to load products', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (item: Product) => {
        if (!confirm(`Are you sure you want to delete ${item.name_es}?`)) return;

        try {
            // await productsApi.delete(item.id); 
            // API call commented out until backend implements delete
            addToast('Product deleted (Simulated)', 'success');
            // Refresh
            // fetchProducts(); 
        } catch (err) {
            addToast('Failed to delete product', 'error');
        }
    };

    const columns = [
        {
            header: 'Product',
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
                        <span className="text-xs text-ms-stone block">{item.slug}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Category',
            accessorKey: (item: Product) => (
                <span className="capitalize">{item.category}</span>
            )
        },
        {
            header: 'Price',
            accessorKey: (item: Product) => `S/. ${item.base_price.toFixed(2)}`
        },
        {
            header: 'Stock',
            accessorKey: (item: Product) => {
                const totalStock = item.product_variants?.reduce((acc, v) => acc + v.stock_quantity, 0) || 0;
                return (
                    <span className={totalStock < 10 ? 'text-ms-error' : 'text-ms-success'}>
                        {totalStock} items
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
                    <h1 className="ms-heading-2 mb-2">Products</h1>
                    <p className="text-ms-stone">Manage your catalog, inventory, and variants.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <DataTable
                data={products}
                columns={columns}
                editPath={(item) => `/admin/products/${item.slug}`}
                onDelete={handleDelete}
            />
        </div>
    );
}
