const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const styleCode = "00501000";

async function getPoloPimaTable() {
    try {
        // Find all products that match 'Polo Básico'
        const { data: products } = await supabase
            .from('products')
            .select('id, name_es')
            .ilike('name_es', '%Polo Básico%');
            
        const productIds = products.map(p => p.id);
        
        // Find all variants for these products
        const { data: variants, error } = await supabase
            .from('product_variants')
            .select(`
                barcode, 
                sku_variant,
                color,
                size,
                product_id,
                products (name_es)
            `)
            .in('product_id', productIds)
            .order('color', { ascending: true })
            .order('size', { ascending: true });

        if (error) {
            console.error(error);
        } else {
            // Generate Markdown Table
            let md = "| Color | Talla | SKU Variant | Código de Barras |\n";
            md += "| :--- | :--- | :--- | :--- |\n";
            
            variants.forEach(v => {
                md += `| ${v.color || 'N/A'} | ${v.size || 'N/A'} | ${v.sku_variant || 'N/A'} | ${v.barcode || 'N/A'} |\n`;
            });
            
            console.log('MARKDOWN_START');
            console.log(md);
            console.log('MARKDOWN_END');
        }
    } catch (e) {
        console.error(e);
    }
}

getPoloPimaTable();
