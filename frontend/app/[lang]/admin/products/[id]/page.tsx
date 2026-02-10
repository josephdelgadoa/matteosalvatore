'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { productsApi, Product, ProductVariant } from '@/lib/api/products';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Trash, Plus } from 'lucide-react';

export default function ProductFormPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addToast } = useToast();
    const isNew = params.id === 'new';

    const [isLoading, setIsLoading] = useState(!isNew);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name_es: '',
        name_en: '',
        slug: '',
        description_es: '',
        description_en: '',
        base_price: 0,
        category: 'clothing',
        subcategory: '',
        product_images: [],
        product_variants: []
    });

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (!isNew) {
            const fetchProduct = async () => {
                try {
                    const product = await productsApi.getBySlug(params.id); // Assuming ID is slug for now, or use ID logic
                    // If we passed ID in URL, we need to fetch by ID. 
                    // But our API uses slug for public facing. 
                    // Let's assume for admin we might use ID or Slug. 
                    // If params.id is a UUID, fetch by ID? Or simplified getBySlug logic works if we consistently use slugs in URL.
                    // For now, let's assume params.id is indeed the slug if we linked it that way, or we need an API method getById.
                    // The previous DataTable linked to `/admin/products/${item.slug}`. So params.id IS slug.

                    setFormData(product);
                    setImages(product.product_images?.sort((a: any, b: any) => a.display_order - b.display_order).map((i: any) => i.image_url) || []);
                } catch (err) {
                    addToast('Failed to load product', 'error');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [params.id, isNew, addToast]); // Added addToast to dependencies

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const payload = {
                ...formData,
                // Reconstruct images array from simple URLs
                product_images: images.map((url, idx) => ({
                    image_url: url,
                    display_order: idx,
                    is_primary: idx === 0,
                    // ID handling would depend on backend (new vs update)
                } as any))
            };

            if (isNew) {
                await productsApi.create(payload);
                addToast('Product created successfully', 'success');
            } else {
                // Need ID for update. If we fetched by slug, we have ID in formData.
                if (formData.id) {
                    await productsApi.update(formData.id, payload);
                    addToast('Product updated successfully', 'success');
                }
            }

            // Redirect after delay
            setTimeout(() => router.push('/admin/products'), 1000);

        } catch (err: any) {
            console.error(err);
            addToast(err.message || 'Failed to save product', 'error');
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

                {/* Basic Info */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Name (ES)" value={formData.name_es || ''} onChange={e => setFormData({ ...formData, name_es: e.target.value })} required />
                        <Input label="Name (EN)" value={formData.name_en || ''} onChange={e => setFormData({ ...formData, name_en: e.target.value })} />

                        <Input label="Slug" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                        <Input label="Base Price (S/)" type="number" value={formData.base_price || 0} onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) })} required />

                        <div className="col-span-2">
                            <label className="ms-label block mb-1">Description (ES)</label>
                            <textarea
                                className="ms-input min-h-[100px]"
                                value={formData.description_es || ''}
                                onChange={e => setFormData({ ...formData, description_es: e.target.value })}
                            />
                        </div>
                    </div>
                </section>

                {/* Images */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">Images</h3>
                    <ImageUploader value={images} onChange={setImages} />
                </section>

                {/* Variants */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <div className="flex items-center justify-between border-b border-ms-fog pb-2 mb-4">
                        <h3 className="font-medium text-lg">Variants</h3>
                        <Button type="button" size="sm" variant="outline" onClick={addVariant} className="gap-2">
                            <Plus className="w-3 h-3" /> Add Variant
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {formData.product_variants?.map((variant, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-ms-ivory/30 p-3 border border-ms-fog">
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Size</label>
                                    <input
                                        className="ms-input h-8 text-sm"
                                        value={variant.size}
                                        onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Color</label>
                                    <input
                                        className="ms-input h-8 text-sm"
                                        value={variant.color}
                                        onChange={e => handleVariantChange(idx, 'color', e.target.value)}
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Stock</label>
                                    <input
                                        type="number"
                                        className="ms-input h-8 text-sm"
                                        value={variant.stock_quantity}
                                        onChange={e => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="text"
                                    className="text-ms-error hover:bg-ms-error/10 h-8 w-8 ml-auto"
                                    onClick={() => removeVariant(idx)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        {(!formData.product_variants || formData.product_variants.length === 0) && (
                            <p className="text-sm text-ms-stone italic">No variants added.</p>
                        )}
                    </div>
                </section>

            </form>
        </div>
    );
}
