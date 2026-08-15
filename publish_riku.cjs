const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SLUG = 'riku-interview-vol5';

const photos = {
  seaside: {
    url: '/images/casts/riku/seaside.jpg',
    alt: '海辺のデッキに立つ171cmのりく',
    caption: '海を見ると、テンションが上がるらしい',
    layout: 'portrait',
  },
  hands: {
    url: '/images/casts/riku/hands.jpg',
    alt: 'グラスを手にするりく。自慢の指先',
    caption: '「手の綺麗さだけは、誰にも負けません」',
    layout: 'portrait',
  },
  catclock: {
    url: '/images/casts/riku/catclock.jpg',
    alt: '部屋の猫の壁掛け時計とりく',
    caption: '猫と赤ちゃんと観葉植物に弱い',
    layout: 'portrait',
  },
  food: {
    url: '/images/casts/riku/food.jpg',
    alt: 'りくが兄と訪れたお店の料理',
    caption: 'お兄さんと2人、お店を巡るのが恒例',
    layout: 'portrait',
  },
  staff_photos: { 'イトウ': '/images/staff/ito.jpg' },
};

const dialogue_data = {
  sections: [
    {
      id: 'sec-1',
      heading: '「りく」は、ずっと呼ばれてきた名前のまま',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'りくさん、今日はよろしくお願いします。まず第一印象なんですが……韓国風の綺麗めなお顔立ちですね。センターパート、すごく似合ってます。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'ありがとうございます(笑)。この髪型は最近始めて、ハマっちゃったんです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '外から見てもハマってます。お名前の「りく」は、どこから?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'ずっと「りく」ってあだ名で呼ばれてきたので、そのまま付けました。' },
        { type: 'editor_note', text: '芸名を凝るでもなく、ずっと呼ばれてきた名前をそのまま持ってくる。飾らない人なんだろうな、というのは取材の最初の5分で分かってしまいました。' },
      ],
    },
    {
      id: 'sec-2',
      heading: '広島出身。海を見ると、テンションが上がる',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご出身は?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '広島です。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '都会と田舎、どっちが好きですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'もう、ゴリゴリで田舎です(笑)。子どもの頃は海があまり身近じゃなかったので、海を見ると、興奮しちゃうタイプです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '海でウェイってはしゃげる?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'はしゃげますね。テンション上がっちゃいます。' },
        { type: 'photo', photo_key: 'seaside' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '体格の話も。身長はどのくらいですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '171cmで、体重は60kgくらい。細い方だと思います。ただ小さい頃からずっと野球をやっていたので、肩幅とか腰回りは意外とごつくて。ズボン選びには悩みます(笑)。' },
        { type: 'narration', text: '画面越しでも分かる肩幅。細身なのに姿勢が崩れない。話し方には「えっと」「あの」がほとんど無く、静かで整っている。初対面では「冷たそう」と言われることもあるらしいが、10分も話せば、それが単なる落ち着きだと分かる。' },
      ],
    },
    {
      id: 'sec-3',
      heading: '鍼灸の学校で覚えた、「手」の話',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'りくさん、経歴がすごいんですよね。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '鍼灸の専門学校に行って、国家資格を取りました。いまは昼間、治療院で働いています。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'つまり、手で人を癒すプロです。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '手の感覚で癒すことには、自信がある方だと思います。指圧もオイルも、力加減の調整の幅というか。……もう、そこぐらいしかアピールポイントがないっていうくらい(笑)。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'いやいや、それが一番強いんですよ。これだけは誰にも負けない、というものはありますか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '手の綺麗さです。男性の中でも綺麗なほうだという自信があります。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ちょっと見せてください。……あ、本当だ。綺麗。女性みたい。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '施術のとき、手ってお客様に見られるじゃないですか。汚かったら丁寧じゃないなと思われる。だから手にも日焼け止めを塗るし、爪は3日に1回はケアしています。' },
        { type: 'photo', photo_key: 'hands' },
        { type: 'editor_note', text: '爪のケアが3日に1回。取材中に画面越しで手を見せてもらいましたが、指が細くて長い。手フェチの方は、たぶんこの人で正解です。' },
      ],
    },
    {
      id: 'sec-4',
      heading: 'マイペースな小悪魔。猫と観葉植物と、定食の話',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご自身の性格を一言で言うと?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'マイペースですね。初対面だと「冷たそう」とか「人に興味なさそう」って言われるんですけど(笑)、楽しくなったら全然、ゴリゴリはしゃぎます。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご兄弟は?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '3人兄弟の真ん中です。高校で野球をやっていて上下関係が厳しかったので、年上には一歩引いちゃう。そのぶん後輩には優しくするタイプです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '真ん中っ子は小悪魔が多いってよく言いますけど。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '上には可愛がられやすくて、自分は下の子に絡んでいきたいタイプなので……そうかもしれないです(笑)。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '休みの日は何をしてますか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'ランニングをするか、兄と居酒屋を巡るか。あとは最近、観葉植物にハマってます。家にサボテンがいて、ちょくちょく写真を撮っちゃいます。' },
        { type: 'photo', photo_key: 'catclock' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'テンションが上がる瞬間は?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'お酒の場と、あとは……猫とか赤ちゃんとか、可愛いものを見たときです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'お酒は強いんですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '弱いんですけど、赤くなってからが長いという中途半端なタイプで(笑)。酔うとよく喋るようになって、距離が近くなります。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'それはいいギャップですね。好きな食べ物は?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '和食です。白ご飯と味噌汁と納豆と卵焼き、みたいな定番の定食がすごく好きで。1人で定食屋さんを巡ったりします。最近だと天神の定食屋さんが、サービス精神旺盛ですごく良かったです。' },
        { type: 'photo', photo_key: 'food' },
        { type: 'editor_note', text: '「その人が作ってくれた料理が好き」とも言っていました。デートの正解、もう出ていませんか。' },
      ],
    },
    {
      id: 'sec-5',
      heading: '「検索したら、一番上に出てきたんです」— 応募まで',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'この仕事は、どうやって知ったんですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'たまたま見ていた動画に出ていた人を「何をしてる人なんだろう」と調べたら、この仕事でした。やってみたい気持ちがあって、自分でも調べ始めて。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '数あるお店から、うちを選んだ理由は。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '検索したら、一番上に出てきたんです。それで、「ストロベリーボーイズ」っていう名前が可愛いなと思って(笑)。直感ですね。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '直感、大事です。応募からは、とんとん拍子?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '7月の末に応募して、すぐ面談をしてもらいました。いまはデビュー準備中で、LINEで「こういう写真を出してみてください」って具体的に教えてもらえるので、SNSをやってこなかった僕にはすごくありがたいです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'デビュー前のいま、不安はありますか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: 'あります。自分にちゃんとお客様がついてくれるのかな、というのは今も不安です。でも、上手に見せることより、一生懸命やっていることが伝われば、「もう一回この子にお願いしようかな」と思ってもらえるんじゃないかって。まずはそこからだと思っています。' },
        { type: 'narration', text: '飾った答えがひとつも無い。この正直さは、たぶんこの人の施術にもそのまま出る。' },
      ],
    },
    {
      id: 'sec-6',
      heading: '「僕も緊張すると思うので」— 初めてのあなたへ',
      items: [
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'お客様に、どんな時間を届けたいですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '癒されに来てほしいです。普段出せない素の自分を出せる、落ち着ける時間を提供したいなと思っています。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '接客で一番大切にしていることは。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '昼の仕事の上司にずっと言われているのが「些細なことに気づけ」なんです。ちょっとした体の変化とか、着ている服とか。痛そうな方、辛そうな方と接する仕事なので、心配りは丁寧に、と教わってきました。ここでも一番大切にしたいです。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '緊張しているお客様は、どうほぐしますか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '言葉や雰囲気も大事なんですけど、体の作用から考えると、そっと触れたり、物理的に少し近づいたりするほうが、緊張はほぐれやすいと思っています。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '福岡でデートするなら?' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '飲み屋さんを巡るのも好きですし、温泉も好きです。逆に、1日おうちでエアコンをつけて映画を見てゴロゴロ、も全然できます。外でウェイも、おうちでまったりも、どっちも大丈夫です(笑)。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '1年後、どんなセラピストになっていたいですか。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '出勤予定をチェックしてもらえて、「この日に合わせたい」と指名をいただける。まずは1日に1人、指名が入るところまで目指したいです。……この業界に入ったからには、売上1位も目指してみたいですね。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '最後に、これから会いに来る方へメッセージを。' },
        { type: 'dialogue', speaker: 'cast', speaker_name: 'りく', text: '初めての方は緊張されると思いますが、僕も、たぶん緊張します(笑)。お互いリラックスして——僕が寄り添いますので、素の自分を出して、満足して帰っていただけたら嬉しいです。ぜひ会いに来てください。' },
        { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'りくさん、今日はありがとうございました。' },
      ],
    },
  ],
};

