import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      casts!inner (
        name,
        mbti_id,
        face_id,
        mbti:mbti_id(name),
        face:face_id(name)
      )
    `,
    )
    .not('casts.mbti_id', 'is', null)
    .limit(3);

  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

run();
