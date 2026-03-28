'use client';

import React, { useEffect, useState } from 'react';
import { storesApi, inventoryApi, Store } from '@/lib/api/stores';
import { productsApi, Product } from '@/lib/api/products';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { Search, RefreshCw, FileDown } from 'lucide-react';

export default function InventoryPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<string>('');
    const [inventory, setInventory] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [storesData, productsData] = await Promise.all([
                storesApi.getAll(),
                productsApi.getAll({ limit: 100 })
            ]);
            setStores(storesData);
            setProducts(productsData);
            if (storesData.length > 0) {
                setSelectedStoreId(storesData[0].id);
            }
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

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadInventory();
    }, [selectedStoreId]);

    const handleUpdateStock = async (variantId: string, currentQty: number) => {
        const newQty = prompt('Ingrese la nueva cantidad de stock:', currentQty.toString());
        if (newQty === null || isNaN(parseInt(newQty))) return;

        try {
            await inventoryApi.updateStock({
                store_id: selectedStoreId,
                variant_id: variantId,
                quantity: parseInt(newQty)
            });
            addToast('Stock actualizado', 'success');
            loadInventory();
        } catch (err) {
            addToast('Error al actualizar stock', 'error');
        }
    };

    const handleExportExcel = () => {
        if (filteredResults.length === 0) return;

        const storeName = stores.find(s => s.id === selectedStoreId)?.name || 'Tienda';
        const headers = ['Producto', 'SKU', 'Talla', 'Color', 'Base Price', 'Stock'];
        const rows = filteredResults.map(item => [
            item.product_name,
            item.sku,
            item.size,
            item.color,
            item.base_price,
            item.inventory_item?.quantity || 0
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `inventario_${storeName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Documento exportado correctamente', 'success');
    };

    // Filter products and their variants based on search
    const filteredResults = products.flatMap(product =>
        (product.product_variants || []).map(variant => ({
            ...variant,
            product_name: product.short_name_es || product.name_es,
            style_sku: product.sku,
            sku: variant.sku_variant || product.sku,
            base_price: product.base_price,
            inventory_item: inventory.find(i => i.variant_id === variant.id)
        }))
    ).filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.style_sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="space-y-8">
            <ToastContainer />
            <div className="flex justify-between items-center rotate-0">
                <h1 className="ms-heading-2">Gestión de Inventario</h1>
                <div className="flex gap-4">
                    <select
                        className="ms-input h-10 px-4 py-0 min-w-[200px] text-ms-black"
                        value={selectedStoreId}
                        onChange={e => setSelectedStoreId(e.target.value)}
                    >
                        {stores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                    <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={filteredResults.length === 0} className="gap-2">
                        <FileDown className="w-4 h-4" />
                        Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={loadInventory}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-ms-white border border-ms-fog overflow-hidden">
                <div className="p-4 border-b border-ms-fog bg-ms-ivory/30 flex items-center gap-4">
                    <Search className="w-5 h-5 text-ms-stone" />
                    <input
                        className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-ms-ivory/50 border-b border-ms-fog text-xs uppercase tracking-widest font-medium text-ms-stone">
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Variante (S/C)</th>
                            <th className="px-6 py-4">Stock en Tienda</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ms-fog">
                        {filteredResults.map((item, idx) => (
                            <tr key={`${item.id}-${idx}`} className="hover:bg-ms-ivory/20 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium">{item.product_name}</td>
                                <td className="px-6 py-4 text-sm font-mono text-ms-stone">
                                    <span className="bg-ms-fog/30 px-1.5 py-0.5 rounded">{item.sku}</span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="bg-ms-ivory px-2 py-1 rounded text-xs">{item.size}</span>
                                    <span className="ml-2 text-ms-stone text-xs">{item.color}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-semibold ${(item.inventory_item?.quantity || 0) <= 5 ? 'text-red-500' : 'text-ms-black'}`}>
                                        {item.inventory_item?.quantity || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="outline" onClick={() => handleUpdateStock(item.id, item.inventory_item?.quantity || 0)}>
                                        Ajustar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredResults.length === 0 && (
                    <div className="p-10 text-center text-ms-stone italic">No se encontraron productos.</div>
                )}
            </div>
        </div>
    );
}