const profile_data = {
  fields: [
    { label: '活動エリア', value: '福岡(博多・天神エリア中心)' },
    { label: '年齢', value: '23歳' },
    { label: '身長・体型', value: '171cm/60kg・細身(野球で鍛えた体幹と肩幅)' },
    { label: '雰囲気', value: '韓国風・センターパート・落ち着いて見えて実はお茶め' },
    { label: '資格', value: '鍼灸の国家資格(昼は治療院勤務)' },
    { label: '趣味', value: 'ランニング、観葉植物、定食屋巡り、ウィンドウショッピング' },
    { label: '好きなもの', value: '和食の定食、猫、赤ちゃん、海' },
    { label: '強み', value: '鍼灸で覚えた手の感覚/3日に1回ケアする手の綺麗さ' },
    { label: 'ひとこと', value: '僕が寄り添いますので、素の自分を出してください。' },
  ],
};

const faq_data = {
  items: [
    {
      question: '女性用風俗を利用するのが初めてで、緊張しています。',
      answer:
        'りくは取材の中で「初めての方は緊張されると思いますが、僕も、たぶん緊張します」と話しています。昼の仕事で教わってきた「些細な変化に気づく」心配りを一番大切にしたいという方針で、言葉だけでなく、そっと触れることで緊張をほぐしていくタイプです。ご自身のペースで大丈夫です。',
    },
    {
      question: 'りくの施術には、どんな特徴がありますか。',
      answer:
        'りくは鍼灸の専門学校で学び、国家資格を持つ「手のプロ」です。指圧もオイルトリートメントも、力加減の調整に自信があると話しています。手にも日焼け止めを塗り、爪は3日に1回整えるという徹底ぶりで、「手の綺麗さは誰にも負けない」と言い切ります。',
    },
    {
      question: 'りくは新人ですが、指名しても大丈夫でしょうか。',
      answer:
        'りくは2026年8月に福岡店へ仲間入りした新人セラピストです。「上手に見せることより、一生懸命やっていることが伝わるように」と本人が話すとおり、正直で丁寧なタイプです。デビュー日や最新の出勤状況は、出勤スケジュールページでご確認ください。',
    },
  ],
};

