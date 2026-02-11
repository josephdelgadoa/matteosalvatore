import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { Locale } from '@/i18n-config';

export default function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    return (
        <div className="h-screen bg-ms-ivory flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col ml-64 h-full">
                <AdminHeader lang={params.lang} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
