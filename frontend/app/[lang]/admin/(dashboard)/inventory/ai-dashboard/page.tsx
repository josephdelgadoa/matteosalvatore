'use client';

import React, { useEffect, useState } from 'react';
import { storesApi, inventoryApi, Store } from '@/lib/api/stores';
import { productsApi, Product } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { RefreshCw, PackageOpen, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function AiInventoryDashboard() {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [inventory, setInventory] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [storesData, productsData] = await Promise.all([
                storesApi.getAll(),
                productsApi.getAll({ limit: 200 })
            ]);
            setStores(storesData);
            setProducts(productsData);
            if (storesData.length > 0) {
                setSelectedStoreId(storesData[0].id);
            }
        } catch (err) {
            console.error('Error loading API data', err);
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
            console.error('Error loading inventory', err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadInventory();
    }, [selectedStoreId]);

    const [viewMode, setViewMode] = useState<'product' | 'category' | 'subcategory'>('product');
    const [productViewType, setProductViewType] = useState<'total' | 'variant' | 'color' | 'size'>('total');
 
    // Aggregate inventory by product
    const productTotalData = products.map(product => {
        let totalQty = 0;
        product.product_variants?.forEach(variant => {
            const item = inventory.find(i => i.variant_id === variant.id);
            totalQty += item?.quantity || 0;
        });
 
        const pName = product.short_name_es || product.name_es;
        const displayName = pName.length > 25 ? pName.substring(0, 22) + '...' : pName;
 
        return {
            name: displayName,
            fullName: pName,
            category: product.category,
            subcategory: product.subcategory,
            quantity: totalQty,
            status: totalQty === 0 ? 'Out of Stock' : totalQty < 10 ? 'Low Stock' : 'In Stock'
        };
    }).sort((a, b) => b.quantity - a.quantity);
 
    // Aggregate inventory by color and size (variant)
    const variantData = products.flatMap(product => 
        (product.product_variants || []).map(v => {
            const item = inventory.find(i => i.variant_id === v.id);
            const qty = item?.quantity || 0;
            const pName = product.short_name_es || product.name_es;
            const variantLabel = `${pName} (${v.color} - ${v.size})`;
            const compactLabel = `${pName.split(' ')[0]}.. (${v.color.substring(0,3)} - ${v.size})`;
 
            return {
                name: compactLabel,
                fullName: variantLabel,
                quantity: qty,
                status: qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock'
            };
        })
    ).sort((a, b) => b.quantity - a.quantity).slice(0, 40); // Limit to top 40 to avoid crowding
 
    // Aggregate inventory by color
    const colorGroupedData = products.flatMap(product => {
        const pName = product.short_name_es || product.name_es;
        const colors = new Map<string, number>();
        
        product.product_variants?.forEach(v => {
            const item = inventory.find(i => i.variant_id === v.id);
            colors.set(v.color, (colors.get(v.color) || 0) + (item?.quantity || 0));
        });
 
        return Array.from(colors.entries()).map(([color, qty]) => ({
            name: `${pName.split(' ')[0]}.. (${color})`,
            fullName: `${pName} (${color})`,
            quantity: qty,
            status: qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock'
        }));
    }).sort((a, b) => b.quantity - a.quantity).slice(0, 40);
 
    // Aggregate inventory by size
    const sizeGroupedData = products.flatMap(product => {
        const pName = product.short_name_es || product.name_es;
        const sizes = new Map<string, number>();
        
        product.product_variants?.forEach(v => {
            const item = inventory.find(i => i.variant_id === v.id);
            sizes.set(v.size, (sizes.get(v.size) || 0) + (item?.quantity || 0));
        });
 
        return Array.from(sizes.entries()).map(([size, qty]) => ({
            name: `${pName.split(' ')[0]}.. (${size})`,
            fullName: `${pName} (${size})`,
            quantity: qty,
            status: qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock'
        }));
    }).sort((a, b) => b.quantity - a.quantity).slice(0, 40);
 
    // Aggregate inventory by category
    const categoryMap = new Map<string, number>();
    productTotalData.forEach(item => {
        const cat = item.category || 'Sin Categoría';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.quantity);
    });
 
    const categoryData = Array.from(categoryMap.entries()).map(([cat, qty]) => ({
        name: cat,
        fullName: `Categoría: ${cat}`,
        quantity: qty,
        status: qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock'
    })).sort((a, b) => b.quantity - a.quantity);
 
    // Aggregate inventory by subcategory
    const subcategoryMap = new Map<string, number>();
    productTotalData.forEach(item => {
        const subcat = item.subcategory || 'Sin Subcategoría';
        subcategoryMap.set(subcat, (subcategoryMap.get(subcat) || 0) + item.quantity);
    });
 
    const subcategoryData = Array.from(subcategoryMap.entries()).map(([subcat, qty]) => ({
        name: subcat,
        fullName: `Subcategoría: ${subcat}`,
        quantity: qty,
        status: qty === 0 ? 'Out of Stock' : qty < 10 ? 'Low Stock' : 'In Stock'
    })).sort((a, b) => b.quantity - a.quantity);
 
    const activeData = viewMode === 'category' ? categoryData : 
                     viewMode === 'subcategory' ? subcategoryData : 
                     (productViewType === 'total' ? productTotalData : 
                      productViewType === 'variant' ? variantData : 
                      productViewType === 'color' ? colorGroupedData : sizeGroupedData);

    // Top metrics calculations
    const totalInventoryUnits = productTotalData.reduce((acc, curr) => acc + curr.quantity, 0);
    const lowStockItems = productTotalData.filter(item => item.quantity > 0 && item.quantity <= 10).length;
    const outOfStockItems = productTotalData.filter(item => item.quantity === 0).length;

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-ms-white border border-ms-fog shadow-lg p-4 rounded-md">
                    <p className="font-serif font-medium text-ms-black mb-2">{payload[0].payload.fullName}</p>
                    <p className="text-sm font-bold text-ms-brand-primary">Stock Total: {payload[0].value} unidades</p>
                    <p className={`text-xs mt-1 ${payload[0].value < 10 ? 'text-red-500' : 'text-green-600'}`}>
                        {payload[0].payload.status}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-ms-fog pb-6">
                <div>
                    <h1 className="ms-heading-2">AI Inventory Dashboard</h1>
                    <p className="text-ms-stone mt-2 text-sm">Visualización predictiva y análisis cuantitativo de mercadería por tienda.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <select
                        className="ms-input h-10 px-4 py-0 min-w-[200px]"
                        value={selectedStoreId}
                        onChange={e => setSelectedStoreId(e.target.value)}
                    >
                        {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                    <Button variant="outline" onClick={loadInventory}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refrescar Datos
                    </Button>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-ms-white border border-ms-fog p-6 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="bg-ms-brand-primary/10 p-3 rounded-full mb-4">
                        <PackageOpen className="w-6 h-6 text-ms-brand-primary" />
                    </div>
                    <span className="text-3xl font-serif font-medium">{totalInventoryUnits}</span>
                    <span className="text-ms-stone text-xs uppercase tracking-widest mt-1">Unidades Totales</span>
                </div>
                
                <div className="bg-ms-white border border-ms-fog p-6 flex flex-col items-center justify-center text-center shadow-sm border-b-4 border-b-green-500">
                    <div className="bg-green-50 p-3 rounded-full mb-4">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-3xl font-serif font-medium">{products.length}</span>
                    <span className="text-ms-stone text-xs uppercase tracking-widest mt-1">Modelos Activos</span>
                </div>

                <div className="bg-ms-white border border-ms-fog p-6 flex flex-col items-center justify-center text-center shadow-sm border-b-4 border-b-red-500">
                    <div className="bg-red-50 p-3 rounded-full mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <span className="text-3xl font-serif font-medium">{lowStockItems + outOfStockItems}</span>
                    <span className="text-ms-stone text-xs uppercase tracking-widest mt-1">En Alerta de Stock</span>
                </div>
            </div>

            {/* Dynamic Graph */}
            <div className="bg-ms-white border border-ms-fog p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex bg-ms-ivory p-1 rounded-md border border-ms-fog">
                            <button 
                                className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${viewMode === 'category' ? 'bg-ms-white shadow-sm border border-ms-fog text-ms-black' : 'text-ms-stone hover:text-ms-black'}`}
                                onClick={() => setViewMode('category')}
                            >
                                Categoría
                            </button>
                            <button 
                                className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${viewMode === 'subcategory' ? 'bg-ms-white shadow-sm border border-ms-fog text-ms-black' : 'text-ms-stone hover:text-ms-black'}`}
                                onClick={() => setViewMode('subcategory')}
                            >
                                Subcategoría
                            </button>
                            <button 
                                className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${viewMode === 'product' ? 'bg-ms-white shadow-sm border border-ms-fog text-ms-black' : 'text-ms-stone hover:text-ms-black'}`}
                                onClick={() => setViewMode('product')}
                            >
                                Producto
                            </button>
                        </div>
                        
                        {viewMode === 'product' && (
                            <div className="flex bg-ms-pearl/50 p-1 rounded-md border border-ms-fog text-[10px] animate-in fade-in slide-in-from-top-1">
                                <button 
                                    className={`px-3 py-1 rounded transition-colors ${productViewType === 'total' ? 'bg-ms-white shadow-xs text-ms-black font-semibold' : 'text-ms-stone hover:text-ms-black'}`}
                                    onClick={() => setProductViewType('total')}
                                >
                                    Total
                                </button>
                                <button 
                                    className={`px-3 py-1 rounded transition-colors ${productViewType === 'variant' ? 'bg-ms-white shadow-xs text-ms-black font-semibold' : 'text-ms-stone hover:text-ms-black'}`}
                                    onClick={() => setProductViewType('variant')}
                                >
                                    Color y Talla
                                </button>
                                <button 
                                    className={`px-3 py-1 rounded transition-colors ${productViewType === 'color' ? 'bg-ms-white shadow-xs text-ms-black font-semibold' : 'text-ms-stone hover:text-ms-black'}`}
                                    onClick={() => setProductViewType('color')}
                                >
                                    Por Color
                                </button>
                                <button 
                                    className={`px-3 py-1 rounded transition-colors ${productViewType === 'size' ? 'bg-ms-white shadow-xs text-ms-black font-semibold' : 'text-ms-stone hover:text-ms-black'}`}
                                    onClick={() => setProductViewType('size')}
                                >
                                    Por Talla
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={activeData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end" 
                                height={100} 
                                interval={0}
                                tick={{ fontSize: 11, fill: '#6B7280' }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar 
                                dataKey="quantity" 
                                name="Stock Disponible" 
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                                animationEasing="ease-out"
                            >
                                {activeData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.quantity === 0 ? '#EF4444' : entry.quantity < 10 ? '#F59E0B' : '#000000'} 
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex gap-6 mt-8 justify-center text-xs text-ms-stone">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black"></div> Stock Saludable</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500"></div> Stock Bajo (&lt;10)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500"></div> Agotado</div>
                </div>
            </div>
        </div>
    );
}
