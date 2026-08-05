import fs from 'fs';
import { prisma } from '../src/lib/prisma.ts';

async function seedAyaArticle() {
  const htmlPath = 'c:/Users/nabe7/.gemini/antigravity/scratch/obsidian-antigravity-nexus/dev/premium-project/ストロベリーボーイズ運用/めぐ/めぐ_記事_公開セット/index.html';
  let rawHtml = fs.readFileSync(htmlPath, 'utf-8');

  // Extract body inner HTML (between <body> and </body>)
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1].trim() : rawHtml;

  // Replace image src paths
  content = content.replace(/src="images\//g, 'src="/images/amolab/aya/');

  // Compliance notice header
  const complianceHtml = '<div style="background-color: #FFF5F6; border: 1px solid #FFD6DC; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; color: #D64567; font-weight: 500;">※本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています。</div>\n';

  if (!content.includes('本メディア「アモラボ」は、女性用風俗ストロベリーボーイズが運営しています')) {
    content = complianceHtml + content;
  }

  const slug = 'voice-aya';
  const title = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が女性用風俗の予約ボタンを押すまで｜ストロベリーボーイズ';
  const excerpt = '夫はいるのに、女として見てもらえない——。半年以上迷った既婚のあやさん（30代・子育て中）が、女性用風俗ストロベリーボーイズの予約ボタンを押すまでの物語。初めてで不安なあなたへ、リアルな迷いと“使ってよかった”をご本人の言葉で。';
  const seoTitle = '「このままおばあさんになりたくなかった」｜あやさん（30代・既婚）が予約ボタンを押すまで';
  const seoDescription = '半年以上迷った既婚女性が、女性用風俗の予約ボタンを押すまで。初めての不安と“使ってよかった”をご本人の言葉で。';
  const thumbnailUrl = '/images/amolab/aya/aya-photo-top.webp';

  console.log('Seeding article to Prisma database...');

  // Upsert article
  const article = await prisma.mediaArticle.upsert({
    where: { slug },
    update: {
      title,
      content,
      excerpt,
      thumbnail_url: thumbnailUrl,
      status: 'published',
      category: 'amolab',
      author_name: 'アモラボ 編集部',
      seo_title: seoTitle,
      seo_description: seoDescription,
      published_at: new Date(),
      updated_at: new Date(),
    },
    create: {
      slug,
      title,
      content,
      excerpt,
      thumbnail_url: thumbnailUrl,
      status: 'published',
      category: 'amolab',
      author_name: 'アモラボ 編集部',
      seo_title: seoTitle,
      seo_description: seoDescription,
      published_at: new Date(),
    },
  });

  console.log('Article upserted:', article.id, article.slug);

  // Connect tag '体験談'
  let tag = await prisma.mediaTag.findFirst({ where: { name: '体験談' } });
  if (!tag) {
    tag = await prisma.mediaTag.create({ data: { name: '体験談' } });
  }

  // Upsert MediaArticleTag relation
  const existingRelation = await prisma.mediaArticleTag.findFirst({
    where: { article_id: article.id, tag_id: tag.id },
  });

  if (!existingRelation) {
    await prisma.mediaArticleTag.create({
      data: {
        article_id: article.id,
        tag_id: tag.id,
      },
    });
    console.log('Attached tag "体験談" to article.');
  }

  // Connect tag '30代女性' if exists
  let tag30s = await prisma.mediaTag.findFirst({ where: { name: '30代女性' } });
  if (tag30s) {
    const rel30s = await prisma.mediaArticleTag.findFirst({
      where: { article_id: article.id, tag_id: tag30s.id },
    });
    if (!rel30s) {
      await prisma.mediaArticleTag.create({
        data: { article_id: article.id, tag_id: tag30s.id },
      });
      console.log('Attached tag "30代女性" to article.');
    }
  }

  console.log('Aya article seeded successfully!');
}

seedAyaArticle().catch(console.error);
