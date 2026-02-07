import api from './api';

export interface Product {
    id: string;
    slug: string;
    name_es: string;
    name_en: string;
    description_es: string;
    description_en: string;
    base_price: number;
    category: string;
    subcategory: string;
    product_variants: ProductVariant[];
    product_images: ProductImage[];
}

export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    stock_quantity: number;
    is_available: boolean;
}

export interface ProductImage {
    id: string;
    image_url: string;
    alt_text_es: string;
    display_order: number;
}

export const productsApi = {
    getAll: async (params?: { category?: string; limit?: number }) => {
        const { data } = await api.get('/products', { params });
        return data.data.products;
    },

    getBySlug: async (slug: string) => {
        const { data } = await api.get(`/products/${slug}`);
        return data.data.product;
    },

    getVariants: async (id: string) => {
        const { data } = await api.get(`/products/${id}/variants`);
        return data.data.variants;
    },

    // Admin Methods
    create: async (productData: Partial<Product>) => {
        const { data } = await api.post('/products', productData);
        return data.data;
    },

    update: async (id: string, productData: Partial<Product>) => {
        const { data } = await api.put(`/products/${id}`, productData);
        return data.data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/products/${id}`);
        return data;
    }
};
