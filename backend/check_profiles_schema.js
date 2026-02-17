const SupabaseService = require('./src/services/supabase');
const supabase = require('./src/config/database');

// Just a quick script to check columns of profiles table
async function checkSchema() {
    try {
        // We can't easily DESCRIBE table via PostgREST, but we can try to select the column
        // If it fails, it doesn't exist.
        const { data, error } = await supabase
            .from('profiles')
            .select('id, avatar_url')
            .limit(1);

        if (error) {
            console.error('Error selecting avatar_url:', error.message);
            if (error.code === 'PGRST301' || error.message.includes('Could not find')) {
                console.log('CONFIRMED: avatar_url column is MISSING.');
            }
        } else {
            console.log('SUCCESS: avatar_url column EXISTS.');
            console.log('Sample data:', data);
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkSchema();
