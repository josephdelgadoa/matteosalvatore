'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

import { Locale } from '@/i18n-config';

export default function ProfilePage({ params }: { params: { lang: Locale } }) {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });

    const supabase = createClientComponentClient();
    const { addToast } = useToast();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setFormData({
                    fullName: user.user_metadata?.full_name || '',
                    email: user.email || '',
                });
            }
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);

        const { error } = await supabase.auth.updateUser({
            data: { full_name: formData.fullName }
        });

        if (error) {
            addToast(error.message, 'error');
        } else {
            addToast('Profile updated successfully', 'success');
        }
        setUpdating(false);
    };

    if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

    return (
        <div className="max-w-xl">
            <h2 className="text-xl font-medium mb-6">Profile Details</h2>

            <form onSubmit={handleUpdate} className="space-y-6">
                <Input
                    label="Email"
                    value={formData.email}
                    disabled
                    className="bg-ms-ivory/50 cursor-not-allowed"
                />
                <Input
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />

                <Button type="submit" isLoading={updating} disabled={updating}>
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
