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
      work_date,
      start_datetime,
      end_datetime,
      status,
      casts!inner (
        id,
        name,
        mbti:feature_master!casts_mbti_id_fkey ( name ),
        face:feature_master!casts_face_id_fkey ( name ),
        cast_store_memberships!inner (
          stores!inner ( slug )
        )
      )
    `,
    )
    .eq('casts.cast_store_memberships.stores.slug', 'fukuoka')
    .limit(3);

  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

run();
