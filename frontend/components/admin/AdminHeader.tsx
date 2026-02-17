'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { LogOut, User, Globe, Menu } from 'lucide-react';
import { Locale } from '@/i18n-config';

interface AdminHeaderProps {
    lang: Locale;
}

export const AdminHeader = ({ lang }: AdminHeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [headerName, setHeaderName] = useState<string>('Administrator');
    const [headerRole, setHeaderRole] = useState<string>('Admin');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        let subscription: any;

        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Fetch Profile Data directly
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, avatar_url, role')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    // Set Name
                    const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ');
                    if (fullName) {
                        setHeaderName(fullName);
                    } else {
                        // Fallback to metadata
                        const metaName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
                        if (metaName) setHeaderName(metaName);
                    }

                    // Set Avatar
                    if (profile.avatar_url) {
                        // Add random query param to force reload if url is static
                        setAvatarUrl(`${profile.avatar_url}?t=${Date.now()}`);
                    }

                    // Set Role
                    if (profile.role) {
                        const formattedRole = profile.role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        setHeaderRole(formattedRole);
                    }
                } else {
                    // User has no profile?? Fallback heavily
                    const metaName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0];
                    if (metaName) setHeaderName(metaName);
                }

                // Subscribe to changes
                subscription = supabase
                    .channel('admin-header-channel')
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `id=eq.${session.user.id}`
                        },
                        (payload: any) => {
                            if (payload.new) {
                                const newP = payload.new;
                                const newName = [newP.first_name, newP.last_name].filter(Boolean).join(' ');
                                if (newName) setHeaderName(newName);
                                if (newP.avatar_url) setAvatarUrl(`${newP.avatar_url}?update=${Date.now()}`);
                                if (newP.role) {
                                    const newRole = newP.role.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                    setHeaderRole(newRole);
                                }
                            }
                        }
                    )
                    .subscribe();
            }
        };

        getUser();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push(`/${lang}/login`);
        router.refresh();
    };

    const toggleLanguage = () => {
        const newLang = lang === 'es' ? 'en' : 'es';
        const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
        router.push(newPath);
    };

    return (
        <header className="bg-white border-b border-ms-fog h-16 flex items-center justify-end px-8 sticky top-0 z-30">
            <div className="flex items-center gap-6">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-ms-stone hover:text-ms-black transition-colors text-sm font-medium"
                >
                    <Globe size={18} />
                    <span>{lang === 'es' ? 'ES' : 'EN'}</span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-ms-fog">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-ms-black">Hola, {headerName}</span>
                        <span className="text-xs text-ms-stone">{headerRole}</span>
                    </div>

                    {avatarUrl ? (
                        <div className="w-8 h-8 rounded-full bg-ms-brand-primary overflow-hidden relative border border-ms-fog">
                            <img src={avatarUrl} alt={headerName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-ms-brand-primary text-white flex items-center justify-center">
                            <User size={16} />
                        </div>
                    )}
                </div>

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
