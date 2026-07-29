/**
 * コード内の画像参照を .png -> .webp に書き換える（WebP版を用意済みのものだけ）
 *
 * 使い方: node scripts/rewrite-webp-refs.mjs [--dry]
 *
 * 注意:
 *  - 完全一致したパス文字列のみ置換する。部分一致・正規表現は使わない。
 *  - '/福岡募集バナー.png'(ルート直下) は実ファイルが存在せず、
 *    HeaderManagement.tsx で「既定値のままか」を判定するセンチネル値として
 *    使われているため意図的に対象外。書き換えるとDB保存値との比較が壊れる。
 *  - 置換後、対応する .webp が public 配下に存在することを検証する。
 */
import fs from 'fs';
import path from 'path';

const DRY = process.argv.includes('--dry');

// 置換対象（完全一致）
const REPLACEMENTS = [
  '/images/{slug}/福岡初めての方へ.png',
  '/images/{slug}/福岡おすすめホテル一覧.png',
  '/images/{slug}/福岡出勤情報.png',
  '/images/fukuoka/福岡募集バナー.png',
  '/images/fukuoka/福岡夜景.png',
  '/images/banners/store-jumps/tokyo.png',
  '/images/banners/store-jumps/osaka.png',
  '/images/banners/store-jumps/yokohama.png',
  '/images/banners/store-jumps/nagoya.png',
  '/images/banners/store-jumps/fukuoka.png',
  '/オープンキャスト募集.png',
  '/キャストモデル１.png',
  '/キャストモデル２.png',
  '/キャストモデル３.png',
  '/ファーストビュー.png',
  '/初めてのお客様へバナー.png',
];

// WebPの実在確認（{slug}はfukuokaで代表検証）
for (const p of REPLACEMENTS) {
  const webp = 'public' + p.replace(/\.png$/, '.webp').replace('{slug}', 'fukuoka');
  if (!fs.existsSync(webp)) {
    throw new Error(`WebPが存在しません: ${webp} — 先に scripts/convert-to-webp.mjs を実行してください`);
  }
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

let totalHits = 0;
const summary = [];

for (const file of walk('src')) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  const hits = [];

  for (const from of REPLACEMENTS) {
    const to = from.replace(/\.png$/, '.webp');
    const n = text.split(from).length - 1;
    if (n > 0) {
      text = text.split(from).join(to);
      hits.push(`${path.basename(from)}×${n}`);
      totalHits += n;
    }
  }

  if (text !== original) {
    if (!DRY) fs.writeFileSync(file, text, 'utf8');
    summary.push(`${file.replace(/\\/g, '/')}  ${hits.join(', ')}`);
  }
}

summary.forEach((s) => console.log(s));
console.log(`\n${DRY ? '[DRY RUN] ' : ''}置換: ${totalHits}箇所 / ${summary.length}ファイル`);
