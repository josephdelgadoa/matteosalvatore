'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Check localStorage to see if user has already seen/closed the popup
        const hasSeenPopup = localStorage.getItem('ms_newsletter_seen');
        const isForced = window.location.hash === '#newsletter';

        if (!hasSeenPopup || isForced) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000); // 3 seconds delay
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('ms_newsletter_seen', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        console.log('Submitted email:', email);
        setIsSubmitted(true);
        localStorage.setItem('ms_newsletter_seen', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white w-full max-w-4xl h-auto md:h-[500px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        >
                            <X size={20} className="text-ms-black" />
                        </button>

                        {/* Image Section */}
                        <div className="hidden md:block w-1/2 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('/images/unlock-15-off.jpeg')",
                                }}
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center">
                            {!isSubmitted ? (
                                <>
                                    <h2 className="font-serif text-3xl font-bold mb-2 tracking-tight">UNLOCK 15% OFF</h2>
                                    <p className="text-ms-stone mb-8 text-sm uppercase tracking-wider font-medium">When you sign up for our newsletter</p>

                                    <p className="text-ms-stone mb-6 text-sm">
                                        Join our exclusive list to receive early access to new collections, events, and styling tips.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="text-center"
                                        />
                                        <Button type="submit" className="w-full bg-ms-brand-primary text-white hover:bg-ms-brand-secondary py-6">
                                            UNLOCK ACCESS
                                        </Button>
                                    </form>

                                    <p className="text-[10px] text-ms-stone mt-4">
                                        By signing up, you agree to receive marketing emails. You can unsubscribe at any time.
                                    </p>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <h3 className="font-serif text-3xl font-bold mb-4">WELCOME TO THE CLUB</h3>
                                    <p className="text-ms-stone mb-6">Here is your exclusive code:</p>

                                    <div className="bg-ms-ivory border border-ms-fog p-4 mb-6 select-all cursor-pointer hover:bg-ms-ivory/80 transition-colors" onClick={() => navigator.clipboard.writeText('MATTEO15')}>
                                        <span className="font-mono text-xl font-bold tracking-widest text-ms-black">MATTEO15</span>
                                    </div>

                                    <Button onClick={handleClose} variant="outline" className="w-full">
                                        START SHOPPING
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
