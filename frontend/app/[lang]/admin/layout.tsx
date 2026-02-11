import { AdminHeader } from '@/components/admin/AdminHeader';
import { Locale } from '@/i18n-config';

export default function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { lang: Locale };
}) {
    return (
        <div className="min-h-screen bg-ms-ivory flex flex-col">
            <AdminHeader lang={params.lang} />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 ml-64 p-8 overflow-y-auto h-full">
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
