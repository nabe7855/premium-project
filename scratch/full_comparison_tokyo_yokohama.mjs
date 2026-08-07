import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import * as cheerio from 'cheerio';

async function runFullComparison() {
  console.log('====================================================');
  console.log('TOKYO SITE vs YOKOHAMA STORE CAST COMPARISON AUDIT');
  console.log('====================================================\n');

  // 1. 横浜店のキャスト（DB）
  const yokohamaCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug, c.image_url, c.main_image_url
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'yokohama' AND c.is_active = true
  `;

  // テスト用・ダミーアカウントの除外
  const activeYokohamaCasts = yokohamaCasts.filter(c => 
    !['www', 'popop', '受付担当', 'あああ', 'wwwww', '田中　テスト用'].includes(c.name)
  );

  console.log(`[1] Total Active Yokohama Store Casts: ${activeYokohamaCasts.length}`);
  console.log(activeYokohamaCasts.map(c => `- ${c.name} (${c.age ?? '??'}歳, slug: ${c.slug})`).join('\n'));
  console.log('\n----------------------------------------------------\n');

  // 2. DB内の東京店所属キャスト
  const tokyoDbCasts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.profile, c.catch_copy, c.is_active, c.slug
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'tokyo' AND c.is_active = true
  `;

  console.log(`[2] Total Tokyo Store Casts in DB: ${tokyoDbCasts.length}`);

  // 3. 東京サイト (sutoroberrys.com/main/) のデータ分析
  const tokyoHtml = fs.readFileSync('scratch/tokyo_page.html', 'utf8');
  const $ = cheerio.load(tokyoHtml);
  const tokyoPageText = $('body').text();

  // 東京サイトと横浜店の兼任（両方在籍）キャストの特定
  const dualBelongingCasts = [];

  for (const yCast of activeYokohamaCasts) {
    // DBの東京キャストに同名で存在するか
    const dbTokyoMatch = tokyoDbCasts.find(t => t.name === yCast.name);
    // 東京サイトのページに名前が存在するか
    const siteTokyoMatch = tokyoPageText.includes(yCast.name);

    if (dbTokyoMatch || siteTokyoMatch) {
      dualBelongingCasts.push({
        yokohamaCast: yCast,
        tokyoDbCast: dbTokyoMatch || null,
        siteTokyoMatch
      });
    }
  }

  console.log(`[3] Dual Belonging Casts Count (Both Tokyo & Yokohama): ${dualBelongingCasts.length}`);
  console.log('Dual Cast Names:', dualBelongingCasts.map(d => d.yokohamaCast.name).join(', '));
  console.log('\n----------------------------------------------------\n');

  // 4. プロフィール同一（コピー）状況の精査
  console.log('[4] Auditing Profile Text Copies...\n');

  const duplicateProfileAudit = [];

  for (const d of dualBelongingCasts) {
    const yCast = d.yokohamaCast;
    const tCast = d.tokyoDbCast;

    let isIdentical = false;
    let similarityNote = '';
    let yProfileText = yCast.profile || '(未設定)';
    let tProfileText = tCast ? (tCast.profile || '(未設定)') : '(東京DB未登録・外部サイト掲載)';

    if (tCast && yCast.profile && tCast.profile) {
      const cleanY = yCast.profile.replace(/\s+/g, '');
      const cleanT = tCast.profile.replace(/\s+/g, '');
      if (cleanY === cleanT) {
        isIdentical = true;
        similarityNote = '完全一致 (100% 同一テキスト)';
      } else if (cleanY.includes(cleanT) || cleanT.includes(cleanY)) {
        isIdentical = true;
        similarityNote = '実質同一 (一部記号・改行差のみのほぼコピー)';
      } else {
        similarityNote = '異なるプロフィール文';
      }
    } else if (yCast.profile && !tCast) {
      // 外部東京サイトのテキストと比較
      if (tokyoPageText.includes(yCast.profile.substring(0, 30))) {
        isIdentical = true;
        similarityNote = '実質同一 (東京Webサイト上の文言と一致)';
      }
    }

    duplicateProfileAudit.push({
      name: yCast.name,
      yokohamaCastId: yCast.id,
      tokyoCastId: tCast ? tCast.id : null,
      isIdentical,
      similarityNote,
      yokohamaProfile: yCast.profile,
      tokyoProfile: tCast ? tCast.profile : null,
      yokohamaCatch: yCast.catch_copy,
      tokyoCatch: tCast ? tCast.catch_copy : null,
    });
  }

  const identicalCount = duplicateProfileAudit.filter(a => a.isIdentical).length;
  console.log(`Identical / Copy Profile Count: ${identicalCount} / ${dualBelongingCasts.length}`);

  // サンプル3名分の比較データ出力
  console.log('\n====================================================');
  console.log('SAMPLE COMPARISON: 3 CASTS WITH IDENTICAL PROFILES');
  console.log('====================================================\n');

  const sample3 = duplicateProfileAudit.filter(a => a.isIdentical).slice(0, 3);
  for (let i = 0; i < sample3.length; i++) {
    const item = sample3[i];
    console.log(`【サンプル ${i + 1}】 ${item.name} さん`);
    console.log(`- 一致状況: ${item.similarityNote}`);
    console.log(`- 横浜側キャッチコピー: ${item.yokohamaCatch || '(未設定)'}`);
    console.log(`- 東京側キャッチコピー: ${item.tokyoCatch || '(未設定)'}`);
    console.log(`- 横浜側プロフィール本文:`);
    console.log(`  "${item.yokohamaProfile?.trim() || '(なし)'}"`);
    console.log(`- 東京側プロフィール本文:`);
    console.log(`  "${item.tokyoProfile?.trim() || '(なし)'}"`);
    console.log('----------------------------------------------------');
  }

  fs.writeFileSync('scratch/full_audit_results.json', JSON.stringify({
    dualBelongingCastsCount: dualBelongingCasts.length,
    dualBelongingCastsList: dualBelongingCasts.map(d => ({ name: d.yokohamaCast.name, age: d.yokohamaCast.age })),
    identicalCount,
    duplicateProfileAudit,
    sample3
  }, null, 2));

  console.log('\nSaved full audit to scratch/full_audit_results.json');
}

runFullComparison().catch(console.error);
