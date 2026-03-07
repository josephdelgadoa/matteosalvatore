'use client';

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Package, Store } from 'lucide-react';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import { dashboardApi } from '@/lib/api/dashboard';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminDashboard({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardApi.getStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="ms-heading-2 mb-2">{dict.dashboard.title}</h1>
                <p className="text-ms-stone">{dict.dashboard.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title={dict.dashboard.totalRevenue}
                    value={`S/. ${(stats?.totalRevenue || 0).toLocaleString()}`}
                    icon={DollarSign}
                />
                <StatCard
                    title="Ventas Online"
                    value={`S/. ${(stats?.onlineRevenue || 0).toLocaleString()}`}
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Ventas Tiendas Físicas"
                    value={`S/. ${(stats?.posRevenue || 0).toLocaleString()}`}
                    icon={Store}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue by Store */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none">
                    <h3 className="text-lg font-medium mb-4">Ingresos por Tienda</h3>
                    <div className="space-y-4">
                        {Object.entries(stats?.statsByStore || {}).map(([storeName, amount]: [string, any]) => (
                            <div key={storeName} className="flex items-center justify-between py-2 border-b border-ms-fog last:border-0">
                                <span className="text-sm font-medium">{storeName}</span>
                                <span className="text-sm font-bold">S/. {amount.toLocaleString()}</span>
                            </div>
                        ))}
                        {Object.keys(stats?.statsByStore || {}).length === 0 && (
                            <p className="text-ms-stone italic text-sm">No hay ventas registradas en tiendas aún.</p>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats Logic Placeholder */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none flex flex-col justify-center items-center">
                    <p className="text-ms-stone mb-2">Resumen Operativo</p>
                    <div className="text-xs text-ms-silver uppercase">Total Consolidado Activo</div>
                    <div className="text-3xl font-serif mt-2">S/. {((stats?.totalRevenue || 0)).toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
}
