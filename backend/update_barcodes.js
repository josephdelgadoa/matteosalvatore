const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const productMapping = {
    "Polo Básico": "00501000",
    "Polo Oversize": "00502000",
    "Polo Boxi": "00503000",
    "Polo Henley Manga Corta": "00504000",
    "Polo Henley Manga Larga": "00505000",
    "Conjunto Canguro": "00506000",
    "Set Rangla": "00507000", 
    "Conjunto Raglan": "00507000",
    "Pantalón Cargo": "00508000",
    "Pantalon Jogguer": "00509000",
    "Pantalón Skinny": "00510000",
    "Tulum": "00511000",
    "Camisa Tulum": "00512000",
    "Hoodie": "00513000"
};

const knownColors = [
    "AZUL", "AZUL MARINO", "AZUL NOCHE", "AZUL ACERO", "BEIGE", "BEIGE / ARENA", "BEIGE / CREMA", "BLANCO", "CAMELL", "CELESTE BEBE", "CELESTE PASTEL", "CEMENTO", "CREMA", "GRIS", "GRIS ACERO", "GRIS CARBON", "GRIS HIELO", "GUINDA", "HUESO", "MARRON", "MARRON / TABACO", "MARRON / TOPO", "MELANGE", "MELANGE CLARO", "NEGRO", "PALO ROSA", "PLOMO", "PLOMO PLATA", "PLOMO RATA", "ROJO", "ROSADO BEBE", "ROSA CLARO", "SKY", "TURQUESA", "VERDE", "VERDE BOTELLA", "VERDE OLIVA", "VERDE OLIVO / MILITAR", "VERDE MILITAR", "VERDE CEMENTO", "VINO", "ARENA"
];
const colorMap = {};
knownColors.forEach((c, i) => colorMap[c.toLowerCase()] = String(i + 1).padStart(2, '0'));

const sizeMap = {
    "xs": "0", "s": "1", "m": "2", "l": "3", "xl": "4", "xxl": "5",
    "28": "1", "30": "2", "32": "3", "34": "4", "36": "5", "38": "6", "40": "7"
};

async function updateBarcodes() {
    console.log('Starting barcode generation matrix...');
    let totalUpdatedVariants = 0;
    const processedSkus = new Set();
    
    try {
        const { data: products } = await supabase.from('products').select('id, name_es, sku');
        
        for (const product of products) {
            let matchedStyle = null;
            for (const [key, code] of Object.entries(productMapping)) {
                if (product.name_es.toLowerCase().includes(key.toLowerCase())) {
                    matchedStyle = code;
                    break;
                }
            }
            
            if (!matchedStyle) continue;

            console.log(`Processing Product: ${product.name_es} -> Style Code: ${matchedStyle}`);

            // Update parent product sku
            await supabase.from('products').update({ sku: matchedStyle }).eq('id', product.id);

            // Get variants
            const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', product.id);
            
            for (const variant of variants) {
                const colorLower = variant.color ? variant.color.toLowerCase().trim() : '';
                const sizeLower = variant.size ? variant.size.toLowerCase().trim() : '';

                // Identify color code
                let colorCode = colorMap[colorLower];
                if (!colorCode && colorLower) {
                    // Try partial match or add new
                    const existingKey = Object.keys(colorMap).find(k => colorLower.includes(k) || k.includes(colorLower));
                    if (existingKey) {
                        colorCode = colorMap[existingKey];
                    } else {
                        const nextId = Object.keys(colorMap).length + 1;
                        colorCode = String(nextId).padStart(2, '0');
                        colorMap[colorLower] = colorCode;
                    }
                }
                if (!colorCode) colorCode = "00";

                // Identify size code
                let sizeCode = sizeMap[sizeLower] || "9";

                // Generate new standard barcode (Purely numeric to avoid any issues)
                const barcode = `${matchedStyle}${colorCode}${sizeCode}`;

                // Generate new SKU variant (Style-ColorCode-SizeAbbrev)
                // Using colorCode here ensures uniqueness across the style if different products share a style
                const sizeAbbrev = variant.size ? variant.size.toUpperCase() : 'XX';
                let newSkuVariant = `${matchedStyle}-${colorCode}-${sizeAbbrev}`;

                // Final safety check for SKU collisions within the table
                // If it exists in our current run, or we suspect it's in DB (though we represent the source of truth here)
                // We will try to update it; if it fails due to DB constraint, we'll log it specifically.
                
                const { error } = await supabase
                    .from('product_variants')
                    .update({ barcode, sku_variant: newSkuVariant })
                    .eq('id', variant.id);

                if (error) {
                    if (error.code === '23505') {
                        // If collision, append a small random to the SKU to unblock, but keep barcode same if logical
                        newSkuVariant = `${newSkuVariant}-${Math.floor(Math.random()*900)+100}`;
                        await supabase.from('product_variants').update({ barcode, sku_variant: newSkuVariant }).eq('id', variant.id);
                        totalUpdatedVariants++;
                    } else {
                        console.error(`Error updating variant ${variant.id}:`, error);
                    }
                } else {
                    totalUpdatedVariants++;
                }
            }
        }
        console.log(`Successfully updated ${totalUpdatedVariants} variants.`);
    } catch (e) {
        console.error(e);
    }
}

updateBarcodes();
