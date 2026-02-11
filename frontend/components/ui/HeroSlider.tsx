'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: number;
    image: string;
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    link: string;
}

interface HeroSliderProps {
    slides: Slide[];
    lang: string;
}

export const HeroSlider = ({ slides, lang }: HeroSliderProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-[90vh] w-full overflow-hidden bg-ms-brand-primary">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ms-black/40 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 ms-container h-full flex items-center">
                <div className="max-w-2xl text-ms-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="px-4 md:px-0"
                        >
                            <p className="ms-label mb-4 md:mb-6 text-ms-white/90 tracking-[0.2em] text-xs md:text-sm">{slides[current].subtitle}</p>
                            <h1 className="text-4xl md:text-7xl font-serif leading-tight mb-6 md:mb-8">
                                {slides[current].title}
                            </h1>
                            <p className="text-base md:text-xl text-ms-white/90 mb-8 md:mb-10 leading-relaxed max-w-lg">
                                {slides[current].description}
                            </p>
                            <Link href={`/${lang}${slides[current].link}`}>
                                <Button size="lg" className="w-full md:w-auto bg-ms-white text-ms-black hover:bg-ms-stone hover:text-ms-white border-none">
                                    {slides[current].cta}
                                </Button>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-10 left-0 right-0 z-20 ms-container flex justify-between items-end pointer-events-none">
                {/* Dots */}
                <div className="flex gap-4 pointer-events-auto">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1 transition-all duration-300 ${idx === current ? 'w-12 bg-ms-white' : 'w-6 bg-ms-white/40 hover:bg-ms-white/60'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-4 pointer-events-auto">
                    <button onClick={prevSlide} className="p-3 border border-ms-white/20 text-ms-white hover:bg-ms-white hover:text-ms-black transition-colors rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className="p-3 border border-ms-white/20 text-ms-white hover:bg-ms-white hover:text-ms-black transition-colors rounded-full">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};
