'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Package,
    LogOut
} from 'lucide-react';

const menuItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/orders', label: 'Orders', icon: Package },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
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
                <p className="text-xs text-ms-stone mt-1 uppercase tracking-wider">Admin Panel</p>
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
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
