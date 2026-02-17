
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function inspectUserProfile() {
    const email = 'josephdelgadoa@gmail.com';
    console.log(`Inspecting profile for: ${email}`);

    // 1. Get Auth User
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) { console.error('Auth Error:', userError); return; }

    const user = users.find(u => u.email === email);
    if (!user) { console.error('User not found in Auth!'); return; }

    console.log('--- Auth Data ---');
    console.log('User ID:', user.id);
    console.log('User Metadata:', user.user_metadata);

    // 2. Get Profile Data
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    console.log('--- Profile Data ---');
    if (profileError) {
        console.error('Profile Fetch Error:', profileError);
    } else {
        console.log(JSON.stringify(profile, null, 2));
    }
}

inspectUserProfile();
