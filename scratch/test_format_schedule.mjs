import { formatScheduleTime, formatTimeJST } from '../src/lib/utils/formatSchedule.js';

console.log('=== TESTING JST FORMAT SCHEDULE TIME ===\n');

// Test case 1: Same day shift (12:00 -> 20:00 JST)
// UTC: 2026-08-07T03:00:00Z -> 2026-08-07T11:00:00Z
const t1Start = '2026-08-07T03:00:00.000Z';
const t1End = '2026-08-07T11:00:00.000Z';
console.log('1. Same day (12:00-20:00 JST):', formatScheduleTime(t1Start, t1End, '〜'));

// Test case 2: Cross day shift (18:00 JST -> 翌04:00 JST)
// UTC: 2026-08-07T09:00:00Z -> 2026-08-07T19:00:00Z
const t2Start = '2026-08-07T09:00:00.000Z';
const t2End = '2026-08-07T19:00:00.000Z';
console.log('2. Cross day (18:00-翌04:00 JST):', formatScheduleTime(t2Start, t2End, '〜'));

// Test case 3: Nobuaki (2026-08-29: 15:00 UTC = 00:00 JST -> 09:00 UTC = 18:00 JST or 21:00 UTC = 06:00 JST -> 15:00 UTC = 00:00 JST)
// 06:00 JST (2026-08-28T21:00:00Z) -> 00:00 JST (2026-08-29T15:00:00Z)
const t3Start = '2026-08-28T21:00:00.000Z';
const t3End = '2026-08-29T15:00:00.000Z';
console.log('3. Nobuaki (06:00-翌00:00 JST):', formatScheduleTime(t3Start, t3End, '〜'));

// Test case 4: Popop (2025-09-10)
const t4Start = '2025-09-10T03:00:00.000Z'; // 12:00 JST
const t4End = '2025-09-10T19:00:00.000Z';   // 04:00 JST next day
console.log('4. Popop (12:00-翌04:00 JST):', formatScheduleTime(t4Start, t4End, '〜'));
