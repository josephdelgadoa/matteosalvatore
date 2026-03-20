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
import { Trash, Plus, GripVertical, Sparkles } from 'lucide-react';
import { Reorder } from 'framer-motion';
import { ProductAiGenerator } from '@/components/admin/ProductAiGenerator';
import { GeneratedProductAsset } from '@/lib/api/ai';
import { inferStyleCode, generateMatrixBarcode } from '@/lib/matrix';
import { slugify } from '@/lib/utils';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('@/components/admin/Editor'), { ssr: false });

const quillModules = {
    toolbar: [
        [{ 'font': [] }],
        ['bold', 'italic', 'underline'],
        ['link', 'blockquote', 'code-block', 'image'],
        [{ 'indent': '-1' }, { 'indent': '+1' }, { 'list': 'bullet' }, { 'list': 'ordered' }],
        [{ 'align': [] }],
        ['clean']
    ]
};

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
        slug_es: '',
        slug_en: '',
        description_es: '',
        description_en: '',
        seo_keywords_es: '',
        seo_keywords_en: '',
        seo_title_es: '',
        seo_title_en: '',
        seo_description_es: '',
        seo_description_en: '',
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
                    // Add tempId to existing variants for stable keys
                    const variantsWithIds = product.product_variants?.map((v: any) => ({
                        ...v,
                        tempId: v.id || Math.random().toString(36).substr(2, 9)
                    })) || [];
                    setFormData({ ...product, product_variants: variantsWithIds });
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
        // Handle matching against either the new slug_es, old unified slug, english slug, or pure UUID to ensure robustness
        const parentObj = categories.find((c: any) =>
            c.slug_es === formData.category ||
            c.slug === formData.category ||
            c.slug_en === formData.category ||
            c.id === formData.category
        );

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

    const renderAiValue = (val: any): string => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
            if (val.es) return val.es;
            if (val.en) return val.en;
            // Fallback to first key
            const keys = Object.keys(val);
            if (keys.length > 0) return String(val[keys[0]]);
        }
        return String(val);
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...(formData.product_variants || [])];
        const updatedVariant = { ...newVariants[index], [field]: value };
        
        // Auto-generate SKU if color or size changes
        if (field === 'color' || field === 'size') {
            const currentSku = formData.sku || '';
            const styleCode = (currentSku.startsWith('MS-HOM-') ? null : currentSku) 
                || inferStyleCode(formData.name_es || '') 
                || '00000000';
            updatedVariant.sku_variant = generateMatrixBarcode(styleCode, updatedVariant.color, updatedVariant.size);
        }
        
        newVariants[index] = updatedVariant;
        setFormData({ ...formData, product_variants: newVariants });
    };

    // Update all variant SKUs when product name or SKU changes
    useEffect(() => {
        if (!formData.product_variants?.length) return;
        
        const currentSku = formData.sku || '';
        const styleCode = (currentSku.startsWith('MS-HOM-') ? null : currentSku) 
            || inferStyleCode(formData.name_es || '');
            
        if (!styleCode) return;

        const updatedVariants = formData.product_variants.map(v => ({
            ...v,
            sku_variant: generateMatrixBarcode(styleCode, v.color, v.size)
        }));

        // Only update if something actually changed to avoid infinite loops
        const changed = JSON.stringify(updatedVariants) !== JSON.stringify(formData.product_variants);
        if (changed) {
            setFormData(prev => ({ ...prev, product_variants: updatedVariants }));
        }
    }, [formData.name_es, formData.sku]);

    // Auto-generate Slugs for New Products
    useEffect(() => {
        if (!isNew || !formData.name_es) return;
        
        // Only auto-generate if the slug is empty or matches the previous auto-generated one
        const suggestedSlugEs = slugify(formData.name_es);
        const suggestedSlugEn = slugify(formData.name_en || formData.name_es);

        setFormData(prev => ({
            ...prev,
            slug_es: prev.slug_es && prev.slug_es !== slugify(prev.name_es || '') ? prev.slug_es : suggestedSlugEs,
            slug_en: prev.slug_en && prev.slug_en !== slugify(prev.name_en || prev.name_es || '') ? prev.slug_en : suggestedSlugEn
        }));
    }, [formData.name_es, formData.name_en, isNew]);

    const addVariant = () => {
        const currentSku = formData.sku || '';
        const styleCode = (currentSku.startsWith('MS-HOM-') ? null : currentSku) 
            || inferStyleCode(formData.name_es || '') 
            || '00000000';
        const initialColor = 'Black';
        const initialSize = 'M';
        const initialSku = generateMatrixBarcode(styleCode, initialColor, initialSize);

        setFormData({
            ...formData,
            product_variants: [
                ...(formData.product_variants || []),
                { 
                    tempId: Math.random().toString(36).substr(2, 9),
                    size: initialSize, 
                    color: initialColor, 
                    sku_variant: initialSku,
                    stock_quantity: 10, 
                    is_available: true 
                } as any
            ]
        });
    };

    const removeVariant = (index: number) => {
        const newVariants = [...(formData.product_variants || [])];
        newVariants.splice(index, 1);
        setFormData({ ...formData, product_variants: newVariants });
    };

    const handleAiGenerate = (aiResult: GeneratedProductAsset) => {
        setFormData(prev => ({
            ...prev,
            name_es: renderAiValue(aiResult["1_name_es"]),
            name_en: renderAiValue(aiResult["1_name_en"]),
            slug_es: renderAiValue(aiResult["2_slug_es"]),
            slug_en: renderAiValue(aiResult["2_slug_en"]),
            short_description_es: renderAiValue(aiResult["3_short_description_es"]),
            short_description_en: renderAiValue(aiResult["3_short_description_en"]),
            description_es: renderAiValue(aiResult["4_full_description_es"]),
            description_en: renderAiValue(aiResult["4_full_description_en"]),
            seo_title_es: renderAiValue(aiResult["10_seo_title_es"]),
            seo_title_en: renderAiValue(aiResult["10_seo_title_en"]),
            seo_description_es: renderAiValue(aiResult["11_seo_description_es"]),
            seo_description_en: renderAiValue(aiResult["11_seo_description_en"]),
            seo_keywords_es: Array.isArray(aiResult["8_keywords"]) ? aiResult["8_keywords"].join(', ') : renderAiValue(aiResult["8_keywords"]),
            seo_keywords_en: Array.isArray(aiResult["8_keywords"]) ? aiResult["8_keywords"].join(', ') : renderAiValue(aiResult["8_keywords"]),
        }));

        // Find category match if possible
        const categoryMatch = rootCategories.find((c: any) =>
            c.name_es.toLowerCase().includes(aiResult["6_specifications_es"]?.Category?.toLowerCase() || '') ||
            c.name_en.toLowerCase().includes(aiResult["6_specifications_en"]?.Category?.toLowerCase() || '')
        );

        if (categoryMatch) {
            const match = categoryMatch as any;
            setFormData(prev => ({ ...prev, category: match.slug_es || match.slug || match.id }));
        }

        addToast('Elite AI assets applied to form!', 'success');

        // Store the full result for the "AI Marketing Assets" display
        setAiMarketingAssets(aiResult);
    };

    const [aiMarketingAssets, setAiMarketingAssets] = useState<GeneratedProductAsset | null>(null);

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <h1 className="ms-heading-2 flex items-baseline gap-3">
                    {isNew ? 'New Product' : (
                        <>
                            <span className="text-2xl text-ms-stone font-normal">Edit</span>
                            <span>{formData.name_es}</span>
                        </>
                    )}
                </h1>
                <div className="flex gap-3">
                    <ProductAiGenerator
                        initialName={formData.name_es}
                        initialCategory={formData.category}
                        onGenerate={handleAiGenerate}
                    />
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

                        <div className="col-span-1">
                            <Input
                                label="Slug (ES)"
                                value={formData.slug_es || ''}
                                onChange={e => setFormData({ ...formData, slug_es: e.target.value })}
                                required
                                placeholder="e.g. urban-hoodie-black"
                            />
                            <p className="text-xs text-ms-stone mt-1">Unique identifier for Spanish URL</p>
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <Input
                                label="Slug (EN)"
                                value={formData.slug_en || ''}
                                onChange={e => setFormData({ ...formData, slug_en: e.target.value })}
                                required
                                placeholder="e.g. urban-hoodie-black"
                            />
                            <p className="text-xs text-ms-stone mt-1">Unique identifier for English URL</p>
                        </div>

                        <div className="col-span-2 space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="short_description_es" className="text-xs font-medium text-ms-stone">Short Description (ES)</label>
                                <textarea
                                    id="short_description_es"
                                    value={formData.short_description_es || ''}
                                    onChange={(e) => setFormData({ ...formData, short_description_es: e.target.value })}
                                    className="w-full p-2 border border-ms-fog rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ms-brand-primary min-h-[80px]"
                                    placeholder="Resumen corto para SEO y listados..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="short_description_en" className="text-xs font-medium text-ms-stone">Short Description (EN)</label>
                                <textarea
                                    id="short_description_en"
                                    value={formData.short_description_en || ''}
                                    onChange={(e) => setFormData({ ...formData, short_description_en: e.target.value })}
                                    className="w-full p-2 border border-ms-fog rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ms-brand-primary min-h-[80px]"
                                    placeholder="Short summary for SEO and listings..."
                                />
                            </div>
                        </div>

                        <Input 
                            label="Base Price (S/.)" 
                            type="number" 
                            step="0.01"
                            value={formData.base_price === 0 && !formData.base_price ? '' : formData.base_price} 
                            onChange={e => setFormData({ ...formData, base_price: e.target.value === '' ? '' : parseFloat(e.target.value) } as any)} 
                            required 
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="ms-label block mb-1">Category</label>
                                <select
                                    className="ms-input w-full"
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
                                    {rootCategories.map((cat: any) => {
                                        // The product might have been saved with the original slug, or the new slug_es.
                                        // We ensure the option value covers both potential states for display continuity.
                                        const optionValue = cat.slug_es || cat.slug || cat.id;
                                        return (
                                            <option key={cat.id} value={optionValue}>
                                                {cat.name_es} / {cat.name_en}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="ms-label block mb-1">Subcategory</label>
                                <select
                                    className="ms-input w-full"
                                    value={formData.subcategory || ''}
                                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                    disabled={!formData.category || availableSubcategories.length === 0}
                                >
                                    <option value="">Select Subcategory</option>
                                    {availableSubcategories.map((sub: any) => {
                                        const optionValue = sub.slug_es || sub.slug || sub.id;
                                        return (
                                            <option key={sub.id} value={optionValue}>
                                                {sub.name_es} / {sub.name_en}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                                <label className="ms-label block">Description (ES) <span className="text-xs font-normal text-ms-stone ml-2">(Supports HTML)</span></label>
                                <span className="text-xs text-ms-stone">{(formData.description_es || '').length} chars</span>
                            </div>
                            <div className="bg-white pb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description_es || ''}
                                    onChange={value => {
                                        if (value !== formData.description_es) {
                                            setFormData({ ...formData, description_es: value });
                                        }
                                    }}
                                    modules={quillModules}
                                    className="h-64"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex justify-between mb-1">
                                <label className="ms-label block">Description (EN) <span className="text-xs font-normal text-ms-stone ml-2">(Supports HTML)</span></label>
                                <span className="text-xs text-ms-stone">{(formData.description_en || '').length} chars</span>
                            </div>
                            <div className="bg-white pb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description_en || ''}
                                    onChange={value => {
                                        if (value !== formData.description_en) {
                                            setFormData({ ...formData, description_en: value });
                                        }
                                    }}
                                    modules={quillModules}
                                    className="h-64"
                                />
                            </div>
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
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">SEO Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="ms-label block">SEO Title (ES)</label>
                                <span className="text-xs text-ms-stone">{(formData.seo_title_es || '').length}/60</span>
                            </div>
                            <Input
                                value={formData.seo_title_es || ''}
                                onChange={e => setFormData({ ...formData, seo_title_es: e.target.value })}
                                maxLength={60}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="ms-label block">SEO Title (EN)</label>
                                <span className="text-xs text-ms-stone">{(formData.seo_title_en || '').length}/60</span>
                            </div>
                            <Input
                                value={formData.seo_title_en || ''}
                                onChange={e => setFormData({ ...formData, seo_title_en: e.target.value })}
                                maxLength={60}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="ms-label block">SEO Description (ES)</label>
                                <span className="text-xs text-ms-stone">{(formData.seo_description_es || '').length}/160</span>
                            </div>
                            <textarea
                                className="ms-input w-full p-2 h-24"
                                maxLength={160}
                                value={formData.seo_description_es || ''}
                                onChange={e => setFormData({ ...formData, seo_description_es: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex justify-between items-center mb-1">
                                <label className="ms-label block">SEO Description (EN)</label>
                                <span className="text-xs text-ms-stone">{(formData.seo_description_en || '').length}/160</span>
                            </div>
                            <textarea
                                className="ms-input w-full p-2 h-24"
                                maxLength={160}
                                value={formData.seo_description_en || ''}
                                onChange={e => setFormData({ ...formData, seo_description_en: e.target.value })}
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
                        {formData.product_variants?.map((variant: any, idx) => (
                            <Reorder.Item key={variant.tempId || variant.id || idx} value={variant} className="flex gap-4 items-end bg-ms-ivory/30 p-3 border border-ms-fog cursor-default">
                                <div className="cursor-grab active:cursor-grabbing p-2 text-ms-stone hover:text-ms-black">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Size</label>
                                    <input className="w-full px-3 h-10 bg-ms-white border border-ms-fog text-sm focus:outline-none focus:border-ms-black transition-colors" value={variant.size} onChange={e => handleVariantChange(idx, 'size', e.target.value)} />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Color</label>
                                    <input className="w-full px-3 h-10 bg-ms-white border border-ms-fog text-sm focus:outline-none focus:border-ms-black transition-colors" value={variant.color} onChange={e => handleVariantChange(idx, 'color', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">SKU (Auto)</label>
                                    <input 
                                        className="w-full px-3 h-10 bg-ms-fog/20 border border-ms-fog text-xs font-mono text-ms-stone focus:outline-none cursor-not-allowed" 
                                        value={variant.sku_variant} 
                                        readOnly 
                                        placeholder="Generating..."
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-medium text-ms-stone mb-1 block">Stock</label>
                                    <input type="number" className="w-full px-3 h-10 bg-ms-white border border-ms-fog text-sm focus:outline-none focus:border-ms-black transition-colors" value={variant.stock_quantity} onChange={e => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value))} />
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

                {aiMarketingAssets && (
                    <section className="bg-ms-white p-6 border border-ms-brand-primary/20 bg-ms-brand-primary/5 rounded-xl space-y-6">
                        <div className="flex items-center gap-3 border-b border-ms-brand-primary/10 pb-4 mb-4">
                            <div className="p-2 bg-ms-brand-primary text-ms-white rounded-lg">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-ms-brand-primary">Elite AI Marketing Kit (2026)</h3>
                                <p className="text-xs text-ms-stone">20 high-conversion assets generated automatically for global dominance.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">📱 Social Media Captions</h4>
                                    <div className="space-y-4">
                                        <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">Instagram</span>
                                            <p className="text-xs whitespace-pre-wrap">{renderAiValue(aiMarketingAssets["17_social_captions"].instagram)}</p>
                                        </div>
                                        <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">TikTok</span>
                                            <p className="text-xs whitespace-pre-wrap">{renderAiValue(aiMarketingAssets["17_social_captions"].tiktok)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">📢 Paid Ad Copy</h4>
                                    <div className="space-y-3 bg-ms-pearl/50 p-4 rounded-lg border border-ms-fog">
                                        <div className="text-xs">
                                            <strong>Meta Ad Copy:</strong>
                                            {typeof aiMarketingAssets["19_ad_copy"].meta === 'object' ? (
                                                <div className="mt-2 space-y-2 pl-2 border-l-2 border-ms-brand-primary/20">
                                                    <p><strong>ES:</strong> {aiMarketingAssets["19_ad_copy"].meta.headline_es}</p>
                                                    <p className="text-ms-stone">{aiMarketingAssets["19_ad_copy"].meta.primary_text_es}</p>
                                                    <p className="pt-1"><strong>EN:</strong> {aiMarketingAssets["19_ad_copy"].meta.headline_en}</p>
                                                    <p className="text-ms-stone">{aiMarketingAssets["19_ad_copy"].meta.primary_text_en}</p>
                                                </div>
                                            ) : (
                                                <p className="mt-1">{renderAiValue(aiMarketingAssets["19_ad_copy"].meta)}</p>
                                            )}
                                        </div>
                                        <p className="text-xs"><strong>TikTok:</strong> {renderAiValue(aiMarketingAssets["19_ad_copy"].tiktok)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">📸 Visual Directives</h4>
                                    <div className="space-y-4">
                                        <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm border-l-4 border-l-ms-brand-primary">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">Image Prompt (Lifestyle)</span>
                                            <p className="text-[11px] italic leading-relaxed text-ms-stone">"{renderAiValue(aiMarketingAssets["12_image_prompts"].lifestyle)}"</p>
                                        </div>
                                        <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm border-l-4 border-l-ms-stone">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">Video Prompt (Reel)</span>
                                            <p className="text-[11px] italic leading-relaxed text-ms-stone">"{renderAiValue(aiMarketingAssets["18_video_prompts"].reel)}"</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">🔗 Cross-Sell & Strategy</h4>
                                    <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm">
                                        <div className="flex flex-wrap gap-2">
                                            {aiMarketingAssets["14_cross_sell"].map((item, i) => (
                                                <span key={i} className="px-2 py-1 bg-ms-fog/30 text-[10px] rounded-full text-ms-stone">{item}</span>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-ms-fog">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">Collection Assignment</span>
                                            <p className="text-[11px] text-ms-brand-primary font-medium">{aiMarketingAssets["20_collection_placement"].join(' • ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">🧠 2026 AI SEO & Schema</h4>
                                    <div className="space-y-4">
                                        <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm">
                                            <span className="text-[10px] font-bold text-ms-stone uppercase block mb-1">Semantic Meaning (SGE)</span>
                                            <p className="text-[11px] text-ms-stone leading-relaxed">{renderAiValue(aiMarketingAssets["16_ai_optimization"].semantic_description)}</p>
                                        </div>
                                        <div className="bg-ms-stone p-4 rounded-lg border border-ms-black shadow-lg">
                                            <span className="text-[10px] font-bold text-ms-pearl uppercase block mb-1">Product Schema (JSON-LD)</span>
                                            <pre className="text-[9px] text-ms-white/80 overflow-x-auto">Generated & Ready to Inject</pre>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-ms-brand-primary mb-3 flex items-center gap-2">🏷️ Metadata & Identifiers</h4>
                                    <div className="bg-ms-white p-4 rounded-lg border border-ms-fog shadow-sm">
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {aiMarketingAssets["9_hashtags"].slice(0, 8).map((h, i) => (
                                                <span key={i} className="text-[10px] text-ms-brand-primary">{renderAiValue(h)}</span>
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-ms-stone border-t border-ms-fog pt-2">
                                            <strong>Alt Text:</strong> {renderAiValue(aiMarketingAssets["13_alt_text_es"])}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-4 border-t border-ms-brand-primary/10">
                            <p className="text-[10px] text-ms-brand-primary font-medium uppercase tracking-widest">Matteo Salvatore — High Performance Fashion AI</p>
                        </div>
                    </section>
                )}
            </form>
        </div>
    );
}
