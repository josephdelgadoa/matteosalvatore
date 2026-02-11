'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ordersApi, Order, OrderItem } from '@/lib/api/orders';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Printer } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await ordersApi.getById(params.id);
                setOrder(orderData);
                // If order items aren't nested, fetch them. 
                // Assuming API returns items nested for now based on typical Supabase joins.
                // If not, we'd fetch items separately.
                if (orderData.order_items) {
                    setItems(orderData.order_items);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [params.id]);

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <Button variant="text" onClick={() => router.back()} className="gap-2 pl-0">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> Print Invoice
                    </Button>
                    {/* Could add actionable buttons here like "Mark as Shipped" */}
                </div>
            </div>

            <div className="bg-ms-white p-8 border border-ms-fog">
                <div className="flex justify-between items-start mb-8 border-b border-ms-fog pb-8">
                    <div>
                        <h1 className="text-2xl font-serif mb-1">Order #{order.order_number}</h1>
                        <p className="text-ms-stone text-sm">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase border
                    ${order.status === 'paid' ? 'bg-ms-success/10 text-ms-success border-ms-success/20' :
                                'bg-ms-pearl text-ms-stone border-ms-fog'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-medium uppercase tracking-wide text-ms-stone mb-2">Customer</h3>
                        {/* Simplified customer info */}
                        <p className="font-medium">Customer ID: {order.customer_id.substring(0, 8)}...</p>
                        {/* Ideally we fetch customer details too */}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium uppercase tracking-wide text-ms-stone mb-2">Shipping Address</h3>
                        <div className="text-sm">
                            {order.shipping_address ? (
                                <>
                                    <p>{order.shipping_address.address_line1}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.country}</p>
                                    <p>{order.shipping_address.postal_code}</p>
                                </>
                            ) : (
                                <p className="italic text-ms-stone">No address info</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border rounded-md border-ms-fog overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-ms-ivory border-b border-ms-fog">
                            <tr>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone">Product</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">Qty</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">Price</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ms-fog">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="p-3">
                                        <p className="font-medium">{item.product_name}</p>
                                        <p className="text-xs text-ms-stone">
                                            {(item.variant_info as any)?.size} / {(item.variant_info as any)?.color}
                                        </p>
                                    </td>
                                    <td className="p-3 text-right">{item.quantity}</td>
                                    <td className="p-3 text-right">S/. {item.unit_price.toFixed(2)}</td>
                                    <td className="p-3 text-right">S/. {item.total_price.toFixed(2)}</td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr><td colSpan={4} className="p-4 text-center">No items found</td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-ms-ivory/50">
                            <tr>
                                <td colSpan={3} className="p-3 text-right font-medium">Subtotal</td>
                                <td className="p-3 text-right">S/. {(order.total_amount / 1.18).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="p-3 text-right font-medium">IGV (18%)</td>
                                <td className="p-3 text-right">S/. {(order.total_amount - (order.total_amount / 1.18)).toFixed(2)}</td>
                            </tr>
                            <tr className="border-t border-ms-fog">
                                <td colSpan={3} className="p-3 text-right font-bold">Total</td>
                                <td className="p-3 text-right font-bold">S/. {order.total_amount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    );
}
