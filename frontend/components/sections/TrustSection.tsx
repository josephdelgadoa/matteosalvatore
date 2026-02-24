import React from 'react';
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
    const iconClass = "w-8 h-8 text-ms-brand-primary stroke-[1.5] group-hover:scale-110 transition-transform duration-500 ease-out";

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
        <section className="bg-ms-pearl py-24 border-t border-ms-fog/50 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-30">
                <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-ms-fog/40 to-transparent blur-3xl"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-ms-brand-primary/5 to-transparent blur-3xl"></div>
            </div>

            <div className="ms-container relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="ms-heading-2 text-ms-black tracking-tight mb-4">{dict.title}</h2>
                    <div className="w-16 h-[1px] bg-ms-brand-primary mx-auto opacity-50"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {dict.features.map((feature, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center bg-ms-white p-10 rounded-2xl border border-ms-fog/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
                        >
                            <div className="relative w-16 h-16 mb-6 rounded-full bg-ms-brand-primary/5 flex items-center justify-center group-hover:bg-ms-brand-primary/10 transition-colors duration-500">
                                {getIconForFeature(feature.icon)}
                            </div>
                            <h3 className="font-serif text-[18px] text-ms-black font-medium mb-3 tracking-wide">
                                {feature.title}
                            </h3>
                            <p className="text-ms-stone text-[14.5px] leading-relaxed max-w-[260px]">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
