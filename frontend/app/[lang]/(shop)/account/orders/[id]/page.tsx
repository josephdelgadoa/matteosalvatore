'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { ChevronLeft, Printer } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import axios from 'axios';
import { getLocalizedPath } from '@/lib/routes';
import { useShopDictionary } from '@/providers/ShopDictionaryProvider';
import { Locale } from '@/i18n-config';

export default function OrderPage() {
    const { id, lang } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [session, setSession] = useState<any>(null);
    const supabase = createClientComponentClient();
    const dict = useShopDictionary();
    const accountDict = dict.account?.orders || {};

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
                setOrder(response.data.data.order);
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
        fetchOrder();
    }, [id, supabase.auth]);

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;
    if (!order) return <div className="py-10 text-center">{accountDict.noOrders || 'Order not found'}</div>;

    const isGuest = !session;
    const shippingCost = order.total_amount > 300 ? 0 : 15;

    // Handle stringified or object shipping address
    let shippingAddress = null;
    if (order.shipping_address) {
        if (typeof order.shipping_address === 'string') {
            try {
                shippingAddress = JSON.parse(order.shipping_address);
            } catch (e) {
                console.error('Error parsing shipping address:', e);
            }
        } else {
            shippingAddress = order.shipping_address;
        }
    }

    return (
        <div>
            <style jsx global>{`
                @media print {
                    @page { margin: 20mm; }
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    header, footer, aside, nav, .ms-account-sidebar { display: none !important; }
                    .ms-container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
                    .border { border: 1px solid #e5e7eb !important; }
                    .bg-ms-ivory { background-color: #f9f9f7 !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        {!isGuest && (
                            <Link href={getLocalizedPath('/account/orders', lang as any)} className="text-sm text-ms-stone hover:text-ms-black flex items-center gap-2 mb-4 no-print">
                                <ChevronLeft className="w-4 h-4" /> {accountDict.backToOrders || 'Regresar a Pedidos'}
                            </Link>
                        )}
                        <h1 className="ms-heading-2 mb-2">{accountDict.orderNumber || 'Pedido #'} {order.order_number}</h1>
                        <p className="text-ms-stone text-sm">{accountDict.orderPlaced || 'Pedido realizado'}: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <button 
                        onClick={() => window.print()}
                        className="no-print flex items-center gap-2 px-4 py-2 border border-ms-fog rounded-md text-sm font-medium hover:bg-ms-pearl transition-colors"
                    >
                        <Printer size={18} />
                        {dict.cart?.summary?.print || 'Imprimir Recibo'}
                    </button>
                </div>
            </div>

            {/* Print Only Header */}
            <div className="print-only mb-8 border-b border-ms-fog pb-6">
                <div className="flex justify-between items-center">
                    <img src="/images/logo-matteo-salvatore.png" alt="Matteo Salvatore" className="h-10 w-auto" />
                    <div className="text-right">
                        <h2 className="text-xl font-bold uppercase tracking-widest">Recibo de Compra</h2>
                        <p className="text-xs text-ms-stone">Matteo Salvatore - www.matteosalvatore.pe</p>
                    </div>
                </div>
            </div>

            <div className="border border-ms-fog rounded-md overflow-hidden">
                {/* Items */}
                <div className="p-6 space-y-6">
                    {order.order_items?.map((item: any) => {
                        // Use variant product or fallback to direct product join
                        const product = item.product_variants?.products || item.products;
                        const mainImage = product?.product_images?.find((img: any) => img.is_primary)?.image_url || 
                                          product?.product_images?.[0]?.image_url;
                        const sku = item.product_variants?.sku_variant || product?.sku;

                        return (
                            <div key={item.id} className="flex gap-4 md:gap-6 items-start">
                                <div className="relative w-20 h-24 bg-ms-ivory border border-ms-fog rounded-sm overflow-hidden flex items-center justify-center">
                                    {mainImage ? (
                                        <img 
                                            src={mainImage} 
                                            alt={item.product_name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[10px] text-ms-stone font-medium uppercase tracking-wider">No Image</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-medium text-ms-black">{item.product_name}</h4>
                                        <span className="font-medium">S/. {(item.subtotal || (item.unit_price * item.quantity)).toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-ms-stone space-y-0.5">
                                        <p>Cant: {item.quantity}{item.variant_details && ` · ${item.variant_details}`}</p>
                                        {sku && <p className="text-[10px] font-mono text-ms-silver uppercase tracking-tight">SKU: {sku}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-ms-ivory/30 p-6 border-t border-ms-fog grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-medium text-sm mb-2">{dict.cart?.summary?.shipping || 'Dirección de Envío'}</h4>
                        <div className="text-sm text-ms-stone space-y-1">
                            {shippingAddress ? (
                                <>
                                    <p>{shippingAddress.address || shippingAddress.address_line1}</p>
                                    <p>{shippingAddress.city}{shippingAddress.district ? `, ${shippingAddress.district}` : ''}</p>
                                    <p>{shippingAddress.country || 'Perú'}</p>
                                    {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                                    <p className="mt-2 text-ms-black">{shippingAddress.phone}</p>
                                </>
                            ) : (
                                <p className="italic text-ms-stone">No address found</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-2">{dict.cart?.summary?.title || 'Resumen del Pedido'}</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-ms-stone">{dict.cart?.summary?.subtotal || 'Subtotal'}</span>
                                <span className="font-medium">S/. {(order.total_amount / 1.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ms-stone">{dict.cart?.summary?.shipping || 'Envío'}</span>
                                <span className="font-medium">S/. {shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-ms-stone">IGV (18%)</span>
                                <span className="font-medium text-ms-silver">S/. {(order.total_amount - (order.total_amount / 1.18)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-ms-fog">
                                <span className="font-bold">{dict.cart?.summary?.total || 'Total'}</span>
                                <span className="font-bold">S/. {order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
