const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'kazuya-interview-vol2';
  
  // 1. Upsert MediaArticle
  const article = await prisma.mediaArticle.upsert({
    where: { slug },
    update: {
      title: 'イトウが行く！キャスト丸裸インタビュー vol.2｜現役SE×長身塩顔男子・カズヤ — “大人の余裕”の正体に迫る',
      excerpt: '「ガツガツしていない、大人の余裕」。カズヤさんとお話しして一番強く感じたのはこれです。声のトーンや言葉選びの端々から伝わる安心感は、日々のストレスや疲れを抱える女性にとって、最高のオアシスになるはず。それでいて、ふと見せる末っ子のような甘えん坊な一面……これはズルいです。',
      thumbnail_url: '/images/casts/kazuya/dome.jpg',
      category: 'interview',
      status: 'draft',
      seo_title: '現役SE×長身塩顔男子・カズヤ — “大人の余裕”の正体に迫る',
      seo_description: 'ストロベリーボーイズのキャスト「カズヤ」のインタビュー記事。現役エンジニアとしての横顔や、女性客を虜にする「美しい手」、そして落ち着いた雰囲気に隠された素顔に迫ります。'
    },
    create: {
      slug,
      title: 'イトウが行く！キャスト丸裸インタビュー vol.2｜現役SE×長身塩顔男子・カズヤ — “大人の余裕”の正体に迫る',
      content: 'dummy',
      excerpt: '「ガツガツしていない、大人の余裕」。カズヤさんとお話しして一番強く感じたのはこれです。声のトーンや言葉選びの端々から伝わる安心感は、日々のストレスや疲れを抱える女性にとって、最高のオアシスになるはず。それでいて、ふと見せる末っ子のような甘えん坊な一面……これはズルいです。',
      thumbnail_url: '/images/casts/kazuya/dome.jpg',
      category: 'interview',
      status: 'draft',
      seo_title: '現役SE×長身塩顔男子・カズヤ — “大人の余裕”の正体に迫る',
      seo_description: 'ストロベリーボーイズのキャスト「カズヤ」のインタビュー記事。現役エンジニアとしての横顔や、女性客を虜にする「美しい手」、そして落ち着いた雰囲気に隠された素顔に迫ります。',
      author_name: 'イトウ'
    }
  });

  // 2. Data Structures
  const profile_data = {
    fields: [
      { label: "活動エリア", value: "福岡（博多・天神エリア中心）" },
      { label: "身長", value: "176cm" },
      { label: "雰囲気", value: "長身塩顔・大人・落ち着き" },
      { label: "特技", value: "オイルマッサージ、指圧（美しい手と長い指が武器）" },
      { label: "趣味", value: "バイク、ゲーム観戦、野球観戦（球場で飲むビール）" },
      { label: "ひとこと", value: "寄り添うことが得意です。安心して身を任せてください。" }
    ]
  };

  const faq_data = {
    items: [
      {
        question: "女性用風俗の利用が初めてで緊張しています。",
        answer: "カズヤさんは非常に落ち着いたトーンでお話しされるため、会話しているだけで自然と緊張が解けていくような魅力があります。「人に寄り添うのが得意」とご自身も語る通り、聞き上手でマイペースな性格ですので、初めての方でも安心して委ねることができます。"
      },
      {
        question: "どんなデートがおすすめですか？",
        answer: "福岡市内のカフェやレストランでのんびり過ごすプランはもちろん、お酒や美味しいものがお好きな方は、博多や天神エリアでのディナーデートもおすすめです。落ち着いた雰囲気なので、大人のデートが楽しめます。"
      },
      {
        question: "施術の特徴を教えてください。",
        answer: "女性客から絶賛される「大きくて美しい手・長い指」を活かしたオイルマッサージや指圧が得意です。「痛気持ちいい」と「心地よい」のバランスが絶妙で、心身ともに深いリラクゼーションへと導いてくれます。"
      }
    ]
  };

  const dialogue_data = {
    sections: [
      {
        id: "sec-1",
        heading: "現役エンジニアが「1対1のサービス」を選んだ理由",
        items: [
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "カズヤさん、今日はよろしくお願いします。さっそくなんですけど、普段はシステムエンジニア（SE）をされてるんですよね。" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "はい、普段はバリバリのエンジニアです（笑）。実はこのサイトのシステム的な不具合なんかも、僕が見つけて報告したりしてます。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "ええっ！？ あのめちゃくちゃ的確で分かりやすいバグ報告、カズヤさんだったんですか！ いつも助かってます……。でも、なんでまたエンジニアから全く畑違いのセラピストをやろうと思ったんですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "エンジニアになったのも、もともとは「人の役に立ちたい」「生活を便利にしたい」っていう思いがあったからなんです。でも実際エンジニアをやってみると、ユーザーにサービスが届くまでにすごく時間がかかるし、直接の声ってなかなか聞けないんですよね。届くのはバグの報告ばかりで（笑）。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "ああー、なるほど。作ったシステムがどう喜ばれてるかが見えづらいと。" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "そうなんです。自分が人の役に立ってる実感が湧きにくくて。その点、このお仕事は完全に1対1じゃないですか。お客様からの感謝が全てダイレクトに自分に向かってくる。それがすごくいいなと思ったんです。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "1対1だからこそ得られる「直接のやりがい」ですね。" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "あとはちょっと生々しい話になっちゃいますけど……プライベートでも女性を「攻める」のがすごく好きなんですよね（笑）。相手を気持ちよくさせることにやりがいを感じるタイプなので、自分と相性がいい職業なんじゃないかなと。" }
        ]
      },
      {
        id: "sec-2",
        heading: "野田洋次郎似？ 176cmの塩顔男子と「美しい手」",
        items: [
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "カズヤさん、スタイルもすごく良さそうですよね。身長はおいくつですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "176cmです。細身なので、女性からするともうちょっと高く見えるみたいで「180cmあるよね？」って言われることもありますね。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "176cmでスタイルが良い……完璧じゃないですか。芸能人で誰かに似てるって言われません？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "高橋一生さんとかはたまに言われます。あと最近、RADWIMPSのボーカルの野田洋次郎さんに顔がめっちゃ似てるって立て続けに言われました（笑）。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "あ、分かります！ そのちょっとミステリアスな塩顔の雰囲気、確かに似てますよ！" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "本当ですか？ 自分ではよく分からないんですけどね。めちゃくちゃイケメンってわけでもないし、モテモテの人生だったわけでもないので、変な自信はないんです。でも、だからこそサービスを向上させようっていう意欲に繋がってるんだと思います。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "謙虚だなぁ……。ちなみに、女性のお客様からよく褒められるパーツってありますか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "それが、「手」をすごく褒められるんですよ。手が大きくて、指が長くて細いねって。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "手！ 確かに女性は男性の手や指先、けっこう見てますよね。" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "本当によく見られてるみたいで。「手のタレント（パーツモデル）になれるよ！」って褒められるぐらいなんです。なので、そこは自分の大きな武器かなと思ってます。オイルマッサージや指圧もすごく「気持ちいい」って好評をいただいてますし。" },
          { type: "image", photo_key: "hand" }
        ]
      },
      {
        id: "sec-3",
        heading: "趣味に見る「大人の余裕」—— 野球とゲームの楽しみ方",
        items: [
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "趣味はおありですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "バイクに乗るのが好きなんですけど、あとはゲームとスポーツ観戦ですね。ゲームはストリートファイターとかApexみたいなのをやります。でも、自分で極めるっていうよりは、上手い人の大会配信を見るのが好きなんですよ。「俺全然プレイしてないのに上手くなった気がする！」って満足してます（笑）。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "エンジョイ勢ですね（笑）。スポーツ観戦は何を見るんですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "プロ野球ですね。僕、生まれも育ちも福岡ではないので、ホークスファンではないけど地元のチームを応援しているんですけど……最近めちゃくちゃ弱くて辛いんですよ（苦笑）。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "ああ……（察し）。でも今は福岡にお住まいなんですよね？ ソフトバンクホークスに浮気したりは？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "浮気はしてないですね（笑）。でも野球自体が好きなんで、福岡の球場にも観に行きますよ。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "負けが込んでても球場に行くモチベーションって何なんですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "球場で飲むビールが一番美味しいんですよ！ それだけで行く価値があります。負けても「まぁ次頑張ろう」って切り替えられますし。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "（なんて大人なんだ……）カズヤさんって、ゲームにしても野球にしても、すごく「いい距離感」で楽しんでますよね。ガツガツしすぎてないというか、心の余裕を感じます。その落ち着きが、女性からするとすごく安心感に繋がるんだと思います。" },
          { type: "image", photo_key: "dome" }
        ]
      },
      {
        id: "sec-4",
        heading: "落ち着いた雰囲気に隠された「末っ子」の素顔",
        items: [
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "そんな落ち着き払ったカズヤさんですが、ご自身の性格でギャップみたいなものはありますか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "実は僕、上に姉がいる末っ子長男なんですよ。だからベースはけっこう「甘えん坊」なんです。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "ええ！？ この大人の色気で甘えん坊！？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "ふとした時にそういう末っ子感が出ちゃうみたいで（笑）。普段は真面目で落ち着いてるように見られる分、お酒の席とかでちょっとふざけたりすると「ギャップがあって面白いね」って、年上の女性からはよく可愛がってもらえます。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "それはずるい。絶対に母性本能くすぐられるやつじゃないですか。年上女性からのウケが良いのも納得です。" }
        ]
      },
      {
        id: "sec-5",
        heading: "福岡での新しいスタート。カズヤと過ごす時間",
        items: [
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "今回、福岡エリアでの募集でしたが、福岡でのデートならどんなところに行きたいですか？" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "そうですね、天神や博多周辺でお買い物や美味しいものを食べに行くのもいいですし、車もあるので少し足を伸ばしてドライブデートなんかも楽しいと思います。福岡はご飯が美味しいですからね。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "出張で福岡に来られた女性の方にも、ローカルな案内をしてもらえそうですね。最後に、この記事を読んでいるお客様へメッセージをお願いします。" },
          { type: "dialogue", speaker: "cast", speaker_name: "カズヤ", text: "初めての方はすごく緊張されると思うんですが、僕は「人に寄り添うこと」がすごく得意です。ちょっとした悩みを聞いてほしいとか、落ち着いた時間を過ごしたいという方は、ぜひ一度会いに来てください。僕自身がすごくマイペースで気楽な人間なので、お話しするだけでもスッと気が楽になると思います。安心して身を任せていただければ嬉しいです。" },
          { type: "dialogue", speaker: "staff", speaker_name: "イトウ", text: "カズヤさん、今日はありがとうございました！" }
        ]
      }
    ]
  };

  const photos = {
    dome: "/images/casts/kazuya/dome.jpg",
    hand: "/images/casts/kazuya/hand.jpg",
    staff_photos: {
      "イトウ": "/images/staff/ito.jpg"
    }
  };

  // 3. Upsert InterviewMeta
  const meta = await prisma.interviewMeta.upsert({
    where: { article_id: article.id },
    update: {
      article_type: 'solo_interview',
      area: 'fukuoka',
      vol_number: 2,
      seo_keywords: 'カズヤ, ストロベリーボーイズ, 福岡, SE, セラピスト, 出張ホスト',
      writer_note: [
        '「ガツガツしていない、大人の余裕」。カズヤさんとお話しして一番強く感じたのはこれです。',
        '声のトーンや言葉選びの端々から伝わる安心感は、日々のストレスや疲れを抱える女性にとって、最高のオアシスになるはず。それでいて、ふと見せる末っ子のような甘えん坊な一面……これはズルいです。',
        '福岡で心身ともに癒やされたい方、そして「美しい手」にときめきたい方は、ぜひカズヤさんとの時間を体験してみてください。'
      ]
    },
    create: {
      article_id: article.id,
      article_type: 'solo_interview',
      area: 'fukuoka',
      vol_number: 2,
      seo_keywords: 'カズヤ, ストロベリーボーイズ, 福岡, SE, セラピスト, 出張ホスト',
      writer_note: [
        '「ガツガツしていない、大人の余裕」。カズヤさんとお話しして一番強く感じたのはこれです。',
        '声のトーンや言葉選びの端々から伝わる安心感は、日々のストレスや疲れを抱える女性にとって、最高のオアシスになるはず。それでいて、ふと見せる末っ子のような甘えん坊な一面……これはズルいです。',
        '福岡で心身ともに癒やされたい方、そして「美しい手」にときめきたい方は、ぜひカズヤさんとの時間を体験してみてください。'
      ]
    }
  });

  // We have to use raw query for jsonb updates to ensure correct casting
  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta SET dialogue_data = $1::jsonb, profile_data = $2::jsonb, faq_data = $3::jsonb, photos = $4::jsonb WHERE id = $5::uuid`,
    JSON.stringify(dialogue_data),
    JSON.stringify(profile_data),
    JSON.stringify(faq_data),
    JSON.stringify(photos),
    meta.id
  );

  // 4. InterviewCastLink
  await prisma.interviewCastLink.deleteMany({
    where: { interview_meta_id: meta.id }
  });
  
  await prisma.interviewCastLink.createMany({
    data: [
      {
        interview_meta_id: meta.id,
        cast_name: 'カズヤ',
        role: 'interviewee',
        display_order: 0
      },
      {
        interview_meta_id: meta.id,
        cast_name: 'イトウ',
        role: 'interviewer',
        display_order: 1
      }
    ]
  });

  console.log('Successfully published Kazuya article to DB!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
