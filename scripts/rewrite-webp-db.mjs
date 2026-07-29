/**
 * store_top_configs / first_time_configs の JSON 内画像パスを .png -> .webp に更新する
 *
 * 使い方:
 *   node scripts/rewrite-webp-db.mjs --dry      … 差分表示のみ（DBは変更しない）
 *   node scripts/rewrite-webp-db.mjs            … 実行
 *   node scripts/rewrite-webp-db.mjs --rollback … .webp -> .png に戻す
 *   node scripts/rewrite-webp-db.mjs --only=fukuoka … 特定store_idのみ（段階適用用）
 *
 * 安全策:
 *  - 完全一致したパス文字列のみ置換（部分一致・正規表現は使わない）
 *  - 対応する .webp が public 配下に実在するパスだけを対象にする
 *  - '/福岡募集バナー.png'(ルート直下) は実ファイルが無くセンチネル用途のため対象外
 *  - --rollback で完全に元へ戻せる
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const DRY = process.argv.includes('--dry');
const ROLLBACK = process.argv.includes('--rollback');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1] || null;

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

// 置換対象（完全一致）。{slug} はテンプレートなので fukuoka で実在確認する。
const PATHS = [
  '/images/{slug}/福岡初めての方へ.png',
  '/images/{slug}/福岡おすすめホテル一覧.png',
  '/images/{slug}/福岡出勤情報.png',
  '/images/fukuoka/福岡初めての方へ.png',
  '/images/fukuoka/福岡おすすめホテル一覧.png',
  '/images/fukuoka/福岡出勤情報.png',
  '/images/fukuoka/福岡募集バナー.png',
  '/初めてのお客様へバナー.png',
];

for (const p of PATHS) {
  const webp = 'public' + p.replace(/\.png$/, '.webp').replace('{slug}', 'fukuoka');
  if (!fs.existsSync(webp)) throw new Error(`WebPが存在しません: ${webp}`);
}

/** JSON内の文字列を再帰的に置換 */
function convert(node, counter) {
  if (typeof node === 'string') {
    for (const from of PATHS) {
      const png = from;
      const webp = from.replace(/\.png$/, '.webp');
      const [a, b] = ROLLBACK ? [webp, png] : [png, webp];
      if (node === a) {
        counter.n++;
        return b;
      }
    }
    return node;
  }
  if (Array.isArray(node)) return node.map((v) => convert(v, counter));
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = convert(v, counter);
    return o;
  }
  return node;
}

const TABLES = ['store_top_configs', 'first_time_configs'];
let grandTotal = 0;

for (const table of TABLES) {
  const { data, error } = await supabase.from(table).select('id, store_id, config');
  if (error) {
    console.log(`${table}: 取得エラー ${error.message}`);
    continue;
  }
  console.log(`\n=== ${table} (${data.length}行) ===`);

  for (const row of data) {
    if (ONLY && !String(row.store_id).startsWith(ONLY)) continue;
    const counter = { n: 0 };
    const next = convert(row.config, counter);
    if (counter.n === 0) {
      console.log(`  store=${String(row.store_id).slice(0, 8)}  変更なし`);
      continue;
    }
    grandTotal += counter.n;
    if (DRY) {
      console.log(`  store=${String(row.store_id).slice(0, 8)}  ${counter.n}箇所 (DRY)`);
    } else {
      const { error: upErr } = await supabase.from(table).update({ config: next }).eq('id', row.id);
      console.log(`  store=${String(row.store_id).slice(0, 8)}  ${counter.n}箇所 ${upErr ? 'NG ' + upErr.message : 'OK'}`);
    }
  }
}

console.log(
  `\n${DRY ? '[DRY RUN] ' : ''}${ROLLBACK ? '[ROLLBACK] ' : ''}合計 ${grandTotal}箇所` +
    (DRY ? '（DBは変更していません）' : '')
);
