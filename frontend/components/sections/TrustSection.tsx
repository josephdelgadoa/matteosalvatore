import React from 'react';
import Image from 'next/image';

interface TrustFeature {
    title: string;
    description: string;
    icon: string;
}

interface TrustSectionProps {
    dict: {
        title: string;
        features: TrustFeature[];
    };
}

export const TrustSection = ({ dict }: TrustSectionProps) => {
    return (
        <section className="bg-ms-ivory py-20 border-t border-ms-fog">
            <div className="ms-container">
                <h2 className="ms-heading-2 mb-16 text-center text-ms-black">{dict.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-10 md:gap-y-16">
                    {dict.features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-ms-fog/50 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex items-center justify-center p-5">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    fill
                                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                            </div>
                            <h3 className="font-serif text-[17px] md:text-lg text-ms-black font-semibold px-2 tracking-wide">
                                {feature.title}
                            </h3>
                            <p className="text-ms-stone text-[14px] md:text-[15px] leading-relaxed max-w-xs px-2 mx-auto">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
