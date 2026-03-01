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

  console.log(`\n--- [DEBUG] Testing 2-step query pattern ---`);

  // Step 1: Get cast IDs for the store
  const { data: casts, error: err1 } = await supabase
    .from('casts')
    .select('id, name')
    .eq('store_id', storeId);

  if (err1) {
    console.error('Error fetching casts:', err1.message);
    return;
  }

  const castIds = casts.map((c) => c.id);
  console.log(`Found ${castIds.length} casts for store. IDs:`, castIds);

  if (castIds.length === 0) {
    console.log('No casts for this store.');
    return;
  }

  // Step 2: Get schedules for these cast IDs
  const { data: schedules, error: err2 } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      start_datetime,
      end_datetime,
      status,
      casts (
        id,
        name,
        age,
        height,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        mbti_id,
        face_id,
        store_id,
        cast_statuses (
          id,
          status_id,
          is_active,
          status_master (
            id,
            name,
            label_color,
            text_color
          )
        )
      )
    `,
    )
    .eq('work_date', dateStr)
    .in('cast_id', castIds);

  if (err2) {
    console.error('Error fetching schedules:', err2.message);
  } else {
    console.log(`Success! Found ${schedules?.length || 0} schedules.`);
    schedules?.forEach((s) => {
      console.log(`  ScheduleID: ${s.id}, Cast: ${s.casts?.name}`);
    });
  }
}

debug();
