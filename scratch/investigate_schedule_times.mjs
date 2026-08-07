import { prisma } from '../src/lib/prisma.ts';

const fmt = (opts) => (iso) => new Date(iso).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', ...opts });
const utcHM = fmt({ timeZone: 'UTC' });      // what the LIST page shows (server TZ = UTC)
const jstHM = fmt({ timeZone: 'Asia/Tokyo' }); // what the DETAIL page shows (JST)

async function main() {
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name, data_type, datetime_precision
    FROM information_schema.columns
    WHERE table_name='schedules' AND column_name IN ('work_date','start_datetime','end_datetime')
    ORDER BY ordinal_position;`);
  console.log('=== schedules time columns ===');
  console.log(JSON.stringify(cols, null, 2));

  for (const slug of ['fukuoka', 'yokohama']) {
    const store = await prisma.store.findUnique({ where: { slug } });
    if (!store) { console.log(`NO STORE ${slug}`); continue; }
    console.log(`\n\n########## STORE ${slug} (${store.id}) ##########`);

    const castRows = await prisma.$queryRawUnsafe(`
      SELECT DISTINCT s.cast_id, c.name
      FROM schedules s JOIN casts c ON c.id = s.cast_id
      WHERE s.store_id = '${store.id}' AND s.start_datetime IS NOT NULL
      LIMIT 3;`);

    for (const cr of castRows) {
      const rows = await prisma.$queryRawUnsafe(`
        SELECT work_date::text AS work_date, start_datetime::text AS s_raw, end_datetime::text AS e_raw
        FROM schedules
        WHERE store_id='${store.id}' AND cast_id='${cr.cast_id}' AND start_datetime IS NOT NULL
        ORDER BY work_date DESC LIMIT 3;`);
      console.log(`\n--- CAST ${cr.name} ---`);
      for (const r of rows) {
        const sIso = r.s_raw, eIso = r.e_raw;
        console.log(`  ${r.work_date} | DB raw start=${sIso}  end=${eIso}`);
        console.log(`      LIST(UTC)=${utcHM(sIso)}-${utcHM(eIso)}   DETAIL(JST)=${jstHM(sIso)}〜${jstHM(eIso)}`);
      }
    }
  }

  // Also hunt the specific named casts from the report
  console.log('\n\n===== SPECIFIC NAMED CASTS (ススム / ゆうひ / ショウタ) =====');
  const named = await prisma.$queryRawUnsafe(`
    SELECT c.name, s.work_date::text AS work_date, s.start_datetime::text AS s_raw, s.end_datetime::text AS e_raw
    FROM schedules s JOIN casts c ON c.id=s.cast_id
    WHERE c.name IN ('ススム','ゆうひ','ショウタ') AND s.start_datetime IS NOT NULL
    ORDER BY c.name, s.work_date DESC LIMIT 30;`);
  for (const r of named) {
    console.log(`  ${r.name} ${r.work_date} | raw ${r.s_raw} → ${r.e_raw} | LIST(UTC)=${utcHM(r.s_raw)}-${utcHM(r.e_raw)}  DETAIL(JST)=${jstHM(r.s_raw)}〜${jstHM(r.e_raw)}`);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
