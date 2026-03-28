'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ordersApi, Order, OrderItem } from '@/lib/api/orders';
import { storesApi, Store } from '@/lib/api/stores';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, Printer, Package, Truck, CheckCircle, Info, MapPin, Phone, Hash } from 'lucide-react';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { addToast } = useToast();
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
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fulfillment State
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [courierName, setCourierName] = useState<string>('');
    const [courierPhone, setCourierPhone] = useState<string>('');
    const [courierAddress, setCourierAddress] = useState<string>('');
    const [trackingCode, setTrackingCode] = useState<string>('');

    const COURIERS = [
        { name: 'Courier 1 (Olva)', phone: '+51 999 888 777', address: 'Av. Principal 123, Lima' },
        { name: 'Courier 2 (Shalom)', phone: '+51 988 777 666', address: 'Jr. Los Cedros 456, Gamarra' },
        { name: 'Courier 3 (Scharff)', phone: '+51 977 666 555', address: 'Calle Las Orquideas 789, San Borja' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderData, storesData] = await Promise.all([
                    ordersApi.getById(params.id),
                    storesApi.getAll()
                ]);
                setOrder(orderData);
                setStores(storesData);
                if (orderData.order_items) setItems(orderData.order_items);
                if (orderData.fulfillment_store_id) setSelectedStoreId(orderData.fulfillment_store_id);
                if (orderData.courier_name) setCourierName(orderData.courier_name);
                if (orderData.courier_phone) setCourierPhone(orderData.courier_phone);
                if (orderData.courier_address) setCourierAddress(orderData.courier_address);
                if (orderData.tracking_number) setTrackingCode(orderData.tracking_number);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    const handleFulfillmentStatus = async (status: 'preparing' | 'ready_for_shipping') => {
        if (!selectedStoreId) {
            addToast('Por favor selecciona una tienda para surtir el pedido', 'error');
            return;
        }
        setIsUpdating(true);
        try {
            const updated = await ordersApi.updateFulfillment(params.id, selectedStoreId, status);
            setOrder(updated);
            addToast(status === 'preparing' ? 'Pedido en preparación. Inventario actualizado y correo enviado.' : 'Pedido listo para envío', 'success');
        } catch (err) {
            addToast('Error al actualizar fulfillment', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleShippingDispatch = async () => {
        if (!courierName || !trackingCode) {
            addToast('Faltan datos del courier o código de seguimiento', 'error');
            return;
        }
        setIsUpdating(true);
        try {
            const courier = COURIERS.find(c => c.name === courierName) || { phone: courierPhone, address: courierAddress };
            const updated = await ordersApi.updateShipping(params.id, {
                courier_name: courierName,
                courier_phone: courier.phone,
                courier_address: courier.address,
                tracking_code: trackingCode
            });
            setOrder(updated);
            addToast('Pedido despachado. Cliente notificado por correo.', 'success');
        } catch (err) {
            addToast('Error al procesar el envío', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
    if (!order) return <div className="p-8 text-center">{detailsDict.orderNotFound}</div>;

    const shippingAddress = order.shipping_address 
        ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address)
        : null;

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            <ToastContainer />
            <style jsx global>{`
                @media print {
                    @page { margin: 15mm; }
                    body { background: white !important; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .lg\\:grid-cols-3 { grid-template-columns: 1fr !important; }
                    .ml-64 { margin-left: 0 !important; }
                    header, .ms-account-sidebar, aside { display: none !important; }
                }
                .print-only { display: none; }
            `}</style>

            <div className="lg:col-span-2 space-y-8">
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
                
                <div className="bg-ms-white p-8 border border-ms-fog shadow-sm">
                    {/* Invoice Content */}
                    <div className="flex justify-between items-start mb-8 border-b border-ms-fog pb-8">
                        <div>
                            <h1 className="text-2xl font-serif mb-1">{detailsDict.orderNumber}{order.order_number}</h1>
                            <p className="text-ms-stone text-sm">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                order.status === 'paid' ? "bg-ms-success/10 text-ms-success border-ms-success/20" : "bg-ms-pearl text-ms-stone border-ms-fog"
                            )}>
                                {order.status}
                            </span>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                order.shipping_status === 'shipped' ? "bg-ms-black text-ms-white border-ms-black" : 
                                order.shipping_status === 'ready_for_shipping' ? "bg-ms-success text-ms-white border-ms-success" :
                                order.shipping_status === 'preparing' ? "bg-ms-brand-primary/10 text-ms-brand-primary border-ms-brand-primary/20" :
                                "bg-ms-ivory text-ms-stone border-ms-fog"
                            )}>
                                Envío: {
                                    order.shipping_status === 'shipped' ? 'En Tránsito' : 
                                    order.shipping_status === 'ready_for_shipping' ? 'Listo' : 
                                    order.shipping_status === 'preparing' ? 'Preparando' : 
                                    'Pendiente'
                                }
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ms-stone mb-2">{detailsDict.customer}</h3>
                            <p className="font-serif">
                                {order.customer_id ? `${detailsDict.customerId}: ${order.customer_id.substring(0, 8)}...` : detailsDict.guest}
                            </p>
                            <p className="text-sm text-ms-stone mt-1">{order.email}</p>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-ms-stone mb-2">{detailsDict.shippingAddress}</h3>
                            <div className="text-sm">
                                {shippingAddress ? (
                                    <>
                                        <p className="font-medium text-ms-black">{shippingAddress.address || shippingAddress.address_line1}</p>
                                        <p>{shippingAddress.city}{shippingAddress.district ? `, ${shippingAddress.district}` : ''}, {shippingAddress.country || 'Perú'}</p>
                                        {shippingAddress.apartment && <p className="text-ms-stone">{shippingAddress.apartment}</p>}
                                        {shippingAddress.phone && <p className="mt-2 font-mono text-[11px] text-ms-stone">{shippingAddress.phone}</p>}
                                    </>
                                ) : (
                                    <p className="italic text-ms-stone">{detailsDict.noAddress}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border border-ms-fog overflow-hidden rounded-xl">
                        <table className="w-full text-left">
                            <thead className="bg-ms-ivory/50 border-b border-ms-fog">
                                <tr>
                                    <th className="p-4 w-16"></th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-ms-stone">{detailsDict.product}</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-ms-stone text-right">{detailsDict.qty}</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-ms-stone text-right">{detailsDict.price}</th>
                                    <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-ms-stone text-right">{detailsDict.total}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ms-fog">
                                {items.map((item: any) => {
                                    const productDetail = item.product_variants?.products || item.products;
                                    const mainImage = productDetail?.product_images?.find((img: any) => img.is_primary)?.image_url || 
                                                      productDetail?.product_images?.[0]?.image_url;
                                    
                                    return (
                                        <tr key={item.id} className="hover:bg-ms-ivory/20 transition-colors">
                                            <td className="p-4">
                                                <div className="w-14 h-20 bg-ms-ivory border border-ms-fog rounded-lg overflow-hidden shrink-0">
                                                    {mainImage ? <img src={mainImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] opacity-30">NO IMG</div>}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-serif text-sm">{productDetail?.short_name_es || item.product_name}</p>
                                                <p className="text-[10px] text-ms-stone font-bold uppercase tracking-tighter mt-1">{item.variant_details}</p>
                                            </td>
                                            <td className="p-4 text-right text-sm font-medium">{item.quantity}</td>
                                            <td className="p-4 text-right text-sm">S/. {item.unit_price.toFixed(2)}</td>
                                            <td className="p-4 text-right text-sm font-medium">S/. {(item.subtotal || (item.unit_price * item.quantity)).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="bg-ms-ivory/20">
                                <tr className="border-t border-ms-fog">
                                    <td colSpan={3} className="p-4 text-right text-xs font-medium text-ms-stone">{detailsDict.subtotal}</td>
                                    <td className="p-4 text-right text-sm font-medium">S/. {(order.total_amount / 1.18).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="p-4 text-right text-xs font-medium text-ms-stone">{detailsDict.igv}</td>
                                    <td className="p-4 text-right text-sm font-medium">S/. {(order.total_amount - (order.total_amount / 1.18)).toFixed(2)}</td>
                                </tr>
                                <tr className="border-t border-ms-fog bg-ms-ivory/40">
                                    <td colSpan={3} className="p-4 text-right text-sm font-bold uppercase tracking-widest">Total Pay</td>
                                    <td className="p-4 text-right text-lg font-serif">S/. {order.total_amount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Logistics Sidebar */}
            <div className="no-print space-y-8">
                <div className="bg-ms-white border border-ms-fog p-6 shadow-sm rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-ms-black" />
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="w-5 h-5 text-ms-black" />
                        <h2 className="font-serif text-xl">Surtido & Fulfillment</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ms-stone mb-2 block">1. Tienda de Salida</label>
                            <select 
                                className="ms-input w-full h-12 py-2 bg-ms-ivory/50 border-ms-fog text-ms-black"
                                value={selectedStoreId}
                                onChange={e => setSelectedStoreId(e.target.value)}
                                disabled={order.shipping_status === 'shipped'}
                            >
                                <option value="">Seleccionar Tienda...</option>
                                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                variant={order.shipping_status === 'preparing' ? 'primary' : 'outline'}
                                className="h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                                onClick={() => handleFulfillmentStatus('preparing')}
                                disabled={isUpdating || order.shipping_status === 'shipped' || order.shipping_status === 'preparing'}
                            >
                                <CheckCircle className={cn("w-4 h-4 mr-2", order.shipping_status === 'preparing' && "text-ms-brand-primary")} />
                                Preparar
                            </Button>
                            <Button 
                                variant={order.shipping_status === 'ready_for_shipping' ? 'primary' : 'outline'}
                                className="h-12 text-[10px] font-bold uppercase tracking-widest rounded-xl"
                                onClick={() => handleFulfillmentStatus('ready_for_shipping')}
                                disabled={isUpdating || order.shipping_status === 'pending' || order.shipping_status === 'shipped' || order.shipping_status === 'ready_for_shipping'}
                            >
                                <Truck className={cn("w-4 h-4 mr-2", order.shipping_status === 'ready_for_shipping' && "text-ms-brand-primary")} />
                                Listo
                            </Button>
                        </div>

                        {order.shipping_status === 'preparing' && (
                            <div className="p-4 bg-ms-brand-primary/5 border border-ms-brand-primary/10 rounded-xl flex gap-3">
                                <Info className="w-4 h-4 text-ms-brand-primary shrink-0 mt-0.5" />
                                <p className="text-[11px] leading-relaxed text-ms-black/70">Asignado a <b>{stores.find(s=>s.id === selectedStoreId)?.name}</b>. Las unidades se han descontado del stock automáticamente.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "bg-ms-white border border-ms-fog p-6 shadow-sm rounded-2xl transition-all",
                    order.shipping_status === 'pending' || order.shipping_status === 'preparing' ? "opacity-50 pointer-events-none grayscale" : "opacity-100"
                )}>
                    <div className="flex items-center gap-3 mb-6">
                        <Truck className="w-5 h-5 text-ms-black" />
                        <h2 className="font-serif text-xl">Gestión de Envío</h2>
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ms-stone mb-2 block">Empresa Courier</label>
                                <select 
                                    className="ms-input w-full h-12 py-2 bg-ms-ivory/50 text-ms-black"
                                    value={courierName}
                                    onChange={e => setCourierName(e.target.value)}
                                    disabled={order.shipping_status === 'shipped'}
                                >
                                    <option value="">Seleccionar Courier...</option>
                                    {COURIERS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ms-stone mb-2 block">Código Tracking</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-3.5 w-4 h-4 text-ms-stone" />
                                    <input 
                                        type="text"
                                        className="ms-input w-full h-12 py-2 pl-10 uppercase font-mono text-[11px] text-ms-black"
                                        placeholder="MS-XXXXX"
                                        value={trackingCode}
                                        onChange={e => setTrackingCode(e.target.value)}
                                        disabled={order.shipping_status === 'shipped'}
                                    />
                                </div>
                            </div>
                        </div>

                        {courierName && (
                            <div className="p-4 bg-ms-ivory rounded-xl space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-ms-stone">
                                    <Phone className="w-3 h-3" /> {COURIERS.find(c=>c.name===courierName)?.phone}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-ms-stone">
                                    <MapPin className="w-3 h-3" /> {COURIERS.find(c=>c.name===courierName)?.address}
                                </div>
                            </div>
                        )}

                        <Button 
                            className="w-full h-14 rounded-2xl shadow-lg hover:shadow-ms-black/10"
                            variant={order.shipping_status === 'shipped' ? 'outline' : 'primary'}
                            onClick={handleShippingDispatch}
                            disabled={isUpdating || order.shipping_status === 'shipped'}
                        >
                            {order.shipping_status === 'shipped' ? (
                                <span className="flex items-center gap-2 uppercase text-[10px] tracking-widest">
                                    <CheckCircle className="w-4 h-4 text-ms-success" /> Paquete Despachado
                                </span>
                            ) : (
                                <span className="uppercase text-[10px] tracking-widest">Actualizar y Notificar Envío</span>
                            )}
                        </Button>
                    </div>
                </div>

                {order.shipping_status === 'shipped' && (
                    <div className="bg-ms-black text-ms-white p-6 rounded-2xl border border-ms-black shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-5 h-5 text-ms-brand-primary" />
                            <h3 className="font-serif text-lg">Reporte de Entrega</h3>
                        </div>
                        <div className="space-y-3 text-[11px] opacity-80">
                            <p className="flex justify-between"><span>Despachado:</span> <span>{order.shipped_at ? new Date(order.shipped_at).toLocaleString() : '-'}</span></p>
                            <p className="flex justify-between"><span>Tracking:</span> <span className="font-mono text-ms-brand-primary">{order.tracking_number}</span></p>
                            <p className="flex justify-between"><span>Courier:</span> <span>{order.courier_name}</span></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

