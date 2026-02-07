'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast, ToastContainer } from '@/components/ui/Toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();
    const supabase = createClientComponentClient();

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
            addToast('Welcome back!', 'success');
            router.push('/account'); // Redirect to dashboard
            router.refresh();
        }
    };

    return (
        <div className="animate-fade-in">
            <ToastContainer />
            <div className="text-center mb-8">
                <h1 className="ms-heading-2 mb-2">Welcome Back</h1>
                <p className="text-ms-stone">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="space-y-1">
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-xs text-ms-stone hover:text-ms-black hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={loading} disabled={loading}>
                    Sign in
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-ms-stone">
                Don't have an account?{' '}
                <Link href="/register" className="text-ms-black font-medium hover:underline">
                    Create account
                </Link>
            </div>
        </div>
    );
}
