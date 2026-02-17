'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productCategoriesApi } from '@/lib/api/productCategories';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductCategoryForm({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addToast } = useToast();
    const isNew = params.id === 'new';

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name_es: '',
        name_en: '',
        description_es: '',
        description_en: '',
        is_active: true
    });

    useEffect(() => {
        if (!isNew) {
            loadCategory();
        }
    }, [params.id]);

    const loadCategory = async () => {
        try {
            const data = await productCategoriesApi.getById(params.id);
            setFormData({
                name_es: data.name_es || '',
                name_en: data.name_en || '',
                description_es: data.description_es || '',
                description_en: data.description_en || '',
                is_active: data.is_active
            });
        } catch (error) {
            console.error(error);
            addToast('Failed to load category', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isNew) {
                await productCategoriesApi.create(formData);
                addToast('Category created successfully', 'success');
            } else {
                await productCategoriesApi.update(params.id, formData);
                addToast('Category updated successfully', 'success');
            }
            // Navigate back after delay
            setTimeout(() => {
                router.push('/admin/categories');
            }, 1000);
        } catch (error) {
            console.error(error);
            addToast('Failed to save category', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

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
