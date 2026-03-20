const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const mapping = {
    "Rosado": "ROSADO BEBE",
    "Camello": "CAMELL",
    "Borgoña": "VINO",
    "Black": "NEGRO",
    "Azul Turquesa": "TURQUESA",
    "Azul Eléctrico": "AZUL"
};

async function fixColors() {
    try {
        console.log('Fixing color labels in database...');
        let updatedCount = 0;

        for (const [oldColor, newColor] of Object.entries(mapping)) {
            const { data, error } = await supabase
                .from('product_variants')
                .update({ color: newColor })
                .eq('color', oldColor);

            if (error) {
                console.error(`Error updating ${oldColor}:`, error);
            } else {
                console.log(`Updated all variants of [${oldColor}] to [${newColor}]`);
            }
        }
        
        // Also update any others to uppercase just in case they match but with different casing
        const { data: allVariants } = await supabase.from('product_variants').select('id, color');
        for (const v of allVariants) {
            if (v.color && v.color !== v.color.toUpperCase()) {
                await supabase.from('product_variants').update({ color: v.color.toUpperCase() }).eq('id', v.id);
                updatedCount++;
            }
        }

        console.log('Finished updating colors.');
    } catch (e) {
        console.error(e);
    }
}

fixColors();
