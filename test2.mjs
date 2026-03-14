import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
    'https://pvlavdmvybylvutkmptl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ'
);

const { data: p, error: e } = await supabase.from('products').select('id,name,sub_category_id,category_id').limit(3);
if (e) console.log('ERROR:', e.message, e.code);
else console.log('PRODUCTS:', JSON.stringify(p));

const { data: c, error: ce } = await supabase.from('categories').select('id,name').limit(10);
if (ce) console.log('CAT ERROR:', ce.message);
else console.log('CATEGORIES:', JSON.stringify(c));
