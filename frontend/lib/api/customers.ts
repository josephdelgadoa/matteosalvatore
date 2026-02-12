import { createBrowserClient } from '@supabase/ssr';

export interface Customer {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: string;
    created_at: string;
    last_sign_in_at?: string;
}

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const customersApi = {
    getAll: async () => {
        // Fetch profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // In a real app with admin SDK, we would fetch emails from auth.users
        // But with client SDK we can only see public profile data.
        // Assuming profiles table has what we need or we can only show what's in profiles.
        // For now, mapping profiles to Customer interface.

        return profiles.map((p: any) => ({
            id: p.id,
            email: p.email || 'N/A', // Email might not be in profiles depending on schema
            first_name: p.first_name,
            last_name: p.last_name,
            role: p.role,
            created_at: p.created_at,
            // last_sign_in_at is not in profiles usually, omitting or mocking
        })) as Customer[];
    }
};
