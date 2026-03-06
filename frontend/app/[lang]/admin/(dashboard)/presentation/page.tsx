'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Layout,
    Server,
    Database,
    Shield,
    Zap,
    Globe,
    Cpu,
    BarChart3,
    CheckCircle2,
    Users
} from 'lucide-react';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import { cn } from '@/lib/utils';

export default function PresentationPage() {
    const dict = useAdminDictionary();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const presentation = dict.presentation;

    useEffect(() => {
        setIsLoaded(true);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlide]);

    const slidesCount = 7;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slidesCount);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);

    if (!presentation) return null;

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const [[page, direction], setPage] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        const nextPage = (page + newDirection + slidesCount) % slidesCount;
        setPage([nextPage, newDirection]);
        setCurrentSlide(nextPage);
    };

    return (
        <div className="relative h-[80vh] flex flex-col overflow-hidden bg-ms-white rounded-2xl shadow-sm border border-ms-fog">
            {/* Slide Content */}
            <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.4 }
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 lg:p-16"
                    >
                        {renderSlide(page, presentation)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="px-8 py-6 border-t border-ms-fog flex items-center justify-between bg-ms-ivory/50">
                <div className="flex gap-4">
                    <button
                        onClick={() => paginate(-1)}
                        className="p-2 rounded-full border border-ms-fog hover:bg-ms-black hover:text-ms-white transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => paginate(1)}
                        className="p-2 rounded-full border border-ms-fog hover:bg-ms-black hover:text-ms-white transition-colors"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex gap-2">
                    {Array.from({ length: slidesCount }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                const dir = i > page ? 1 : -1;
                                setPage([i, dir]);
                                setCurrentSlide(i);
                            }}
                            className={cn(
                                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                page === i ? "bg-ms-brand-accent w-8" : "bg-ms-fog hover:bg-ms-silver"
                            )}
                        />
                    ))}
                </div>

                <div className="text-sm font-medium text-ms-stone font-serif">
                    {page + 1} / {slidesCount}
                </div>
            </div>
        </div>
    );
}

