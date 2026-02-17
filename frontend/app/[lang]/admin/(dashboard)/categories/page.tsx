'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { productCategoriesApi, ProductCategory } from '@/lib/api/productCategories';
import { Plus, Edit, Trash, LayoutDashboard } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function ProductCategoriesPage() {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await productCategoriesApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load product categories', error);
            addToast('Failed to load categories', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await productCategoriesApi.delete(id);
            addToast('Category deleted', 'success');
            loadCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            addToast('Failed to delete category', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2">Product Categories</h1>
                    <p className="text-ms-stone mt-1">Manage product taxonomy (Tops, Bottoms, Shoes, etc.)</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button>
                        <Plus size={20} className="mr-2" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border border-ms-fog overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-ms-pearl border-b border-ms-fog">
                        <tr>
                            <th className="p-4 font-medium text-ms-stone w-16">Active</th>
                            <th className="p-4 font-medium text-ms-stone">Name (ES)</th>
                            <th className="p-4 font-medium text-ms-stone">Name (EN)</th>
                            <th className="p-4 font-medium text-ms-stone w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ms-fog">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-ms-pearl/50">
                                <td className="p-4">
                                    <div className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                </td>
                                <td className="p-4 font-medium">{category.name_es}</td>
                                <td className="p-4 text-ms-stone">{category.name_en}</td>
                                <td className="p-4 flex gap-2">
                                    <Link href={`/admin/categories/${category.id}`}>
                                        <button className="p-2 hover:bg-ms-pearl rounded-md text-ms-stone hover:text-ms-black transition-colors">
                                            <Edit size={16} />
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 hover:bg-red-50 rounded-md text-ms-stone hover:text-red-600 transition-colors"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-ms-stone">
                                    No categories found. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
