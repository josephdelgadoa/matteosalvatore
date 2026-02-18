
import api from './api';

export interface ProductCategory {
    id: string;
    name_es: string;
    name_en: string; // Added English Name
    slug: string;
    description: string;
    image_url?: string;
    parent_id?: string;
    display_order?: number;
    is_active: boolean;
}

export const productCategoriesApi = {
    getAll: async () => {
        const response = await api.get('/product-categories');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/product-categories/${id}`);
        return response.data;
    },

    create: async (data: Partial<ProductCategory>) => {
        const response = await api.post('/product-categories', data);
        return response.data;
    },

    update: async (id: string, data: Partial<ProductCategory>) => {
        const response = await api.put(`/product-categories/${id}`, data);
        return response.data;
    },

    reorder: async (items: { id: string; parent_id?: string | null; display_order: number }[]) => {
        const response = await api.put('/product-categories/reorder', { items });
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/product-categories/${id}`);
    },
};
