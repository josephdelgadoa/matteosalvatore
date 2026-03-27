'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { ChevronRight, PackageX } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';

import { getLocalizedPath } from '@/lib/routes';
import { useShopDictionary } from '@/providers/ShopDictionaryProvider';
import { Locale } from '@/i18n-config';

export default function OrderHistoryPage({ params: { lang } }: { params: { lang: Locale } }) {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const supabase = createClientComponentClient();
    const dict = useShopDictionary();
    const accountDict = dict.account.orders;

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch from Backend API. We pass email as well to link guest orders manually.
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/customer/${user.id}?email=${user.email}`);
                setOrders(response.data.data.orders);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [supabase]);

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ms-ivory text-ms-stone mb-4">
                    <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">{accountDict.noOrders}</h3>
                <p className="text-ms-stone mb-6">{accountDict.noOrdersSub}</p>
                <Link href={`/${lang}/${lang === 'es' ? 'productos' : 'products'}`}>
                    <button className="bg-ms-black text-ms-white px-6 py-2 rounded-md hover:bg-ms-charcoal transition-colors">
                        {accountDict.startShopping}
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-medium mb-6">{accountDict.title}</h2>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.order_number} className="border border-ms-fog rounded-md overflow-hidden hover:border-ms-stone transition-colors">
                        <div className="bg-ms-ivory/30 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-ms-fog">
                            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                                <div>
                                    <span className="text-xs text-ms-stone block uppercase tracking-wider">{accountDict.orderPlaced}</span>
                                    <span className="text-sm font-medium">{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-ms-stone block uppercase tracking-wider">{accountDict.total}</span>
                                    <span className="text-sm font-medium">S/. {order.total_amount.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-ms-stone block uppercase tracking-wider">{accountDict.orderNumber}</span>
                                    <span className="text-sm font-medium font-serif">{order.order_number}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wider",
                                    order.status === 'paid' ? "bg-green-100 text-green-800" :
                                        order.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                            "bg-gray-100 text-gray-800"
                                )}>
                                    {order.status === 'paid' ? accountDict.statusPaid : 
                                     order.status === 'pending' ? accountDict.statusPending : 
                                     order.status}
                                </span>
                            </div>
                        </div>

                        <div className="px-6 py-4 flex justify-between items-center group cursor-pointer hover:bg-ms-ivory/10">
                            <div className="text-sm text-ms-stone">
                                {accountDict.viewDetails}
                            </div>
                            <Link href={getLocalizedPath(`/account/orders/${order.order_number}`, lang as any)} className="flex items-center text-sm font-medium text-ms-black group-hover:underline">
                                {accountDict.details} <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper util
function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(' ');
}
