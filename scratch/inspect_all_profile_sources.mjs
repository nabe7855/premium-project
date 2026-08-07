import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function inspectAllProfiles() {
  console.log('=== INSPECTING ALL PROFILE SOURCES FOR YOKOHAMA & TOKYO CASTS ===\n');

  // 横浜店と東京店の各キャストの詳細情報を全テーブルから取得
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

  // CastProfile テーブルも取得
  const castProfiles = await prisma.castProfile.findMany();
  console.log(`Found ${castProfiles.length} entries in CastProfile table.`);

  const validYokohama = yokohamaCasts.filter(c => !['www', 'popop', '受付担当', 'あああ', 'wwwww', '田中　テスト用'].includes(c.name));

  const comparisonReport = [];

  for (const y of validYokohama) {
    // 東京側キャストを名前でマッチング
    const tList = tokyoCasts.filter(t => t.name === y.name);

    // CastProfile (cast_profiles テーブル) からのサブプロフィールも探す
    const ySubProfiles = castProfiles.filter(p => p.cast_id === y.id);
    
    let matchedTokyoCast = null;
    let tSubProfiles = [];

    if (tList.length > 0) {
      matchedTokyoCast = tList[0];
      tSubProfiles = castProfiles.filter(p => p.cast_id === matchedTokyoCast.id);
    }

    // 重複判定
    let isCopy = false;
    let matchDetail = '';

    const yContent = [y.profile, y.catch_copy, y.manager_comment, ...ySubProfiles.map(p => p.content)].filter(Boolean).join('\n');
    const tContent = matchedTokyoCast ? [matchedTokyoCast.profile, matchedTokyoCast.catch_copy, matchedTokyoCast.manager_comment, ...tSubProfiles.map(p => p.content)].filter(Boolean).join('\n') : '';

    if (matchedTokyoCast && yContent && tContent) {
      const cleanY = yContent.replace(/\s+/g, '');
      const cleanT = tContent.replace(/\s+/g, '');

      if (cleanY === cleanT || cleanY.includes(cleanT) || cleanT.includes(cleanY)) {
        isCopy = true;
        matchDetail = 'プロフィール・キャッチコピー・詳細文章が完全または実質同一';
      } else {
        // 文章のオーバーラップ度（共通フレーズの有無）
        let commonChars = 0;
        for (let i = 0; i < cleanY.length - 10; i += 5) {
          const chunk = cleanY.substring(i, i + 10);
          if (cleanT.includes(chunk)) commonChars += 10;
        }
        if (commonChars > 20) {
          isCopy = true;
          matchDetail = `文章の一部・フレーズが同一 (共通文字部分あり)`;
        } else {
          matchDetail = '文章内容が異なる';
        }
      }
    } else if (matchedTokyoCast) {
      matchDetail = '片方または両方の文章データが空白';
    } else {
      matchDetail = '東京DB未登録 (東京Webサイトのみ掲載可能性あり)';
    }

    comparisonReport.push({
      name: y.name,
      yokohamaCastId: y.id,
      tokyoCastId: matchedTokyoCast ? matchedTokyoCast.id : null,
      isCopy,
      matchDetail,
      yokohamaText: yContent || '(データなし)',
      tokyoText: tContent || '(データなし)',
      yokohamaProfileRaw: y.profile,
      tokyoProfileRaw: matchedTokyoCast ? matchedTokyoCast.profile : null,
      yokohamaCatchRaw: y.catch_copy,
      tokyoCatchRaw: matchedTokyoCast ? matchedTokyoCast.catch_copy : null,
    });
  }

  console.log('=== AUDIT RESULTS SUMMARY ===');
  console.log(`Total Yokohama Casts Audited: ${comparisonReport.length}`);
  const copyCount = comparisonReport.filter(r => r.isCopy).length;
  console.log(`Number of Casts with Identical/Copy Profiles: ${copyCount} / ${comparisonReport.length}\n`);

  for (const r of comparisonReport) {
    console.log(`- [${r.name}] -> Both Stores? ${r.tokyoCastId ? 'YES' : 'NO (DB)'} | Is Copy? ${r.isCopy ? '✅ YES' : '❌ NO'} (${r.matchDetail})`);
  }

  // サンプル3名の抽出
  const samples = comparisonReport.filter(r => r.tokyoCastId !== null).slice(0, 3);
  fs.writeFileSync('scratch/all_profile_sources_report.json', JSON.stringify({ copyCount, comparisonReport, samples }, null, 2));
}

inspectAllProfiles().catch(console.error);
