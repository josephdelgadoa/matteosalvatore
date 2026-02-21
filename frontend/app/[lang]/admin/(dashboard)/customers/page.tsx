'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { customersApi, Customer } from '@/lib/api/customers';
import { Spinner } from '@/components/ui/Spinner';
import { Mail, User } from 'lucide-react';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function AdminCustomersPage() {
    const dict = useAdminDictionary();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await customersApi.getAll();
                setCustomers(data);
            } catch (err) {
                console.error('Failed to load customers:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const columns: any[] = [
        {
            header: dict.customersList.tableCustomer,
            accessorKey: (item: Customer) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-ms-pearl rounded-full flex items-center justify-center text-ms-stone">
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="font-medium block">
                            {item.first_name} {item.last_name}
                        </span>
                        <span className="text-xs text-ms-stone block">
                            {dict.customersList.joined} {new Date(item.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: dict.customersList.tableEmail,
            accessorKey: (item: Customer) => (
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3 h-3 text-ms-stone" />
                    {item.email}
                </div>
            )
        },
        {
            header: dict.customersList.tableRole,
            accessorKey: (item: Customer) => (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase
                    ${item.role === 'admin' || item.role === 'super_admin'
                        ? 'bg-ms-black text-ms-white'
                        : 'bg-ms-pearl text-ms-stone'
                    }`}>
                    {item.role}
                </span>
            )
        },
    ];

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">{dict.customersList.title}</h1>
                    <p className="text-ms-stone">{dict.customersList.subtitle}</p>
                </div>
            </div>

            <DataTable
                data={customers}
                columns={columns}
            />
        </div>
    );
}
