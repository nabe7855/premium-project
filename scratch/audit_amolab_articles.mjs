import { prisma } from '../src/lib/prisma.ts';

async function audit() {
  console.log('=== 1. ALL CATEGORY COUNTS & STATUS ===');
  const allArticles = await prisma.mediaArticle.findMany({
    include: {
      tags: { include: { tag: true } }
    }
  });

  const categorySummary = {};
  for (const a of allArticles) {
    if (!categorySummary[a.category]) {
      categorySummary[a.category] = { total: 0, published: 0, draft: 0 };
    }
    categorySummary[a.category].total++;
    if (a.status === 'published') categorySummary[a.category].published++;
    else categorySummary[a.category].draft++;
  }
  console.log(JSON.stringify(categorySummary, null, 2));

  console.log('\n=== 2. AMOLAB & AMOLAB-JITEN ARTICLES DETAILED AUDIT ===');
  const amolabArticles = allArticles.filter(a => a.category === 'amolab' || a.category === 'amolab-jiten' || a.category === 'ikejo-jiten');

  const detailedList = [];

  for (const a of amolabArticles) {
    const rawContent = a.content || '';
    const textOnly = rawContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const charCount = textOnly.length;

    // 医療・健康系のキーワード検索
    const healthKeywords = ['健康', 'ホルモン', 'ドーパミン', 'オキシトシン', '自律神経', '血流', '免疫', '治療', '治る', '効果', '脳内物質', 'ストレス軽減', 'うつ', '精神'];
    const foundHealthSentences = [];
    const sentences = textOnly.split(/[。！？\n]/);
    for (const s of sentences) {
      if (healthKeywords.some(kw => s.includes(kw))) {
        if (s.trim().length > 5 && foundHealthSentences.length < 5) {
          foundHealthSentences.push(s.trim());
        }
      }
    }

    // ダミーリンク
    const dummyMatches = rawContent.match(/href=["'](#|https?:\/\/(www\.)?example\.com[^"']*|javascript:[^"']*)["']/g) || [];
    
    // 出典・根拠
    const hasSource = /出典|参考文献|参考サイト|引用元|エビデンス|研究|論文/.test(rawContent);

    // 運営者明記
    const hasOperatorNote = /ストロベリーボーイズが運営|アモラボは|Strawberry Boys/.test(rawContent);

    // 画像抽出
    const imgTags = rawContent.match(/<img[^>]+>/g) || [];
    let imgWithAlt = 0;
    for (const img of imgTags) {
      if (/alt=["'][^"']+["']/.test(img)) imgWithAlt++;
    }

    // 内部リンク
    const linkMatches = rawContent.match(/href=["'](\/[^"']+|https?:\/\/www\.sutoroberrys\.jp[^"']*)["']/g) || [];

    detailedList.push({
      id: a.id,
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
      imageCount: imgTags.length,
      imgWithAltCount: imgWithAlt,
      internalLinkCount: linkMatches.length,
      tags: a.tags.map(t => t.tag.name),
      excerpt: a.excerpt || textOnly.substring(0, 150),
    });
  }

  console.log(JSON.stringify(detailedList, null, 2));

  console.log('\n=== 3. TAGS & ARTICLE COUNT ===');
  const tags = await prisma.mediaTag.findMany({
    include: {
      articles: {
        include: {
          article: true
        }
      }
    }
  });

  const tagSummary = tags.map(t => ({
    id: t.id,
    name: t.name,
    totalArticles: t.articles.length,
    publishedArticles: t.articles.filter(ta => ta.article.status === 'published').length,
    articles: t.articles.map(ta => ({ slug: ta.article.slug, title: ta.article.title, category: ta.article.category, status: ta.article.status }))
  }));

  console.log(JSON.stringify(tagSummary, null, 2));
}

audit().catch(console.error);
