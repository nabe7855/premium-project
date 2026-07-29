/**
 * AI利用実績（トークン消費量・概算費用）を集計する
 *
 * 使い方:
 *   node scripts/ai-usage-report.mjs --month            … 今月
 *   node scripts/ai-usage-report.mjs --month=2026-06    … 指定月
 *   node scripts/ai-usage-report.mjs --days=30          … 直近30日
 *   node scripts/ai-usage-report.mjs                    … 全期間
 *
 *   --detail        1件ずつの明細も表示する
 *   --detail=50     明細の表示件数を指定（既定20件）
 *
 * 単価は scripts/ai-price.json で管理する（モデル・時期で変わるためDBには保存しない）。
 * 費用はあくまで概算。正確な金額は Google 側の請求明細を確認すること。
 *
 * ai_usage_logs は RLS でアプリの匿名キーから遮断されているため、
 * 本スクリプトは service_role キーを使う（ローカル実行専用）。
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

const argVal = (name) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
};
const hasFlag = (name) => process.argv.some((a) => a === `--${name}` || a.startsWith(`--${name}=`));

const days = argVal('days') ? Number(argVal('days')) : null;
const showDetail = hasFlag('detail');
const detailLimit = argVal('detail') ? Number(argVal('detail')) : 20;

// ── 期間の決定 ──
let range = null;
let periodLabel = '全期間';
if (hasFlag('month')) {
  const v = argVal('month');
  const now = new Date();
  const [y, m] = v ? v.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  range = { start: new Date(Date.UTC(y, m - 1, 1)).toISOString(), end: new Date(Date.UTC(y, m, 1)).toISOString() };
  periodLabel = `${y}年${m}月`;
} else if (days) {
  range = { start: new Date(Date.now() - days * 86400000).toISOString(), end: null };
  periodLabel = `直近${days}日`;
}

// ── 単価設定 ──
let price = { models: { default: { input: 0, output: 0 } }, usdJpy: 0 };
const pricePath = path.join(HERE, 'ai-price.json');
try {
  price = JSON.parse(fs.readFileSync(pricePath, 'utf8'));
} catch {
  console.error(`単価設定を読めませんでした: ${pricePath}`);
}
const rateFor = (model) => price.models?.[model] || price.models?.default || { input: 0, output: 0 };
const costOf = (model, inTok, outTok) => {
  const r = rateFor(model);
  return (inTok / 1_000_000) * (r.input || 0) + (outTok / 1_000_000) * (r.output || 0);
};

// ── 取得 ──
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

let query = supabase.from('ai_usage_logs').select('*').order('created_at', { ascending: false });
if (range?.start) query = query.gte('created_at', range.start);
if (range?.end) query = query.lt('created_at', range.end);

const { data, error } = await query;
if (error) {
  console.error('取得エラー:', error.message);
  process.exit(1);
}

console.log(`■ 対象期間: ${periodLabel}`);
if (!data.length) {
  console.log('  記録はまだありません。');
  process.exit(0);
}

const jp = (n) => Math.round(n).toLocaleString('ja-JP');
const usd = (n) => '$' + n.toFixed(4);
const line = (w = 74) => '─'.repeat(w);
const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

console.log(`  記録件数: ${jp(data.length)}件   ${String(data[data.length - 1].created_at).slice(0, 10)} 〜 ${String(data[0].created_at).slice(0, 10)}`);

// ── 日別 ──
const byDay = {};
data.forEach((r) => {
  const d = String(r.created_at).slice(0, 10);
  byDay[d] ??= { n: 0, in: 0, out: 0, total: 0, cost: 0 };
  byDay[d].n++;
  byDay[d].in += r.prompt_tokens || 0;
  byDay[d].out += r.output_tokens || 0;
  byDay[d].total += r.total_tokens || 0;
  byDay[d].cost += costOf(r.model, r.prompt_tokens || 0, r.output_tokens || 0);
});

console.log('\n【日別】');
console.log('  日付          回数        入力        出力        合計      概算費用');
console.log('  ' + line(72));
Object.keys(byDay)
  .sort()
  .forEach((d) => {
    const v = byDay[d];
    console.log(
      `  ${d}  ${jp(v.n).padStart(6)}  ${jp(v.in).padStart(10)}  ${jp(v.out).padStart(10)}  ${jp(v.total).padStart(10)}  ${usd(v.cost).padStart(11)}`,
    );
  });

// ── 機能別 ──
const byFeature = {};
data.forEach((r) => {
  const k = r.feature || '(不明)';
  byFeature[k] ??= { n: 0, in: 0, out: 0, total: 0, cost: 0, ng: 0 };
  byFeature[k].n++;
  byFeature[k].in += r.prompt_tokens || 0;
  byFeature[k].out += r.output_tokens || 0;
  byFeature[k].total += r.total_tokens || 0;
  byFeature[k].cost += costOf(r.model, r.prompt_tokens || 0, r.output_tokens || 0);
  if (!r.succeeded) byFeature[k].ng++;
});

console.log('\n【機能別】');
console.log('  機能                    回数        入力        出力        合計      概算費用');
console.log('  ' + line(72));
Object.entries(byFeature)
  .sort((a, b) => b[1].cost - a[1].cost)
  .forEach(([k, v]) => {
    console.log(
      `  ${trunc(k,20).padEnd(20)}${jp(v.n).padStart(6)}  ${jp(v.in).padStart(10)}  ${jp(v.out).padStart(10)}  ${jp(v.total).padStart(10)}  ${usd(v.cost).padStart(11)}` +
        (v.ng ? `  (失敗${v.ng})` : ''),
    );
  });

// ── モデル別 ──
const byModel = {};
data.forEach((r) => {
  const k = r.model || '(不明)';
  byModel[k] ??= { n: 0, in: 0, out: 0, cost: 0 };
  byModel[k].n++;
  byModel[k].in += r.prompt_tokens || 0;
  byModel[k].out += r.output_tokens || 0;
  byModel[k].cost += costOf(r.model, r.prompt_tokens || 0, r.output_tokens || 0);
});

console.log('\n【モデル別】');
Object.entries(byModel)
  .sort((a, b) => b[1].cost - a[1].cost)
  .forEach(([k, v]) => {
    const r = rateFor(k);
    console.log(
      `  ${k.padEnd(24)}${jp(v.n).padStart(5)}回  ${usd(v.cost).padStart(11)}` +
        `   (単価 入力$${r.input}/1M・出力$${r.output}/1M)`,
    );
  });

// ── 明細 ──
if (showDetail) {
  console.log(`\n【明細】新しい順・最大${detailLimit}件`);
  console.log('  日時                 機能               入力    出力    合計     概算費用');
  console.log('  ' + line(72));
  data.slice(0, detailLimit).forEach((r) => {
    const c = costOf(r.model, r.prompt_tokens || 0, r.output_tokens || 0);
    console.log(
      `  ${String(r.created_at).slice(0, 19).replace('T', ' ')}  ${trunc(String(r.feature),18).padEnd(18)}` +
        `${jp(r.prompt_tokens || 0).padStart(6)}  ${jp(r.output_tokens || 0).padStart(6)}  ${jp(r.total_tokens || 0).padStart(6)}  ${usd(c).padStart(10)}` +
        (r.succeeded ? '' : '  ❌失敗'),
    );
  });
  if (data.length > detailLimit) console.log(`  … 他 ${jp(data.length - detailLimit)}件`);
}

// ── 合計 ──
const tIn = data.reduce((a, r) => a + (r.prompt_tokens || 0), 0);
const tOut = data.reduce((a, r) => a + (r.output_tokens || 0), 0);
const tAll = data.reduce((a, r) => a + (r.total_tokens || 0), 0);
const tCost = data.reduce((a, r) => a + costOf(r.model, r.prompt_tokens || 0, r.output_tokens || 0), 0);
const failed = data.filter((r) => !r.succeeded).length;

console.log('\n' + line());
console.log(`【合計】${periodLabel}`);
console.log(`  呼び出し    ${jp(data.length)}回` + (failed ? `（うち失敗 ${jp(failed)}回）` : ''));
console.log(`  トークン    入力 ${jp(tIn)} ／ 出力 ${jp(tOut)} ／ 合計 ${jp(tAll)}`);
console.log(`  概算費用    ${usd(tCost)}` + (price.usdJpy > 0 ? `（約 ${jp(tCost * price.usdJpy)} 円 / 1USD=${price.usdJpy}円）` : ''));
console.log(line());
console.log('  ※ 単価は scripts/ai-price.json の設定値による概算です。');
console.log('     正確な請求額は Google AI Studio / Cloud Console の明細をご確認ください。');
if (!price.usdJpy) console.log('     円換算を表示するには ai-price.json の usdJpy にレートを設定してください。');
