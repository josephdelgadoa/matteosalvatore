
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

async function listAdmins() {
    console.log('Checking admin users in profiles table...');

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'super_admin']);

    if (error) {
        console.error('Error fetching profiles:', error);
        return;
    }

    console.log(`Found ${profiles.length} admin/super_admin profiles.`);
    profiles.forEach(p => {
        console.log(`- ID: ${p.id}, Role: ${p.role}, Name: ${p.first_name || ''} ${p.last_name || ''}`);
    });

    // Also list all users to see if there are any at all
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
    console.log(`Total profiles in DB: ${count}`);
}

listAdmins();
