'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productCategoriesApi, ProductCategory } from '@/lib/api/productCategories';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductCategoryForm({ params }: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const isNew = params.id === 'new';
    const parentIdParam = searchParams.get('parentId');

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    const [formData, setFormData] = useState({
        name_es: '',
        name_en: '',
        slug_es: '',
        slug_en: '',
        description_es: '',
        description_en: '',
        parent_id: parentIdParam || '', // Default to param if present
        is_active: true
    });

    useEffect(() => {
        loadData();
    }, [params.id]);

    const loadData = async () => {
        try {
            // Load all categories for the dropdown
            const allCategories = await productCategoriesApi.getAll();
            setCategories(allCategories);

            if (!isNew) {
                const data = await productCategoriesApi.getById(params.id);
                setFormData({
                    name_es: data.name_es || '',
                    name_en: data.name_en || '',
                    slug_es: data.slug_es || '',
                    slug_en: data.slug_en || '',
                    description_es: data.description_es || '',
                    description_en: data.description_en || '',
                    parent_id: data.parent_id || '',
                    is_active: data.is_active
                });
            }
        } catch (error) {
            console.error(error);
            addToast('Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload: Partial<ProductCategory> = {
                ...formData,
                parent_id: formData.parent_id === '' ? undefined : formData.parent_id
            };

            if (isNew) {
                await productCategoriesApi.create(payload);
                addToast('Category created successfully', 'success');
            } else {
                await productCategoriesApi.update(params.id, payload);
                addToast('Category updated successfully', 'success');
            }
            // Navigate back after delay
            setTimeout(() => {
                router.push('/admin/categories');
            }, 1000);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || error.message || 'Unknown error';
            addToast(`Failed to save category: ${msg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    // Filter out self to prevent circular dependency (simple check)
    const validParents = categories.filter(c => c.id !== params.id);

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <ToastContainer />

            <div className="mb-8">
                <Link href="/admin/categories" className="text-ms-stone hover:text-ms-black flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Categories
                </Link>
                <h1 className="ms-heading-2">{isNew ? 'New Product Category' : 'Edit Category'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg border border-ms-fog shadow-sm">

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Name (ES) *</label>
                        <Input
                            value={formData.name_es}
                            onChange={e => setFormData({ ...formData, name_es: e.target.value })}
                            required
                            placeholder="Ej. Camisetas"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Name (EN) *</label>
                        <Input
                            value={formData.name_en}
                            onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                            required
                            placeholder="Ex. T-Shirts"
                        />
                    </div>
                </div>

                {/* Slugs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Slug URL (ES)</label>
                        <Input
                            value={formData.slug_es}
                            onChange={e => setFormData({ ...formData, slug_es: e.target.value })}
                            placeholder="Ej. polos-basicos"
                        />
                        <p className="text-xs text-ms-stone">Leave blank to auto-generate from Spanish Name.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Slug URL (EN)</label>
                        <Input
                            value={formData.slug_en}
                            onChange={e => setFormData({ ...formData, slug_en: e.target.value })}
                            placeholder="Ex. basic-polos"
                        />
                        <p className="text-xs text-ms-stone">Leave blank to auto-generate from English Name.</p>
                    </div>
                </div>

                {/* Parent Category */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-ms-black">Parent Category</label>
                    <select
                        className="ms-input w-full"
                        value={formData.parent_id}
                        onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
                    >
                        <option value="">None (Top Level)</option>
                        {validParents.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name_en} / {cat.name_es}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-ms-stone">Select a parent category to nest this under.</p>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Description (ES)</label>
                        <textarea
                            className="ms-input min-h-[100px] py-2"
                            value={formData.description_es}
                            onChange={e => setFormData({ ...formData, description_es: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ms-black">Description (EN)</label>
                        <textarea
                            className="ms-input min-h-[100px] py-2"
                            value={formData.description_en}
                            onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                        />
                    </div>
                </div>

                {/* Settings */}
                <div className="pt-4 border-t border-ms-fog">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-5 h-5 rounded border-ms-stone text-ms-brand-primary focus:ring-ms-brand-primary"
                        />
                        <span className="text-sm font-medium text-ms-black">Active</span>
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={isSaving}>
                        {isNew ? 'Create Category' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
