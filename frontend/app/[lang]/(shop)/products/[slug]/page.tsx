'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { productsApi, Product, ProductVariant } from '@/lib/api/products';
import { Spinner } from '@/components/ui/Spinner';
import { useCart } from '@/store/useCart';
import { useToast, ToastContainer } from '@/components/ui/Toast';
// @ts-ignore
// @ts-ignore
import { Locale } from '@/i18n-config';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: { slug: string; lang: Locale } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Selection state
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    const { addItem, isLoading: isAddingToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await productsApi.getBySlug(params.slug);
                setProduct(productData);
                if (productData) {
                    // Variants are often embedded, but we fetched them separately in API logic. 
                    // Actually the controller returns them embedded in 'product_variants'
                    setVariants(productData.product_variants || []);
                }
            } catch (err) {
                setError('Product not found.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [params.slug]);

    const handleAddToCart = async () => {
        if (!product || !selectedSize || !selectedColor) {
            addToast('Please select a size and color.', 'error');
            return;
        }

        const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor);

        if (!variant) {
            addToast('Selected combination is unavailable.', 'error');
            return;
        }

        try {
            await addItem(variant.id, 1);
            addToast(`Added ${product.name_es} to cart.`, 'success');
        } catch (err) {
            addToast('Failed to add to cart.', 'error');
        }
    };

    // Extract unique sizes and colors
    // Safe to Memoize or just compute. Variants is always an array (empty or populated)
    const sizes = React.useMemo(() => {
        const sizeOrder = { 'XS': 0, 'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5 };
        return Array.from(new Set(variants.map(v => v.size))).sort((a, b) => {
            // @ts-ignore
            return (sizeOrder[a] ?? 99) - (sizeOrder[b] ?? 99);
        });
    }, [variants]);
    const colors = React.useMemo(() => Array.from(new Set(variants.map(v => v.color))).sort(), [variants]);

    // Dynamic logic for available options
    const isColorAvailable = (color: string) => {
        if (!selectedSize) return true;
        return variants.some(v => v.color === color && v.size === selectedSize && v.is_available && v.stock_quantity > 0);
    };

    const isSizeAvailable = (size: string) => {
        if (!selectedColor) return true;
        return variants.some(v => v.size === size && v.color === selectedColor && v.is_available && v.stock_quantity > 0);
    };

    // Filter images based on selected color
    const effectiveImages = React.useMemo(() => {
        if (!product || !product.product_images) return [];

        let filtered = product.product_images;

        if (selectedColor) {
            const colorSpecific = product.product_images.filter(img => img.color === selectedColor);
            if (colorSpecific.length > 0) {
                filtered = colorSpecific;
            } else {
                // If no images for this color, show all (or maybe show default ones? sticking to all for now)
                filtered = product.product_images;
            }
        }

        return filtered.sort((a, b) => a.display_order - b.display_order);
    }, [product, selectedColor]);

    if (isLoading) return <div className="flex h-[80vh] items-center justify-center"><Spinner size="lg" /></div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    const primaryImage = effectiveImages?.[0]?.image_url || 'https://via.placeholder.com/600x800';
    const displayPrice = product.base_price; // TODO: Add price_adjustment logic if needed

    return (
        <div className="ms-container py-12 md:py-20 animate-fade-in relative transition-all">
            <ToastContainer />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] bg-ms-pearl w-full overflow-hidden">
                        <div
                            className="w-full h-full bg-cover bg-center transition-all duration-500"
                            style={{ backgroundImage: `url(${primaryImage})` }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {effectiveImages.slice(1).map((img, i) => (
                            <div
                                key={img.id || i}
                                className="aspect-[3/4] bg-ms-pearl overflow-hidden cursor-pointer hover:opacity-90"
                                onClick={() => {
                                    // Optional: clicking grid image sets it as primary? 
                                    // For now just display.
                                }}
                            >
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img.image_url})` }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="lg:sticky lg:top-32 h-fit space-y-8">
                    <div>
                        <h1 className="ms-heading-2 mb-2">{product.name_es}</h1>
                        <p className="text-xl font-medium">S/. {displayPrice.toFixed(2)}</p>
                    </div>

                    <div className="space-y-4">
                        <div
                            className="text-ms-stone text-[15px] prose max-w-none prose-p:mb-2 prose-p:mt-0 prose-p:leading-snug prose-ul:mb-2 prose-ul:mt-0 prose-li:my-0.5 prose-headings:mb-2 prose-headings:mt-4"
                            dangerouslySetInnerHTML={{ __html: (params.lang === 'en' ? product.description_en : product.description_es) || '' }}
                        />
                    </div>

                    {/* Selectors */}
                    <div className="space-y-6 pt-6 border-t border-ms-fog">
                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="ms-label block">Color</label>
                                {selectedColor && (
                                    <button
                                        className="text-xs text-ms-stone underline"
                                        onClick={() => setSelectedColor(null)}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {colors.length === 0 ? <span className="text-sm text-ms-stone italic">No colors available</span> : colors.map(color => {
                                    const available = isColorAvailable(color);
                                    return (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            disabled={!available}
                                            className={cn(
                                                "h-10 px-4 border transition-colors text-sm relative",
                                                selectedColor === color
                                                    ? 'border-ms-black bg-ms-black text-ms-white'
                                                    : available
                                                        ? 'border-ms-fog hover:border-ms-black'
                                                        : 'border-ms-fog/50 text-ms-stone/50 cursor-not-allowed bg-ms-ivory/50'
                                            )}
                                        >
                                            {color}
                                            {!available && <span className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-[1px] bg-ms-stone/30 rotate-45 transform" />
                                            </span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-3">
                                <label className="ms-label block">Size</label>
                                {selectedSize && (
                                    <button
                                        className="text-xs text-ms-stone underline"
                                        onClick={() => setSelectedSize(null)}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {sizes.length === 0 ? <span className="text-sm text-ms-stone italic">No sizes available</span> : sizes.map(size => {
                                    const available = isSizeAvailable(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={!available}
                                            className={cn(
                                                "w-12 h-12 flex items-center justify-center border transition-colors text-sm relative",
                                                selectedSize === size
                                                    ? 'border-ms-black bg-ms-black text-ms-white'
                                                    : available
                                                        ? 'border-ms-fog hover:border-ms-black'
                                                        : 'border-ms-fog/50 text-ms-stone/50 cursor-not-allowed bg-ms-ivory/50'
                                            )}
                                        >
                                            {size}
                                            {!available && <span className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-[80%] h-[1px] bg-ms-stone/30 rotate-45 transform" />
                                            </span>}
                                        </button>
                                    );
                                })}
                            </div>
                            <button className="text-xs underline mt-2 text-ms-stone">Size Guide</button>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handleAddToCart}
                            isLoading={isAddingToCart}
                        >
                            Add to Cart
                        </Button>
                        <p className="text-xs text-center text-ms-stone">Free shipping on orders over S/. 300</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
