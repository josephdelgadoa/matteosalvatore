require('dotenv').config();
const supabase = require('./src/config/database');

async function check() {
    const { data: stores, error } = await supabase.from('stores').select('*');
    console.log(stores);
    if(error) console.error(error);
}
check();
