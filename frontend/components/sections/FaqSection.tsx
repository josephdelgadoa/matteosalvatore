'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
    q: string;
    a: string;
}

interface FaqSectionProps {
    dict: {
        title: string;
        items: FaqItem[];
    };
}

export const FaqSection = ({ dict }: FaqSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-ms-white py-24 border-t border-ms-fog">
            <div className="ms-container max-w-4xl mx-auto">
                <h2 className="ms-heading-2 mb-12 text-center text-ms-black">{dict.title}</h2>
                <div className="space-y-4">
                    {dict.items.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="border-b border-ms-fog">
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center py-6 text-left group transition-colors"
                                >
                                    <span className={`font-serif text-lg md:text-xl transition-colors pr-8 ${isOpen ? 'text-ms-stone' : 'text-ms-black group-hover:text-ms-stone'}`}>
                                        {item.q}
                                    </span>
                                    <span className="text-ms-stone flex-shrink-0 transition-transform duration-300">
                                        {isOpen ? <Minus className="w-5 h-5 text-ms-stone" /> : <Plus className="w-5 h-5" />}
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-ms-stone leading-relaxed pb-6 text-base pr-8">
                                                {item.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
