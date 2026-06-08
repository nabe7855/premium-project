const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'yuuhi-interview-vol3';
  const article = await prisma.mediaArticle.findUnique({ where: { slug } });
  
  if (!article) {
    console.error('Article not found');
    return;
  }

  // Update MediaArticle with excerpt and thumbnail
  await prisma.mediaArticle.update({
    where: { id: article.id },
    data: {
      excerpt: '「ワイルドなイケメン」という第一印象から、「一途で優しいワンコ系男子」へと印象が180度変わる、驚きのインタビューでした。12年間の純愛を経験し、介護というハードな仕事で培われた「人に寄り添う力」。そして、相手を喜ばせることに全力を注ぐロマンチストな一面。',
      thumbnail_url: 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/media/media_1780718289082_9mcfod.jpg', // selfie url
      seo_title: '現役介護士×ワンコ系男子・ゆうひ — “一途な愛”とギャップの正体に迫る',
      seo_description: 'ストロベリーボーイズのキャスト「ゆうひ」のインタビュー記事。現役介護士としての顔や、韓国系イケメンのルックスとは裏腹な一途でロマンチストな素顔に迫ります。'
    }
  });

  const meta = await prisma.interviewMeta.findUnique({ where: { article_id: article.id } });
  if (!meta) {
    console.error('Meta not found');
    return;
  }

  // Rewrite profile_data to { fields: [...] } format
  const profile_data = {
    fields: [
      { label: "活動エリア", value: "福岡" },
      { label: "身長", value: "170cm" },
      { label: "タイプ", value: "韓国系・醤油顔イケメン・ワンコ系（柴犬）" },
      { label: "特技", value: "柔道（黒帯）、女性を喜ばせること（奉仕）" },
      { label: "趣味", value: "温泉・サウナ、美容・ファッション、サプライズをすること" },
      { label: "キャッチフレーズ", value: "癒やしと安心、愛を感じる時間を提供します。たっぷり愛させてください。" }
    ]
  };

  // Rewrite faq_data to { items: [...] } format
  const faq_data = {
    items: [
      {
        question: "どんな接客スタイルですか？",
        answer: "第一印象はキリッとしていますが、中身はとてもオープンで人懐っこい「ワンコ系男子」です。介護士として5年働いている経験から、相手への気遣いや包容力は抜群。「なんでも話しやすい安心感がある」と定評があります。"
      },
      {
        question: "得意なプレイやスキンシップは？",
        answer: "「自分が楽しむこと」よりも「女性を喜ばせること」に喜びを感じる奉仕型です。言葉を使ったスキンシップや、じっくり時間をかけて心も体も満たすことを得意としています。"
      },
      {
        question: "年上の女性でも大丈夫ですか？",
        answer: "むしろ大歓迎です！30代〜50代の落ち着いた女性の色気や、一緒にいるときの居心地の良さが大好きです。甘えたり甘えられたりしたいので、ぜひ年上のお姉さんに可愛がっていただきたいです。"
      },
      {
        question: "デートではどんなところに行きたいですか？",
        answer: "相手に合わせるのが好きですが、おしゃれなカフェでゆっくりお話ししたり、水族館に行ったりする王道デートが好きです。サプライズでホテルを飾り付けたり、花束を渡したりするのも大好きです。"
      }
    ]
  };

  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta SET profile_data = $1::jsonb, faq_data = $2::jsonb WHERE id = $3::uuid`,
    JSON.stringify(profile_data),
    JSON.stringify(faq_data),
    meta.id
  );

  console.log('Fixed data structure for Yuuhi in both media_article and interview_meta.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
