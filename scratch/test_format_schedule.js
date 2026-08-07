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

console.log('=== TESTING JST FORMAT SCHEDULE TIME ===\n');

// 1. Same day (12:00 -> 20:00 JST)
console.log('1. Same day (12:00-20:00 JST):', formatScheduleTime('2026-08-07T03:00:00.000Z', '2026-08-07T11:00:00.000Z', '〜'));

// 2. Cross day (18:00 JST -> 翌04:00 JST)
console.log('2. Cross day (18:00-翌04:00 JST):', formatScheduleTime('2026-08-07T09:00:00.000Z', '2026-08-07T19:00:00.000Z', '〜'));

// 3. Nobuaki (06:00 JST -> 翌00:00 JST)
console.log('3. Nobuaki (06:00-翌00:00 JST):', formatScheduleTime('2026-08-28T21:00:00.000Z', '2026-08-29T15:00:00.000Z', '〜'));

// 4. Popop (12:00 JST -> 翌04:00 JST)
console.log('4. Popop (12:00-翌04:00 JST):', formatScheduleTime('2025-09-10T03:00:00.000Z', '2025-09-10T19:00:00.000Z', '〜'));
