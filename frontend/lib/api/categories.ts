
import api from './api';

export interface FeaturedCategory {
    id: string;
    title_es: string;
    title_en: string;
    subtitle_es: string;
    subtitle_en: string;
    image_url: string;
    link_url: string;
    display_order: number;
    is_active: boolean;
}

export const categoriesApi = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<FeaturedCategory>) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    update: async (id: string, data: Partial<FeaturedCategory>) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/categories/${id}`);
    },

    reorder: async (items: { id: string; display_order: number }[]) => {
        await api.post('/categories/reorder', { items });
    }
};
