import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function formatTimeJST(datetime) {
  if (!datetime) return '??:??';
  const dateObj = new Date(datetime);
  const formatter = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false });
  const parts = formatter.formatToParts(dateObj);
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
}

function getDateJST(datetime) {
  const dateObj = new Date(datetime);
  const formatter = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' });
  return formatter.format(dateObj);
}

function formatScheduleTime(startDatetime, endDatetime, separator = '〜') {
  if (!startDatetime && !endDatetime) return '時間未定';
  if (!startDatetime) return `??:??${separator}${formatTimeJST(endDatetime)}`;
  if (!endDatetime) return `${formatTimeJST(startDatetime)}${separator}??:??`;

  const startTimeStr = formatTimeJST(startDatetime);
  let endTimeStr = formatTimeJST(endDatetime);

  try {
    const startDateObj = new Date(startDatetime);
    const endDateObj = new Date(endDatetime);

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
  } catch (e) {}

  return `${startTimeStr}${separator}${endTimeStr}`;
}

async function findCasts() {
  const { data: casts } = await supabase.from('casts').select('id, name, slug');
  console.log('Total casts:', casts.length);
  casts.forEach(c => {
    if (c.name.includes('ノブ') || c.name.includes('のぶ') || c.slug.includes('nobu') || c.name.includes('pop') || c.slug.includes('pop')) {
      console.log('Found:', c);
    }
  });

  const { data: schs } = await supabase.from('schedules').select('*, casts(name, slug)').in('work_date', ['2026-08-29', '2025-09-10', '2026-08-28', '2026-08-30']);
  console.log('\nSchedules on target dates:', schs.length);
  schs.forEach(s => {
    console.log(`Cast: ${s.casts?.name} | Date: ${s.work_date} | Start: ${s.start_datetime} | End: ${s.end_datetime} | List: "${formatScheduleTime(s.start_datetime, s.end_datetime, ' - ')}" | Detail: "${formatScheduleTime(s.start_datetime, s.end_datetime, '〜')}"`);
  });
}

findCasts();
