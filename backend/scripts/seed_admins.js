require('dotenv').config({ path: '../.env' }); // Adjust path if running from backend root
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const admins = [
    {
        email: 'josephdelgadoa@gmail.com',
        password: 'Cupertino05%',
        first_name: 'Joseph',
        last_name: 'Delgado',
        role: 'super_admin'
    },
    {
        email: 'gquispe0374@gmail.com',
        password: 'Cupertino05%',
        first_name: 'Gloria',
        last_name: 'Quispe',
        role: 'super_admin'
    }
];

async function seedAdmins() {
    console.log('🌱 Seeding Admin Users...');

    for (const admin of admins) {
        try {
            // 1. Check if user exists
            const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers();

            // Simple filter (listUsers might be paginated in strict prod, but fine for seed)
            let user = existingUsers.users.find(u => u.email === admin.email);
            let userId;

            if (user) {
                console.log(`🔹 User ${admin.email} exists. Updating password and confirming email...`);
                userId = user.id;
                const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                    password: admin.password,
                    email_confirm: true,
                    user_metadata: {
                        first_name: admin.first_name,
                        last_name: admin.last_name
                    }
                });
                if (updateError) throw updateError;
            } else {
                console.log(`🔹 Creating user ${admin.email}...`);
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                    email: admin.email,
                    password: admin.password,
                    email_confirm: true,
                    user_metadata: {
                        first_name: admin.first_name,
                        last_name: admin.last_name
                    }
                });
                if (createError) throw createError;
                userId = newUser.user.id;
            }

            // 2. Upsert Profile
            console.log(`🔹 Updating profile for ${admin.email}...`);
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    first_name: admin.first_name,
                    last_name: admin.last_name,
                    role: admin.role
                });

            if (profileError) throw profileError;

            console.log(`✅ Success for ${admin.first_name}`);

        } catch (err) {
            console.error(`❌ Error processing ${admin.email}:`, err.message);
        }
    }
}

seedAdmins();
