'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/admin/DataTable';
import { ordersApi, Order } from '@/lib/api/orders';
import { Spinner } from '@/components/ui/Spinner';
import { Eye } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await ordersApi.getAll();
                setOrders(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const columns: any[] = [
        { header: 'Order #', accessorKey: 'order_number' },
        {
            header: 'Date',
            accessorKey: (item: Order) => new Date(item.created_at).toLocaleDateString()
        },
        {
            header: 'Status',
            accessorKey: (item: Order) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase
                ${item.status === 'paid' ? 'bg-ms-success/10 text-ms-success' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-ms-pearl text-ms-stone'
                    }`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Total',
            accessorKey: (item: Order) => `S/. ${item.total_amount.toFixed(2)}`
        },
        {
            header: '',
            accessorKey: (item: Order) => (
                <Link href={`/admin/orders/${item.id}`}>
                    <Button variant="text" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" /> View
                    </Button>
                </Link>
            )
        }
    ];

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">Orders</h1>
                    <p className="text-ms-stone">View and manage customer orders.</p>
                </div>
            </div>

            <DataTable
                data={orders}
                columns={columns}
            />
        </div>
    );
}
