import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const storeId = 'fc7964f7-73b6-4acb-8fb7-5dfc4f67157c'; // Osaka
  const dateStr = '2026-02-28';

  console.log('--- FINAL TEST: schedules.store_id filter ---');
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
        age,
        height,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active
      )
    `,
    )
    .eq('work_date', dateStr)
    .eq('store_id', storeId);

  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log(`Success! Found ${data?.length || 0} schedules.`);
    data?.forEach((s) => {
      console.log(`  Cast: ${s.casts?.name}, is_active: ${s.casts?.is_active}`);
    });
  }
}

debug();
