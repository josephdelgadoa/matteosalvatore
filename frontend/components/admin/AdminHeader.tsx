'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { LogOut, User, Globe, Menu } from 'lucide-react';
import { Locale } from '@/i18n-config';

interface AdminHeaderProps {
    lang: Locale;
}

export const AdminHeader = ({ lang }: AdminHeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [userName, setUserName] = useState<string>('');
    const supabase = createClientComponentClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Try to get name from metadata, or fallback to email
                const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Admin';
                setUserName(name);
            }
        };
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push(`/${lang}/login`);
        router.refresh();
    };

    const toggleLanguage = () => {
        const newLang = lang === 'es' ? 'en' : 'es';
        // Replace the language segment in the path
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <header className="bg-white border-b border-ms-fog h-16 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-serif font-bold text-ms-black tracking-wide">
                    Matteo Salvatore <span className="text-ms-stone font-sans text-sm font-normal bg-ms-ivory px-2 py-1 rounded-sm border border-ms-fog ml-2">ADMIN</span>
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {/* Language Switcher */}
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-ms-stone hover:text-ms-black transition-colors text-sm font-medium"
                >
                    <Globe size={18} />
                    <span>{lang === 'es' ? 'ES' : 'EN'}</span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-6 border-l border-ms-fog">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-ms-black">Hola, {userName}</span>
                        <span className="text-xs text-ms-stone">Administrator</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-ms-brand-primary text-white flex items-center justify-center">
                        <User size={16} />
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2 text-ms-stone hover:text-red-600 transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};
