import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function inspectAllProfiles() {
  console.log('=== INSPECTING ALL PROFILE DATA FROM DB ===\n');

  // 横浜店と東京店のキャストデータ
  const yokohamaCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.manager_comment, c.ai_summary, c.slug, s.slug as store_slug
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'yokohama' AND c.is_active = true
  `;

  const tokyoCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.manager_comment, c.ai_summary, c.slug, s.slug as store_slug
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'tokyo' AND c.is_active = true
  `;

  const validYokohama = yokohamaCasts.filter(c => !['www', 'popop', '受付担当', 'あああ', 'wwwww', '田中　テスト用'].includes(c.name));

  console.log(`Auditing ${validYokohama.length} Yokohama active casts...`);

  const auditReport = [];

  for (const y of validYokohama) {
    const tMatches = tokyoCasts.filter(t => t.name === y.name);
    const matchedT = tMatches.length > 0 ? tMatches[0] : null;

    let isCopy = false;
    let details = '';

    const yProfile = (y.profile || '').trim();
    const tProfile = matchedT ? (matchedT.profile || '').trim() : '';

    const yCatch = (y.catch_copy || '').trim();
    const tCatch = matchedT ? (matchedT.catch_copy || '').trim() : '';

    if (matchedT) {
      if (yProfile && tProfile) {
        if (yProfile === tProfile) {
          isCopy = true;
          details = 'プロフィール本文が完全同一 (100% コピー)';
        } else if (yProfile.includes(tProfile) || tProfile.includes(yProfile)) {
          isCopy = true;
          details = 'プロフィール本文が部分同一 (ほぼコピー)';
        } else {
          details = 'プロフィール本文は店舗ごとに別文言が設定されている';
        }
      } else if (yCatch && tCatch && yCatch === tCatch) {
        isCopy = true;
        details = 'キャッチコピーが完全同一';
      } else {
        details = '文言未設定または異なる内容';
      }
    } else {
      details = '東京店DBレコードなし (東京Webサイトで別管理の可能性)';
    }

    auditReport.push({
      name: y.name,
      age: y.age,
      yokohamaSlug: y.slug,
      tokyoSlug: matchedT ? matchedT.slug : null,
      bothInDb: Boolean(matchedT),
      isCopy,
      details,
      yokohamaProfile: yProfile || '(未設定)',
      tokyoProfile: tProfile || '(未設定)',
      yokohamaCatch: yCatch || '(未設定)',
      tokyoCatch: tCatch || '(未設定)'
    });
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  const bothCount = auditReport.filter(a => a.bothInDb).length;
  const copyCount = auditReport.filter(a => a.isCopy).length;

  console.log(`1. Total Active Yokohama Casts: ${auditReport.length}`);
  console.log(`2. Registered in Both Stores (Tokyo & Yokohama DB): ${bothCount}`);
  console.log(`3. Profile Text Identical / Copy Count: ${copyCount}\n`);

  for (const a of auditReport) {
    console.log(`- ${a.name} (${a.age ?? '??'}歳): Both DB? ${a.bothInDb ? 'YES' : 'NO'} | Copy? ${a.isCopy ? '✅ YES' : '❌ NO'} | ${a.details}`);
  }

  // 3名分の比較データ（コピーまたは兼任のサンプル）
  const sampleList = auditReport.filter(a => a.bothInDb);
  console.log('\n=== 3 CASTS COMPARISON SAMPLE ===\n');

  for (let i = 0; i < Math.min(3, sampleList.length); i++) {
    const s = sampleList[i];
    console.log(`--- 【サンプル ${i + 1}】 ${s.name} さん (${s.age ?? '??'}歳) ---`);
    console.log(`[横浜店 (/store/yokohama/cast/${s.yokohamaSlug})]`);
    console.log(`  キャッチコピー: ${s.yokohamaCatch}`);
    console.log(`  プロフィール本文: ${s.yokohamaProfile}`);
    console.log(`[東京サイト/東京店 (/store/tokyo/cast/${s.tokyoSlug})]`);
    console.log(`  キャッチコピー: ${s.tokyoCatch}`);
    console.log(`  プロフィール本文: ${s.tokyoProfile}`);
    console.log(`  判定: ${s.details}\n`);
  }

  fs.writeFileSync('scratch/final_audit_summary.json', JSON.stringify({
    totalAudited: auditReport.length,
    bothCount,
    copyCount,
    auditReport
  }, null, 2));
}

inspectAllProfiles().catch(console.error);
