import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvlavdmvybylvutkmptl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    console.log('--- Checking products table schema ---');

    // Fetch one product to see all columns
    const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .limit(3);

    if (prodErr) {
        console.error('Products error:', prodErr);
    } else {
        console.log('Product columns (keys from first row):', products[0] ? Object.keys(products[0]) : 'No products');
        console.log('Products count:', products.length);
        if (products[0]) {
            console.log('Sample product:', JSON.stringify(products[0], null, 2));
        }
    }

    console.log('\n--- Checking categories ---');
    const { data: cats, error: catErr } = await supabase
        .from('categories')
        .select('*');

    if (catErr) {
        console.error('Categories error:', catErr);
    } else {
        console.log('Categories:', JSON.stringify(cats, null, 2));
    }

    console.log('\n--- Checking products with sub_categories join ---');
    const { data: joinedProds, error: joinErr } = await supabase
        .from('products')
        .select('id, name, sub_category_id, category_id, sub_categories(category_id)')
        .limit(5);

    if (joinErr) {
        console.error('Join error:', joinErr.message, joinErr.details);
    } else {
        console.log('Joined products:', JSON.stringify(joinedProds, null, 2));
    }
}

test().catch(console.error);