const writer_note = [
  '取材で一番印象に残ったのは、「爪は3日に1回ケアしています」という一言でした。誰に言われたわけでもなく、お客様から見える場所だから、と。この几帳面さは、たぶん施術のすみずみに出ます。',
  '「検索したら一番上に出てきて、名前が可愛かったから」という応募理由に、思わず笑ってしまいました。でもその直感で動ける素直さと、「一生懸命やっていることが伝われば」という誠実さは、たぶん同じところから来ています。',
  '静かで整った話し方をするのに、海を見るとはしゃいで、猫に弱くて、サボテンの写真を撮ってしまう。このギャップは、会って確かめる価値があると思います。',
];

const cta_data = {
  heading: '次はこちらもどうぞ',
  links: [
    {
      label: 'りくの出勤スケジュールを見る',
      href: 'https://www.sutoroberrys.jp/store/fukuoka/schedule',
      description: '最新の出勤日と空き状況はこちらから確認できます',
    },
    {
      label: '料金・コースを確認する',
      href: 'https://www.sutoroberrys.jp/store/fukuoka/price',
      description: 'コース料金と延長・交通費の考え方をまとめています',
    },
    {
      label: '初めての方へ',
      href: 'https://www.sutoroberrys.jp/store/fukuoka/first-time',
      description: '予約から当日の流れまで、初めての方向けにご案内します',
    },
  ],
};

const structured_data = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '手だけは、誰にも負けない — 鍼灸の国家資格を持つ福岡の新人セラピスト・りく(23)',
  description:
    '福岡・ストロベリーボーイズの新人セラピスト「りく」のインタビュー。鍼灸の学校で覚えた手の感覚、3日に1回の爪ケア、猫と観葉植物に癒される素顔まで。',
  author: { '@type': 'Person', name: 'イトウ' },
  publisher: { '@type': 'Organization', name: 'ストロベリーボーイズ' },
  about: { '@type': 'Person', name: 'りく' },
  contentLocation: { '@type': 'Place', name: '福岡' },
};

