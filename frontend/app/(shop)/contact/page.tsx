'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

import { PageHero } from '@/components/ui/PageHero';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        addToast('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', message: '' });
        setSending(false);
    };

    return (
        <div className="animate-fade-in">
            <PageHero
                title="Contact Us"
                subtitle="Get in Touch"
                image="/images/hero-image-01.png"
            />

            <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                <ToastContainer />
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    <div>
                        <h2 className="ms-heading-2 mb-6">We're Here for You</h2>
                        <p className="text-ms-stone mb-8">
                            Have a question about an order, sizing, or just want to say hello?
                            We'd love to hear from you.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">Email</h3>
                                <p className="text-ms-black">support@matteosalvatore.pe</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">WhatsApp</h3>
                                <p className="text-ms-black">+51 987 654 321</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium uppercase tracking-wider text-ms-stone mb-1">Atelier</h3>
                                <p className="text-ms-black">
                                    Av. Conquistadores 1234<br />
                                    San Isidro, Lima, Peru<br />
                                    (By appointment only)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-ms-ivory p-8 rounded-lg border border-ms-fog">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <div>
                                <label className="block text-xs font-medium text-ms-stone mb-1 uppercase tracking-wider">
                                    Message
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-ms-white border border-ms-fog rounded-sm text-ms-black focus:outline-none focus:border-ms-stone transition-colors min-h-[150px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" isLoading={sending} disabled={sending} className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div >
    );
}
