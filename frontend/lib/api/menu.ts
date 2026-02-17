
import api from './api';

export interface MenuItem {
    id: string;
    label_es: string;
    label_en: string;
    link_url: string | null;
    type: 'link' | 'dropdown';
    parent_id: string | null;
    display_order: number;
    is_active: boolean;
    children?: MenuItem[];
    subcategories?: any[]; // For now, we might want to manually manage subcats or link them really.
}

export const menuApi = {
    getAll: async () => {
        const response = await api.get('/menu');
        return response.data;
    },

    create: async (data: Partial<MenuItem>) => {
        const response = await api.post('/menu', data);
        return response.data;
    },

    update: async (id: string, data: Partial<MenuItem>) => {
        const response = await api.put(`/menu/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/menu/${id}`);
    },

    reorder: async (items: { id: string, parent_id: string | null, display_order: number }[]) => {
        const response = await api.put('/menu/reorder', { items });
        return response.data;
    }
};
