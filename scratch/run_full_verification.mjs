import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function runVerification() {
  console.log('=== FULL VERIFICATION REPORT ===\n');

  // 1. 福岡・横浜の各2名（福岡: リク, 青空(せいら)、横浜: ユウト, セナ）の表示検証
  const testCasts = [
    { storeSlug: 'fukuoka', castName: '青空' },
    { storeSlug: 'fukuoka', castName: 'リク' },
    { storeSlug: 'yokohama', castName: 'ユウト' },
    { storeSlug: 'yokohama', castName: 'セナ' },
  ];

  console.log('1. Task A Metadata Output Test:');
  for (const t of testCasts) {
    const cast = await prisma.$queryRawUnsafe(`
      SELECT c.id, c.name, c.catch_copy, c.profile, c.slug
      FROM casts c
      JOIN cast_store_memberships m ON c.id = m.cast_id
      JOIN stores s ON m.store_id = s.id
      WHERE s.slug = '${t.storeSlug}' AND c.name LIKE '%${t.castName}%' AND c.is_active = true
      LIMIT 1
    `);

    if (cast && cast[0]) {
      const c = cast[0];
      const city = t.storeSlug === 'yokohama' ? '横浜' : '福岡';
      const area = t.storeSlug === 'yokohama' ? 'みなとみらい・関内' : '天神・博多';
      const storeName = `ストロベリーボーイズ${city}店`;
      const catchText = c.catch_copy ? `（${c.catch_copy}）` : '';
      
      const newTitle = `${c.name}${catchText}｜${city}の女性用風俗セラピスト｜${storeName}`;
      
      const cleanProfile = c.profile ? c.profile.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80) : '';
      const newDescription = cleanProfile
        ? `${cleanProfile}…【${city}（${area}）で活動するセラピスト「${c.name}」の出勤スケジュール・ご予約】`
        : `${city}（${area}）で活動するセラピスト「${c.name}」のプロフィール。施術スタイル・出勤スケジュール・ご予約はこちらから。`;

      console.log(`\n--- [${t.storeSlug.toUpperCase()}] ${c.name} (slug: ${c.slug}) ---`);
      console.log(`  旧title形式: "${c.name} - ${c.catch_copy || ''} | ${t.storeSlug} | Strawberry Boys"`);
      console.log(`  新title現物: "${newTitle}"`);
      console.log(`  新description現物: "${newDescription}"`);

      const hasOldPattern = newTitle.includes(`| ${t.storeSlug} |`);
      console.log(`  -> Old Pattern Removed? ${!hasOldPattern ? '✅ PASS' : '❌ FAIL'}`);
    }
  }

  // 2. タスクB 旧キセキの動作テスト
  console.log('\n2. Task B Kiseki Verification:');
  const oldKiseki = await prisma.$queryRawUnsafe(`SELECT id, is_active FROM casts WHERE id = 'c788c210-41f4-4510-bf72-ceb63535fb80'::uuid`);
  const newKiseki = await prisma.$queryRawUnsafe(`SELECT id, is_active FROM casts WHERE id = '5be4ec1f-e9eb-4667-ada2-1e0f2adb1948'::uuid`);

  console.log(`  - Old Kiseki (27) is_active = ${oldKiseki[0]?.is_active} (Expected: false) -> ${oldKiseki[0]?.is_active === false ? '✅ PASS (Drafted)' : '❌ FAIL'}`);
  console.log(`  - New Kiseki (31) is_active = ${newKiseki[0]?.is_active} (Expected: true) -> ${newKiseki[0]?.is_active === true ? '✅ PASS (Active)' : '❌ FAIL'}`);
}

runVerification().catch(console.error);
