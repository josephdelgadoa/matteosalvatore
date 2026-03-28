import api from './api';

export interface Order {
    id: string;
    order_number: string;
    customer_id: string;
    email: string;
    total_amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
    shipping_status: 'pending' | 'preparing' | 'ready_for_shipping' | 'shipped' | 'delivered';
    fulfillment_store_id?: string;
    courier_name?: string;
    courier_phone?: string;
    courier_address?: string;
    tracking_number?: string;
    payment_status: string;
    shipping_address: any;
    created_at: string;
    shipped_at?: string;
    delivered_at?: string;
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    product_name: string;
    product_id: string;
    variant_id?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    variant_details?: string;
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
        const { data } = await api.patch(`/orders/${id}/status`, { status });
        return data.data;
    },

    updateFulfillment: async (id: string, storeId: string, status: string) => {
        const { data } = await api.patch(`/orders/${id}/fulfillment`, { store_id: storeId, status });
        return data.data.order;
    },

    updateShipping: async (id: string, shippingData: {
        courier_name: string;
        courier_phone: string;
        courier_address: string;
        tracking_code: string;
    }) => {
        const { data } = await api.patch(`/orders/${id}/shipping`, shippingData);
        return data.data.order;
    }
};
