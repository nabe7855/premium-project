import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function applyConfirmedPackage() {
  console.log('=== APPLYING CONFIRMED PACKAGE FOR SEIRA VOL.4 ===\n');

  // 1. Find mediaArticle (slug: seira-interview-vol4)
  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  if (!article) {
    console.error('Article seira-interview-vol4 not found!');
    return;
  }

  // 2. Exact confirmed data from package
  const title = 'イトウが行く！キャスト丸裸インタビュー vol.4｜35歳、最後のチャンス — 福岡の新人セラピスト・セイラが「尽くしたい」と言う理由';
  const seoTitle = '35歳、最後のチャンス — 福岡の新人セラピスト・セイラが「尽くしたい」と言う理由｜ストロベリーボーイズ福岡';
  const seoDescription = '「前の職場の後輩の名前なんです」。35歳、全身脱毛7〜8年、一瞬で伝わる人柄。福岡店でデビューする新人セラピスト・セイラさんにライター・イトウが切り込みました。';

  await prisma.mediaArticle.update({
    where: { id: article.id },
    data: {
      title,
      seo_title: seoTitle,
      seo_description: seoDescription,
      excerpt: seoDescription,
      status: 'published',
      category: 'interview',
      author_name: 'イトウ'
    }
  });

  // 3. Exact dialogue_data (all 6 sections)
  const dialogue_data = {
    sections: [
      {
        id: 'sec-1',
        heading: '「セイラ」は、前の職場の後輩からもらった名前',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'セイラさん、今日はよろしくお願いします。さっそくなんですけど、すごくセンスのいいお名前ですよね。これ、どこから取ったんですか？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '前の職場の後輩の名前なんです。「青空」って書いてセイラ。かっこいいなとずっと思っていて、使わせてもらいました。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '女性の方かと思いました。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '男性です（笑）。もう離れてしまったんですけど、名前だけはずっと頭に残ってて。' },
          { type: 'editor_note', text: '人の名前を「かっこいい」と覚えていて、借りてまで名乗る。この時点で、人のいいところを見つけるのが得意な人なんだろうな、と分かってしまいました。' },
        ],
      },
      {
        id: 'sec-2',
        heading: '174cm、35歳。「27歳ですか？」と間違われる肌の話',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '身長と体型を教えてください。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '174cmで、64〜65kgくらいですね。普通体型だと思います。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '失礼ながら、年齢を伺っても？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '35です。ただ、だいたい実年齢より若く見られますね。27くらいって言われることが多いです。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '27。画面越しでも肌がきれいなのが分かります。何かしてるんですか？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '何もしてないです（笑）。ちゃんと洗顔して、化粧水と乳液をつけるだけで。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '……ちょっとムカつきました（笑）。美意識が高いタイプなんですね。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '高いわけじゃないんです。ただ、清潔感は保っていたいなと思っていて。全身脱毛はしてます。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'どのくらい続けてるんですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '間が空いた時期もありますけど、トータルで7〜8年ですね。今日も行ってきました。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '今日も！？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'ヒゲとラインだけ、まだちょっと残ってて。' },
          { type: 'narration', text: 'まつげが長い。「羨ましい」と女性から言われた回数は数えきれないという。低いのに、どこか柔らかい声。' },
          { type: 'photo', photo_key: 'portrait' },
        ],
      },
      {
        id: 'sec-3',
        heading: '生まれも育ちも福岡。ゴルフ場と球場と、譲れないラーメン3軒',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご出身はどちらですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '福岡です。仕事で県外にいた時期もありますけど、今はずっと福岡ですね。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '運動、されてました？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '小さい頃からずっと体を動かすのが好きで、野球とサッカーと陸上を。むしろ運動しか得意じゃないです（笑）。中学高校のころはアビスパ福岡のファンクラブにも入ってました。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '今も体を動かしてるんですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '涼しくなったら友達とゴルフに行ったり、野球やサッカーを観に行ったり。……ゴルフ場で飲むお酒が最高なんですよ。朝8時から飲んだりします。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '朝8時（笑）。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '球場で飲むビールも最高です。家でも毎日飲みますね。録画したお笑い番組や映画を見ながらゴロゴロして。インドアもアウトドアも、どっちも好きです。' },
          { type: 'photo', photo_key: 'fullbody' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '食べ物はどうですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '自炊はしないです。好きなものはラーメン、焼肉、寿司、オムライス。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'オムライス（笑）。かわいいところがありますね。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'あと、ラーメンだけは聞いてください。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '来ました。福岡に遊びに来た人が行くべき3軒、教えてください。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '今日のお昼も食べたんですけど「一双」。あとは県外の方にも人気の「しんしん」、それから「ふくちゃんラーメン」。全部とんこつです。福岡ですから。' },
          { type: 'photo', photo_key: 'ramen' },
          { type: 'editor_note', text: 'このあとイトウが福岡のラーメン談義に夢中になり、インタビューの持ち時間を危うく溶かしかけました。' },
        ],
      },
      {
        id: 'sec-4',
        heading: '「好きになった人には、好かれないんですよ」',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'モテそうな見た目をされてますけど、今はお相手は。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '今はいないです。2年くらい前までですね。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '意外です。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '好きになった人には好かれないんですよ。逆に、興味のない人からは好かれたりして。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '心当たりはあるんですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'たぶん、ガツガツいっちゃうタイプなんで。それがあまりよくないのかなって。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '周りからはどんな人だと言われます？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '「適当」ってよく言われます（笑）。あまりよくないかもしれないですけど、一緒にいて楽なのは大事かなと思っていて。あとは優しいとか、面白いとか。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '相談ごとを持ちかけられるタイプでしょう。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '受けますね。まずは話を聞いてあげることが大事だと思うので。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご自身の性格を一言で言うと？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '優しい……ぐらいじゃないですか（笑）。人間こうあるべき、みたいに思いすぎると苦しくなっちゃうじゃないですか。そういうのが、あまりないんです。' },
          { type: 'narration', text: '三人きょうだいの末っ子。年上の女性から可愛がられることが多いと本人は言う。落ち着いて見えて、場面によっては全力ではしゃぐらしい。' },
        ],
      },
      {
        id: 'sec-5',
        heading: '35歳、最後のチャンス。応募ボタンを押すまでの数年間',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'この仕事を始めようと思ったきっかけを教えてください。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '夜、女性と過ごすときも、相手に気持ちよくなってほしいというのが一番にあるタイプで。尽くしてあげたいというか。それで、もしかしたら向いてるのかなと思ったんです。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'こういう仕事があること自体は、前から知っていた？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '話題になった頃から知ってはいました。やってみたい気持ちはずっとあったんですけど、なかなか踏み出せなくて。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '何が背中を押したんですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'もう35ですし、最後のチャンスかなと思って。一回やってみようと思って応募しました。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '何店舗か比較されましたか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'しました。ホームページを見ていて、ここは長く続いているじゃないですか。ちゃんとしたお店なんだろうなという信頼があって。ホストクラブみたいな雰囲気のところもあったんですけど、ここは柔らかい感じで、いいなと思って。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '応募前に、一番不安だったことは。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '決まりごとがいろいろあるじゃないですか。僕、頭がよくないので、覚えられるかなと（笑）。今も勉強中です。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'そこをちゃんと不安に思えるのは、いいことだと思いますよ。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'ありがとうございます。女性をちゃんと満足させられるように、気持ちも体も、頑張りたいなと思ってます。' },
        ],
      },
      {
        id: 'sec-6',
        heading: '「最初はリードしたい。でも、引っ張りすぎずに」— 初めてのあなたへ',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'お客様にどんな時間を届けたいですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '「来てよかったな」と思ってもらいたいです。初めてだと絶対に緊張されると思うんですよ。僕も自分が利用する側だったとき、そうだったので。特別な時間、素敵な時間として共有できたらいいなと思ってます。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '接客で一番大切にしたいことは。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'まずは相手の話を聞くこと。その人が何を求めているのかを自分で察知して、寄り添うことだと思ってます。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '初めてのお客様には、どう接したいですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '最初はちゃんと僕がリードしたいですね。でも、引っ張りすぎずに。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'これだけは誰にも負けない、というものはありますか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '気配り、心配りです。ずっと部活で習ってきたことなので、そこは負けたくないです。あとは……全身脱毛しているので、肌のつるつるさは負けません（笑）。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '福岡でデートするなら、どこに行きたいですか。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '温泉デートしてみたいですね。あとは博多や天神でごはんを食べたり、球場に野球を観に行ったり。……健全すぎますかね（笑）。' },
          { type: 'photo', photo_key: 'handwritten' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '最後に、これから会いに来る方へメッセージをお願いします。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '絶対に緊張されると思いますし、今、踏みとどまっている方もいると思います。でも、一歩だけ踏み出してみてほしいです。特別な時間、素敵な時間にする自信はありますので、ぜひ会いに来てください。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'セイラさん、今日はありがとうございました。' },
        ],
      },
    ],
  };

  const profile_data = {
    fields: [
      { label: '活動エリア', value: '福岡（博多・天神エリア中心）' },
      { label: '年齢', value: '35歳（20代後半に見られることが多い）' },
      { label: '身長・体重', value: '174cm / 64〜65kg（普通体型）' },
      { label: '外見の印象', value: '低い声、長いまつげ、全身脱毛済み' },
      { label: 'スポーツ歴', value: '野球・サッカー・陸上（アビスパ福岡ファン）' },
      { label: '趣味', value: 'ゴルフ場・球場での一杯、お笑い・映画鑑賞' },
      { label: '好きな食べ物', value: 'とんこつラーメン（一双/しんしん/ふくちゃん）、焼肉、寿司、オムライス' },
      { label: '性格', value: '優しい、適当で楽、聞き上手、気配り・心配り重視' },
      { label: 'デートの希望', value: '温泉、博多・天神グルメ、野球観戦' },
    ],
  };

  const faq_data = {
    items: [
      {
        question: 'セイラさんはどんな人ですか？話すのが苦手でも大丈夫ですか？',
        answer: '35歳・普通体型の落ち着いた雰囲気で、低い声と柔らかい話し方が特徴です。部活経験で培われた気配りと「まずは話を聞く」姿勢を大切にしており、聞き手にまわるのが得意なタイプです。お話しが得意でない方でもリラックスして過ごしていただけます。',
      },
      {
        question: '年齢差が気になります。年上や年下でも利用できますか？',
        answer: 'まったく問題ありません。三人きょうだいの末っ子で年上の方から可愛がられることが多く、実年齢より若い印象（27歳前後）を持たれることも多いです。どなたでも気を遣わずに過ごせる雰囲気を大切にしています。',
      },
      {
        question: 'どんなデートや過ごし方がおすすめですか？',
        answer: 'お部屋でのんびり過ごすのはもちろん、温泉デート、博多・天神でのごはん、球場での観戦など、健全で心地よいデートも大歓迎です。「相手の希望に寄り添いたい」というスタンスですので、ご希望をお聞かせください。',
      },
      {
        question: '身だしなみや清潔感はどうですか？',
        answer: 'トータルで7〜8年全身脱毛を継続しており、お肌の手入れや清潔感の維持には人一倍気を配っています。',
      },
    ],
  };

  const writer_note = [
    '「人の名前をかっこいいと覚えていて、借りてまで名乗る」「自分の話より相手の話を聞きたがる」「人間こうあるべきと思いすぎない」。',
    'セイラさんと話していて一番印象的だったのは、相手に対する過剰な期待も自分に対する押しつけもなく、ただその場を心地よくしようとする自然体の優しさでした。',
    '35歳、最後のチャンスとして一歩を踏み出したセイラさん。緊張している方にこそ、彼の柔らかい雰囲気に触れてほしいと思います。',
  ];

  const p1Url = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/seira/seira_portrait_1786320401253.jpg';
  const p2Url = 'https://vkrztvkpjcpejccyiviw.supabase.co/storage/v1/object/public/banners/news-pages/seira/seira_fullbody_1786320401253.jpg';

  const photosData = {
    portrait: {
      url: p1Url,
      alt: '174cm細身のセイラ',
      caption: '「27歳くらいって言われます」',
      layout: 'portrait'
    },
    fullbody: {
      url: p2Url,
      alt: '白Tシャツに黒パンツのシンプルな私服姿',
      caption: '普段着は「黒いパンツに白いTシャツ」',
      layout: 'portrait'
    },
    ramen: {
      url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
      alt: 'セイラが取材当日に食べた博多のとんこつラーメン',
      caption: '取材当日のお昼。福岡はやっぱりとんこつ',
      layout: 'landscape'
    },
    handwritten: {
      url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
      alt: 'セイラの手書きメッセージ',
      caption: 'セイラさんからの手書きメッセージ',
      layout: 'landscape'
    },
    staff_photos: {
      'イトウ': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    }
  };

  const ctaData = {
    links: [
      {
        label: '福岡店セラピスト一覧',
        href: 'https://www.sutoroberrys.jp/store/fukuoka/cast-list',
        description: 'セイラさんをはじめ、福岡店で在籍中の厳選イケメンセラピスト一覧はこちら。'
      },
      {
        label: '初めての方へ',
        href: 'https://www.sutoroberrys.jp/store/fukuoka/first-time',
        description: '女性用風俗の利用の流れ、料金体系、よくある質問を分かりやすく解説しています。'
      },
      {
        label: '福岡店トップページ',
        href: 'https://www.sutoroberrys.jp/store/fukuoka',
        description: 'コース料金やお得なキャンペーン情報、店舗の最新情報をご確認いただけます。'
      }
    ]
  };

  const canonicalUrl = 'https://www.sutoroberrys.jp/store/fukuoka/interview/-130642/seira-interview-vol4';

  const structured_data = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description: seoDescription,
      image: [p1Url],
      datePublished: article.published_at ? article.published_at.toISOString() : new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: 'イトウ',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ストロベリーボーイズ',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.sutoroberrys.jp/images/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq_data.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'ストロベリーボーイズ',
          item: 'https://www.sutoroberrys.jp',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '福岡店',
          item: 'https://www.sutoroberrys.jp/store/fukuoka',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'インタビュー一覧',
          item: 'https://www.sutoroberrys.jp/store/fukuoka/interview',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  const meta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  if (meta) {
    await prisma.interviewMeta.update({
      where: { id: meta.id },
      data: {
        article_type: 'solo_interview',
        series_slug: 'seira-interview',
        vol_number: 4,
        area: 'fukuoka',
        dialogue_data,
        profile_data,
        faq_data,
        writer_note,
        photos: photosData,
        cta_data: ctaData,
        structured_data
      }
    });
    console.log('✅ Updated interview_meta with EXACT CONFIRMED PACKAGE DATA!');
  }

  // 4. Update interview_cast_links to point to cast_name_romaji '-130642'
  const seiraCast = await prisma.cast.findFirst({
    where: { name: { contains: 'せいら' } }
  });

  if (meta && seiraCast) {
    const existingLink = await prisma.interviewCastLink.findFirst({
      where: { interview_meta_id: meta.id }
    });

    if (existingLink) {
      await prisma.interviewCastLink.update({
        where: { id: existingLink.id },
        data: {
          cast_id: seiraCast.id,
          cast_name: '青空（せいら）',
          cast_name_romaji: '-130642',
          role: 'interviewee'
        }
      });
      console.log('✅ Updated interview_cast_link with cast_name_romaji: "-130642"');
    }
  }
}

applyConfirmedPackage().catch(console.error);
