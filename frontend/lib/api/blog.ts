import api from './api';

export interface BlogPost {
    id: string;
    slug_es: string;
    slug_en: string;
    title_es: string;
    title_en: string;
    content_es: string;
    content_en: string;
    excerpt_es?: string;
    excerpt_en?: string;
    featured_image_url?: string;
    image_prompts?: any;
    category?: string;
    tags?: string[];
    seo_title_es?: string;
    seo_title_en?: string;
    seo_description_es?: string;
    seo_description_en?: string;
    is_published: boolean;
    published_at?: string;
    created_at: string;
    updated_at: string;
}

export const blogApi = {
    getAllPosts: async (params?: { lang?: string; publishedOnly?: boolean }) => {
        const response = await api.get('/blog', { params });
        return response.data.data.posts as BlogPost[];
    },

    getPostBySlug: async (slug: string, lang: string = 'es') => {
        const response = await api.get(`/blog/slug/${slug}`, { params: { lang } });
        return response.data.data.post as BlogPost;
    },

    getPostById: async (id: string) => {
        const response = await api.get(`/blog/${id}`);
        return response.data.data.post as BlogPost;
    },

    createPost: async (postData: Partial<BlogPost>) => {
        const response = await api.post('/blog', postData);
        return response.data.data.post as BlogPost;
    },

    updatePost: async (id: string, postData: Partial<BlogPost>) => {
        const response = await api.put(`/blog/${id}`, postData);
        return response.data.data.post as BlogPost;
    },

    deletePost: async (id: string) => {
        const response = await api.delete(`/blog/${id}`);
        return response.data;
    },

    generateBlogContent: async (data: { topic: string; keywords: string; targetAudience?: string; location?: string }) => {
        const response = await api.post('/blog/generate', data);
        return response.data.data.content;
    }
};