async function main() {
  const cast = await prisma.cast.findFirst({
    where: { name: { contains: 'りく' } },
    select: { id: true, name: true, slug: true },
  });
  if (!cast) {
    throw new Error(
      'casts テーブルに「りく」が見つかりません。先にキャスト登録を済ませてから再実行してください。'
    );
  }
  console.log('cast resolved:', cast);

  const article = await prisma.mediaArticle.upsert({
    where: { slug: SLUG },
    update: {
      title:
        'イトウが行く！キャスト丸裸インタビュー vol.5｜手だけは、誰にも負けない — 鍼灸の国家資格を持つ福岡の新人セラピスト・りく(23)',
      excerpt:
        '「検索したら、一番上に出てきたんです」。広島出身、鍼灸の国家資格を持つ23歳が、直感でこの世界に飛び込んだ。3日に1回ケアする自慢の手、猫と観葉植物に弱い素顔、そして「僕も、たぶん緊張します」という正直さ。福岡店の新人セラピスト・りくの話。',
      thumbnail_url: '/images/casts/riku/seaside.jpg',
      category: 'interview',
      status: 'draft',
      seo_title:
        '手だけは、誰にも負けない — 鍼灸の国家資格を持つ福岡の新人セラピスト・りく(23)',
      seo_description:
        '福岡・ストロベリーボーイズの新人セラピスト「りく」のインタビュー。鍼灸の学校で覚えた手の感覚、3日に1回の爪ケア、猫と観葉植物に癒される素顔、天神の定食屋まで。初めての方へのメッセージも掲載しています。',
      author_name: 'イトウ',
    },
    create: {
      slug: SLUG,
      title:
        'イトウが行く！キャスト丸裸インタビュー vol.5｜手だけは、誰にも負けない — 鍼灸の国家資格を持つ福岡の新人セラピスト・りく(23)',
      content: 'dialogue_data 参照',
      excerpt:
        '「検索したら、一番上に出てきたんです」。広島出身、鍼灸の国家資格を持つ23歳が、直感でこの世界に飛び込んだ。3日に1回ケアする自慢の手、猫と観葉植物に弱い素顔、そして「僕も、たぶん緊張します」という正直さ。福岡店の新人セラピスト・りくの話。',
      thumbnail_url: '/images/casts/riku/seaside.jpg',
      category: 'interview',
      status: 'draft',
      seo_title:
        '手だけは、誰にも負けない — 鍼灸の国家資格を持つ福岡の新人セラピスト・りく(23)',
      seo_description:
        '福岡・ストロベリーボーイズの新人セラピスト「りく」のインタビュー。鍼灸の学校で覚えた手の感覚、3日に1回の爪ケア、猫と観葉植物に癒される素顔、天神の定食屋まで。初めての方へのメッセージも掲載しています。',
      author_name: 'イトウ',
    },
  });

  const meta = await prisma.interviewMeta.upsert({
    where: { article_id: article.id },
    update: {
      article_type: 'solo_interview',
      series_slug: 'cast-interview',
      area: 'fukuoka',
      vol_number: 5,
      seo_keywords:
        'りく, ストロベリーボーイズ, 女性用風俗 福岡, 女風 福岡, セラピスト 福岡, 博多, 天神',
      writer_note,
      ogp_image_url: '/images/casts/riku/seaside.jpg',
    },
    create: {
      article_id: article.id,
      article_type: 'solo_interview',
      series_slug: 'cast-interview',
      area: 'fukuoka',
      vol_number: 5,
      seo_keywords:
        'りく, ストロベリーボーイズ, 女性用風俗 福岡, 女風 福岡, セラピスト 福岡, 博多, 天神',
      writer_note,
      ogp_image_url: '/images/casts/riku/seaside.jpg',
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta
       SET dialogue_data = $1::jsonb,
           profile_data  = $2::jsonb,
           faq_data      = $3::jsonb,
           photos        = $4::jsonb,
           cta_data      = $5::jsonb,
           structured_data = $6::jsonb
     WHERE id = $7::uuid`,
    JSON.stringify(dialogue_data),
    JSON.stringify(profile_data),
    JSON.stringify(faq_data),
    JSON.stringify(photos),
    JSON.stringify(cta_data),
    JSON.stringify(structured_data),
    meta.id
  );

  await prisma.interviewCastLink.deleteMany({ where: { interview_meta_id: meta.id } });
  await prisma.interviewCastLink.createMany({
    data: [
      {
        interview_meta_id: meta.id,
        cast_id: cast.id,
        cast_name: 'りく',
        cast_name_romaji: 'riku',
        role: 'interviewee',
        display_order: 0,
      },
      {
        interview_meta_id: meta.id,
        cast_name: 'イトウ',
        cast_name_romaji: 'ito',
        role: 'interviewer',
        display_order: 1,
      },
    ],
  });

  console.log('OK: riku-interview-vol5 を投入しました(status=draft)');
  console.log(`確認URL: /store/fukuoka/interview/${cast.id}/${SLUG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
