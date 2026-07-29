/**
 * stores.hero_cast_image_url カラムを追加する（Prismaスキーマとの差分解消）
 *
 * 背景:
 *   prisma/schema.prisma には hero_cast_image_url が定義されているが、
 *   本番DBには適用されていなかった。getStores() がこのカラムをSELECTしており、
 *   Supabaseは存在しないカラムを含むとクエリ全体をエラーにするため、
 *   トップFVの店舗データが丸ごと取得できず、ハードコードのフォールバックで
 *   描画されていた（店舗カード画像が販促バナーになる不具合）。
 *   さらに管理画面の店舗編集も同カラムをUPDATEに含むため保存に失敗していた。
 *
 * 使い方:
 *   node scripts/add-hero-cast-image-url-column.mjs --dry  … 現状確認のみ
 *   node scripts/add-hero-cast-image-url-column.mjs        … 実行
 *   node scripts/add-hero-cast-image-url-column.mjs --rollback … カラム削除
 *
 * 安全性:
 *   - NULL許容カラムの追加のみ。既存行・既存カラムには一切触れない
 *   - IF NOT EXISTS 付きなので再実行しても安全
 *   - prisma db push は他のスキーマドリフトを巻き込む恐れがあるため使わない
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

const COLUMN_SQL = `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'stores'
  ORDER BY ordinal_position;
`;

await client.connect();

const before = await client.query(COLUMN_SQL);
const hasCol = before.rows.some((r) => r.column_name === 'hero_cast_image_url');
console.log(`stores カラム数: ${before.rows.length}`);
console.log(`hero_cast_image_url: ${hasCol ? '存在する' : '存在しない'}`);

if (DRY) {
  console.log('\n[DRY RUN] 変更していません。');
  await client.end();
  process.exit(0);
}

if (ROLLBACK) {
  if (!hasCol) {
    console.log('カラムが無いのでロールバック不要です。');
  } else {
    await client.query('ALTER TABLE stores DROP COLUMN IF EXISTS hero_cast_image_url;');
    console.log('✅ hero_cast_image_url を削除しました。');
  }
} else {
  if (hasCol) {
    console.log('既に存在するため何もしません。');
  } else {
    await client.query('ALTER TABLE stores ADD COLUMN IF NOT EXISTS hero_cast_image_url text;');
    console.log('✅ hero_cast_image_url text を追加しました。');
  }
}

const after = await client.query(COLUMN_SQL);
console.log(`\n実行後のカラム数: ${after.rows.length}`);
const added = after.rows.filter((r) => !before.rows.some((b) => b.column_name === r.column_name));
const removed = before.rows.filter((b) => !after.rows.some((r) => r.column_name === b.column_name));
console.log(`  追加された: ${added.map((r) => r.column_name).join(', ') || 'なし'}`);
console.log(`  削除された: ${removed.map((r) => r.column_name).join(', ') || 'なし'}`);

await client.end();
