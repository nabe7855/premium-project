const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'sai-interview-vol1';
  
  const article = await prisma.mediaArticle.findUnique({ where: { slug } });
  if (!article) {
    console.error('Article not found:', slug);
    return;
  }

  const interviewData = {
    "seo_keywords": "女性用風俗 福岡, セラピスト 福岡, ストロベリーボーイズ, サイ インタビュー",
    "writer_note": [
      "取材を終えて一番印象に残ったのは、「いい距離感で見守ってます」というサイさんの言葉でした。植物の世話も、人との接し方も、全部このスタンスで一貫している。近すぎず、でもちゃんとそこにいる。そういう人って、会うだけでちょっと肩の力が抜けるんですよね。",
      "初めての利用で緊張している方、ただ穏やかな時間を過ごしたい方、そして福岡の卵プリンが気になってきた方（僕です）。サイさんの予約、おすすめです。"
    ],
    "dialogue_data": {
      "sections": [
        {
          "heading": "「サイ」という名前に隠された意味",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "さっそくなんですけど、ずっと気になってたことがありまして。「サイ」っていう名前、どこから来てるんですか？ 動物の？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "動物じゃないです（笑）。「采」っていう漢字からなんですけど、人に寄り添うとか、そういう意味を込めてつけました。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "え、めちゃくちゃいい由来じゃないですか。自分で考えたんですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "はい、自分で考えました。2文字で馴染みのある名前にしようと思って。" }
          ]
        },
        {
          "heading": "福岡の「西の方」が気になりすぎた件",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "サイさん、今はどちらにお住まいなんですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "福岡です。生まれも育ちもずっと福岡ですね。地元は福岡の西の方で。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "けっこう田舎寄りなんですけど、観光地としては福岡でも有名な地域ですね。別荘を建てる人もいたり、海もあって山もあって。自然養鶏場が多くて、卵プリンが充実してるんですよ。" },
            { "type": "photo", "photo_key": "cafe_food_pair" },
            { "type": "editor_note", "text": "この後、イトウが福岡トークに夢中になりすぎて危うくインタビューの時間を使い切りかけました。" }
          ]
        },
        {
          "heading": "178cmの塩顔。でも本人はいたって天然",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "身長ってどのくらいなんですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "178cmです。体型は細身ですね。" },
            { "type": "narration", "text": "見た目の雰囲気を聞くと「塩っぽい感じ」とのこと。まつ毛が長く、韓国の漫画に出てきそうな顔立ち。" },
            { "type": "photo", "photo_key": "fullbody" }
          ]
        },
        {
          "heading": "初めてのあなたへ —— サイからのメッセージ",
          "items": [
            { "type": "dialogue", "speaker": "cast", "speaker_name": "サイ", "text": "利用するのはすごく勇気がいると思いますし。でも、そんな中で選んでいただけたら本当に嬉しいですし、期待には応えたいと思ってます。安心して飛び込んできてください。" }
          ]
        }
      ]
    },
    "photos": {
      "cafe_food_pair": {
        "layout": "pair",
        "images": [
          { "url": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000", "alt": "カフェ", "caption": "取材中のサイさん" },
          { "url": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1000", "alt": "フード", "caption": "おすすめのカフェにて" }
        ]
      },
      "fullbody": {
        "layout": "portrait",
        "url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000",
        "alt": "サイさん全身",
        "caption": "178cm、細身のスタイル"
      }
    },
    "structured_data": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "塩顔セラピスト・サイに聞いた、植物とパスタとVaundyの話",
      "author": { "@type": "Person", "name": "イトウ" }
    }
  };

  // Raw SQL を使って、型チェックを回避して更新
  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta 
     SET dialogue_data = $1::jsonb, 
         photos = $2::jsonb, 
         seo_keywords = $3, 
         writer_note = $4::jsonb, 
         structured_data = $5::jsonb 
     WHERE article_id = $6::uuid`,
    JSON.stringify(interviewData.dialogue_data),
    JSON.stringify(interviewData.photos),
    interviewData.seo_keywords,
    JSON.stringify(interviewData.writer_note),
    JSON.stringify(interviewData.structured_data),
    article.id
  );

  console.log('Raw SQL Update success for article:', article.id);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
