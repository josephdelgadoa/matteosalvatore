const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const allowedColors = [
    "AZUL", "AZUL MARINO", "AZUL NOCHE", "AZUL ACERO", "BEIGE", "BEIGE / ARENA", "BEIGE / CREMA", "BLANCO", "CAMELL", "CELESTE BEBE", "CELESTE PASTEL", "CEMENTO", "CREMA", "GRIS", "GRIS ACERO", "GRIS CARBON", "GRIS HIELO", "GUINDA", "HUESO", "MARRON", "MARRON / TABACO", "MARRON / TOPO", "MELANGE", "MELANGE CLARO", "NEGRO", "PALO ROSA", "PLOMO", "PLOMO PLATA", "PLOMO RATA", "ROJO", "ROSADO BEBE", "ROSA CLARO", "SKY", "TURQUESA", "VERDE", "VERDE BOTELLA", "VERDE OLIVA", "VERDE OLIVO / MILITAR", "VERDE MILITAR", "VERDE CEMENTO", "VINO", "ARENA"
].map(c => c.toUpperCase());

async function auditColors() {
    try {
        const { data: variants, error } = await supabase
            .from('product_variants')
            .select(`
                id,
                color,
                products (name_es)
            `);

        if (error) {
            console.error(error);
            return;
        }

        const missing = [];
        const seenColors = new Set();

        variants.forEach(v => {
            const color = v.color ? v.color.toUpperCase().trim() : 'N/A';
            if (!allowedColors.includes(color)) {
                missing.push({
                    product: v.products.name_es,
                    color: v.color,
                    id: v.id
                });
                seenColors.add(v.color);
            }
        });

        console.log('--- COLORS NOT IN LIST ---');
        console.log(Array.from(seenColors));
        console.log('\n--- DETAILED LIST ---');
        missing.forEach(m => {
            console.log(`[${m.color}] -> ${m.product}`);
        });

    } catch (e) {
        console.error(e);
    }
}

auditColors();
