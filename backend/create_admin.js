require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
// We use ANON key here for client-side signUp because we don't have the SERVICE key locally.

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createAdmin() {
    const email = 'josephdelgadoa@gmail.com';
    const password = 'Universitario2026';
    const firstName = 'Joseph';
    const lastName = 'Delgado';

    console.log(`Registering user via public API: ${email}`);

    // attempt signUp
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName
            }
        }
    });

    if (error) {
        console.error('Error signing up:', error.message);
        if (error.message.includes('already registered')) {
            console.log('User already exists. They should try to login directly or reset password.');
        }
        return;
    }

    if (data.user) {
        console.log(`User created successfully! ID: ${data.user.id}`);
        if (data.session) {
            console.log('Session created (Auto-confirm likely enabled). User can login immediately.');
        } else {
            console.log('No session returned. Email confirmation might be required.');
        }

        // Attempt to insert customer record if RLS permits (using the session access token if available)
        if (data.session) {
            // Authenticated client
            const authClient = createClient(supabaseUrl, supabaseAnonKey, {
                global: {
                    headers: {
                        Authorization: `Bearer ${data.session.access_token}`
                    }
                }
            });

            // Try inserting into customers.
            // Wait, the trigger might handle this automatically? 
            // Or we might need to do it manually if RLS allows authenticated users to insert their own record.
            // Let's rely on the user manually logging in if the backend handles post-login profile creation, OR try to insert here.

            // Actually, without SERVICE key, we can't force insert into `customers` if RLS blocks it 
            // unless there's a policy allowing "auth.uid() = id".
            // Assuming there IS such a policy for self-registration.

            const { error: dbError } = await authClient
                .from('customers')
                .upsert([
                    {
                        id: data.user.id,
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                        language_preference: 'es'
                    }
                ]);

            if (dbError) {
                console.error('Error creating customer record (RLS might block):', dbError.message);
            } else {
                console.log('Customer record created/updated successfully.');
            }
        }
    }
}

createAdmin();
