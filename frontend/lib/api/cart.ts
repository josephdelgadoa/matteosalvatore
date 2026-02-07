import api from './api';

export interface CartItem {
    id: string;
    variant_id: string;
    product_id: string;
    name: string;
    slug: string;
    image: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    total: number;
}

export const cartApi = {
    get: async (sessionId: string) => {
        const { data } = await api.get('/cart', { params: { sessionId } });
        return data.data;
    },

    add: async (sessionId: string, variantId: string, quantity: number) => {
        const { data } = await api.post('/cart/add', { sessionId, variantId, quantity });
        return data;
    },

    updateItem: async (id: string, quantity: number) => {
        const { data } = await api.put(`/cart/update/${id}`, { quantity });
        return data;
    },

    remove: async (id: string) => {
        const { data } = await api.delete(`/cart/remove/${id}`);
        return data;
    },

    clear: async (sessionId: string) => {
        const { data } = await api.post('/cart/clear', { sessionId });
        return data;
    }
};
