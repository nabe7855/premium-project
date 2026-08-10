import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatTimeJST(datetime) {
  if (!datetime) return '??:??';
  try {
    const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
    if (isNaN(dateObj.getTime())) return '??:??';

    const formatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(dateObj);
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch (err) {
    return '??:??';
  }
}

function getDateJST(datetime) {
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dateObj);
}

function formatScheduleTime(startDatetime, endDatetime, separator = '〜') {
  if (!startDatetime && !endDatetime) return '時間未定';
  if (!startDatetime) return `??:??${separator}${formatTimeJST(endDatetime)}`;
  if (!endDatetime) return `${formatTimeJST(startDatetime)}${separator}??:??`;

  const startTimeStr = formatTimeJST(startDatetime);
  let endTimeStr = formatTimeJST(endDatetime);

  try {
    const startDateObj = typeof startDatetime === 'string' ? new Date(startDatetime) : startDatetime;
    const endDateObj = typeof endDatetime === 'string' ? new Date(endDatetime) : endDatetime;

    if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
      const startJSTDay = getDateJST(startDateObj);
      const endJSTDay = getDateJST(endDateObj);

      if (endJSTDay > startJSTDay || (endJSTDay === startJSTDay && endDateObj.getTime() < startDateObj.getTime())) {
        endTimeStr = `翌${endTimeStr}`;
      } else if (endJSTDay === startJSTDay) {
        const [sH, sM] = startTimeStr.split(':').map(Number);
        const [eH, eM] = endTimeStr.split(':').map(Number);
        if (eH < sH || (eH === sH && eM < sM)) {
          endTimeStr = `翌${endTimeStr}`;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  return `${startTimeStr}${separator}${endTimeStr}`;
}

async function runVerification() {
  console.log('====================================================');
  console.log('=== VERIFYING SCHEDULE & CAST PROFILE TIME MATCH ===');
  console.log('====================================================\n');

  const comparisonRows = [];

  for (const storeSlug of ['fukuoka', 'yokohama']) {
    console.log(`\n--- STORE: ${storeSlug.toUpperCase()} ---`);
    
    const { data: casts } = await supabase
      .from('casts')
      .select('id, name, slug, cast_store_memberships!inner(stores!inner(slug))')
      .eq('is_active', true)
      .eq('cast_store_memberships.stores.slug', storeSlug)
      .limit(3);

    if (!casts) continue;

    for (const cast of casts) {
      const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('cast_id', cast.id)
        .order('work_date', { ascending: true })
        .limit(3);

      for (const s of schedules || []) {
        const listStr = formatScheduleTime(s.start_datetime, s.end_datetime, ' - ');
        const detailStr = formatScheduleTime(s.start_datetime, s.end_datetime, '〜');
        const match = listStr.replace(' - ', '〜') === detailStr;

        comparisonRows.push({
          store: storeSlug,
          name: cast.name,
          slug: cast.slug,
          date: s.work_date,
          start: s.start_datetime,
          end: s.end_datetime,
          list: listStr,
          detail: detailStr,
          isMatch: match
        });
      }
    }
  }

  console.table(comparisonRows);

  // Check specific cross-day shifts
  console.log('\n====================================================');
  console.log('=== CHECKING SPECIFIC CROSS-DAY SHIFTS ===');
  console.log('====================================================\n');

  const specialRows = [];
  const specialCasts = [
    { name: 'ノブアキ', date: '2026-08-29' },
    { name: 'popop', date: '2025-09-10' }
  ];

  for (const item of specialCasts) {
    const { data: cast } = await supabase.from('casts').select('id, name, slug').eq('name', item.name).single();
    if (cast) {
      const { data: sch } = await supabase.from('schedules').select('*').eq('cast_id', cast.id).eq('work_date', item.date).single();
      if (sch) {
        const listStr = formatScheduleTime(sch.start_datetime, sch.end_datetime, ' - ');
        const detailStr = formatScheduleTime(sch.start_datetime, sch.end_datetime, '〜');
        specialRows.push({
          name: cast.name,
          date: sch.work_date,
          rawStart: sch.start_datetime,
          rawEnd: sch.end_datetime,
          list: listStr,
          detail: detailStr,
          isMatch: listStr.replace(' - ', '〜') === detailStr
        });
      }
    }
  }

  console.table(specialRows);

  // Fetch production HTML snippets
  console.log('\n====================================================');
  console.log('=== FETCHING PRODUCTION HTML SNIPPETS ===');
  console.log('====================================================\n');

  try {
    const scheduleUrl = 'https://www.sutoroberrys.jp/store/fukuoka/schedule';
    const htmlSchedule = execSync(`curl.exe -s "${scheduleUrl}"`, { encoding: 'utf8' });
    const matchesSchedule = htmlSchedule.match(/\d{2}:\d{2}\s*[-〜]\s*(?:翌)?\d{2}:\d{2}/g);
    console.log(`Production Schedule Page Snippets:`, matchesSchedule?.slice(0, 6));

    const castUrl = 'https://www.sutoroberrys.jp/store/fukuoka/cast/shohei';
    const htmlCast = execSync(`curl.exe -s "${castUrl}"`, { encoding: 'utf8' });
    const matchesCast = htmlCast.match(/\d{2}:\d{2}\s*[-〜]\s*(?:翌)?\d{2}:\d{2}/g) || htmlCast.match(/\d{2}:\d{2}〜(?:翌)?\d{2}:\d{2}/g);
    console.log(`Production Cast Detail Snippets:`, matchesCast?.slice(0, 6));
  } catch (e) {
    console.error('Error fetching production HTML snippets:', e);
  }
}

runVerification().catch(console.error);
