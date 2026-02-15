'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usersApi, User } from '@/lib/api/users';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminUserEditPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const isNew = id === 'new';
    const router = useRouter();
    const { addToast } = useToast();

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'admin',
        avatar_url: ''
    });

    useEffect(() => {
        if (!isNew) {
            loadUser();
        }
    }, [id]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const user = await usersApi.getOne(id);
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                password: '', // Password not returned by API for security
                role: user.role || 'customer',
                avatar_url: user.avatar_url || ''
            });
        } catch (error) {
            console.error('Failed to load user:', error);
            addToast('Failed to load user data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isNew && !formData.password) {
            addToast('Password is required for new users', 'error');
            return;
        }

        try {
            setSaving(true);
            if (isNew) {
                await usersApi.create(formData);
                addToast('User created successfully', 'success');
            } else {
                await usersApi.update(id, formData);
                addToast('User updated successfully', 'success');
            }
            router.push('/admin/users');
        } catch (error: any) {
            console.error('Failed to save user:', error);
            addToast(error.message || 'Failed to save user', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <ToastContainer />

            <Link href="/admin/users" className="flex items-center text-ms-stone hover:text-ms-black mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2">{isNew ? 'Create New User' : 'Edit User'}</h1>
                    <p className="text-ms-stone mt-1">{isNew ? 'Add a new administrator or staff member.' : 'Update user profile and permissions.'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-ms-white p-8 border border-ms-fog rounded-lg">

                {/* Avatar */}
                <div>
                    <label className="ms-label block mb-2">Profile Photo</label>
                    <div className="flex items-start gap-6">
                        {formData.avatar_url && (
                            <img
                                src={formData.avatar_url}
                                alt="Profile Preview"
                                className="w-24 h-24 rounded-full object-cover border border-ms-fog"
                            />
                        )}
                        <div className="flex-1">
                            <ImageUploader
                                value={formData.avatar_url ? [formData.avatar_url] : []}
                                onChange={(urls) => setFormData({ ...formData, avatar_url: urls[0] || '' })}
                                maxFiles={1}
                            />
                            <p className="text-xs text-ms-stone mt-2">Recommended: Square image, 400x400px.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <Input
                        label="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        required
                    />
                    <Input
                        label="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                    />
                </div>

                <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                // Disable email editing for now to avoid auth sync complexity if not needed
                // or allow it if backend supports it (our controller does).
                />

                <Input
                    label={isNew ? "Password" : "New Password (leave blank to keep current)"}
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={isNew}
                />

                <div>
                    <label className="ms-label block mb-2">Role</label>
                    <select
                        className="ms-input"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" isLoading={saving}>
                        {isNew ? 'Create User' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
