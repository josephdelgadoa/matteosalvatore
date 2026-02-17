
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Use Service Key to bypass RLS and access auth.users
);

async function checkUserAvatar() {
    const email = 'josephdelgadoa@gmail.com';
    console.log(`Checking avatar for: ${email}`);

    // 1. Get User ID from Auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error fetching users:', userError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('User not found in auth.users');
        return;
    }

    console.log(`User ID: ${user.id}`);

    // 2. Get Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError);
    } else {
        console.log('Profile found:', profile);
        console.log('Avatar URL:', profile.avatar_url);
    }
}

checkUserAvatar();
