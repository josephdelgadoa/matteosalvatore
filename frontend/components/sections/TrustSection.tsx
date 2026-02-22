import React from 'react';
import Image from 'next/image';

interface TrustFeature {
    title: string;
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
        <section className="bg-ms-ivory py-16 border-t border-ms-fog">
            <div className="ms-container">
                <h2 className="ms-heading-2 mb-12 text-center text-ms-black">{dict.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    {dict.features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="relative w-24 h-24 mb-2 overflow-hidden rounded-full bg-white shadow-sm border border-ms-fog group-hover:shadow-md transition-shadow flex items-center justify-center p-4">
                                <Image
                                    src={feature.icon}
                                    alt={feature.title}
                                    fill
                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="font-serif text-[15px] md:text-base text-ms-black font-medium px-2 leading-snug">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
