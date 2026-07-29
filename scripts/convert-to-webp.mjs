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
  // トップページFVの店舗ジャンプバナー（LCP直結のため300KB未満でも対象）
  'public/images/banners/store-jumps/tokyo.png',
  'public/images/banners/store-jumps/osaka.png',
  'public/images/banners/store-jumps/yokohama.png',
  'public/images/banners/store-jumps/nagoya.png',
  'public/images/banners/store-jumps/fukuoka.png',
  'public/オープンキャスト募集.png',
  'public/キャストモデル１.png',
  'public/キャストモデル２.png',
  'public/キャストモデル３.png',
  'public/ファーストビュー.png',
  'public/初めてのお客様へバナー.png',

  // ── 第2弾: 福岡店ヘッダー / 料金セクション ──
  // フルパスでコード参照を確認済みのものだけ。表示サイズはデスクトップ実測で
  // 検証し、いずれも2倍解像度に足りていないためリサイズはせず形式変換のみ行う。
  'public/images/store/fukuoka/new-header/00_main_logo_full.png',
  'public/images/store/fukuoka/new-header/23_bottom_bar.png',
  'public/images/store/fukuoka/new-header/04_background_base.png',
  'public/images/store/fukuoka/new-header/09_today_card.png',
  'public/images/store/fukuoka/new-header/19_menu_card.png',
  'public/images/store/fukuoka/new-header/03_gold_divider.png',
  'public/images/store/fukuoka/new-header/35_flower.png',
  'public/images/store/fukuoka/new-header/37b_ornament_line.png',
  'public/images/store/fukuoka/new-header/36_sparkles.png',
  'public/images/store/fukuoka/price/A_お得なイベントコース/inner_frame.png',
  'public/images/store/fukuoka/price/A_お得なイベントコース/title_price_menu.png',
  'public/images/store/fukuoka/price/A_お得なイベントコース/divider.png',
  'public/images/store/fukuoka/price/A_お得なイベントコース/card_strawberry.png',
  'public/images/store/fukuoka/price/A_お得なイベントコース/strawberries_transparent.png',
];

// 変換してはいけない画像（SNS/検索エンジンのクローラー互換）
const EXCLUDE = ['/ogp/', 'logo.png', 'favicon', 'apple-touch'];

/**
 * 元画像と変換後画像の平均絶対誤差(0-255)を求める。
 * 透過画像は完全透明部のRGBが不定でノイズになるため、白背景に合成してから比較する。
 */
async function meanAbsoluteError(a, b) {
  const flatten = (src) =>
    sharp(src).flatten({ background: '#ffffff' }).raw().toBuffer();
  const [ra, rb] = await Promise.all([flatten(a), flatten(b)]);
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

  // 透過つきの図版などは可逆圧縮の方が小さくなることがあるため両方試して小さい方を採る
  const lossy = await sharp(src).webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
  let chosen = lossy;
  let mode = `q${quality}`;
  if (isGraphic) {
    const lossless = await sharp(src).webp({ lossless: true, effort: 6 }).toBuffer();
    if (lossless.length < chosen.length) {
      chosen = lossless;
      mode = 'lossless';
    }
  }

  const beforeSize = fs.statSync(src).size;
  // WebPの方が大きい場合は変換しない（元PNGのまま配信する方が速い）
  if (chosen.length >= beforeSize) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    console.log(
      `SKIP (WebPの方が大きい ${Math.round(beforeSize / 1024)}KB -> ${Math.round(chosen.length / 1024)}KB): ${src}`,
    );
    continue;
  }
  fs.writeFileSync(dest, chosen);

  const before = beforeSize;
  const after = fs.statSync(dest).size;
  const mae = await meanAbsoluteError(src, dest);
  const out = await sharp(dest).metadata();

  // 寸法が変わっていたら異常なので停止
  if (out.width !== meta.width || out.height !== meta.height) {
    throw new Error(`寸法不一致: ${dest} ${meta.width}x${meta.height} -> ${out.width}x${out.height}`);
  }
  // 透過の有無が変わっていたら重ね合わせが崩れるので停止
  if (Boolean(meta.hasAlpha) !== Boolean(out.hasAlpha)) {
    throw new Error(`透過情報が変化: ${dest} alpha ${meta.hasAlpha} -> ${out.hasAlpha}`);
  }

  beforeTotal += before;
  afterTotal += after;
  rows.push({
    file: src.replace('public/', ''),
    type: isGraphic ? '文字/図' : '写真',
    q: mode,
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
