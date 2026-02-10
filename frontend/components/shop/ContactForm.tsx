'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

interface ContactFormProps {
    dict: any;
}

export const ContactForm = ({ dict }: ContactFormProps) => {
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

        addToast(dict.success, 'success');
        setFormData({ name: '', email: '', message: '' });
        setSending(false);
    };

    return (
        <div className="bg-ms-ivory p-8 rounded-lg border border-ms-fog">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label={dict.name}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <Input
                    label={dict.email}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <div>
                    <label className="block text-xs font-medium text-ms-stone mb-1 uppercase tracking-wider">
                        {dict.message}
                    </label>
                    <textarea
                        className="w-full px-4 py-3 bg-ms-white border border-ms-fog rounded-sm text-ms-black focus:outline-none focus:border-ms-stone transition-colors min-h-[150px]"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    />
                </div>
                <Button type="submit" isLoading={sending} disabled={sending} className="w-full">
                    {dict.send}
                </Button>
            </form>
        </div>
    );
};
