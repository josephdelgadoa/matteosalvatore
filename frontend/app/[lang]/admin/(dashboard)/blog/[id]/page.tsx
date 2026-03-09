'use client';

import React, { useEffect, useState } from 'react';
import { BlogForm } from '@/components/admin/BlogForm';
import { blogApi, BlogPost } from '@/lib/api/blog';
import { Spinner } from '@/components/ui/Spinner';
import { Locale } from '@/i18n-config';

export default function EditBlogPostPage({ params }: { params: { lang: Locale, id: string } }) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await blogApi.getPostById(params.id);
                setPost(data);
            } catch (err) {
                console.error('Error loading post:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    if (isLoading) return <div className="flex justify-center p-20"><Spinner /></div>;
    if (!post) return <div className="p-20 text-center">Post not found</div>;

    return (
        <div className="pb-20">
            <BlogForm lang={params.lang} initialData={post} isEditing={true} />
        </div>
    );
}
