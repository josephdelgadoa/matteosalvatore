'use client';

import React from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

import { Locale } from '@/i18n-config';

export default function AdminDashboard({ params }: { params: { lang: Locale } }) {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="ms-heading-2 mb-2">Dashboard</h1>
                <p className="text-ms-stone">Overview of your store's performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="S/. 124,500"
                    icon={DollarSign}
                    trend={{ value: 12, label: "vs last month", isPositive: true }}
                />
                <StatCard
                    title="Orders"
                    value="1,245"
                    icon={Package}
                    trend={{ value: 8, label: "vs last month", isPositive: true }}
                />
                <StatCard
                    title="Active Products"
                    value="48"
                    icon={ShoppingBag}
                />
                <StatCard
                    title="Customers"
                    value="3,892"
                    icon={Users}
                    trend={{ value: 24, label: "vs last month", isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Revenue Chart */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none h-80 flex flex-col justify-center items-center">
                    <p className="text-ms-stone mb-2">Revenue Overview</p>
                    <div className="text-xs text-ms-silver uppercase">[Chart Placeholder]</div>
                </div>

                {/* Placeholder for Recent Activity */}
                <div className="bg-ms-white p-6 border border-ms-fog rounded-none h-80">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-ms-fog last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-ms-pearl rounded-full flex items-center justify-center text-xs">MS</div>
                                    <div>
                                        <p className="text-sm font-medium">New Order #202{i}</p>
                                        <p className="text-xs text-ms-stone">2 minutes ago</p>
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
