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
    }
};
