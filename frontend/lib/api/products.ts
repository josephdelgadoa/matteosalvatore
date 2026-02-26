import api from './api';

export interface Product {
    id: string;
    slug_es: string;
    slug_en: string;
    name_es: string;
    name_en: string;
    description_es: string;
    description_en: string;
    base_price: number;
    category: string;
    subcategory: string;
    product_variants: ProductVariant[];
    product_images: ProductImage[];
    seo_title_es?: string;
    seo_title_en?: string;
    seo_description_es?: string;
    seo_description_en?: string;
    seo_keywords_es?: string;
    seo_keywords_en?: string;
}

export interface ProductVariant {
    id: string;
    size: string;
    color: string;
    stock_quantity: number;
    is_available: boolean;
    sku_variant?: string;
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    color?: string | null;
    alt_text_es: string;
    display_order: number;
    is_primary: boolean;
}

export const productsApi = {
    getAll: async (params?: { category?: string; subcategory?: string; limit?: number; featured?: boolean; sort?: 'newest' | 'price-asc' | 'price-desc'; includeInactive?: boolean; ids?: string[] }) => {
        const queryParams: any = { ...params };
        if (params?.includeInactive) {
            queryParams.include_inactive = 'true';
        }
        if (params?.ids) {
            queryParams.ids = params.ids.join(',');
        }
        const response = await api.get('/products', { params: queryParams });

        if (!response.data || !response.data.data) {
            console.error('Invalid API response structure:', response);
            if (response.status === 404) {
                throw new Error('API Endpoint not found (404)');
            }
            throw new Error('Invalid API response: ' + JSON.stringify(response.data));
        }

        return response.data.data.products;
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
