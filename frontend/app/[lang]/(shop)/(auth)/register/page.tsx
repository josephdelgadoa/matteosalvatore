'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

import { Locale } from '@/i18n-config';

import { useShopDictionary } from '@/providers/ShopDictionaryProvider';

export default function RegisterPage({ params }: { params: { lang: Locale } }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClientComponentClient();
    const dict = useShopDictionary();
    const regDict = dict.auth.register;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            addToast(error.message, 'error');
            setLoading(false);
        } else {
            addToast(regDict.successToast, 'success');

            if (data.session) {
                router.push(`/${params.lang}/account`);
                router.refresh();
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <ToastContainer />
            <div className="text-center mb-8">
                <h1 className="ms-heading-2 mb-2">{regDict.title}</h1>
                <p className="text-ms-stone">{regDict.subtitle}</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <Input
                    label={regDict.fullNameLabel}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <Input
                    label={regDict.emailLabel}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label={regDict.passwordLabel}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />

                <Button type="submit" className="w-full" isLoading={loading} disabled={loading}>
                    {regDict.registerBtn}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ms-stone">
                {regDict.alreadyHaveAccount}{' '}
                <Link href={`/${params.lang}/login`} className="text-ms-black font-medium hover:underline">
                    {regDict.signIn}
                </Link>
            </div>
        </div>
    );
}
