
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ACCESS_INFO_PATH = 'c:\\Users\\nabe7\\Documents\\Projects\\premium-project\\data\\raw_hotel_data\\hotels_access_info.json';

async function main() {
  // 1. カラムを追加（存在しなければ）
  console.log('Step 1: Adding access_info column if not exists...');
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE lh_hotels ADD COLUMN IF NOT EXISTS access_info jsonb'
  });
  if (alterError) {
    // rpcが無い場合はスキップして進む
    console.log('  Note: Could not run ALTER via RPC. Attempting data sync anyway...');
  } else {
    console.log('  Column ready.');
  }

  // 2. データ同期
  const accessData = JSON.parse(fs.readFileSync(ACCESS_INFO_PATH, 'utf8'));
  const hotelIds = Object.keys(accessData);
  console.log(`Step 2: Syncing access info for ${hotelIds.length} hotels...`);

  let successCount = 0;
  let errorCount = 0;
  const BATCH = 100;

  for (let i = 0; i < hotelIds.length; i += BATCH) {
    const batchIds = hotelIds.slice(i, i + BATCH);
    
    const updates = batchIds.map(id => {
      const info = accessData[id];
      const stationsArr = Array.isArray(info.stations) ? info.stations : [];
      const summary = stationsArr[0]?.trim() || (info.parking ? `P: ${info.parking}` : null);
      return { id, access_info: info, station_summary: summary };
    });

    let firstErr = null;
    for (const u of updates) {
      const updateData = { access_info: u.access_info };
      if (u.station_summary) {
        updateData.distance_from_station = u.station_summary;
      }
      
      const { error } = await supabase
        .from('lh_hotels')
        .update(updateData)
        .eq('id', u.id);

      if (error) {
        errorCount++;
        if (!firstErr) firstErr = error;
      } else {
        successCount++;
      }
    }
    if (firstErr) {
      console.log(`  Error (first of batch): ${firstErr.message} / Code: ${firstErr.code}`);
    }

    if ((i + BATCH) % 500 === 0 || i + BATCH >= hotelIds.length) {
      console.log(`  Progress: ${Math.min(i + BATCH, hotelIds.length)}/${hotelIds.length} processed`);
    }
  }

  console.log(`Done. Updated: ${successCount}, Errors: ${errorCount}`);
}

main().catch(console.error);
