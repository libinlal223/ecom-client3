import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvlavdmvybylvutkmptl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('products')
    .select('*, sub_categories(category_id), product_images(image_url)')
    .limit(2);
    
  console.log("Raw products:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}

test();
