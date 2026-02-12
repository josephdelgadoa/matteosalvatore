'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Brain, Globe, ShieldCheck, Zap } from 'lucide-react';

const slides = [
    {
        title: "Business Intelligence",
        description: "Real-time analytics and data-driven insights to grow your business.",
        icon: BarChart
    },
    {
        title: "Supported by AI",
        description: "Automated workflows and personalized recommendations powered by Nexa Sphere AI.",
        icon: Brain
    },
    {
        title: "Global Reach",
        description: "Seamlessly manage international sales, currencies, and logistics from one hub.",
        icon: Globe
    },
    {
        title: "Enterprise Security",
        description: "Bank-grade encryption and role-based access control to keep your data safe.",
        icon: ShieldCheck
    },
    {
        title: "Lightning Fast",
        description: "Optimized performance ensuring zero latency for your administrative tasks.",
        icon: Zap
    }
];

export function LoginSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="mb-6 p-4 bg-white/10 rounded-full backdrop-blur-sm">
                        {React.createElement(slides[current].icon, { size: 48, className: "text-blue-400" })}
                    </div>
                    <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {slides[current].title}
                    </h3>
                    <p className="text-lg text-gray-300 max-w-sm leading-relaxed">
                        {slides[current].description}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-10 flex gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${current === idx ? "bg-blue-400 w-6" : "bg-gray-600"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
