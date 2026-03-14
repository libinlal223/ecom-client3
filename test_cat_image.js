import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvlavdmvybylvutkmptl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log("Testing insert with image field...");
    const { data, error } = await supabase.from('categories').insert([{ name: 'TestCat', image: 'test.jpg' }]).select();
    console.log("Result:", data, error);
    if (data && data.length) {
        await supabase.from('categories').delete().eq('id', data[0].id);
    }
}
checkSchema();
