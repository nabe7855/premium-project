import { prisma } from '../src/lib/prisma.ts';
import fs from 'fs';

async function main() {
  const allArticles = await prisma.mediaArticle.findMany({
    include: {
      tags: { include: { tag: true } }
    }
  });

  // 1. 各カテゴリの件数とステータス
  const categoryCounts = {};
  for (const a of allArticles) {
    if (!categoryCounts[a.category]) {
      categoryCounts[a.category] = { total: 0, published: 0, draft: 0 };
    }
    categoryCounts[a.category].total++;
    if (a.status === 'published') categoryCounts[a.category].published++;
    else categoryCounts[a.category].draft++;
  }

  // 2. amolab & amolab-jiten
  const amolabArticles = allArticles.filter(a => a.category === 'amolab' || a.category === 'amolab-jiten');

  const articleDetails = [];

  for (const a of amolabArticles) {
    const rawContent = a.content || '';
    const textOnly = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const charCount = textOnly.length;

    // 医療・健康系のキーワード検索と文抽出
    const healthKeywords = ['健康', 'ホルモン', 'ドーパミン', 'オキシトシン', '自律神経', '血流', '免疫', '治療', '治る', '効果', '脳内物質', 'ストレス', '膣', '子宮', '感度', '美肌', 'アンチエイジング'];
    const foundHealthSentences = [];
    const sentences = textOnly.split(/[。！？\n]/);
    for (const s of sentences) {
      if (healthKeywords.some(kw => s.includes(kw))) {
        const trimmed = s.trim();
        if (trimmed.length > 5 && foundHealthSentences.length < 5) {
          foundHealthSentences.push(trimmed);
        }
      }
    }

    // ダミーリンク
    const dummyMatches = rawContent.match(/href=["'](#|https?:\/\/(www\.)?example\.com[^"']*|javascript:[^"']*)["']/g) || [];

    // 出典・根拠
    const hasSource = /出典|参考文献|参考サイト|引用元|エビデンス|研究|論文/.test(rawContent);

    // 運営者明記
    const hasOperatorNote = /ストロベリーボーイズが運営|アモラボは|Strawberry Boys/.test(rawContent);

    // 画像
    const imgMatches = rawContent.match(/<img[^>]+>/g) || [];
    let imgWithAlt = 0;
    for (const img of imgMatches) {
      if (/alt=["'][^"']+["']/.test(img)) imgWithAlt++;
    }

    // 内部リンク
    const internalLinks = rawContent.match(/href=["'](\/[^"']+|https?:\/\/www\.sutoroberrys\.jp[^"']*)["']/g) || [];

    articleDetails.push({
      category: a.category,
      slug: a.slug,
      title: a.title,
      status: a.status,
      created_at: a.created_at,
      published_at: a.published_at,
      updated_at: a.updated_at,
      charCount,
      healthClaims: foundHealthSentences,
      hasSource,
      hasOperatorNote,
      dummyLinkCount: dummyMatches.length,
      dummyLinks: dummyMatches,
      imageCount: imgMatches.length,
      imgWithAltCount: imgWithAlt,
      internalLinkCount: internalLinks.length,
      internalLinks: internalLinks,
      tags: a.tags.map(t => t.tag.name),
      excerpt: a.excerpt || textOnly.substring(0, 100),
    });
  }

  // 3. タグ別紐付け
  const tags = await prisma.mediaTag.findMany({
    include: {
      articles: {
        include: {
          article: true
        }
      }
    }
  });

  const tagDetails = tags.map(t => ({
    name: t.name,
    total: t.articles.length,
    published: t.articles.filter(ta => ta.article.status === 'published').length,
    articles: t.articles.map(ta => ({ slug: ta.article.slug, title: ta.article.title, category: ta.article.category, status: ta.article.status }))
  }));

  const result = {
    categoryCounts,
    articleDetails,
    tagDetails
  };

  fs.writeFileSync('scratch/audit_parsed.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('✅ Wrote audit_parsed.json in UTF-8!');
}

main().catch(console.error);
