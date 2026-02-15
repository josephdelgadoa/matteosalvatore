import api from './api';

export interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: 'customer' | 'admin' | 'super_admin';
    avatar_url?: string;
    created_at: string;
}

export const usersApi = {
    getAll: async () => {
        const { data } = await api.get('/users');
        return data.data;
    },

    getOne: async (id: string) => {
        const { data } = await api.get(`/users/${id}`);
        return data.data;
    },

    create: async (userData: any) => {
        const { data } = await api.post('/users', userData);
        return data.data;
    },

    update: async (id: string, userData: any) => {
        const { data } = await api.put(`/users/${id}`, userData);
        return data.data;
    },

    delete: async (id: string) => {
        await api.delete(`/users/${id}`);
    }
};
