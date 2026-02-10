import React from 'react';
import { AdminSidebar } from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-ms-ivory flex">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
