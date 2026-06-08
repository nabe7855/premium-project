const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'yuuhi-interview-vol3';
  
  // 1. Ensure MediaArticle exists
  const article = await prisma.mediaArticle.upsert({
    where: { slug },
    update: {
      title: 'イトウが行く！キャスト丸裸インタビュー vol.3｜現役介護士×ワンコ系男子・ゆうひ — “一途な愛”とギャップの正体に迫る',
      status: 'published'
    },
    create: {
      slug,
      title: 'イトウが行く！キャスト丸裸インタビュー vol.3｜現役介護士×ワンコ系男子・ゆうひ — “一途な愛”とギャップの正体に迫る',
      content: 'dummy',
      category: 'ikejo',
      status: 'published'
    }
  });

  console.log('MediaArticle ensured:', article.id);

  // 2. Prepare JSON data
  const interviewData = {
    "seo_keywords": "女性用風俗 福岡, セラピスト 福岡, ストロベリーボーイズ, ゆうひ インタビュー",
    "writer_note": [
      "「ワイルドなイケメン」という第一印象から、「一途で優しいワンコ系男子」へと印象が180度変わる、驚きのインタビューでした。",
      "12年間の純愛を経験し、介護というハードな仕事で培われた「人に寄り添う力」。そして、相手を喜ばせることに全力を注ぐロマンチストな一面。",
      "ゆうひさんとなら、心から安心できる、そして最高に愛される時間を過ごせること間違いなしです。キノコだけは避けて（笑）、ぜひ彼にたっぷりと甘やかされてみてください。"
    ],
    "dialogue_data": {
      "sections": [
        {
          "heading": "歴5年の現役介護士。タフさと優しさの秘密",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ゆうひさん、今日はよろしくお願いします。さっそくですが、普段は介護のお仕事をされていると伺いました。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "はい、もう5年になります。今は難病の方や車椅子生活で体が動かせない方のサポートをするお仕事をしています。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "5年！ それはすごいですね。かなり体力も精神力も使うお仕事じゃないですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "そうですね。体力はもちろん使いますし、精神的にもハードな場面はたくさんあります。でも、その分「誰かのお世話をする」ことにかけては、誰にも負けない自信がつきました。5年やってるので、本当にどんな方のお世話でもできますよ！" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "その言葉、めちゃくちゃ心強いです。体格もすごくガッチリされてますよね？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "小学校6年生から高校3年生までずっと柔道をやっていて、一応「黒帯」なんです。今でも休みの日に柔道着を着て練習に行ったり、ジムで軽く鍛えたりしているので、細マッチョぐらいの体型は維持しています。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "柔道黒帯の介護士……！ その「守ってくれそう」な安心感、ハンパないですね。" }
          ]
        },
        {
          "heading": "ワイルド×韓国系。美容に目覚めたワンコ系男子",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ゆうひさんって、キリッとしたお顔立ちで、少しワイルドな雰囲気がありますよね。芸能人で誰かに似てるって言われませんか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "最近だとRADWIMPSの野田洋次郎さんとか、少し前だと『HiGH&LOW』に出ている俳優さんに似てると言われたことがあります。短髪にするとワイルド系になるんですけど、最近はちょっと髪を伸ばして「韓国系」を意識してます。" },
            { "type": "photo", "photo_key": "selfie_pic" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "あ、確かに今のスタイルは韓国系のアイドルっぽいです！ 女性ウケはどうですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "やっぱり韓国系にしてからのほうがモテますね（笑）。最近は美容にも目覚めて、スキンケアにこだわったり、簡単なメイク動画を見て練習したりしてるんです。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "美意識が高い！ ワイルドな見た目なのに、お話しするとすごく人懐っこくてオープンですよね。「柴犬みたい」って言われるのも納得です。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "そうなんです（笑）。見た目で「怖そう」って思われがちなんですけど、仲良くなると「なんでも話せるね」ってよく言われます。自分自身がすごくオープンな性格なので、お客様にもリラックスして何でも話してほしいなと思っています。" }
          ]
        },
        {
          "heading": "「女性を喜ばせたい」—— 12年の純愛を経て気づいたこと",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "そんなゆうひさんが、なぜセラピストをやろうと思ったんですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "実は僕、高校1年生からずっと付き合っていた彼女がいて、そのまま結婚したんです。結果的には最近お別れしてしまったんですが、トータルで12年くらい一緒にいました。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "12年！？ それはすごい……めちゃくちゃ一途じゃないですか。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "そうですね。介護士になったのも、元々は「資格を取れば転勤になってもどこでも働けるから、彼女と結婚するため」だったんです。でも、いろいろあって離婚して、自分ひとりの時間が増えた時に、改めて「自分がやりたいこと」を考えました。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "なるほど。それがこの仕事だったと。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "はい。夜の営みにおいて、僕は「自分が楽しみたい」というより「女性を喜ばせたい」という気持ちがすごく強くて。自分が奉仕して、相手の女性が喜んでくれる顔を見るのが一番の幸せなんです。それを仕事にできたら最高だなと思って飛び込みました。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ご自身のプレースタイルで、自信がある部分はありますか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "「いくらでも愛せます」ってことですかね。特に言葉を使ったスキンシップや、じっくり時間をかけて相手を満たすことには自信があります。過去の経験からも、そこは女性からすごく好評をいただいていたので、たっぷり甘やかしてあげたいです。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "これは頼もしい……！ ちなみに、年上の女性はいかがですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "大好きです！ むしろ年上の方が断然いいですね。30代、40代、50代の女性の落ち着いた色気や、一緒にいるときの居心地の良さがすごく好きで。僕自身、甘えたり甘えられたりするのが好きなので、年上のお姉さんにはぜひ可愛がってほしいです。" }
          ]
        },
        {
          "heading": "涙もろいロマンチスト。でも「キノコ」だけはNG？",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ゆうひさん、休みの日はどんなふうに過ごしていますか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "温泉やサウナに行くのが大好きです。車を運転するのも好きなので、福岡の市外や地元・熊本の温泉まで足を伸ばすこともあります。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "いいですね。映画を見たりは？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "映画も好きです！ 『花束みたいな恋をした』みたいな、ちょっとリアルで大人な恋愛映画とか。僕、めちゃくちゃ涙もろくて、映画を見てポロポロ泣いちゃうんですよ。" },
            { "type": "photo", "photo_key": "sunset_beach" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ええーっ、柔道黒帯の男らしいルックスで、映画で泣くんですか！？ ギャップが渋滞してますね。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "サプライズとかも大好きなんです。なんでもない日に花束を渡したり、ホテルを風船で飾り付けてお祝いしたり。そういうエンターテインメント性のあるデートをするのが好きですね。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "めちゃくちゃロマンチストじゃないですか……。逆に、これだけは苦手！っていうものはありますか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "……キノコです。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "え？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "キノコ全般が絶対に無理で……。なので、ご飯デートの時だけは、キノコが入っていないお店にしてもらえるとすごく嬉しいです（笑）。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "わかりました（笑）。キノコはNGですね。" }
          ]
        },
        {
          "heading": "福岡でのデートと、未来のお客様へ",
          "items": [
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ストロベリーボーイズを選んでくれた理由は何だったんですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "「ストロベリー」っていう名前が可愛くていいなと思ったんです。僕自身「犬系」というか、可愛がってもらいたいタイプなので、ギラギラしたホスト系の名前より、こういう可愛い名前のお店の方が自分に合ってるなと。" },
            { "type": "photo", "photo_key": "cafe_date" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "福岡でのデートなら、どんなプランがいいですか？" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "僕は相手に合わせるのが好きなので、まずはゆっくりカフェでお話ししたいですね。天神や博多で買い物をしたり、海の中道にある水族館に行ったり。おしゃれなカフェでご飯を食べて、夜は雰囲気のいいホテルでゆっくり……みたいな、王道のデートプランも大好きです。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "最後に、これからゆうひさんに会いに来てくれるお客様へメッセージをお願いします。" },
            { "type": "dialogue", "speaker": "cast", "speaker_name": "ゆうひ", "text": "僕がお届けしたいのは、「癒やし」と「安心」、そして「愛を感じる特別な時間」です。ストレスを感じさせない、心の底からリラックスできる環境を作ります。僕にしかできない特別な愛情表現で、心も体もたっぷり満たしますので、ぜひ一度会いに来てください。" },
            { "type": "dialogue", "speaker": "interviewer", "speaker_name": "イトウ", "text": "ゆうひさん、ありがとうございました！" }
          ]
        }
      ]
    },
    "photos": {
      "selfie_pic": {
        "layout": "portrait",
        "url": "/images/casts/yuuhi/selfie.jpg",
        "alt": "ゆうひさん自撮り",
        "caption": "美容にも気を使う韓国系スタイル"
      },
      "sunset_beach": {
        "layout": "portrait",
        "url": "/images/casts/yuuhi/sunset-beach.jpg",
        "alt": "サンセットビーチに佇むゆうひさん",
        "caption": "ロマンチストな一面も"
      },
      "cafe_date": {
        "layout": "portrait",
        "url": "/images/casts/yuuhi/cafe-date.jpg",
        "alt": "カフェでのゆうひさん",
        "caption": "王道のカフェデートや水族館デートが得意"
      }
    },
    "profile_data": {
      "activities": ["福岡"],
      "height": "170cm",
      "vibe": "韓国系・醤油顔イケメン・ワンコ系（柴犬）",
      "special_skills": ["柔道（黒帯）", "女性を喜ばせること（奉仕）"],
      "hobbies": ["温泉・サウナ", "美容・ファッション", "サプライズをすること"],
      "catchphrase": "癒やしと安心、愛を感じる時間を提供します。たっぷり愛させてください。"
    },
    "faq_data": [
      {
        "question": "どんな接客スタイルですか？",
        "answer": "第一印象はキリッとしていますが、中身はとてもオープンで人懐っこい「ワンコ系男子」です。介護士として5年働いている経験から、相手への気遣いや包容力は抜群。「なんでも話しやすい安心感がある」と定評があります。"
      },
      {
        "question": "施術（プレー）の特徴を教えてください。",
        "answer": "「自分が楽しむより、女性を喜ばせたい」という強い思いを持っています。特にじっくりと時間をかけて相手を愛すること（奉仕）を得意としており、愛情たっぷりのスキンシップで心も体も満たしてくれます。"
      },
      {
        "question": "デートではどんなところに行きたいですか？",
        "answer": "お客様の要望に合わせるのが得意ですが、おしゃれなカフェでゆっくりお話ししたり、水族館（海の中道など）でのんびり過ごすデートが好きです。サプライズも大好きなので、記念日などのご利用にもぴったりです。"
      }
    ],
    "structured_data": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "現役介護士×ワンコ系男子・ゆうひ — “一途な愛”とギャップの正体に迫る",
      "author": { "@type": "Person", "name": "イトウ" }
    }
  };

  // Upsert InterviewMeta
  const existingMeta = await prisma.interviewMeta.findUnique({
    where: { article_id: article.id }
  });

  if (existingMeta) {
    await prisma.$executeRawUnsafe(
      `UPDATE interview_meta 
       SET dialogue_data = $1::jsonb, 
           photos = $2::jsonb, 
           seo_keywords = $3, 
           writer_note = $4::jsonb, 
           structured_data = $5::jsonb,
           profile_data = $6::jsonb,
           faq_data = $7::jsonb
       WHERE article_id = $8::uuid`,
      JSON.stringify(interviewData.dialogue_data),
      JSON.stringify(interviewData.photos),
      interviewData.seo_keywords,
      JSON.stringify(interviewData.writer_note),
      JSON.stringify(interviewData.structured_data),
      JSON.stringify(interviewData.profile_data),
      JSON.stringify(interviewData.faq_data),
      article.id
    );
  } else {
    await prisma.$executeRawUnsafe(
      `INSERT INTO interview_meta (id, article_id, article_type, seo_keywords, dialogue_data, photos, writer_note, structured_data, profile_data, faq_data, updated_at)
       VALUES (gen_random_uuid(), $1::uuid, 'solo_interview', $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, NOW())`,
      article.id,
      interviewData.seo_keywords,
      JSON.stringify(interviewData.dialogue_data),
      JSON.stringify(interviewData.photos),
      JSON.stringify(interviewData.writer_note),
      JSON.stringify(interviewData.structured_data),
      JSON.stringify(interviewData.profile_data),
      JSON.stringify(interviewData.faq_data)
    );
  }

  console.log('Update success for Yuuhi article:', article.id);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
