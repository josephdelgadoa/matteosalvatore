'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { storesApi, inventoryApi, posApi, Store } from '@/lib/api/stores';
import { productsApi, Product } from '@/lib/api/products';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { Search, ShoppingCart, Trash, CheckCircle } from 'lucide-react';

interface CartItem {
    variant_id: string;
    product_name: string;
    size: string;
    color: string;
    quantity: number;
    unit_price: number;
    stock: number;
}

export default function POSPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const { addToast } = useToast();

    const loadData = async () => {
        try {
            const [storesData, productsData] = await Promise.all([
                storesApi.getAll(),
                productsApi.getAll({ limit: 100 })
            ]);
            setStores(storesData);
            setProducts(productsData);
            if (storesData.length > 0) setSelectedStoreId(storesData[0].id);
        } catch (err) {
            addToast('Error al cargar datos', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const loadInventory = async () => {
        if (!selectedStoreId) return;
        try {
            const data = await inventoryApi.getByStore(selectedStoreId);
            setInventory(data);
        } catch (err) {
            addToast('Error al cargar inventario', 'error');
        }
    };

    useEffect(() => { loadData(); }, []);
    useEffect(() => { loadInventory(); }, [selectedStoreId]);

    const addToCart = (item: any) => {
        const stock = item.inventory_item?.quantity || 0;
        if (stock <= 0) {
            addToast('Sin stock disponible en esta tienda', 'error');
            return;
        }

        const existing = cart.find(c => c.variant_id === item.id);
        if (existing) {
            if (existing.quantity >= stock) {
                addToast('No hay más stock disponible', 'error');
                return;
            }
            setCart(cart.map(c => c.variant_id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, {
                variant_id: item.id,
                product_name: item.product_name,
                size: item.size,
                color: item.color,
                quantity: 1,
                unit_price: item.price,
                stock: stock
            }]);
        }
    };

    const removeFromCart = (variantId: string) => {
        setCart(cart.filter(c => c.variant_id !== variantId));
    };

    const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0), [cart]);

    const handleCompleteSale = async () => {
        if (cart.length === 0) return;
        try {
            await posApi.createSale({
                store_id: selectedStoreId,
                items: cart.map(c => ({
                    variant_id: c.variant_id,
                    quantity: c.quantity,
                    unit_price: c.unit_price
                })),
                total_amount: totalAmount,
                payment_method: paymentMethod
            });
            addToast('Venta completada con éxito', 'success');
            setCart([]);
            loadInventory();
        } catch (err) {
            addToast('Error al procesar la venta', 'error');
        }
    };

    const availableItems = products.flatMap(p =>
        (p.product_variants || []).map(v => ({
            ...v,
            product_name: p.short_name_es || p.name_es,
            price: p.base_price,
            inventory_item: inventory.find(i => i.variant_id === v.id)
        }))
    ).filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sku_variant || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="space-y-6">
            <ToastContainer />
            <div className="flex justify-between items-center">
                <h1 className="ms-heading-2">Terminal de Venta (POS)</h1>
                <select
                    className="ms-input h-10 px-4 py-0 min-w-[200px]"
                    value={selectedStoreId}
                    onChange={e => { setSelectedStoreId(e.target.value); setCart([]); }}
                >
                    {stores.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-ms-white p-4 border border-ms-fog flex items-center gap-4">
                        <Search className="w-5 h-5 text-ms-stone" />
                        <input
                            className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableItems.map(item => (
                            <div
                                key={item.id}
                                className={`bg-ms-white p-4 border border-ms-fog cursor-pointer hover:border-ms-black transition-all ${item.inventory_item?.quantity ? '' : 'opacity-50'}`}
                                onClick={() => addToCart(item)}
                            >
                                <div className="flex justify-between font-medium">
                                    <span>{item.product_name}</span>
                                    <span>S/. {item.price}</span>
                                </div>
                                <div className="text-xs text-ms-stone mt-1">
                                    {item.size} / {item.color} • Stock: {item.inventory_item?.quantity || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shopping Cart */}
                <div className="lg:col-span-1 bg-ms-white border border-ms-fog flex flex-col h-[calc(100vh-250px)]">
                    <div className="p-4 border-b border-ms-fog bg-ms-ivory/30 flex items-center gap-2 font-medium">
                        <ShoppingCart className="w-5 h-5" /> Carrito de Venta
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.map(item => (
                            <div key={item.variant_id} className="flex justify-between items-start text-sm border-b border-ms-fog pb-2">
                                <div>
                                    <div className="font-medium">{item.product_name}</div>
                                    <div className="text-xs text-ms-stone">{item.size} / {item.color} x {item.quantity}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span>S/. {item.unit_price * item.quantity}</span>
                                    <button onClick={() => removeFromCart(item.variant_id)} className="text-red-500 hover:text-red-700">
                                        <Trash className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && <div className="text-center text-ms-stone h-full flex items-center justify-center italic">Carrito vacío</div>}
                    </div>
                    <div className="p-4 border-t border-ms-fog space-y-4">
                        <div className="flex justify-between font-serif text-xl border-b border-ms-fog pb-2">
                            <span>Total</span>
                            <span>S/. {totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-ms-stone uppercase tracking-widest">Método de Pago</label>
                            <select
                                className="ms-input w-full"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                            >
                                <option value="cash">Efectivo</option>
                                <option value="card">Tarjeta</option>
                                <option value="transfer">Transferencia</option>
                            </select>
                        </div>
                        <Button className="w-full gap-2 p-6" onClick={handleCompleteSale} disabled={cart.length === 0}>
                            <CheckCircle className="w-5 h-5" /> Finalizar Venta
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
