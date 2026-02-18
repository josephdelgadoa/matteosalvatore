
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function dumpTree() {
    console.log('Fetching all categories...');
    const { data: categories, error } = await supabase
        .from('product_categories')
        .select('id, name_es, parent_id, display_order')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error:', error);
        return;
    }

    const map = new Map();
    const roots = [];

    categories.forEach(c => map.set(c.id, { ...c, children: [] }));

    categories.forEach(c => {
        if (c.parent_id && map.has(c.parent_id)) {
            map.get(c.parent_id).children.push(map.get(c.id));
        } else {
            roots.push(map.get(c.id));
        }
    });

    function printNode(node, depth = 0) {
        console.log('  '.repeat(depth) + `- ${node.name_es} (Order: ${node.display_order}) [ID: ${node.id}]`);
        node.children.forEach(child => printNode(child, depth + 1));
    }

    console.log('\n--- Category Tree ---');
    roots.forEach(root => printNode(root));
    console.log('---------------------');

    // Check for orphans/cycles that didn't make it into the tree
    const allIdsInTree = new Set();
    function collectIds(node) {
        allIdsInTree.add(node.id);
        node.children.forEach(collectIds);
    }
    roots.forEach(collectIds);

    const orphans = categories.filter(c => !allIdsInTree.has(c.id));
    if (orphans.length > 0) {
        console.log('\n!!! ORPHANS DETECTED (Possible Cycles) !!!');
        orphans.forEach(o => console.log(`${o.name_es} (Parent: ${o.parent_id})`));
    }
}

dumpTree();
