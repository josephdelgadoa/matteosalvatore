'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookieConsentProps {
    dict: {
        title: string;
        message: string;
        accept: string;
        decline: string;
        preferences: string;
        learnMore: string;
    };
    lang: string;
}

export const CookieConsent = ({ dict, lang }: CookieConsentProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Show banner after a slight delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pb-24 md:pb-6 pointer-events-none flex justify-center">
            <div className="bg-ms-black text-ms-ivory p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row items-start md:items-center gap-6 pointer-events-auto transform transition-all duration-500 ease-out translate-y-0 opacity-100 border border-ms-stone/20">
                <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-serif text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-ms-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                        {dict.title}
                    </h3>
                    <p className="text-ms-silver text-sm leading-relaxed">
                        {dict.message}{' '}
                        <Link href={`/${lang}/policy/cookies`} className="underline decoration-ms-stone hover:text-white transition-colors">
                            {dict.learnMore}
                        </Link>
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={handleDecline}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-ms-stone/50 text-ms-silver hover:text-white hover:border-white hover:bg-white/5 transition-all text-sm font-medium"
                    >
                        {dict.decline}
                    </button>
                    {dict.preferences && (
                        <button
                            onClick={() => { }} // Additional functionality could open a preferences modal
                            className="flex-1 md:flex-none px-6 py-2.5 rounded-full border border-ms-stone/50 text-ms-silver hover:text-white hover:border-white hover:bg-white/5 transition-all text-sm font-medium"
                        >
                            {dict.preferences}
                        </button>
                    )}
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-white text-ms-black hover:bg-ms-ivory transition-all text-sm font-medium transform active:scale-95"
                    >
                        {dict.accept}
                    </button>
                </div>
            </div>
        </div>
    );
};
