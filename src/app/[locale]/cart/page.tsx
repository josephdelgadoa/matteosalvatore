"use client";

import { useCart } from "@/context/CartContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
    const { items, removeItem, total, itemCount } = useCart();
    const t = useTranslations("Navigation");

    if (items.length === 0) {
        return (
            <main className="container section" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Your Cart is Empty</h1>
                <Link href="/" style={{ textDecoration: 'underline' }}>
                    Continue Shopping
                </Link>
            </main>
        );
    }

    return (
        <main className="container section">
            <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>{t('cart')} ({itemCount})</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-2xl)' }}>
                {/* Cart Items */}
                <div>
                    {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} style={{
                            display: 'flex',
                            gap: 'var(--spacing-md)',
                            borderBottom: '1px solid #eee',
                            padding: 'var(--spacing-md) 0'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem'
                            }}>
                                No Img
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-xs)' }}>{item.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                    Size: {item.size} | Color: {item.color}
                                </p>
                                <button
                                    onClick={() => removeItem(item.id, item.size, item.color)}
                                    style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--color-red)',
                                        textDecoration: 'underline',
                                        marginTop: 'var(--spacing-sm)'
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                            <div>
                                <p style={{ fontWeight: 'bold' }}>S/ {(item.price * item.quantity).toFixed(2)}</p>
                                <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>
                                    {item.quantity} x S/ {item.price.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div style={{
                    backgroundColor: '#f9f9f9',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--border-radius-md)',
                    height: 'fit-content'
                }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-md)' }}>Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                        <span>Subtotal</span>
                        <span>S/ {total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--spacing-lg)',
                        fontWeight: 'bold',
                        borderTop: '1px solid #ddd',
                        paddingTop: 'var(--spacing-md)'
                    }}>
                        <span>Total</span>
                        <span>S/ {total.toFixed(2)}</span>
                    </div>

                    <button style={{
                        backgroundColor: 'var(--color-black)',
                        color: 'var(--color-white)',
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--border-radius-sm)',
                        fontWeight: 'bold'
                    }}>
                        Checkout (Placeholder)
                    </button>
                </div>
            </div>
        </main>
    );
}
