'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Brain, Globe, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

const slides = [
    {
        title: "Business Intelligence",
        description: "Real-time analytics and data-driven insights to grow your business.",
        icon: BarChart,
        image: '/images/admin-login/slide-1.png'
    },
    {
        title: "Supported by AI",
        description: "Automated workflows and personalized recommendations powered by Nexa Sphere AI.",
        icon: Brain,
        image: '/images/admin-login/slide-2.png'
    },
    {
        title: "Global Reach",
        description: "Seamlessly manage international sales, currencies, and logistics from one hub.",
        icon: Globe,
        image: '/images/admin-login/slide-3.png'
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade encryption and role-based access control to keep your data safe.",
        icon: ShieldCheck,
        image: '/images/admin-login/slide-4.png'
    },
    {
        title: "Lightning Fast",
        description: "Optimized performance ensuring zero latency for your administrative tasks.",
        icon: Zap,
        image: '/images/admin-login/slide-5.png'
    }
];

export function LoginSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-full w-full flex flex-col items-center justify-center text-center overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slides[current].image}
                        alt={slides[current].title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 px-8 max-w-lg mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-xl">
                            {React.createElement(slides[current].icon, { size: 48, className: "text-blue-400" })}
                        </div>
                        <h3 className="text-4xl font-bold mb-4 text-white tracking-tight drop-shadow-lg">
                            {slides[current].title}
                        </h3>
                        <p className="text-lg text-gray-200 leading-relaxed font-light drop-shadow-md">
                            {slides[current].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 z-20 flex gap-3">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 backdrop-blur-sm ${current === idx ? "bg-blue-400 w-8" : "bg-white/30 w-2 hover:bg-white/50"
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
