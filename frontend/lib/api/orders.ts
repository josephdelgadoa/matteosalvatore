import api from './api';

export interface Order {
    id: string;
    order_number: string;
    customer_id: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: string;
    shipping_address: any;
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    variant_info: any;
}

export const ordersApi = {
    getAll: async (params?: { status?: string; limit?: number }) => {
        const { data } = await api.get('/orders', { params });
        return data.data.orders;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/orders/${id}`);
        return data.data.order;
    },

    // Admin: update status
    updateStatus: async (id: string, status: string) => {
        // We need to implement this in backend too if not exists. 
        // For now placeholder.
        const { data } = await api.put(`/orders/${id}/status`, { status });
        return data.data;
    }
};
