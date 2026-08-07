import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';
import * as cheerio from 'cheerio';

async function auditAllCastProfiles() {
  console.log('=== TASK C: FULL CAST PROFILE AUDIT (FUKUOKA & YOKOHAMA) ===\n');

  // 東京サイトのテキストデータ読み込み
  let tokyoPageText = '';
  try {
    const tokyoHtml = fs.readFileSync('scratch/tokyo_page.html', 'utf8');
    const $ = cheerio.load(tokyoHtml);
    tokyoPageText = $('body').text();
  } catch (e) {
    console.log('Tokyo HTML file read warning:', e.message);
  }

  // 東京DBのキャストプロフィールを取得
  const tokyoDbCasts = await prisma.$queryRaw`
    SELECT c.name, c.profile, c.catch_copy
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE s.slug = 'tokyo' AND c.is_active = true
  `;

  // 福岡・横浜の全アクティブキャスト取得
  const casts = await prisma.$queryRaw`
    SELECT c.id, c.name, c.age, c.height, c.profile, c.catch_copy, c.mbti_id, c.animal_id, c.face_id, c.sns_url, c.question_box_url, c.slug, s.name as store_name, s.slug as store_slug
    FROM casts c
    JOIN cast_store_memberships m ON c.id = m.cast_id
    JOIN stores s ON m.store_id = s.id
    WHERE (s.slug = 'fukuoka' OR s.slug = 'yokohama') AND c.is_active = true
    ORDER BY s.slug ASC, c.name ASC
  `;

  // ダミー削除
  const validCasts = casts.filter(c => !['www', 'popop', '受付担当', 'あああ', 'wwwww', '田中　テスト用'].includes(c.name));

  const rows = [];

  for (const c of validCasts) {
    const url = `https://www.sutoroberrys.jp/store/${c.store_slug}/cast/${c.slug}`;
    const profileText = (c.profile || '').trim();
    const charCount = profileText.length;

    let charCountCategory = '0字(空欄)';
    if (charCount >= 100) {
      charCountCategory = '100字以上';
    } else if (charCount > 0) {
      charCountCategory = '100字未満';
    }

    const hasCatch = Boolean((c.catch_copy || '').trim());

    // 東京サイトとの重複チェック (横浜キャストのみ)
    let tokyoDuplication = '-';
    if (c.store_slug === 'yokohama') {
      if (!profileText) {
        tokyoDuplication = '空欄';
      } else {
        const tMatch = tokyoDbCasts.find(t => t.name === c.name);
        const tProfile = (tMatch?.profile || '').trim();

        if (tProfile) {
          const cleanP = profileText.replace(/\s+/g, '');
          const cleanT = tProfile.replace(/\s+/g, '');
          if (cleanP === cleanT) {
            tokyoDuplication = '完全一致';
          } else if (cleanP.includes(cleanT) || cleanT.includes(cleanP)) {
            tokyoDuplication = '部分一致';
          } else {
            tokyoDuplication = '固有文章';
          }
        } else if (tokyoPageText && tokyoPageText.includes(profileText.substring(0, 30))) {
          tokyoDuplication = '部分一致';
        } else {
          tokyoDuplication = '固有文章';
        }
      }
    }

    // 空欄主要項目
    const emptyFields = [];
    if (!c.catch_copy) emptyFields.push('キャッチコピー');
    if (!c.profile) emptyFields.push('プロフィール本文');
    if (!c.height) emptyFields.push('身長');
    if (!c.mbti_id) emptyFields.push('MBTI');
    if (!c.animal_id) emptyFields.push('動物占い');
    if (!c.face_id) emptyFields.push('顔型');
    if (!c.question_box_url) emptyFields.push('質問箱URL');

    rows.push({
      store: c.store_name,
      storeSlug: c.store_slug,
      name: c.name,
      url,
      charCountCategory,
      rawCharCount: charCount,
      hasCatch: hasCatch ? '有' : '無',
      tokyoDuplication,
      emptyFields: emptyFields.length > 0 ? emptyFields.join(', ') : 'なし(完備)'
    });
  }

  console.log(`Audited ${rows.length} active casts across Fukuoka & Yokohama.\n`);
  fs.writeFileSync('scratch/task_c_audit_table.json', JSON.stringify(rows, null, 2));

  // Markdown テーブル出力
  let md = '| 店舗 | キャスト名 | 実URL | プロフィール文字数 | キャッチコピー | 東京重複 | 空欄主要項目 |\n';
  md += '|---|---|---|---|---|---|---|\n';

  for (const r of rows) {
    md += `| ${r.store} | **${r.name}** | [リンク](${r.url}) | ${r.charCountCategory} (${r.rawCharCount}字) | ${r.hasCatch} | ${r.tokyoDuplication} | ${r.emptyFields} |\n`;
  }

  fs.writeFileSync('scratch/task_c_audit_table.md', md, 'utf8');
  console.log('Saved audit table to scratch/task_c_audit_table.md');
}

auditAllCastProfiles().catch(console.error);
