'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ordersApi, Order, OrderItem } from '@/lib/api/orders';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Printer } from 'lucide-react';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const dict = useAdminDictionary();
    const detailsDict = (dict as any).orderDetails || {
        backToOrders: "Back to Orders",
        printInvoice: "Print Invoice",
        orderNumber: "Order #",
        customer: "Customer",
        guest: "Guest (Guest Order)",
        customerId: "Customer ID",
        shippingAddress: "Shipping Address",
        noAddress: "No address info",
        product: "Product",
        qty: "Qty",
        price: "Price",
        total: "Total",
        noItems: "No items found",
        subtotal: "Subtotal",
        igv: "IGV (18%)",
        orderNotFound: "Order not found"
    };

    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await ordersApi.getById(params.id);
                setOrder(orderData);
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
    if (!order) return <div className="p-8 text-center">{detailsDict.orderNotFound}</div>;

    // Support both stringified and object shipping address
    const shippingAddress = order.shipping_address 
        ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address)
        : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <style jsx global>{`
                @media print {
                    @page { margin: 15mm; }
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .ml-64 { margin-left: 0 !important; } /* Remove sidebar margin in admin layout */
                    header, .ms-account-sidebar, aside { display: none !important; }
                    .bg-ms-white { border: none !important; padding: 0 !important; }
                    .border { border: 1px solid #e5e7eb !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="no-print flex items-center justify-between">
                <Button variant="text" onClick={() => router.back()} className="gap-2 pl-0">
                    <ArrowLeft className="w-4 h-4" /> {detailsDict.backToOrders}
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer className="w-4 h-4" /> {detailsDict.printInvoice}
                    </Button>
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

            <div className="bg-ms-white p-8 border border-ms-fog">
                <div className="flex justify-between items-start mb-8 border-b border-ms-fog pb-8">
                    <div>
                        <h1 className="text-2xl font-serif mb-1">{detailsDict.orderNumber}{order.order_number}</h1>
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
                        <h3 className="text-sm font-medium uppercase tracking-wide text-ms-stone mb-2">{detailsDict.customer}</h3>
                        <p className="font-medium">
                            {order.customer_id ? `${detailsDict.customerId}: ${order.customer_id.substring(0, 8)}...` : detailsDict.guest}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium uppercase tracking-wide text-ms-stone mb-2">{detailsDict.shippingAddress}</h3>
                        <div className="text-sm">
                            {shippingAddress ? (
                                <>
                                    <p>{shippingAddress.address || shippingAddress.address_line1}</p>
                                    <p>{shippingAddress.city}{shippingAddress.district ? `, ${shippingAddress.district}` : ''}, {shippingAddress.country || 'Perú'}</p>
                                    {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                                    {shippingAddress.postal_code || shippingAddress.postalCode ? (
                                        <p>{shippingAddress.postal_code || shippingAddress.postalCode}</p>
                                    ) : null}
                                    {shippingAddress.phone && <p className="mt-1 font-medium text-ms-black">{shippingAddress.phone}</p>}
                                </>
                            ) : (
                                <p className="italic text-ms-stone">{detailsDict.noAddress}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border rounded-md border-ms-fog overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-ms-ivory border-b border-ms-fog">
                            <tr>
                                <th className="p-3 w-16"></th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone">{detailsDict.product}</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">{detailsDict.qty}</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">{detailsDict.price}</th>
                                <th className="p-3 text-xs font-medium uppercase text-ms-stone text-right">{detailsDict.total}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ms-fog">
                            {items.map((item: any) => {
                                const product = item.product_variants?.products || item.products;
                                const mainImage = product?.product_images?.find((img: any) => img.is_primary)?.image_url || 
                                                  product?.product_images?.[0]?.image_url;
                                const sku = item.product_variants?.sku_variant || product?.sku;

                                return (
                                    <tr key={item.id}>
                                        <td className="p-3">
                                            <div className="w-12 h-16 bg-ms-ivory border border-ms-fog rounded overflow-hidden flex items-center justify-center">
                                                {mainImage ? (
                                                    <img src={mainImage} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-[8px] text-ms-silver">NO IMG</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <p className="font-medium text-ms-black">{item.product_name}</p>
                                            <p className="text-xs text-ms-stone">
                                                {item.variant_details || 'N/A'}
                                            </p>
                                            {sku && (
                                                <p className="text-[10px] font-mono text-ms-silver mt-1 uppercase">SKU: {sku}</p>
                                            )}
                                        </td>
                                        <td className="p-3 text-right">{item.quantity}</td>
                                        <td className="p-3 text-right">S/. {item.unit_price.toFixed(2)}</td>
                                        <td className="p-3 text-right">S/. {(item.subtotal || (item.unit_price * item.quantity)).toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            {items.length === 0 && (
                                <tr><td colSpan={5} className="p-4 text-center">{detailsDict.noItems}</td></tr>
                            )}
                        </tbody>
                        <tfoot className="bg-ms-ivory/50">
                            <tr>
                                <td colSpan={3} className="p-3 text-right font-medium">{detailsDict.subtotal}</td>
                                <td className="p-3 text-right">S/. {(order.total_amount / 1.18).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="p-3 text-right font-medium">{detailsDict.igv}</td>
                                <td className="p-3 text-right">S/. {(order.total_amount - (order.total_amount / 1.18)).toFixed(2)}</td>
                            </tr>
                            <tr className="border-t border-ms-fog">
                                <td colSpan={3} className="p-3 text-right font-bold">{detailsDict.total}</td>
                                <td className="p-3 text-right font-bold">S/. {order.total_amount.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </div>
        </div>
    );
}
