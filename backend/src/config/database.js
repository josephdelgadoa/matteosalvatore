const { createClient } = require('@supabase/supabase-js');

// Validation
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Only warn in dev mode if variables are missing, but in production this should be set.
    // We use standard logger if available, otherwise console
    console.warn('⚠️  Supabase URL or Service Key missing. Check .env file.');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

module.exports = supabase;