function renderSlide(index: number, content: any) {
    switch (index) {
        case 0: // Title Slide
            return (
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-ms-brand-accent font-serif text-lg tracking-[0.2em] uppercase"
                    >
                        {content.subtitle}
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl lg:text-8xl font-serif text-ms-black font-medium leading-tight"
                    >
                        Matteo Salvatore
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-ms-stone max-w-2xl mx-auto"
                    >
                        {content.title}
                    </motion.p>
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 2 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="w-24 bg-ms-brand-accent mx-auto"
                    />
                </div>
            );

        case 1: // Vision
            return (
                <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-sm font-serif text-ms-brand-accent uppercase tracking-widest">{content.vision.title}</h2>
                            <p className="text-3xl font-serif text-ms-black leading-snug">
                                {content.vision.text}
                            </p>
                        </div>
                        <ul className="space-y-4">
                            {content.vision.points.map((point: string, i: number) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-4 text-ms-stone text-lg"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-ms-brand-accent" />
                                    {point}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-square bg-ms-ivory rounded-2xl flex items-center justify-center p-8 border border-ms-fog">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-ms-brand-accent/20 rounded-full m-8"
                        />
                        <Layout className="w-32 h-32 text-ms-brand-accent opacity-20 absolute" />
                        <div className="relative grid grid-cols-2 gap-4">
                            {[Shield, Globe, Zap, Cpu].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                                    className="p-6 bg-ms-white rounded-xl shadow-sm border border-ms-fog"
                                >
                                    <Icon className="w-10 h-10 text-ms-brand-accent" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 2: // Architecture
            return (
                <div className="w-full max-w-5xl space-y-12">
                    <div className="text-center space-y-2">
                        <h2 className="text-sm font-serif text-ms-brand-accent uppercase tracking-widest">{content.architecture.title}</h2>
                        <p className="text-xl text-ms-stone">{content.architecture.description}</p>
                    </div>
                    <div className="relative py-20 flex justify-center items-center">
                        {/* Horizontal Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-ms-fog z-0" />

                        <div className="grid grid-cols-4 w-full gap-8 relative z-10">
                            {[
                                { label: 'Client', icon: Globe, tools: 'Browser' },
                                { label: 'Frontend', icon: Layout, tools: 'Next.js 14' },
                                { label: 'Backend', icon: Server, tools: 'Express.js' },
                                { label: 'Data', icon: Database, tools: 'PostgreSQL' }
                            ].map((node, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex flex-col items-center group"
                                >
                                    <div className="w-20 h-20 bg-ms-white border border-ms-fog rounded-2xl flex items-center justify-center shadow-lg group-hover:border-ms-brand-accent transition-colors duration-500">
                                        <node.icon className="w-8 h-8 text-ms-brand-accent" />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="font-serif text-ms-black font-medium">{node.label}</div>
                                        <div className="text-xs text-ms-stone uppercase tracking-tighter mt-1">{node.tools}</div>
                                    </div>
                                    {i < 3 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                                            className="absolute right-[-2.5rem] top-[2.5rem] origin-left"
                                        >
                                            <ChevronRight className="text-ms-brand-accent w-4 h-4" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            );

        case 3: // Modules
            return (
                <div className="w-full max-w-4xl space-y-8">
                    <h2 className="text-center text-sm font-serif text-ms-brand-accent uppercase tracking-widest">{content.modules.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'frontend', icon: Layout },
                            { key: 'backend', icon: Server },
                            { key: 'database', icon: Database },
                            { key: 'admin', icon: Shield },
                            { key: 'ai', icon: Cpu }
                        ].map((mod, i) => (
                            <motion.div
                                key={mod.key}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-5 bg-ms-ivory/50 rounded-xl border border-ms-fog hover:bg-ms-white hover:border-ms-brand-accent transition-all duration-300"
                            >
                                <div className="p-3 bg-ms-white rounded-lg shadow-sm border border-ms-fog">
                                    <mod.icon className="w-6 h-6 text-ms-brand-accent" />
                                </div>
                                <div className="text-left font-serif text-ms-black">
                                    {content.modules[mod.key]}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            );

        case 4: // Benefits
            return (
                <div className="w-full max-w-5xl space-y-12">
                    <h2 className="text-center text-sm font-serif text-ms-brand-accent uppercase tracking-widest">{content.benefits.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.benefits.items.map((benefit: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-ms-white border border-ms-fog rounded-2xl flex flex-col items-center text-center space-y-4 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                            >
                                <div className="w-16 h-16 bg-ms-ivory rounded-full flex items-center justify-center group-hover:bg-ms-brand-accent group-hover:text-ms-white transition-colors duration-500">
                                    {[Zap, Globe, Layout, Shield][i % 4] && React.createElement([Zap, Globe, Layout, Shield][i % 4], { className: "w-8 h-8" })}
                                </div>
                                <h3 className="font-serif text-lg text-ms-black">{benefit.title}</h3>
                                <p className="text-sm text-ms-stone leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            );

        case 5: // Progress Chart
            return (
                <div className="w-full max-w-4xl space-y-12">
                    <h2 className="text-center text-sm font-serif text-ms-brand-accent uppercase tracking-widest">{content.milestones.title}</h2>
                    <div className="bg-ms-white p-12 rounded-2xl border border-ms-fog shadow-lg relative h-[400px]">
                        <p className="absolute top-6 left-8 text-xs font-serif text-ms-stone uppercase tracking-widest">{content.milestones.label}</p>

                        <div className="absolute inset-x-12 bottom-12 top-24 flex items-end justify-between">
                            {[20, 45, 65, 85, 95].map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 w-1/5 relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${val}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                        className="w-12 bg-ms-brand-accent rounded-t-lg relative group"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.5 + i * 0.1 }}
                                            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-ms-black text-ms-white text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            {val}%
                                        </motion.div>
                                    </motion.div>
                                    <div className="text-[10px] text-ms-stone font-serif uppercase tracking-widest">
                                        {['Ene', 'Feb', 'Mar', 'Abr', 'May'][i]}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Connecting Line */}
                        <svg className="absolute inset-x-12 bottom-12 top-24 w-[calc(100%-6rem)] h-full overflow-visible z-20 pointer-events-none">
                            <motion.path
                                d={`M ${1 / 10 * 100}% ${100 - 20}% L ${3 / 10 * 100}% ${100 - 45}% L ${5 / 10 * 100}% ${100 - 65}% L ${7 / 10 * 100}% ${100 - 85}% L ${9 / 10 * 100}% ${100 - 95}%`}
                                fill="none"
                                stroke="#8B7355"
                                strokeWidth="2"
                                strokeDasharray="1000"
                                strokeDashoffset="1000"
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ delay: 0.5, duration: 2, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>
                </div>
            );

        case 6: // Final Slide
            return (
                <div className="space-y-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                        className="w-32 h-32 bg-ms-brand-accent/10 rounded-full flex items-center justify-center mx-auto"
                    >
                        <BarChart3 className="w-12 h-12 text-ms-brand-accent" />
                    </motion.div>
                    <div className="space-y-4">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-serif text-ms-black"
                        >
                            {content.footer}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-ms-stone text-lg"
                        >
                            Project 2026 - Matteo Salvatore
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-center gap-8"
                    >
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-serif text-ms-black font-medium">95%</div>
                            <div className="text-[10px] text-ms-stone uppercase tracking-widest">Completed</div>
                        </div>
                        <div className="w-[1px] h-12 bg-ms-fog" />
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-serif text-ms-black font-medium">2026</div>
                            <div className="text-[10px] text-ms-stone uppercase tracking-widest">Target Year</div>
                        </div>
                    </motion.div>
                </div>
            );

        default:
            return null;
    }
}
