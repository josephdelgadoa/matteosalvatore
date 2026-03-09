import api from './api';

export interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

export interface ChatbotContext {
    cart?: any[];
    isAuthenticated?: boolean;
    currentPage?: string;
}

export const chatbotApi = {
    sendMessage: async (message: string, history: ChatMessage[], lang: string, context: ChatbotContext) => {
        const response = await api.post('/chatbot', {
            message,
            history,
            lang,
            context
        });
        return response.data;
    }
};
