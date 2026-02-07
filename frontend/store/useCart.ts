import { create } from 'zustand';
import { cartApi, CartItem } from '@/lib/api/cart';
// import { v4 as uuidv4 } from 'uuid';

// Helper to get or create a session ID
const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('ms_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('ms_session_id', sessionId);
    }
    return sessionId;
};

interface CartState {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
    isOpen: boolean;
    isLoading: boolean;
    error: string | null;
    sessionId: string;

    // Actions
    initCart: () => Promise<void>;
    addItem: (variantId: string, quantity: number) => Promise<void>;
    updateQuantity: (id: string, quantity: number) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: () => void;
    getCartTotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
    items: [],
    subtotal: 0,
    itemCount: 0,
    isOpen: false,
    isLoading: false,
    error: null,
    sessionId: '',

    initCart: async () => {
        const sessionId = getSessionId();
        set({ sessionId, isLoading: true });
        try {
            const data = await cartApi.get(sessionId);
            set({
                items: data.items,
                subtotal: data.subtotal,
                itemCount: data.itemCount,
                isLoading: false
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    addItem: async (variantId, quantity) => {
        set({ isLoading: true, error: null });
        const { sessionId, initCart } = get();
        try {
            await cartApi.add(sessionId, variantId, quantity);
            await initCart(); // Refresh cart
            // Don't set loading false here because initCart handles it? 
            // Actually better to be explicit or let initCart handle the state update.
            // But initCart sets loading true/false. 
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error; // Re-throw so UI can show toast
        }
    },

    removeItem: async (id) => {
        set({ isLoading: true });
        const { initCart } = get();
        try {
            await cartApi.remove(id);
            await initCart();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    updateQuantity: async (id, quantity) => {
        set({ isLoading: true });
        const { initCart } = get();
        try {
            await cartApi.updateItem(id, quantity);
            await initCart();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    clearCart: async () => {
        set({ isLoading: true });
        const { sessionId, initCart } = get();
        try {
            await cartApi.clear(sessionId);
            await initCart();
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

    getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}));
