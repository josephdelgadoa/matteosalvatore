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
        // Fetch registered profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch guest orders (orders without a registered customer_id attached to them)
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('email, shipping_address, created_at')
            .is('customer_id', null)
            .order('created_at', { ascending: false });

        if (ordersError) {
            console.error('Failed to fetch guest orders for customers list:', ordersError);
        }

        // Aggregate unique guest customers by email
        const guestCustomersMap = new Map();
        
        if (orders) {
            orders.forEach((order: any) => {
                if (order.email && !guestCustomersMap.has(order.email)) {
                    let firstName = 'Guest';
                    let lastName = 'Customer';
                    
                    if (order.shipping_address) {
                        try {
                            const addr = typeof order.shipping_address === 'string' 
                                ? JSON.parse(order.shipping_address) 
                                : order.shipping_address;
                            if (addr.firstName) firstName = addr.firstName;
                            if (addr.lastName) lastName = addr.lastName;
                        } catch (e) {}
                    }
                    
                    guestCustomersMap.set(order.email, {
                        id: `guest-${order.email}`,
                        email: order.email,
                        first_name: firstName,
                        last_name: lastName,
                        role: 'guest',
                        created_at: order.created_at
                    });
                }
            });
        }

        // Map standard profiles
        const registeredCustomers = profiles.map((p: any) => ({
            id: p.id,
            email: p.email || 'N/A', // Email might not be in profiles depending on schema
            first_name: p.first_name,
            last_name: p.last_name,
            role: p.role || 'user',
            created_at: p.created_at,
        })) as Customer[];

        const guestCustomers = Array.from(guestCustomersMap.values()) as Customer[];
        
        // Exclude guests who already have a registered account under the same email
        const registeredEmails = new Set(registeredCustomers.map(c => c.email));
        const filteredGuests = guestCustomers.filter(g => !registeredEmails.has(g.email));

        // Combine both lists and sort by newest first
        const allCustomers = [...registeredCustomers, ...filteredGuests];
        allCustomers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return allCustomers;
    }
};
