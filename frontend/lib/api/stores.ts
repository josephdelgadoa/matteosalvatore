import api from './api';

export interface Store {
    id: string;
    name: string;
    address: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const storesApi = {
    getAll: async (): Promise<Store[]> => {
        const response = await api.get('/stores');
        return response.data.data.stores;
    },
    create: async (data: Partial<Store>): Promise<Store> => {
        const response = await api.post('/stores', data);
        return response.data.data.store;
    },
    update: async (id: string, data: Partial<Store>): Promise<Store> => {
        const response = await api.patch(`/stores/${id}`, data);
        return response.data.data.store;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/stores/${id}`);
    }
};

export const inventoryApi = {
    getByStore: async (storeId: string): Promise<any[]> => {
        const response = await api.get(`/inventory/${storeId}`);
        return response.data.data.inventory;
    },
    updateStock: async (data: { store_id: string, variant_id: string, quantity: number }): Promise<void> => {
        await api.post('/inventory/update', data);
    },
    transferStock: async (data: { from_store_id: string, to_store_id: string, variant_id: string, quantity: number }): Promise<void> => {
        await api.post('/inventory/transfer', data);
    }
};

export const posApi = {
    createSale: async (data: { store_id: string, items: any[], total_amount: number, payment_method: string }): Promise<any> => {
        const response = await api.post('/pos/sale', data);
        return response.data.data.sale;
    },
    getSalesByStore: async (storeId: string): Promise<any[]> => {
        const response = await api.get(`/pos/sales/${storeId}`);
        return response.data.data.sales;
    }
};
