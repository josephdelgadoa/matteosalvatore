import api from './api';

export interface HeroSlide {
    id: number;
    image: string;
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    link: string;
}

export const contentApi = {
    getHeroSlides: async (lang: string = 'es'): Promise<HeroSlide[]> => {
        try {
            const { data } = await api.get(`/content/hero_slides_${lang}`);
            return data.data;
        } catch (error) {
            console.error('Failed to fetch hero slides:', error);
            return [];
        }
    },

    updateHeroSlides: async (slides: HeroSlide[], lang: string = 'es') => {
        const { data } = await api.put(`/content/hero_slides_${lang}`, { value: slides });
        return data.data;
    },
 
    getSmartSection: async (key: string = 'homepage_smart_section'): Promise<{ title: string; productIds: string[] } | null> => {
        try {
            const { data } = await api.get(`/content/${key}`);
            return data.data;
        } catch (error) {
            console.error('Failed to fetch smart section:', error);
            return null;
        }
    },
 
    updateSmartSection: async (value: { title: string; productIds: string[] }, key: string = 'homepage_smart_section') => {
        const { data } = await api.put(`/content/${key}`, { value });
        return data.data;
    }
};
