'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { User, usersApi } from '@/lib/api/users';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminUsersPage() {
    const { addToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await usersApi.getAll();
            setUsers(data || []);
        } catch (error) {
            console.error('Failed to load users:', error);
            addToast('Failed to load users', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            await usersApi.delete(id);
            addToast('User deleted successfully', 'success');
            loadUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
            addToast('Failed to delete user', 'error');
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
        <div className="space-y-6">
            <ToastContainer />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="ms-heading-2">Users</h1>
                    <p className="text-ms-stone mt-1">Manage admin users and staff.</p>
                </div>
                <Link href="/admin/users/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add New User
                    </Button>
                </Link>
            </div>

            <div className="bg-ms-white border border-ms-fog rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-ms-ivory border-b border-ms-fog">
                            <th className="px-6 py-4 font-medium text-ms-stone">User</th>
                            <th className="px-6 py-4 font-medium text-ms-stone">Role</th>
                            <th className="px-6 py-4 font-medium text-ms-stone">Created</th>
                            <th className="px-6 py-4 font-medium text-ms-stone text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-ms-fog">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-ms-stone">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-ms-ivory/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.first_name || 'User'}
                                                    className="w-10 h-10 rounded-full object-cover border border-ms-fog"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-ms-fog flex items-center justify-center text-ms-stone font-medium">
                                                    {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-ms-black">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div className="text-ms-stone text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-ms-stone">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <button className="p-2 text-ms-stone hover:text-ms-black hover:bg-ms-fog/20 rounded-md transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-ms-stone hover:text-ms-error hover:bg-ms-error/10 rounded-md transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
