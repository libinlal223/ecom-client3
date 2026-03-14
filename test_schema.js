import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pvlavdmvybylvutkmptl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bGF2ZG12eWJ5bHZ1dGttcHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NDA3MTMsImV4cCI6MjA4NjAxNjcxM30.ckWt5px3kUOG6F2OSPAw6f3oNkvAY4-ajZmaEsRm_GQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    console.log("Categories columns:", data && data.length ? Object.keys(data[0]) : "No data/error", error);
}
checkSchema();
