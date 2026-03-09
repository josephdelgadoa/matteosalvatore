'use client';

import React from 'react';
import { BlogForm } from '@/components/admin/BlogForm';
import { Locale } from '@/i18n-config';

export default function NewBlogPostPage({ params }: { params: { lang: Locale } }) {
    return (
        <div className="pb-20">
            <BlogForm lang={params.lang} />
        </div>
    );
}
