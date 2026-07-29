/**
 * store_top_configs.hero.images に混入した空要素を除去する
 *
 * 使い方:
 *   node scripts/repair-hero-images.mjs --dry   … 対象確認のみ
 *   node scripts/repair-hero-images.mjs         … 実行
 *
 * 背景:
 *   管理画面の画像アップロード処理が、HeroSection 側の filter(Boolean) 済み配列を
 *   基準にした index を、生配列に対して適用していたため、空要素があると
 *   「追加」が既存画像の上書きになっていた。さらに index がずれた際の
 *   パディング処理が空文字を書き込み、状態を自己増悪させていた。
 *
 *   コード側は修正済みだが、既に空要素が入ったデータが残っているため本スクリプトで清掃する。
 *   imageLinks は images と同じ添字で対応するため、同じ位置を同時に詰める。
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const DRY = process.argv.includes('--dry');

const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : undefined;
};
const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

const { data, error } = await supabase.from('store_top_configs').select('id, store_id, config');
if (error) {
  console.error('取得エラー:', error.message);
  process.exit(1);
}

let touched = 0;
for (const row of data) {
  const hero = row.config?.hero;
  if (!hero || !Array.isArray(hero.images)) continue;

  const rawImages = hero.images;
  const rawLinks = Array.isArray(hero.imageLinks) ? hero.imageLinks : [];
  const kept = rawImages.map((img, i) => ({ img, link: rawLinks[i] || '' })).filter((x) => x.img);

  const removed = rawImages.length - kept.length;
  if (removed === 0) continue;

  const nextImages = kept.map((x) => x.img);
  const nextLinks = kept.map((x) => x.link);

  console.log(`store_id=${row.store_id}`);
  console.log(`  images  ${rawImages.length}件 → ${nextImages.length}件（空要素 ${removed}件を除去）`);
  console.log(`  links   ${rawLinks.length}件 → ${nextLinks.length}件`);

  if (!DRY) {
    const nextConfig = { ...row.config, hero: { ...hero, images: nextImages, imageLinks: nextLinks } };
    const { error: upErr } = await supabase
      .from('store_top_configs')
      .update({ config: nextConfig })
      .eq('id', row.id);
    console.log(upErr ? `  ❌ ${upErr.message}` : '  ✅ 更新しました');
  }
  touched++;
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}対象 ${touched} 行${DRY ? '（変更していません）' : ''}`);
