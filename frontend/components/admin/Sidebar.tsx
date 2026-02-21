'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { cn } from '@/lib/utils';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import { Locale } from '@/i18n-config';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Package,
    LogOut,
    Menu
} from 'lucide-react';

export const AdminSidebar = ({ lang }: { lang: Locale }) => {
    const dict = useAdminDictionary();
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { href: `/${lang}/admin`, label: dict.sidebar.overview, icon: LayoutDashboard },
        { href: `/${lang}/admin/products`, label: dict.sidebar.products, icon: ShoppingBag },
        { href: `/${lang}/admin/categories`, label: dict.sidebar.categories, icon: LayoutDashboard },
        { href: `/${lang}/admin/settings/categories-images`, label: dict.sidebar.categoriesImages, icon: LayoutDashboard },
        { href: `/${lang}/admin/orders`, label: dict.sidebar.orders, icon: Package },
        { href: `/${lang}/admin/customers`, label: dict.sidebar.customers, icon: Users },
        { href: `/${lang}/admin/users`, label: dict.sidebar.users, icon: Users },
        { href: `/${lang}/admin/settings/menu`, label: dict.sidebar.menuBar, icon: Menu },
        { href: `/${lang}/admin/settings`, label: dict.sidebar.settings, icon: Settings },
    ];
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <aside className="w-64 bg-ms-white border-r border-ms-fog h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-ms-fog">
                <Link href="/" className="font-serif text-xl font-medium tracking-tight">
                    Matteo Salvatore
                </Link>
                <p className="text-xs text-ms-stone mt-1 uppercase tracking-wider">{dict.sidebar.title}</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-ms-black text-ms-white"
                                    : "text-ms-stone hover:bg-ms-ivory hover:text-ms-black"
                            )}
                        >
                            <Icon className="w-5 h-5" strokeWidth={1.5} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-ms-fog">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 w-full text-left text-sm font-medium text-ms-error hover:bg-ms-error/5 rounded-md transition-colors"
                >
                    <LogOut className="w-5 h-5" strokeWidth={1.5} />
                    {dict.sidebar.signOut}
                </button>
            </div>
        </aside>
    );
};
