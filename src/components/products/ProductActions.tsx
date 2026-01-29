"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductActionsProps {
    product: {
        id: string;
        slug: string;
        name: string;
        price: number;
        image?: string;
    };
}

export default function ProductActions({ product }: ProductActionsProps) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<string>('M'); // Default for now
    const [selectedColor, setSelectedColor] = useState<string>('Black'); // Default

    // Mock options (ideally passed from props based on stock)
    const sizes = ['S', 'M', 'L', 'XL'];
    const colors = ['White', 'Black', 'Blue', 'Beige', 'Red'];

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            color: selectedColor
        });
        alert("Added to cart!"); // Simple feedback for now
    };

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <p style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-sm)' }}>Size</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {sizes.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: selectedSize === size ? '2px solid black' : '1px solid #ddd',
                                backgroundColor: 'white'
                            }}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <p style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-sm)' }}>Color</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: selectedColor === color ? '2px solid black' : '1px solid #ddd',
                                backgroundColor: 'white'
                            }}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                style={{
                    backgroundColor: 'var(--color-black)',
                    color: 'var(--color-white)',
                    padding: '1rem 2rem',
                    width: '100%',
                    fontSize: '1rem',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: 'pointer'
                }}>
                Add to Cart
            </button>
        </div>
    );
}
