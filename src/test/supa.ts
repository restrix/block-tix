import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("Supabase URL missing!");
if (!supabaseKey) throw new Error("Supabase anon key missing!");

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('movies').select('*');
  if (error) console.error("Error:", error);
  else console.log("Data:", data);
}

test();
