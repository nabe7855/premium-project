/**
 * 大きいPNGをWebPへ変換するスクリプト（元PNGは削除しない・追加のみ）
 *
 * 使い方: node scripts/convert-to-webp.mjs
 *
 * 方針:
 *  - og:image / logo / favicon はSNSクローラー互換のため対象外（EXCLUDE参照）
 *  - コード・DBから参照されていない画像は対象外（配信されないため効果ゼロ）
 *  - 寸法は変更しない（レイアウト・CLSへの影響を排除）
 *  - 文字主体の画像は高品質(q90)、写真は標準(q82)で変換し、
 *    変換後に元画像との平均絶対誤差(MAE)を計測して劣化がないことを検証する
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 変換対象（コードまたはDBから実際に参照されているものだけ）
const TARGETS = [
  'public/images/fukuoka/福岡おすすめホテル一覧.png',
  'public/images/fukuoka/福岡出勤情報.png',
  'public/images/fukuoka/福岡初めての方へ.png',
  'public/images/fukuoka/福岡募集バナー.png',
  'public/images/fukuoka/福岡夜景.png',
  'public/images/nagoya.png',
  'public/images/tokyo.png',
  'public/オープンキャスト募集.png',
  'public/キャストモデル１.png',
  'public/キャストモデル２.png',
  'public/キャストモデル３.png',
  'public/ファーストビュー.png',
  'public/初めてのお客様へバナー.png',
];

// 変換してはいけない画像（SNS/検索エンジンのクローラー互換）
const EXCLUDE = ['/ogp/', 'logo.png', 'favicon', 'apple-touch'];

/** 元画像と変換後画像の平均絶対誤差(0-255)を求める */
async function meanAbsoluteError(a, b) {
  const [ra, rb] = await Promise.all([
    sharp(a).removeAlpha().raw().toBuffer(),
    sharp(b).removeAlpha().raw().toBuffer(),
  ]);
  if (ra.length !== rb.length) return NaN;
  let sum = 0;
  for (let i = 0; i < ra.length; i++) sum += Math.abs(ra[i] - rb[i]);
  return sum / ra.length;
}

let beforeTotal = 0;
let afterTotal = 0;
const rows = [];

for (const src of TARGETS) {
  if (EXCLUDE.some((x) => src.includes(x))) {
    console.log(`SKIP (除外指定): ${src}`);
    continue;
  }
  if (!fs.existsSync(src)) {
    console.log(`SKIP (存在しない): ${src}`);
    continue;
  }

  const dest = src.replace(/\.png$/i, '.webp');
  const meta = await sharp(src).metadata();
  const stats = await sharp(src).stats();

  // 文字・イラスト主体(低エントロピー)は圧縮アーティファクトが目立つため高品質
  const isGraphic = stats.entropy < 5.5;
  const quality = isGraphic ? 90 : 82;

  await sharp(src).webp({ quality, effort: 6, smartSubsample: true }).toFile(dest);

  const before = fs.statSync(src).size;
  const after = fs.statSync(dest).size;
  const mae = await meanAbsoluteError(src, dest);
  const out = await sharp(dest).metadata();

  // 寸法が変わっていたら異常なので停止
  if (out.width !== meta.width || out.height !== meta.height) {
    throw new Error(`寸法不一致: ${dest} ${meta.width}x${meta.height} -> ${out.width}x${out.height}`);
  }

  beforeTotal += before;
  afterTotal += after;
  rows.push({
    file: src.replace('public/', ''),
    type: isGraphic ? '文字/図' : '写真',
    q: quality,
    beforeKB: Math.round(before / 1024),
    afterKB: Math.round(after / 1024),
    cut: `${Math.round((1 - after / before) * 100)}%`,
    mae: mae.toFixed(2),
  });
}

console.table(rows);
console.log(
  `合計: ${Math.round(beforeTotal / 1024)}KB -> ${Math.round(afterTotal / 1024)}KB ` +
    `(${Math.round((1 - afterTotal / beforeTotal) * 100)}%削減 / ${Math.round((beforeTotal - afterTotal) / 1024)}KB削減)`
);
console.log('MAEは0-255スケールの平均絶対誤差。1.0未満なら肉眼で判別困難な水準。');
