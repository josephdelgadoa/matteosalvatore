'use client';

import React from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function AdminDashboard({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    return (
        <div className="space-y-8">
            <div>
                <h1 className="ms-heading-2 mb-2">{dict.dashboard.title}</h1>
                <p className="text-ms-stone">{dict.dashboard.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={dict.dashboard.totalRevenue}
                    value="S/. 124,500"
                    icon={DollarSign}
                    trend={{ value: 12, label: dict.dashboard.vsLastMonth, isPositive: true }}
                />
                <StatCard
                    title={dict.dashboard.orders}
                    value="1,245"
                    icon={Package}
                    trend={{ value: 8, label: dict.dashboard.vsLastMonth, isPositive: true }}
                />
                <StatCard
                    title={dict.dashboard.activeProducts}
                    value="48"
                    icon={ShoppingBag}
                />
                <StatCard
                    title={dict.dashboard.customers}
                    value="3,892"
                    icon={Users}
                    trend={{ value: 24, label: dict.dashboard.vsLastMonth, isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Revenue Chart */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none min-h-[20rem] h-auto flex flex-col justify-center items-center">
                    <p className="text-ms-stone mb-2">{dict.dashboard.revenueOverview}</p>
                    <div className="text-xs text-ms-silver uppercase">{dict.dashboard.chartPlaceholder}</div>
                </div>

                {/* Placeholder for Recent Activity */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none min-h-[20rem] h-auto">
                    <h3 className="text-lg font-medium mb-4">{dict.dashboard.recentActivity}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-ms-fog last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-ms-pearl rounded-full flex items-center justify-center text-xs">MS</div>
                                    <div>
                                        <p className="text-sm font-medium">{dict.dashboard.newOrder} #{2020 + i}</p>
                                        <p className="text-xs text-ms-stone">2 {dict.dashboard.minutesAgo}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium">S/. 240.00</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
