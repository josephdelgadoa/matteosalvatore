"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Quote, MapPin } from 'lucide-react';

interface Testimonial {
    name: string;
    city: string;
    text: string;
}

interface TestimonialsProps {
    dict: {
        title: string;
        subtitle: string;
        items: Testimonial[];
    };
}

export const Testimonials = ({ dict }: TestimonialsProps) => {
    // Duplicate items to create infinite scroll effect
    const testimonials = [...dict.items, ...dict.items];

    return (
        <section className="bg-ms-ivory py-24 border-y border-ms-fog overflow-hidden">
            <div className="ms-container mb-16 text-center">
                <h2 className="ms-heading-2 mb-4">{dict.subtitle}</h2>
                <p className="font-serif text-xl text-ms-black/70">{dict.title}</p>
            </div>

            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ms-ivory to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-ms-ivory to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex gap-8 px-4"
                        animate={{
                            x: ["0%", "-50%"],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 50, // Slow, elegant scroll
                                ease: "linear",
                            },
                        }}
                    >
                        {testimonials.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[85vw] md:w-[400px] bg-white p-6 md:p-8 border border-ms-fog shadow-sm hover:shadow-md transition-shadow duration-300 rounded-sm"
                            >
                                <Quote className="w-8 h-8 text-ms-brand-primary/20 mb-6" />
                                <p className="text-ms-stone text-lg italic leading-relaxed mb-6 min-h-[100px]">
                                    "{item.text}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-ms-fog pt-4">
                                    <div className="w-10 h-10 rounded-full bg-ms-pearl flex items-center justify-center text-ms-brand-primary font-serif font-medium">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-serif font-medium text-ms-black">{item.name}</h4>
                                        <div className="flex items-center gap-1 text-xs text-ms-silver uppercase tracking-wider">
                                            <MapPin className="w-3 h-3" />
                                            {item.city}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
