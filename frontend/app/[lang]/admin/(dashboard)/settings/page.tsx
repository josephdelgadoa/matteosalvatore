'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { contentApi, HeroSlide } from '@/lib/api/content';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';


export default function AdminSettingsPage({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [activeLang, setActiveLang] = useState<'es' | 'en'>('es');
    const [heroSlidesEs, setHeroSlidesEs] = useState<HeroSlide[]>([]);
    const [heroSlidesEn, setHeroSlidesEn] = useState<HeroSlide[]>([]);

    useEffect(() => {
        const loadContent = async () => {
            const [es, en] = await Promise.all([
                contentApi.getHeroSlides('es'),
                contentApi.getHeroSlides('en')
            ]);

            if (es && es.length > 0) setHeroSlidesEs(es);
            else setHeroSlidesEs(getEmptySlides());

            if (en && en.length > 0) setHeroSlidesEn(en);
            else setHeroSlidesEn(getEmptySlides());
        };
        loadContent();
    }, []);

    const getEmptySlides = (): HeroSlide[] => [
        { id: 1, image: '', title: '', subtitle: '', description: '', cta: '', link: '' },
        { id: 2, image: '', title: '', subtitle: '', description: '', cta: '', link: '' },
        { id: 3, image: '', title: '', subtitle: '', description: '', cta: '', link: '' }
    ];

    const handleSlideChange = (index: number, field: keyof HeroSlide, value: string) => {
        if (activeLang === 'es') {
            const newSlides = [...heroSlidesEs];
            // @ts-ignore
            newSlides[index] = { ...newSlides[index], [field]: value };
            setHeroSlidesEs(newSlides);
        } else {
            const newSlides = [...heroSlidesEn];
            // @ts-ignore
            newSlides[index] = { ...newSlides[index], [field]: value };
            setHeroSlidesEn(newSlides);
        }
    };

    // Mock Settings State
    const [settings, setSettings] = useState({
        storeName: 'Matteo Salvatore',
        supportEmail: 'support@matteosalvatore.pe',
        taxRate: 18,
        currency: 'PEN',
        shippingFlatRate: 15.00,
        freeShippingThreshold: 300.00,
        seoTitle: 'Matteo Salvatore | Minimalist Menswear',
        seoDescription: 'Premium minimalist menswear made in Peru.'
    });

    const handleChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        setLoading(true);
        // Save Hero Slides for both languages
        const saveEs = contentApi.updateHeroSlides(heroSlidesEs, 'es');
        const saveEn = contentApi.updateHeroSlides(heroSlidesEn, 'en');

        // Save other settings (mock)
        const settingsPromise = new Promise(resolve => setTimeout(resolve, 500));

        Promise.all([saveEs, saveEn, settingsPromise])
            .then(() => {
                addToast(dict.settings.saveSuccess, 'success');
            })
            .catch(err => {
                console.error(err);
                addToast(dict.settings.saveError, 'error');
            })
            .finally(() => setLoading(false));
    };

    const currentSlides = activeLang === 'es' ? heroSlidesEs : heroSlidesEn;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">{dict.settings.title}</h1>
                    <p className="text-ms-stone">{dict.settings.subtitle}</p>
                </div>
                <Button onClick={handleSave} isLoading={loading}>{dict.settings.saveBtn}</Button>
            </div>

            <div className="space-y-8">

                {/* General */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">{dict.settings.generalTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={dict.settings.storeName}
                            value={settings.storeName}
                            onChange={e => handleChange('storeName', e.target.value)}
                        />
                        <Input
                            label={dict.settings.supportEmail}
                            value={settings.supportEmail}
                            onChange={e => handleChange('supportEmail', e.target.value)}
                        />
                        <Input
                            label={dict.settings.currencyCode}
                            value={settings.currency}
                            onChange={e => handleChange('currency', e.target.value)}
                        />
                    </div>
                </section>

                {/* Financials (Taxes & Shipping) */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">{dict.settings.financialsTitle}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={dict.settings.taxRate}
                            type="number"
                            value={settings.taxRate}
                            onChange={e => handleChange('taxRate', parseFloat(e.target.value))}
                        />
                        <div className="hidden md:block"></div> {/* Spacer */}

                        <Input
                            label={dict.settings.flatShipping}
                            type="number"
                            value={settings.shippingFlatRate}
                            onChange={e => handleChange('shippingFlatRate', parseFloat(e.target.value))}
                        />
                        <Input
                            label={dict.settings.freeShipping}
                            type="number"
                            value={settings.freeShippingThreshold}
                            onChange={e => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                        />
                    </div>
                </section>

                {/* SEO */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">{dict.settings.seoTitle}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label={dict.settings.metaTitle}
                            value={settings.seoTitle}
                            onChange={e => handleChange('seoTitle', e.target.value)}
                        />
                        <div>
                            <label className="ms-label block mb-1">{dict.settings.metaDescription}</label>
                            <textarea
                                className="ms-input min-h-[100px]"
                                value={settings.seoDescription}
                                onChange={e => handleChange('seoDescription', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Hero Slider Settings */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-6">
                    <div className="flex items-center justify-between border-b border-ms-fog pb-2 mb-4">
                        <h3 className="font-medium text-lg">{dict.settings.heroTitle}</h3>
                        <div className="flex bg-ms-pearl items-center p-1 rounded-md">
                            <button
                                onClick={() => setActiveLang('es')}
                                className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${activeLang === 'es' ? 'bg-ms-white shadow-sm' : 'text-ms-stone hover:text-ms-black'}`}
                            >
                                Esp (ES)
                            </button>
                            <button
                                onClick={() => setActiveLang('en')}
                                className={`px-3 py-1 rounded-sm text-sm font-medium transition-colors ${activeLang === 'en' ? 'bg-ms-white shadow-sm' : 'text-ms-stone hover:text-ms-black'}`}
                            >
                                Eng (EN)
                            </button>
                        </div>
                    </div>

                    {currentSlides.map((slide, index) => (
                        <div key={slide.id} className="border border-ms-fog p-4 rounded-md space-y-4">
                            <h4 className="font-medium text-ms-stone">{dict.settings.slideLabel} {index + 1} ({activeLang.toUpperCase()})</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="ms-label block mb-2">{dict.settings.heroBackground}</label>
                                    <ImageUploader
                                        value={slide.image ? [slide.image] : []}
                                        onChange={(urls) => handleSlideChange(index, 'image', urls[0] || '')}
                                        maxFiles={1}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        label={dict.settings.heroTitleInput}
                                        value={slide.title}
                                        onChange={e => handleSlideChange(index, 'title', e.target.value)}
                                    />
                                    <Input
                                        label={dict.settings.heroSubtitle}
                                        value={slide.subtitle}
                                        onChange={e => handleSlideChange(index, 'subtitle', e.target.value)}
                                    />
                                    <div>
                                        <label className="ms-label block mb-1">{dict.settings.heroDescription}</label>
                                        <textarea
                                            className="ms-input min-h-[80px]"
                                            value={slide.description}
                                            onChange={e => handleSlideChange(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label={dict.settings.heroBtnText}
                                            value={slide.cta}
                                            onChange={e => handleSlideChange(index, 'cta', e.target.value)}
                                        />
                                        <Input
                                            label={dict.settings.heroLink}
                                            value={slide.link}
                                            onChange={e => handleSlideChange(index, 'link', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
}
