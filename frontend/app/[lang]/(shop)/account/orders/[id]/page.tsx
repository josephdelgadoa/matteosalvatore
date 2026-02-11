'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';
import Image from 'next/image';

export default function OrderPage() {
    const { id } = useParams(); // This is order_number based on previous link
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Using existing endpoint: GET /api/orders/:orderNumber
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
                setOrder(response.data.data.order);
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
    if (!order) return <div className="py-10 text-center">Order not found</div>;

    return (
        <div>
            <div className="mb-6">
                <Link href="/account/orders" className="text-sm text-ms-stone hover:text-ms-black flex items-center gap-2 mb-4">
                    <ChevronLeft className="w-4 h-4" /> Back to Orders
                </Link>
                <div className="flex justify-between items-baseline">
                    <h2 className="text-2xl font-medium font-serif">Order #{order.order_number}</h2>
                    <span className="text-sm text-ms-stone">
                        Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
                    </span>
                </div>
            </div>

            <div className="border border-ms-fog rounded-md overflow-hidden">
                {/* Items */}
                <div className="p-6 space-y-6">
                    {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex gap-4 md:gap-6 items-start">
                            {/* 
                       Note: Order items typically don't store image_url in simplified schema.
                       Ideally we should populate product to get image.
                       For now, use placeholder or fetch product if needed.
                       Or backend `getAllOrders` could join products.
                       Assuming we might not have image here unless we enhanced the query.
                       Let's check if product_id can be used to link.
                     */}
                            <div className="relative w-20 h-24 bg-ms-ivory border border-ms-fog rounded-sm flex items-center justify-center text-xs text-ms-stone">
                                No Image
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <h4 className="font-medium">{item.product_name}</h4>
                                    <span className="font-medium">S/. {item.total_price.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-ms-stone">
                                    Quantity: {item.quantity}
                                    {item.variant_info && ` · ${item.variant_info.size} / ${item.variant_info.color}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-ms-ivory/30 p-6 border-t border-ms-fog grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-medium text-sm mb-2">Shipping Address</h4>
                        <div className="text-sm text-ms-stone space-y-1">
                            {/* Assuming shipping_address is JSONB */}
                            <p>{order.shipping_address?.address_line1}</p>
                            <p>{order.shipping_address?.city}, {order.shipping_address?.district}</p>
                            <p>{order.shipping_address?.country}</p>
                            <p className="mt-2 text-ms-black">{order.shipping_address?.phone}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-2">Order Summary</h4>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between text-ms-stone">
                                <span>Subtotal</span>
                                {/* Calculate subtotal from total - shipping if we stored shipping cost separately. 
                            If not stored, just show Total for now. 
                        */}
                                <span>-</span>
                            </div>
                            <div className="flex justify-between text-ms-stone">
                                <span>Shipping</span>
                                <span>-</span>
                            </div>
                            <div className="flex justify-between font-medium text-ms-black pt-2 border-t border-ms-fog">
                                <span>Total</span>
                                <span>S/. {order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
