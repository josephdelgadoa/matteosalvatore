import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface AboutBrandProps {
    dict: {
        title: string;
        text: string;
        bullets: string[];
    };
}

export const AboutBrandSection = ({ dict }: AboutBrandProps) => {
    // Split the text by newlines to render multiple paragraphs correctly
    const paragraphs = dict.text.split('\n').filter(p => p.trim() !== '');

    return (
        <section className="bg-ms-pearl py-24 relative overflow-hidden">
            <div className="ms-container">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left: Image */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <Image
                                src="/images/about-brand.png"
                                alt={dict.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Decorative elements */}
                            <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-ms-brand-primary/5 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-ms-fog/40 rounded-full blur-2xl -z-10"></div>
                    </div>

                    {/* Right: Content */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-2">
                            <span className="text-ms-brand-primary font-medium tracking-widest text-sm uppercase">Matteo Salvatore</span>
                        </div>
                        <h2 className="ms-heading-2 text-ms-black mb-8 leading-tight">{dict.title}</h2>

                        <div className="space-y-5 text-ms-stone leading-relaxed mb-10 text-[15px] md:text-base">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {dict.bullets.map((bullet, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-ms-brand-primary shrink-0 mt-0.5" />
                                    <span className="text-ms-black/80 font-medium">{bullet}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <div className="w-16 h-[2px] bg-ms-brand-primary opacity-50"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
