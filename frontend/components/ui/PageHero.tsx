'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    image: string;
    className?: string;
    overlayOpacity?: number;
}

export const PageHero: React.FC<PageHeroProps> = ({
    title,
    subtitle,
    image,
    className,
    overlayOpacity = 0.4
}) => {
    return (
        <div className={cn("relative w-full h-[40vh] md:h-[50vh] overflow-hidden flex items-center justify-center", className)}>
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay */}
                <div
                    className="absolute inset-0 bg-ms-black"
                    style={{ opacity: overlayOpacity }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {subtitle && (
                        <p className="text-ms-white/90 text-sm md:text-base uppercase tracking-widest mb-3 md:mb-4">
                            {subtitle}
                        </p>
                    )}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ms-white tracking-wide">
                        {title}
                    </h1>
                </motion.div>
            </div>
        </div>
    );
};
