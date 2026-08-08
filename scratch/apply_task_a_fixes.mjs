import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function applyTaskAFixes() {
  console.log('=== APPLYING TASK A COMPLIANCE FIXES ===\n');

  const { data: articles, error } = await supabase
    .from('media_articles')
    .select('*')
    .eq('category', 'ikeo');

  if (error) {
    console.error('Error fetching ikeo articles:', error);
    return;
  }

  const forbiddenWords = ['保証', '確実に', '絶対', '必ず', '安定して稼げる'];

  for (const article of articles) {
    let content = article.content || '';
    let title = article.title || '';
    const slug = article.slug;

    console.log(`Processing /ikeo/${slug}...`);

    let modifiedContent = content;
    let modifiedTitle = title;

    // Specific replacements to ensure clean compliance without creative promises

    // 1. fukuoka-recruit-guide
    if (slug === 'fukuoka-recruit-guide') {
      modifiedContent = modifiedContent
        .replace(/歩合50%～80% を保証/g, '歩合50%～80%')
        .replace(/歩合50%〜80%を保証/g, '歩合50%〜80%')
        .replace(/保証/g, '')
        .replace(/プロの技術を確実に習得できます/g, 'プロの技術をしっかり習得していただけます')
        .replace(/確実に/g, '')
        .replace(/絶対に/g, '')
        .replace(/絶対/g, '')
        .replace(/必ず/g, '');
    }

    // 2. income-model-and-experience
    if (slug === 'income-model-and-experience') {
      modifiedContent = modifiedContent
        .replace(/半年目には本業の倍以上の月40万円を安定して稼げるようになりました/g, '半年目には本業の収入を大きく超える月40万円を達成できた事例もあります')
        .replace(/安定して稼げる/g, '収入を得る')
        .replace(/当店でも絶対NGとしており/g, '当店でも禁止事項としており')
        .replace(/事前同意を徹底しているため安全です/g, '事前同意を徹底しています')
        .replace(/絶対に/g, '')
        .replace(/絶対/g, '')
        .replace(/確実に/g, '')
        .replace(/必ず/g, '')
        .replace(/保証/g, '');
    }

    // 3. interview-and-training-guide
    if (slug === 'interview-and-training-guide') {
      modifiedContent = modifiedContent
        .replace(/面接合格の絶対的ポイント/g, '面接合格の重要なポイント')
        .replace(/放置されることは絶対にありません/g, '放置されることはありません')
        .replace(/絶対に/g, '')
        .replace(/絶対/g, '')
        .replace(/確実に/g, '')
        .replace(/必ず/g, '')
        .replace(/保証/g, '');
    }

    // 4. nightwork-comparison
    if (slug === 'nightwork-comparison') {
      modifiedContent = modifiedContent
        .replace(/マイペースで、確実に高収入を得たい/g, 'マイペースで、高収入を目指したい')
        .replace(/確実に/g, '')
        .replace(/絶対に/g, '')
        .replace(/絶対/g, '')
        .replace(/必ず/g, '')
        .replace(/保証/g, '')
        .replace(/安定して稼げる/g, '高収入を得る');
    }

    // 5. success-for-50s
    if (slug === 'success-for-50s') {
      modifiedContent = modifiedContent
        .replace(/絶対に/g, '')
        .replace(/絶対/g, '')
        .replace(/確実に/g, '')
        .replace(/必ず/g, '')
        .replace(/保証/g, '')
        .replace(/安定して稼げる/g, '収入を得る');
    }

    // Double check for any residual forbidden words
    forbiddenWords.forEach(word => {
      const regex = new RegExp(word, 'g');
      modifiedContent = modifiedContent.replace(regex, '');
      modifiedTitle = modifiedTitle.replace(regex, '');
    });

    const { error: updateError } = await supabase
      .from('media_articles')
      .update({
        content: modifiedContent,
        title: modifiedTitle,
        updated_at: new Date().toISOString()
      })
      .eq('id', article.id);

    if (updateError) {
      console.error(`Failed to update ${slug}:`, updateError);
    } else {
      console.log(`✅ Successfully updated ${slug}`);
    }
  }

  console.log('\n=== TASK A FIXES APPLIED ===');
}

applyTaskAFixes().catch(console.error);
