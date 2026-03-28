'use client';
 
import React, { useEffect, useState, useMemo } from 'react';
import { storesApi, inventoryApi, posApi, Store } from '@/lib/api/stores';
import { productsApi, Product } from '@/lib/api/products';
import { Button } from '@/components/ui/Button';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { Search, ShoppingCart, Trash, CheckCircle, Plus, Minus, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
 
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
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
    const { addToast } = useToast();
 
    // Touch-first selection states
    const [posStep, setPosStep] = useState<'products' | 'color' | 'size'>('products');
    const [selectingProduct, setSelectingProduct] = useState<Product | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
 
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
 
    const addToCart = (variant: any, product: Product) => {
        const inventoryItem = inventory.find(i => i.variant_id === variant.id);
        const stock = inventoryItem?.quantity || 0;
        
        if (stock <= 0) {
            addToast('Sin stock disponible', 'error');
            return;
        }
 
        const existing = cart.find(c => c.variant_id === variant.id);
        if (existing) {
            if (existing.quantity >= stock) {
                addToast('No hay más stock disponible', 'error');
                return;
            }
            setCart(cart.map(c => c.variant_id === variant.id ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, {
                variant_id: variant.id,
                product_name: product.short_name_es || product.name_es,
                size: variant.size,
                color: variant.color,
                quantity: 1,
                unit_price: product.base_price,
                stock: stock
            }]);
        }
        
        setSelectingProduct(null);
        setSelectedColor(null);
        setPosStep('products');
        addToast('Añadido al carrito', 'success');
    };
 
    const removeFromCart = (variantId: string) => {
        setCart(cart.filter(c => c.variant_id !== variantId));
    };
 
    const updateQuantity = (variantId: string, delta: number) => {
        setCart(prev => prev.map(c => {
            if (c.variant_id === variantId) {
                const newQty = Math.max(1, Math.min(c.stock, c.quantity + delta));
                return { ...c, quantity: newQty };
            }
            return c;
        }));
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
 
    const filteredProducts = products.filter(p => 
        (p.short_name_es || p.name_es).toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
 
    const availableColors = useMemo(() => {
        if (!selectingProduct) return [];
        return Array.from(new Set(selectingProduct.product_variants?.map(v => v.color) || []));
    }, [selectingProduct]);
 
    const availableSizes = useMemo(() => {
        if (!selectingProduct || !selectedColor) return [];
        return selectingProduct.product_variants?.filter(v => v.color === selectedColor) || [];
    }, [selectingProduct, selectedColor]);
 
    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
 
    return (
        <div className="flex flex-col h-[calc(100vh-140px)] -mt-4 overflow-hidden bg-ms-ivory/10">
            <ToastContainer />
            
            {/* Header */}
            <div className="flex justify-between items-center bg-ms-white p-4 border-b border-ms-fog z-10">
                <div className="flex items-center gap-6">
                    <h1 className="ms-heading-4 text-ms-black font-serif italic">M S <span className="text-xs uppercase tracking-[0.3em] font-sans not-italic ml-2 opacity-50">Terminal</span></h1>
                    <select
                        className="ms-input h-9 py-0 text-xs min-w-[180px] bg-ms-ivory border-transparent"
                        value={selectedStoreId}
                        onChange={e => { setSelectedStoreId(e.target.value); setCart([]); }}
                    >
                        {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-ms-black px-4 py-2 rounded-full text-ms-white font-serif text-lg">
                        S/. {totalAmount.toFixed(2)}
                    </div>
                </div>
            </div>
 
            <div className="flex flex-1 overflow-hidden">
                {/* Selection Area */}
                <div className="flex-1 relative bg-ms-ivory/5 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {posStep === 'products' ? (
                            <motion.div 
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 space-y-6"
                            >
                                <div className="bg-ms-white p-4 border border-ms-fog shadow-sm rounded-2xl flex items-center gap-4 max-w-xl mx-auto focus-within:ring-1 focus-within:ring-ms-black transition-all">
                                    <Search className="w-5 h-5 text-ms-stone" />
                                    <input
                                        className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium"
                                        placeholder="Buscar por prenda..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
 
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                                    {filteredProducts.map(product => {
                                        const imageUrl = product.product_images?.[1]?.image_url || product.product_images?.[0]?.image_url || '';
                                        return (
                                            <motion.div
                                                whileTap={{ scale: 0.95 }}
                                                key={product.id}
                                                className="bg-ms-white border border-ms-fog rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col"
                                                onClick={() => {
                                                    setSelectingProduct(product);
                                                    setPosStep('color');
                                                }}
                                            >
                                                <div className="aspect-[3/4] relative bg-ms-ivory/50">
                                                    {imageUrl ? (
                                                        <Image 
                                                            src={imageUrl} 
                                                            alt={product.name_es}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, 25vw"
                                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-ms-stone uppercase tracking-widest">Sin Imagen</div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex flex-col items-center text-center">
                                                    <div className="font-serif text-sm text-ms-black leading-tight mb-1">
                                                        {product.short_name_es || product.name_es}
                                                    </div>
                                                    <div className="text-[10px] text-ms-stone font-bold uppercase tracking-widest">S/. {product.base_price}</div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="selection-flow"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute inset-0 bg-ms-white z-20 flex flex-col"
                            >
                                <div className="p-6 border-b border-ms-fog flex justify-between items-center bg-ms-ivory/20">
                                    <button 
                                        onClick={() => {
                                            if (posStep === 'size') { setPosStep('color'); setSelectedColor(null); }
                                            else setPosStep('products');
                                        }}
                                        className="flex items-center gap-2 text-ms-stone hover:text-ms-black transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Volver</span>
                                    </button>
                                    <h2 className="font-serif text-xl">{selectingProduct?.short_name_es || selectingProduct?.name_es}</h2>
                                    <button onClick={() => { setPosStep('products'); setSelectingProduct(null); }} className="text-ms-stone">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
 
                                <div className="flex-1 p-10 overflow-auto">
                                    {posStep === 'color' && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-4xl mx-auto">
                                            <div className="text-center">
                                                <h3 className="text-ms-stone uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Paso 1</h3>
                                                <p className="font-serif text-2xl">Seleccionar Color</p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                {availableColors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => { setSelectedColor(color); setPosStep('size'); }}
                                                        className="aspect-square rounded-3xl border border-ms-fog hover:border-ms-black hover:shadow-xl transition-all text-sm font-bold uppercase tracking-widest flex items-center justify-center bg-ms-white active:scale-95"
                                                    >
                                                        {color}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
 
                                    {posStep === 'size' && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-4xl mx-auto">
                                            <div className="text-center">
                                                <h3 className="text-ms-stone uppercase tracking-[0.2em] text-[10px] font-bold mb-2">Paso 2 — Color: {selectedColor}</h3>
                                                <p className="font-serif text-2xl">Seleccionar Talla</p>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                {availableSizes.map(variant => {
                                                    const stockItem = inventory.find(i => i.variant_id === variant.id);
                                                    const stock = stockItem?.quantity || 0;
                                                    return (
                                                        <button
                                                            key={variant.id}
                                                            disabled={stock <= 0}
                                                            onClick={() => addToCart(variant, selectingProduct!)}
                                                            className={cn(
                                                                "h-32 rounded-3xl border transition-all flex flex-col items-center justify-center shadow-sm active:scale-95",
                                                                stock > 0 
                                                                ? "border-ms-fog hover:border-ms-black hover:bg-ms-black hover:text-ms-white" 
                                                                : "border-dashed border-ms-fog opacity-30 cursor-not-allowed"
                                                            )}
                                                        >
                                                            <span className="text-2xl font-serif">{variant.size}</span>
                                                            <span className="text-[10px] uppercase font-bold tracking-widest mt-2">{stock} DISP.</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
 
                {/* Sidebar */}
                <div className="w-[420px] border-l border-ms-fog bg-ms-white flex flex-col shadow-2xl z-30">
                    <div className="p-6 border-b border-ms-fog flex justify-between items-center bg-ms-black text-ms-white">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5 text-ms-brand-primary" />
                            <span className="font-serif text-lg">Bolsa de Venta</span>
                        </div>
                        <span className="bg-ms-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            {cart.length} articulos
                        </span>
                    </div>
 
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {cart.map(item => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={item.variant_id} 
                                    className="bg-ms-ivory/20 p-5 rounded-2xl border border-ms-fog/40"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="font-serif text-sm text-ms-black mb-1">{item.product_name}</div>
                                            <div className="flex gap-2">
                                                <span className="bg-ms-black text-ms-white text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{item.color}</span>
                                                <span className="bg-ms-white border border-ms-fog text-ms-black text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Talla {item.size}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.variant_id)} 
                                            className="text-ms-stone hover:text-red-600 transition-colors p-1"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center bg-ms-white border border-ms-fog rounded-xl h-10 shadow-xs overflow-hidden">
                                            <button 
                                                onClick={() => updateQuantity(item.variant_id, -1)}
                                                className="w-10 h-full flex items-center justify-center hover:bg-ms-ivory transition-colors active:bg-ms-fog"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <div className="w-8 text-center text-xs font-bold">{item.quantity}</div>
                                            <button 
                                                onClick={() => updateQuantity(item.variant_id, 1)}
                                                className="w-10 h-full flex items-center justify-center hover:bg-ms-ivory transition-colors active:bg-ms-fog"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="font-serif text-lg">
                                            S/. {(item.unit_price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {cart.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-20">
                                <ShoppingCart className="w-20 h-20 mb-6" />
                                <p className="font-serif italic text-lg text-center px-10">Agrega prendas del catálogo para comenzar la venta</p>
                            </div>
                        )}
                    </div>
 
                    <div className="p-8 border-t border-ms-fog bg-ms-ivory/10 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-ms-stone uppercase tracking-widest">Pago con</span>
                                <div className="flex gap-2 p-1 bg-ms-white border border-ms-fog rounded-xl">
                                    {(['cash', 'card'] as const).map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                                paymentMethod === method 
                                                ? "bg-ms-black text-ms-white shadow-lg" 
                                                : "text-ms-stone hover:text-ms-black"
                                            )}
                                        >
                                            {method === 'cash' ? 'Efectivo' : 'Tarjeta'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-serif text-3xl">S/. {totalAmount.toFixed(2)}</span>
                                <span className="text-[10px] font-bold text-ms-stone uppercase tracking-widest">Venta Total</span>
                            </div>
                        </div>
                        
                        <Button 
                            className="w-full h-20 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-ms-black/20" 
                            variant="primary"
                            onClick={handleCompleteSale} 
                            disabled={cart.length === 0}
                        >
                            <span className="text-lg font-serif tracking-wide flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-ms-brand-primary" /> Finalizar Venta
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
