import React from 'react';
import Image from 'next/image';
import { Truck, ShieldCheck, Zap, Globe, HeartHandshake, ShoppingBag } from 'lucide-react';

interface TrustFeature {
    title: string;
    description: string;
    icon: string; // The dictionary passes a string like '/images/trust-shipping.png'
}

interface TrustSectionProps {
    dict: {
        title: string;
        features: TrustFeature[];
    };
}

// Helper to map the dictionary string paths to premium SVG icons
const getIconForFeature = (iconString: string) => {
    const iconClass = "w-8 h-8 text-white group-hover:text-ms-brand-primary stroke-[1.5] group-hover:scale-110 transition-all duration-500 ease-out";

    if (iconString.includes('shipping')) return <Truck className={iconClass} />;
    if (iconString.includes('protection') || iconString.includes('secure')) return <ShieldCheck className={iconClass} />;
    if (iconString.includes('dispatch')) return <Zap className={iconClass} />;
    if (iconString.includes('reach')) return <Globe className={iconClass} />;
    if (iconString.includes('service')) return <HeartHandshake className={iconClass} />;
    if (iconString.includes('satisfaction') || iconString.includes('quality') || iconString.includes('returns')) return <ShoppingBag className={iconClass} />;

    return <ShoppingBag className={iconClass} />;
};

export const TrustSection = ({ dict }: TrustSectionProps) => {
    return (
        <section className="relative py-28 overflow-hidden bg-ms-black">
            {/* Full-width dark premium background image */}
            <Image
                src="/images/trust-bg.png"
                alt="Matteo Salvatore Luxury"
                fill
                className="object-cover opacity-30 pointer-events-none"
                priority
            />

            {/* Subtle Gradient Overlays for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-ms-black/80 via-ms-black/40 to-ms-black/90 pointer-events-none z-0"></div>

            <div className="ms-container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="ms-heading-2 text-white tracking-tight mb-4">{dict.title}</h2>
                    <div className="w-16 h-[1px] bg-ms-brand-primary mx-auto opacity-70"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {dict.features.map((feature, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-500"
                        >
                            <div className="relative w-16 h-16 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-ms-brand-primary/20 group-hover:border-ms-brand-primary/30 transition-colors duration-500">
                                {getIconForFeature(feature.icon)}
                            </div>
                            <h3 className="font-serif text-[18px] text-white font-medium mb-3 tracking-wide">
                                {feature.title}
                            </h3>
                            <p className="text-white/70 text-[14.5px] leading-relaxed max-w-[260px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
