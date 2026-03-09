'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Plus, FileEdit, Trash2, Eye } from 'lucide-react';
import { DataTable } from '@/components/admin/DataTable';
import { blogApi, BlogPost } from '@/lib/api/blog';
import { Spinner } from '@/components/ui/Spinner';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { Locale } from '@/i18n-config';
import { useAdminDictionary } from '@/providers/AdminDictionaryProvider';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

export default function AdminBlogPage({ params }: { params: { lang: Locale } }) {
    const dict = useAdminDictionary();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const fetchPosts = async () => {
        try {
            const data = await blogApi.getAllPosts();
            setPosts(data);
        } catch (err: any) {
            console.error('Error loading blog posts:', err);
            addToast(`${dict.blog.loadError}: ${err.message || 'Unknown error'}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (item: BlogPost) => {
        if (!confirm(`${dict.blog.confirmDelete} "${item.title_es}"?`)) return;

        try {
            await blogApi.deletePost(item.id);
            addToast(dict.blog.deleteSuccess, 'success');
            fetchPosts();
        } catch (err) {
            console.error('Error deleting post:', err);
            addToast(dict.blog.deleteError, 'error');
        }
    };

    const columns = [
        {
            header: dict.blog.tablePost,
            accessorKey: (item: BlogPost) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ms-pearl flex-shrink-0 overflow-hidden">
                        {item.featured_image_url && (
                            <img
                                src={item.featured_image_url}
                                alt={item.title_es}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <span className="font-medium block">{item.title_es}</span>
                        <span className="text-xs text-ms-stone block line-clamp-1">{item.slug_es}</span>
                    </div>
                </div>
            )
        },
        {
            header: dict.blog.tableStatus,
            accessorKey: (item: BlogPost) => (
                <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    item.is_published
                        ? "bg-ms-success/10 text-ms-success"
                        : "bg-ms-stone/10 text-ms-stone"
                )}>
                    {item.is_published ? dict.blog.published : dict.blog.draft}
                </span>
            )
        },
        {
            header: dict.blog.tableDate,
            accessorKey: (item: BlogPost) => {
                const date = new Date(item.created_at);
                return (
                    <span className="text-sm text-ms-stone">
                        {format(date, 'MMM dd, yyyy', {
                            locale: params.lang === 'es' ? es : enUS
                        })}
                    </span>
                );
            }
        }
    ];

    // Helper function for classNames since I don't have clsx/cn available globally here without importing
    function cn(...classes: any[]) {
        return classes.filter(Boolean).join(' ');
    }

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;

    return (
        <div>
            <ToastContainer />
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="ms-heading-2 mb-2">{dict.blog.title}</h1>
                    <p className="text-ms-stone">{dict.blog.subtitle}</p>
                </div>
                <Link href={`/${params.lang}/admin/blog/new`}>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {dict.blog.add}
                    </Button>
                </Link>
            </div>

            <DataTable
                data={posts}
                columns={columns}
                editPath={(item) => `/admin/blog/${item.id}`}
                onDelete={handleDelete}
                extraActions={(item) => (
                    <Link href={`/${params.lang}/blog/${item.slug_es}`} target="_blank">
                        <Button
                            variant="text"
                            size="sm"
                            className="p-2 h-8 w-8"
                            title="View Public Post"
                        >
                            <Eye className="w-4 h-4 text-ms-stone hover:text-ms-black" />
                        </Button>
                    </Link>
                )}
            />
        </div>
    );
}
