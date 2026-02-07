'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Package, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { addToast } = useToast();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        addToast('Logged out successfully', 'success');
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { name: 'Profile', href: '/account', icon: User },
        { name: 'My Orders', href: '/account/orders', icon: Package },
    ];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-[60vh]">
            <ToastContainer />
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <h2 className="ms-heading-3 mb-6">My Account</h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-ms-black text-ms-white"
                                        : "text-ms-stone hover:bg-ms-ivory hover:text-ms-black"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <div className="bg-ms-white border border-ms-fog rounded-lg p-6 md:p-8 animate-fade-in text-ms-black">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
