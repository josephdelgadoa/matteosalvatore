'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function AdminSettingsPage() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        storeName: 'Matteo Salvatore',
        supportEmail: 'support@matteosalvatore.pe',
        taxRate: 18,
        currency: 'PEN',
        shippingFlatRate: 15.00,
        freeShippingThreshold: 300.00,
        seoTitle: 'Matteo Salvatore | Minimalist Menswear',
        seoDescription: 'Premium minimalist menswear made in Peru.'
    });

    const handleChange = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            addToast('Settings saved successfully', 'success');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">Settings</h1>
                    <p className="text-ms-stone">Configure store preferences, taxes, and shipping.</p>
                </div>
                <Button onClick={handleSave} isLoading={loading}>Save Changes</Button>
            </div>

            <div className="space-y-8">

                {/* General */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Store Name"
                            value={settings.storeName}
                            onChange={e => handleChange('storeName', e.target.value)}
                        />
                        <Input
                            label="Support Email"
                            value={settings.supportEmail}
                            onChange={e => handleChange('supportEmail', e.target.value)}
                        />
                        <Input
                            label="Currency Code"
                            value={settings.currency}
                            onChange={e => handleChange('currency', e.target.value)}
                        />
                    </div>
                </section>

                {/* Financials (Taxes & Shipping) */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">Taxes & Shipping</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Tax Rate (%)"
                            type="number"
                            value={settings.taxRate}
                            onChange={e => handleChange('taxRate', parseFloat(e.target.value))}
                        />
                        <div className="hidden md:block"></div> {/* Spacer */}

                        <Input
                            label="Flat Shipping Rate (S/)"
                            type="number"
                            value={settings.shippingFlatRate}
                            onChange={e => handleChange('shippingFlatRate', parseFloat(e.target.value))}
                        />
                        <Input
                            label="Free Shipping Threshold (S/)"
                            type="number"
                            value={settings.freeShippingThreshold}
                            onChange={e => handleChange('freeShippingThreshold', parseFloat(e.target.value))}
                        />
                    </div>
                </section>

                {/* SEO */}
                <section className="bg-ms-white p-6 border border-ms-fog space-y-4">
                    <h3 className="font-medium text-lg border-b border-ms-fog pb-2 mb-4">SEO Defaults</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Default Meta Title"
                            value={settings.seoTitle}
                            onChange={e => handleChange('seoTitle', e.target.value)}
                        />
                        <div>
                            <label className="ms-label block mb-1">Default Meta Description</label>
                            <textarea
                                className="ms-input min-h-[100px]"
                                value={settings.seoDescription}
                                onChange={e => handleChange('seoDescription', e.target.value)}
                            />
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
