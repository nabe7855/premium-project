/**
 * AI利用実績（トークン消費量）を集計する
 *
 * 使い方:
 *   node scripts/ai-usage-report.mjs              … 全期間
 *   node scripts/ai-usage-report.mjs --month      … 今月（1日〜現在）
 *   node scripts/ai-usage-report.mjs --month=2026-06  … 指定月
 *   node scripts/ai-usage-report.mjs --days=30    … 直近30日
 *   node scripts/ai-usage-report.mjs --month --price-in=0.30 --price-out=2.50
 *       … 100万トークンあたりの単価(USD)を指定すると概算費用も表示する
 *
 * 単価はモデル・時期で変わるため保存していない。集計時に指定する方式にしている。
 *
 * ai_usage_logs は RLS でアプリの匿名キーから遮断されているため、
 * 本スクリプトは service_role キーを使う（ローカル実行専用）。
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const arg = (name) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
};
const days = arg('days') ? Number(arg('days')) : null;
const priceIn = arg('price-in') ? Number(arg('price-in')) : null;
const priceOut = arg('price-out') ? Number(arg('price-out')) : null;

// --month（今月） / --month=2026-06（指定月）
const monthFlag = process.argv.find((a) => a === '--month' || a.startsWith('--month='));
let monthRange = null;
if (monthFlag) {
  const v = monthFlag.includes('=') ? monthFlag.split('=')[1] : null;
  const now = new Date();
  const [y, m] = v ? v.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 1));
  monthRange = { label: `${y}年${m}月`, start: start.toISOString(), end: end.toISOString() };
}

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

let query = supabase.from('ai_usage_logs').select('*').order('created_at', { ascending: false });
if (monthRange) {
  query = query.gte('created_at', monthRange.start).lt('created_at', monthRange.end);
} else if (days) {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  query = query.gte('created_at', since);
}

const { data, error } = await query;
if (error) {
  console.error('取得エラー:', error.message);
  process.exit(1);
}

const periodLabel = monthRange ? monthRange.label : days ? `直近${days}日` : '全期間';

if (!data.length) {
  console.log(`■ 対象期間: ${periodLabel}`);
  console.log('  記録はまだありません。');
  process.exit(0);
}

const jp = (n) => n.toLocaleString('ja-JP');
const sum = (rows, k) => rows.reduce((a, r) => a + (r[k] || 0), 0);

console.log(`■ 対象期間: ${periodLabel}   記録件数: ${jp(data.length)}件`);
console.log(`  最古: ${String(data[data.length - 1].created_at).slice(0, 19)}`);
console.log(`  最新: ${String(data[0].created_at).slice(0, 19)}\n`);

// 機能別
const byFeature = {};
data.forEach((r) => {
  const k = r.feature || '(不明)';
  byFeature[k] ??= { n: 0, in: 0, out: 0, total: 0, ng: 0 };
  byFeature[k].n++;
  byFeature[k].in += r.prompt_tokens || 0;
  byFeature[k].out += r.output_tokens || 0;
  byFeature[k].total += r.total_tokens || 0;
  if (!r.succeeded) byFeature[k].ng++;
});

console.log('機能別'.padEnd(22) + '回数'.padStart(8) + '入力'.padStart(12) + '出力'.padStart(12) + '合計'.padStart(12));
console.log('─'.repeat(66));
Object.entries(byFeature)
  .sort((a, b) => b[1].total - a[1].total)
  .forEach(([k, v]) => {
    console.log(
      k.padEnd(24) + jp(v.n).padStart(6) + jp(v.in).padStart(13) + jp(v.out).padStart(13) + jp(v.total).padStart(13),
    );
  });

const tIn = sum(data, 'prompt_tokens');
const tOut = sum(data, 'output_tokens');
const tAll = sum(data, 'total_tokens');
console.log('─'.repeat(66));
console.log('合計'.padEnd(24) + jp(data.length).padStart(6) + jp(tIn).padStart(13) + jp(tOut).padStart(13) + jp(tAll).padStart(13));

// モデル別
const byModel = {};
data.forEach((r) => {
  const k = r.model || '(不明)';
  byModel[k] = (byModel[k] || 0) + (r.total_tokens || 0);
});
console.log('\nモデル別の合計トークン');
Object.entries(byModel)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k.padEnd(26)} ${jp(v).padStart(12)}`));

const failed = data.filter((r) => !r.succeeded).length;
if (failed) console.log(`\n失敗した呼び出し: ${failed}件`);

if (priceIn !== null && priceOut !== null) {
  const cost = (tIn / 1_000_000) * priceIn + (tOut / 1_000_000) * priceOut;
  console.log(
    `\n概算費用: $${cost.toFixed(4)}` +
      `  （入力 $${priceIn}/1M・出力 $${priceOut}/1M で計算。実際の請求額はGoogle側の明細をご確認ください）`,
  );
}
