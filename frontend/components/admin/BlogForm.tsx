'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { blogApi, BlogPost } from '@/lib/api/blog';
import { useToast } from '@/components/ui/Toast';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import {
    Sparkles,
    Save,
    ChevronLeft,
    Globe,
    Layout,
    Search,
    Tag,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';
const ReactQuill = dynamic(() => import('@/components/admin/Editor'), { ssr: false });

interface BlogFormProps {
    lang: string;
    initialData?: BlogPost;
    isEditing?: boolean;
}

export const BlogForm = ({ lang, initialData, isEditing = false }: BlogFormProps) => {
    const dict = useAdminDictionary();
    const router = useRouter();
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<BlogPost>>(initialData || {
        title_es: '',
        title_en: '',
        slug_es: '',
        slug_en: '',
        content_es: '',
        content_en: '',
        excerpt_es: '',
        excerpt_en: '',
        category: 'Fashion',
        tags: [],
        featured_image_url: '',
        is_published: false,
        seo_title_es: '',
        seo_title_en: '',
        seo_description_es: '',
        seo_description_en: '',
    });

    // AI Generator State
    const [aiParams, setAiParams] = useState({
        topic: '',
        keywords: '',
        location: 'Perú'
    });

    // Quill Modules
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

    const handleChange = (field: keyof BlogPost, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isEditing && initialData?.id) {
                await blogApi.updatePost(initialData.id, formData);
                addToast(dict.blog.deleteSuccess.replace('eliminado', 'actualizado'), 'success');
            } else {
                await blogApi.createPost(formData);
                addToast(dict.blog.aiSuccess, 'success');
            }
            router.push(`/${lang}/admin/blog`);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            addToast(error.message || 'Error al guardar el artículo', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateAI = async () => {
        if (!aiParams.topic || !aiParams.keywords) {
            addToast('Por favor ingrese el tema y las palabras clave', 'error');
            return;
        }

        setIsGenerating(true);
        try {
            const aiContent = await blogApi.generateBlogContent(aiParams);

            setFormData(prev => ({
                ...prev,
                title_es: aiContent.title_es,
                title_en: aiContent.title_en,
                slug_es: aiContent.slug_es,
                slug_en: aiContent.slug_en,
                content_es: aiContent.content_es,
                content_en: aiContent.content_en,
                excerpt_es: aiContent.excerpt_es,
                excerpt_en: aiContent.excerpt_en,
                seo_title_es: aiContent.seo_title_es,
                seo_title_en: aiContent.seo_title_en,
                seo_description_es: aiContent.seo_description_es,
                seo_description_en: aiContent.seo_description_en,
                tags: aiContent.tags,
                image_prompts: aiContent.image_prompts
            }));

            addToast(dict.blog.form.aiSuccess, 'success');
        } catch (error: any) {
            console.error(error);
            addToast(dict.blog.form.aiError, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
            {/* Header Actions */}
            <div className="flex items-center justify-between sticky top-0 bg-ms-white z-10 py-4 border-b border-ms-fog -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="text"
                        size="sm"
                        onClick={() => router.back()}
                        className="p-0 hover:bg-transparent"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="ms-heading-3">
                        {isEditing ? `Editar: ${formData.title_es}` : dict.blog.add}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center mr-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_published}
                                onChange={(e) => handleChange('is_published', e.target.checked)}
                                className="rounded border-ms-fog text-ms-brand-primary focus:ring-ms-brand-primary"
                            />
                            <span className="text-sm font-medium text-ms-stone">{dict.blog.form.isPublished}</span>
                        </label>
                    </div>
                    <Button type="submit" isLoading={isSaving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {dict.settings.saveBtn}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* AI Generator Panel */}
                    <div className="ms-card p-6 bg-ms-brand-primary/5 border-ms-brand-primary/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-ms-brand-primary" />
                            <h2 className="font-serif text-lg font-medium text-ms-brand-primary">
                                {dict.blog.form.ai}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <Input
                                label={dict.blog.form.aiTopic}
                                value={aiParams.topic}
                                onChange={(e) => setAiParams({ ...aiParams, topic: e.target.value })}
                                placeholder="Ej: La elegancia del Algodón Pima"
                            />
                            <Input
                                label={dict.blog.form.aiKeywords}
                                value={aiParams.keywords}
                                onChange={(e) => setAiParams({ ...aiParams, keywords: e.target.value })}
                                placeholder="Estilo, Lujo, Algodón, Perú"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2 border-ms-brand-primary text-ms-brand-primary hover:bg-ms-brand-primary hover:text-ms-white"
                            onClick={handleGenerateAI}
                            isLoading={isGenerating}
                        >
                            {isGenerating ? dict.blog.form.generating : dict.blog.form.aiGenerate}
                        </Button>
                    </div>

                    {/* Spanish Content */}
                    <div className="ms-card p-6 space-y-6">
                        <div className="flex items-center gap-2 border-b border-ms-fog pb-2">
                            <Globe className="w-4 h-4 text-ms-stone" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ms-stone">Contenido en Español</h3>
                        </div>
                        <Input
                            label={dict.blog.form.titleEs}
                            value={formData.title_es}
                            onChange={(e) => handleChange('title_es', e.target.value)}
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-ms-stone">{dict.blog.form.contentEs}</label>
                            <div className="h-[400px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content_es}
                                    onChange={(val) => handleChange('content_es', val)}
                                    modules={quillModules}
                                    style={{ height: '100%' }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wide text-ms-stone block">
                                {dict.blog.form.excerptEs}
                            </label>
                            <textarea
                                value={formData.excerpt_es}
                                onChange={(e) => handleChange('excerpt_es', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-4 bg-ms-white border border-ms-fog text-base focus:outline-none focus:border-ms-black focus:ring-1 focus:ring-ms-black/5 hover:border-ms-stone/50 transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* English Content */}
                    <div className="ms-card p-6 space-y-6">
                        <div className="flex items-center gap-2 border-b border-ms-fog pb-2">
                            <Globe className="w-4 h-4 text-ms-stone" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ms-stone">English Content</h3>
                        </div>
                        <Input
                            label={dict.blog.form.titleEn}
                            value={formData.title_en}
                            onChange={(e) => handleChange('title_en', e.target.value)}
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-ms-stone">{dict.blog.form.contentEn}</label>
                            <div className="h-[400px] mb-12">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content_en}
                                    onChange={(val) => handleChange('content_en', val)}
                                    modules={quillModules}
                                    style={{ height: '100%' }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium uppercase tracking-wide text-ms-stone block">
                                {dict.blog.form.excerptEn}
                            </label>
                            <textarea
                                value={formData.excerpt_en}
                                onChange={(e) => handleChange('excerpt_en', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-4 bg-ms-white border border-ms-fog text-base focus:outline-none focus:border-ms-black focus:ring-1 focus:ring-ms-black/5 hover:border-ms-stone/50 transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Config */}
                <div className="space-y-8">
                    {/* Publishing Info */}
                    <div className="ms-card p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-ms-fog pb-2">
                            <Layout className="w-4 h-4 text-ms-stone" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ms-stone">{dict.blog.form.general}</h3>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm font-medium text-ms-stone">{dict.blog.form.isPublished}</span>
                            <input
                                type="checkbox"
                                checked={formData.is_published}
                                onChange={(e) => handleChange('is_published', e.target.checked)}
                                className="w-5 h-5 rounded border-ms-fog text-ms-brand-primary"
                            />
                        </div>
                        <Input
                            label={dict.blog.form.category}
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        />
                        <Input
                            label={dict.blog.form.tags}
                            value={formData.tags?.join(', ') || ''}
                            onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()))}
                            placeholder="Moda, Verano, 2026"
                        />
                    </div>

                    {/* Featured Image */}
                    <div className="ms-card p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-ms-fog pb-2">
                            <ImageIcon className="w-4 h-4 text-ms-stone" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ms-stone">{dict.blog.form.featuredImage}</h3>
                        </div>
                        <ImageUploader
                            maxFiles={1}
                            value={formData.featured_image_url ? [formData.featured_image_url] : []}
                            onChange={(imgs) => handleChange('featured_image_url', imgs[0] || '')}
                        />
                        {formData.image_prompts?.featured && (
                            <div className="mt-4 p-3 bg-ms-ivory rounded text-[10px] text-ms-stone leading-relaxed italic border border-ms-fog">
                                <span className="font-bold uppercase block mb-1 not-italic opacity-60">AI Photo Prompt:</span>
                                {formData.image_prompts.featured}
                            </div>
                        )}
                    </div>

                    {/* SEO Config */}
                    <div className="ms-card p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-ms-fog pb-2">
                            <Search className="w-4 h-4 text-ms-stone" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-ms-stone">SEO & URL Slugs</h3>
                        </div>
                        <Input
                            label={dict.blog.form.slugEs}
                            value={formData.slug_es}
                            onChange={(e) => handleChange('slug_es', e.target.value)}
                            placeholder="la-elegancia-del-pima"
                        />
                        <Input
                            label={dict.blog.form.slugEn}
                            value={formData.slug_en}
                            onChange={(e) => handleChange('slug_en', e.target.value)}
                            placeholder="elegance-of-pima"
                        />
                        <div className="pt-4 space-y-4 border-t border-ms-fog">
                            <Input
                                label="SEO Meta Title (ES)"
                                value={formData.seo_title_es}
                                onChange={(e) => handleChange('seo_title_es', e.target.value)}
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium uppercase tracking-wide text-ms-stone block">
                                    SEO Meta Description (ES)
                                </label>
                                <textarea
                                    value={formData.seo_description_es}
                                    onChange={(e) => handleChange('seo_description_es', e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-4 bg-ms-white border border-ms-fog text-base focus:outline-none focus:border-ms-black focus:ring-1 focus:ring-ms-black/5 hover:border-ms-stone/50 transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
