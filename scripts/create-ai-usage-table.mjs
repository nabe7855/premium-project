/**
 * AI利用実績テーブル ai_usage_logs を作成する
 *
 * 使い方:
 *   node scripts/create-ai-usage-table.mjs --dry       … 現状確認のみ
 *   node scripts/create-ai-usage-table.mjs             … 作成
 *   node scripts/create-ai-usage-table.mjs --rollback  … 削除
 *
 * 設計:
 *   RLS を有効化し、ポリシーを一切作らない。
 *   これにより anon / authenticated キーからは SELECT も INSERT も全て拒否される。
 *   アプリ（管理画面含む）は anon キーで動作するため、このテーブルには到達できない。
 *   書き込みと集計は RLS をバイパスする service_role キーからのみ行う。
 */
import pg from 'pg';
import fs from 'fs';

const DRY = process.argv.includes('--dry');
const ROLLBACK = process.argv.includes('--rollback');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};

const client = new pg.Client({
  connectionString: getEnv('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const exists = async () =>
  (
    await client.query(
      `select 1 from information_schema.tables
       where table_schema='public' and table_name='ai_usage_logs'`,
    )
  ).rowCount > 0;

const before = await exists();
console.log(`ai_usage_logs: ${before ? '存在する' : '存在しない'}`);

if (DRY) {
  console.log('\n[DRY RUN] 変更していません。');
  await client.end();
  process.exit(0);
}

if (ROLLBACK) {
  await client.query('drop table if exists public.ai_usage_logs;');
  console.log('✅ 削除しました');
} else if (before) {
  console.log('既に存在するため何もしません。');
} else {
  await client.query(`
    create table public.ai_usage_logs (
      id            uuid primary key default gen_random_uuid(),
      created_at    timestamptz not null default now(),
      feature       text not null,
      model         text,
      prompt_tokens integer not null default 0,
      output_tokens integer not null default 0,
      total_tokens  integer not null default 0,
      store_slug    text,
      succeeded     boolean not null default true,
      error_message text
    );
  `);
  await client.query('create index ai_usage_logs_created_at_idx on public.ai_usage_logs (created_at desc);');
  await client.query('create index ai_usage_logs_feature_idx on public.ai_usage_logs (feature);');

  // RLS を有効化し、ポリシーは作らない → anon / authenticated からは全拒否
  await client.query('alter table public.ai_usage_logs enable row level security;');
  await client.query('revoke all on public.ai_usage_logs from anon, authenticated;');

  console.log('✅ 作成しました（RLS有効・ポリシーなし・anon/authenticatedの権限剥奪）');
}

const after = await exists();
console.log(`\n実行後: ${after ? '存在する' : '存在しない'}`);

if (after) {
  const rls = await client.query(
    `select relrowsecurity from pg_class where relname='ai_usage_logs'`,
  );
  const pol = await client.query(
    `select count(*)::int as n from pg_policies where tablename='ai_usage_logs'`,
  );
  console.log(`  RLS有効: ${rls.rows[0]?.relrowsecurity}`);
  console.log(`  ポリシー数: ${pol.rows[0]?.n}（0 = 匿名キーから全拒否）`);
}

await client.end();
