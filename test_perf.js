import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvlavdmvybylvutkmptl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPerformance() {
    console.time('getCategories');
    await supabase.from('categories').select('*').order('name');
    console.timeEnd('getCategories');

    console.time('getSubcategories');
    await supabase.from('sub_categories').select('*').order('name');
    console.timeEnd('getSubcategories');

    console.time('getProducts (50)');
    await supabase.from('products').select('*, product_images(image_url), sub_categories(category_id)', { count: 'exact' }).range(0, 49).order('created_at', { ascending: false });
    console.timeEnd('getProducts (50)');
}
testPerformance();
