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

export default function LoginPage({ params }: { params: { lang: Locale } }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClientComponentClient();
    const dict = useShopDictionary();
    const authDict = dict.auth.login;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            addToast(error.message, 'error');
            setLoading(false);
        } else {
            addToast(authDict.welcomeBackToast, 'success');
            router.push(`/${params.lang}/account`); // Redirect to dashboard
            router.refresh();
        }
    };

    return (
        <div className="animate-fade-in">
            <ToastContainer />
            <div className="text-center mb-8">
                <h1 className="ms-heading-2 mb-2">{authDict.title}</h1>
                <p className="text-ms-stone">{authDict.subtitle}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <Input
                    label={authDict.emailLabel}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="space-y-1">
                    <Input
                        label={authDict.passwordLabel}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-end">
                        <Link href={`/${params.lang}/forgot-password`} className="text-xs text-ms-stone hover:text-ms-black hover:underline">
                            {authDict.forgotPassword}
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={loading} disabled={loading}>
                    {authDict.signInBtn}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ms-stone">
                {authDict.noAccount}{' '}
                <Link href={`/${params.lang}/register`} className="text-ms-black font-medium hover:underline">
                    {authDict.createAccount}
                </Link>
            </div>
        </div>
    );
}
