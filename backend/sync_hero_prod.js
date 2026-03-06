
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../backend/.env' });

const devUrl = process.env.SUPABASE_URL;
const devKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const devSupabase = createClient(devUrl, devKey);

const prodUrl = 'https://pmugxoobcvuumymvopig.supabase.co';
const prodKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdWd4b29iY3Z1dW15bXZvcGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNzExNDIsImV4cCI6MjA4NTg0NzE0Mn0.U-6xR4pZCczLZJE0Q6Hxfgs2nxSIJ5cusNIX_Aw6PlU';
const prodSupabase = createClient(prodUrl, prodKey);

async function syncHeroSlides() {
    console.log('Fetching hero slides from development...');
    const { data: devSlides, error: devError } = await devSupabase
        .from('content_blocks')
        .select('*')
        .in('key', ['hero_slides_es', 'hero_slides_en']);

    if (devError) {
        console.error('Error fetching from dev:', devError);
        return;
    }

    console.log(`Found ${devSlides.length} blocks. Syncing to production...`);

    for (const block of devSlides) {
        console.log(`Syncing ${block.key}...`);
        const { error: prodError } = await prodSupabase
            .from('content_blocks')
            .upsert({
                key: block.key,
                value: block.value,
                updated_at: new Date()
            });

        if (prodError) {
            console.error(`Error syncing ${block.key}:`, prodError);
        } else {
            console.log(`Successfully synced ${block.key}`);
        }
    }
}

syncHeroSlides();
