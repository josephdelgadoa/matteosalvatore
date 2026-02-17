'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productsApi, Product, ProductVariant } from '@/lib/api/products';
import { productCategoriesApi, ProductCategory } from '@/lib/api/productCategories';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Trash, Plus, GripVertical } from 'lucide-react';
import { Reorder } from 'framer-motion';

export default function ProductFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addToast } = useToast();
    const isNew = params.id === 'new';

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<ProductCategory[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name_es: '',
        name_en: '',
        slug: '',
        description_es: '',
        description_en: '',
        seo_keywords_es: '',
        base_price: 0,
        category: '',
        subcategory: '',
        product_images: [],
        product_variants: []
    });

    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Fetch Categories
                const cats = await productCategoriesApi.getAll();
                setCategories(cats);

                // 2. Fetch Product if existing
                if (!isNew) {
                    const product = await productsApi.getBySlug(params.id);
                    setFormData(product);
                    setImages(product.product_images?.sort((a: any, b: any) => a.display_order - b.display_order) || []);
                }
            } catch (err) {
                console.error(err);
                addToast('Failed to load data', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [params.id, isNew, addToast]);

    // Derived State for Taxonomy logic
    // Roots: No parent_id
    const rootCategories = useMemo(() =>
        categories.filter(c => !c.parent_id && c.is_active),
        [categories]);

    // Available subcategories based on selected root slug
    const availableSubcategories = useMemo(() => {
        if (!formData.category) return [];
        // Find the root category object that matches the current selected slug
        const parent = categories.find(c => c.slug === formData.category || c.id === formData.category); // Handle legacy ID or Slug match?
        // Actually, let's look for slug match first as that's what we store
        const parentObj = categories.find(c => c.slug === formData.category);

        if (!parentObj) return [];

        return categories.filter(c => c.parent_id === parentObj.id && c.is_active);
    }, [categories, formData.category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                product_images: images.map((img, idx) => ({
                    image_url: typeof img === 'string' ? img : img.image_url,
                    color: typeof img === 'string' ? null : img.color,
                    display_order: idx,
                    is_primary: idx === 0,
                } as any))
            };

            if (isNew) {
                await productsApi.create(payload);
                addToast('Product created successfully', 'success');
            } else {
                if (formData.id) {
                    await productsApi.update(formData.id, payload);
                    addToast('Product updated successfully', 'success');
                }
            }

            setTimeout(() => router.push('/admin/products'), 1000);

        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to save product';
            addToast(errorMessage, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...(formData.product_variants || [])];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, product_variants: newVariants });
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            product_variants: [
                ...(formData.product_variants || []),
                { size: 'M', color: 'Black', stock_quantity: 10, is_available: true } as ProductVariant
            ]
        });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...(formData.product_variants || [])];
        newVariants.splice(index, 1);
        setFormData({ ...formData, product_variants: newVariants });
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <h1 className="ms-heading-2">{isNew ? 'New Product' : `Edit ${formData.name_es}`}</h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} isLoading={isSaving}>Save Product</Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Name (ES)" value={formData.name_es || ''} onChange={e => setFormData({ ...formData, name_es: e.target.value })} required />
                        <Input label="Name (EN)" value={formData.name_en || ''} onChange={e => setFormData({ ...formData, name_en: e.target.value })} />

                        <div className="col-span-2 md:col-span-1">
                            <Input
                                label="Slug"
                                value={formData.slug || ''}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                required
                                placeholder="e.g. urban-hoodie-black"
                            />
                            <p className="text-xs text-ms-stone mt-1">Unique identifier for the URL</p>
                        </div>
                        <Input label="Base Price (S/.)" type="number" value={formData.base_price || 0} onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) })} required />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="ms-label block mb-1">Category</label>
                                <select
                                    className="ms-input w-full h-10"
                                    value={formData.category || ''}
                                    onChange={e => {
                                        setFormData({
                                            ...formData,
                                            category: e.target.value,
                                            subcategory: '' // Reset subcategory when category changes
                                        });
                                    }}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {rootCategories.map(cat => (
                                        <option key={cat.id} value={cat.slug}>
                                            {cat.name_es}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="ms-label block mb-1">Subcategory</label>
                                <select
                                    className="ms-input w-full h-10"
                                    value={formData.subcategory || ''}
                                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                    disabled={!formData.category || availableSubcategories.length === 0}
                                >
                                    <option value="">Select Subcategory</option>
                                    {availableSubcategories.map(sub => (
                                        <option key={sub.id} value={sub.slug}>
                                            {sub.name_es}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                                <label className="ms-label block">Description (ES) <span className="text-xs font-normal text-ms-stone ml-2">(Supports HTML)</span></label>
                                <span className="text-xs text-ms-stone">{(formData.description_es || '').length} chars</span>
                            </div>
                            <textarea
                                className="ms-input min-h-[100px]"
                                value={formData.description_es || ''}
                                onChange={e => setFormData({ ...formData, description_es: e.target.value })}
                            />
                        </div>
                        <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                                <label className="ms-label block">Description (EN) <span className="text-xs font-normal text-ms-stone ml-2">(Supports HTML)</span></label>
                                <span className="text-xs text-ms-stone">{(formData.description_en || '').length} chars</span>
                            </div>
                            <textarea
                                className="ms-input min-h-[100px]"
                                value={formData.description_en || ''}
                                onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                                <label className="ms-label block">Hashtags / Keywords</label>
                                <span className="text-xs text-ms-stone">Comma separated</span>
                            </div>
                            <Input
                                placeholder="e.g. streetwear, premium"
                                value={formData.seo_keywords_es || ''}
                                onChange={e => setFormData({ ...formData, seo_keywords_es: e.target.value, seo_keywords_en: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">Images</h3>
                    <ImageUploader
                        value={images}
                        onChange={setImages}
                        maxFiles={50}
                        availableColors={Array.from(new Set(formData.product_variants?.map(v => v.color).filter(Boolean) as string[]))}
                    />
                </section>

                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <div className="flex items-center justify-between border-b border-ms-fog pb-2 mb-4">
                        <h3 className="font-medium text-lg">Variants</h3>
                        <Button type="button" size="sm" variant="outline" onClick={addVariant} className="gap-2">
                            <Plus className="w-3 h-3" /> Add Variant
                        </Button>
                    </div>

                    <Reorder.Group axis="y" values={formData.product_variants || []} onReorder={(newVariants) => setFormData({ ...formData, product_variants: newVariants })} className="space-y-3">
                        {formData.product_variants?.map((variant, idx) => (
                            <Reorder.Item key={variant.sku_variant || idx} value={variant} className="flex gap-4 items-end bg-ms-ivory/30 p-3 border border-ms-fog cursor-default">
                                <div className="cursor-grab active:cursor-grabbing p-2 text-ms-stone hover:text-ms-black">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Size</label>
                                    <input className="ms-input h-8 text-sm" value={variant.size} onChange={e => handleVariantChange(idx, 'size', e.target.value)} />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Color</label>
                                    <input className="ms-input h-8 text-sm" value={variant.color} onChange={e => handleVariantChange(idx, 'color', e.target.value)} />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Stock</label>
                                    <input type="number" className="ms-input h-8 text-sm" value={variant.stock_quantity} onChange={e => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value))} />
                                </div>
                                <button type="button" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 flex items-center justify-center rounded-md ml-auto" onClick={() => removeVariant(idx)}>
                                    <Trash className="w-4 h-4" />
                                </button>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                    {(!formData.product_variants || formData.product_variants.length === 0) && (
                        <p className="text-sm text-ms-stone italic">No variants added.</p>
                    )}
                </section>
            </form>
        </div>
    );
}
