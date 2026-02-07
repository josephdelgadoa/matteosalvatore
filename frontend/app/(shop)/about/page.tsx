import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2940&auto=format&fit=crop"
                    alt="Matteo Salvatore Atelier"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl text-ms-white font-serif tracking-wide">Our Story</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-4xl text-center">
                <h2 className="ms-heading-2 mb-8">Minimal Luxury from Peru</h2>
                <p className="text-lg md:text-xl text-ms-stone leading-relaxed mb-12">
                    Matteo Salvatore was born from a desire to redefine menswear through the lens of effortless elegance.
                    We believe that true luxury lies in simplicity, quality materials, and impeccable fit.
                </p>

                <div className="grid md:grid-cols-2 gap-12 text-left">
                    <div>
                        <h3 className="text-xl font-medium mb-4">Craftsmanship</h3>
                        <p className="text-ms-stone">All our garments are crafted in small batches in Lima, Peru, using the finest Pima cotton and alpaca blends. We work directly with local artisans to ensure every stitch meets our exacting standards.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium mb-4">Sustainability</h3>
                        <p className="text-ms-stone">We are committed to slow fashion. Our timeless designs are meant to last for years, not seasons. By using natural, biodegradable fibers, we minimize our environmental footprint.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
