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
    "style_code"?: string;
    "1_name_es": string;
    "1_name_en": string;
    "2_slug_es": string;
    "2_slug_en": string;
    "3_short_description_es": string;
    "3_short_description_en": string;
    "4_full_description_es": string;
    "4_full_description_en": string;
    "5_features_es": string[];
    "5_features_en": string[];
    "6_specifications_es": Record<string, string>;
    "6_specifications_en": Record<string, string>;
    "7_tags": string[];
    "8_keywords": string[];
    "9_hashtags": string[];
    "10_seo_title_es": string;
    "10_seo_title_en": string;
    "11_seo_description_es": string;
    "11_seo_description_en": string;
    "12_image_prompts": {
        catalog: string;
        lifestyle: string;
    };
    "13_alt_text_es": string;
    "13_alt_text_en": string;
    "14_cross_sell": string[];
    "15_product_schema": any;
    "16_ai_optimization": {
        semantic_description: string;
        graph_signals: string;
    };
    "17_social_captions": {
        instagram: string;
        tiktok: string;
    };
    "18_video_prompts": {
        reel: string;
        ad_video: string;
    };
    "19_ad_copy": {
        meta: string | {
            headline_es: string;
            primary_text_es: string;
            headline_en: string;
            primary_text_en: string;
        };
        tiktok: string;
    };
    "20_collection_placement": string[];
}

export const aiApi = {
    generateProduct: async (data: AiProductGenerationData): Promise<GeneratedProductAsset> => {
        const response = await api.post('/ai/generate-product', data);
        return response.data.data;
    }
};
