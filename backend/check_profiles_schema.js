require('dotenv').config();
const supabase = require('./src/config/database');

async function check() {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    console.log(data);
    if(error) console.error(error);
}
check();
