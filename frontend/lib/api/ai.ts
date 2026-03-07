import api from './api';

export interface AiProductGenerationData {
    name: string;
    category: string;
    color: string;
    material: string;
    collection?: string;
    fit?: string;
    gender?: string;
    price: number | string;
}

export interface GeneratedProductAsset {
    name_es: string;
    name_en: string;
    slug_es: string;
    slug_en: string;
    short_description_es: string;
    short_description_en: string;
    description_es: string;
    description_en: string;
    features_es: string[];
    features_en: string[];
    specifications_es: Record<string, string>;
    specifications_en: Record<string, string>;
    tags: string[];
    keywords: string[];
    hashtags: string[];
    seo_title_es: string;
    seo_title_en: string;
    seo_description_es: string;
    seo_description_en: string;
    image_prompts: {
        catalog: string;
        lifestyle: string;
        ad: string;
    };
    alt_text_es: string;
    cross_sell_suggestions: string[];
    semantic_description: string;
    social_caption_es: string;
    social_caption_en: string;
}

export const aiApi = {
    generateProduct: async (data: AiProductGenerationData): Promise<GeneratedProductAsset> => {
        const response = await api.post('/ai/generate-product', data);
        return response.data.data;
    }
};
