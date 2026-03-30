'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Check, Save, MoveRight, X, Info } from 'lucide-react';
import { productsApi, Product } from '@/lib/api/products';
import { contentApi } from '@/lib/api/content';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';

export default function SmartSectionPage({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const { addToast } = useToast();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [sectionTitle, setSectionTitle] = useState('Tendencia Ahora');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allProducts, smartSection] = await Promise.all([
                    productsApi.getAll({ limit: 100, includeInactive: false }),
                    contentApi.getSmartSection()
                ]);
                
                setProducts(allProducts);
                if (smartSection) {
                    setSectionTitle(smartSection.title || 'Tendencia Ahora');
                    setSelectedProductIds(smartSection.productIds || []);
                }
            } catch (err: any) {
                console.error('Error loading smart section data:', err);
                addToast('Error loading data', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            !selectedProductIds.includes(p.id) &&
            (p.name_es.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.short_name_es?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [products, selectedProductIds, searchQuery]);

    const selectedProducts = useMemo(() => {
        return selectedProductIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is Product => !!p);
    }, [products, selectedProductIds]);

    const handleToggleProduct = (productId: string) => {
        if (selectedProductIds.includes(productId)) {
            setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
        } else {
            if (selectedProductIds.length >= 4) {
                addToast('Only 4 products can be selected for this section', 'warning');
                return;
            }
            setSelectedProductIds([...selectedProductIds, productId]);
        }
    };

    const handleSave = async () => {
        if (selectedProductIds.length !== 4) {
            addToast('Please select exactly 4 products', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            await contentApi.updateSmartSection({
                title: sectionTitle,
                productIds: selectedProductIds
            });
            addToast('Smart Section updated successfully', 'success');
        } catch (err) {
            console.error('Error saving smart section:', err);
            addToast('Error saving smart section', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div className="max-w-6xl mx-auto">
            <ToastContainer />
            
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-ms-black text-ms-white rounded-lg">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="ms-heading-2">Smart Section Manager</h1>
                </div>
                <p className="text-ms-stone max-w-2xl">
                    Curate the homepage experience dynamically. Select 4 premium products to showcase in the "Trending Now" section. The order of selection determines the display order.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                {/* Product Selection Column */}
                <section className="bg-ms-white border border-ms-fog rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-ms-fog bg-ms-ivory/50">
                        <h2 className="font-serif text-lg font-medium flex items-center gap-2">
                            Available Inventory
                            <span className="text-xs bg-ms-pearl px-2 py-1 rounded-full text-ms-stone font-sans">
                                {filteredProducts.length} items
                            </span>
                        </h2>
                        <div className="mt-4 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ms-stone" />
                            <Input 
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-ms-white border-ms-fog focus:ring-ms-black/5"
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-[600px] overflow-y-auto p-2">
                        <AnimatePresence initial={false}>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-3 mb-2 rounded-xl border border-transparent hover:border-ms-fog hover:bg-ms-pearl/30 transition-all cursor-pointer group"
                                    onClick={() => handleToggleProduct(product.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-ms-pearl rounded-lg overflow-hidden flex-shrink-0 border border-ms-fog/30">
                                            {product.product_images?.[0] && (
                                                <img 
                                                    src={product.product_images[0].image_url} 
                                                    alt={product.name_es}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-ms-black truncate uppercase tracking-tight">
                                                {product.short_name_es || product.name_es}
                                            </h3>
                                            <p className="text-xs text-ms-stone mt-0.5">
                                                {product.category} • S/. {product.base_price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-ms-fog flex items-center justify-center group-hover:border-ms-black transition-colors">
                                            <div className="w-2.5 h-2.5 rounded-full bg-ms-black opacity-0 group-hover:opacity-20 transition-opacity" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center text-ms-stone">
                                <p className="text-sm">No products found matching your search.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Selection Column */}
                <div className="space-y-6">
                    <section className="bg-ms-black text-ms-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-ms-pearl/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="relative z-10">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-ms-stone/80 font-bold mb-3 block">
                                Section Configuration
                            </label>
                            <Input
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                className="bg-white/5 border-white/10 text-white placeholder:text-ms-stone text-xl font-serif h-14 focus:border-white/30 transition-all rounded-xl"
                                placeholder="Enter Section Title (e.g. Tendencia Ahora)"
                            />
                            
                            <div className="mt-10">
                                <header className="flex items-center justify-between mb-6">
                                    <h3 className="font-serif text-lg flex items-center gap-2">
                                        Selected Products
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-sans uppercase tracking-wider">
                                            {selectedProductIds.length}/4
                                        </span>
                                    </h3>
                                    {selectedProductIds.length > 0 && (
                                        <button 
                                            onClick={() => setSelectedProductIds([])}
                                            className="text-[10px] uppercase tracking-widest text-ms-stone hover:text-white transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </header>

                                <div className="space-y-4">
                                    <AnimatePresence mode="popLayout">
                                        {selectedProducts.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                layout
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-ms-stone">
                                                    0{index + 1}
                                                </div>
                                                <div className="w-12 h-12 rounded bg-ms-pearl/20 overflow-hidden">
                                                    {product.product_images?.[0] && (
                                                        <img src={product.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-medium uppercase tracking-tight truncate">{product.short_name_es || product.name_es}</h4>
                                                    <p className="text-[10px] text-ms-stone mt-0.5">S/. {product.base_price.toFixed(2)}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleToggleProduct(product.id)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-ms-stone hover:text-ms-error hover:bg-ms-error/10 transition-all"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {Array.from({ length: 4 - selectedProductIds.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-[74px] rounded-xl border-2 border-dashed border-white/5 flex items-center justify-center text-ms-stone/30">
                                            <Info className="w-4 h-4 mr-2" />
                                            <span className="text-[10px] uppercase tracking-widest">Slot 0{selectedProductIds.length + i + 1} Empty</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-white/10">
                                <Button 
                                    className="w-full h-14 bg-white text-ms-black hover:bg-ms-pearl text-sm font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                                    onClick={handleSave}
                                    disabled={isSaving || selectedProductIds.length !== 4}
                                >
                                    {isSaving ? (
                                        <Spinner className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    )}
                                    {isSaving ? 'Updating...' : 'Publish Smart Section'}
                                </Button>
                                <p className="text-[10px] text-ms-stone/60 text-center mt-4 uppercase tracking-widest leading-relaxed">
                                    Changes will be immediately visible on the homepage row.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
