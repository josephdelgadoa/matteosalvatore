import axios from 'axios';

const isServer = typeof window === 'undefined';
const API_URL = (isServer && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

if (isServer) {
    console.log(`[API Init] Server-side request. Using base URL: ${API_URL}`);
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies/session if needed
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Standardize error format
        const message = error.response?.data?.message || 'An unexpected error occurred';
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);

import { createBrowserClient } from '@supabase/ssr';

// Request interceptor for auth token injection
api.interceptors.request.use(
    async (config) => {
        if (!isServer) {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
