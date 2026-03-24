'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useCheckoutDictionary } from '@/providers/CheckoutDictionaryProvider';
import { getLocalizedPath } from '@/lib/routes';

export default function CheckoutInformationPage() {
    const router = useRouter();
    const { dict, lang } = useCheckoutDictionary();
    const infoDict = dict.information;
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: 'Lima',
        district: '',
        postalCode: '',
        phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate form (simplified)
        if (!formData.email || !formData.address || !formData.phone) return;

        // Save to local storage or context (Mock)
        localStorage.setItem('checkout_info', JSON.stringify(formData));

        // Proceed to shipping
        router.push(getLocalizedPath('/checkout/shipping', lang as any));
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">{infoDict?.title || 'Contact'}</h2>
                <div className="text-sm">
                    <span className="text-ms-stone mr-2">{infoDict?.haveAccount || 'Have an account?'}</span>
                    <Link href={getLocalizedPath('/login', lang as any)} className="text-ms-black hover:underline">{infoDict?.login || 'Log in'}</Link>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Input
                    label={infoDict?.emailLabel || 'Email'}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={infoDict?.emailPlaceholder || 'email@example.com'}
                />

                <div>
                    <h2 className="text-xl font-medium mb-4">{infoDict?.shippingTitle || 'Shipping Address'}</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={infoDict?.firstName || 'First name'}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label={infoDict?.lastName || 'Last name'}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Input
                            label={infoDict?.addressLabel || 'Address'}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder={infoDict?.addressPlaceholder || 'Av. Larco 123'}
                        />
                        <Input
                            label={infoDict?.apartmentLabel || 'Apartment, suite, etc. (optional)'}
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-ms-stone uppercase tracking-wider">{infoDict?.city || 'City'}</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="bg-transparent border border-ms-fog w-full h-12 px-4 focus:outline-none focus:border-ms-stone transition-colors"
                                >
                                    <option value="Lima">Lima</option>
                                    <option value="Callao">Callao</option>
                                </select>
                            </div>
                            <Input
                                label={infoDict?.district || 'District'}
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder={infoDict?.districtPlaceholder || 'Miraflores'}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={infoDict?.postalCode || 'Postal Code (Optional)'}
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                            />
                            <Input
                                label={infoDict?.phone || 'Phone'}
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                    <Link href={getLocalizedPath('/cart', lang as any)} className="text-ms-black hover:text-ms-stone transition-colors flex items-center gap-2 text-sm">
                        {infoDict?.returnToCart || 'Return to cart'}
                    </Link>
                    <Button type="submit" className="min-w-[200px]">
                        {infoDict?.continueToShipping || 'Continue to Shipping'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
