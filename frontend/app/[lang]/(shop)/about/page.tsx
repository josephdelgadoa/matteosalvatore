import React from 'react';
import Image from 'next/image';

// @ts-ignore
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { PageHero } from '@/components/ui/PageHero';

export default async function AboutPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);

    return (
        <div className="animate-fade-in">
            <PageHero
                title={dict.about.title}
                subtitle={dict.about.subtitle}
                image="/images/hero-image-ruso-1.jpeg"
            />

            <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
                <h2 className="ms-heading-2 mb-8">{dict.about.heading}</h2>
                <p className="text-lg md:text-xl text-ms-stone leading-relaxed mb-12">
                    {dict.about.description}
                </p>

                <div className="grid md:grid-cols-2 gap-12 text-left">
                    <div>
                        <h3 className="text-xl font-medium mb-4">{dict.about.craftsmanship.title}</h3>
                        <p className="text-ms-stone">{dict.about.craftsmanship.text}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium mb-4">{dict.about.sustainability.title}</h3>
                        <p className="text-ms-stone">{dict.about.sustainability.text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
