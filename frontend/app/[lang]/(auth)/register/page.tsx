'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

import { Locale } from '@/i18n-config';

export default function RegisterPage({ params }: { params: { lang: Locale } }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClientComponentClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    // We'll use this metadata to populate our customers table via trigger or manual hook
                },
            },
        });

        if (error) {
            addToast(error.message, 'error');
            setLoading(false);
        } else {
            // If email confirmation is disabled, we can redirect. 
            // If enabled, we show a message.
            // Assuming it might be disabled for dev or we auto-login?
            // Supabase defaults to requiring confirmation.
            addToast('Account created! Please check your email to verify.', 'success');

            // Optional: If auto-confirm is on, we redirect
            if (data.session) {
                router.push(`/${params.lang}/account`);
                router.refresh();
            } else {
                // Stay here or redirect to a verify info page
                setLoading(false);
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <ToastContainer />
            <div className="text-center mb-8">
                <h1 className="ms-heading-2 mb-2">Create Account</h1>
                <p className="text-ms-stone">Join us for exclusive access and potential rewards.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
                <Input
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />

                <Button type="submit" className="w-full" isLoading={loading} disabled={loading}>
                    Create account
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ms-stone">
                Already have an account?{' '}
                <Link href={`/${params.lang}/login`} className="text-ms-black font-medium hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
