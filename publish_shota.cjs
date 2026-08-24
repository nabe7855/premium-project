// publish_shota.cjs — ショウタ vol.6 投入(実行: node publish_shota.cjs)
// 2026-08-17 更新: 写真3枚の実素材を受領・最適化済み。URLを実パス(/images/casts/shota/*.webp)に確定。
// 公開前チェックA〜D(表記/年齢/美容鑑定の提供確定/本人確認)が未完了のため status='draft' のまま投入する。
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SLUG = 'shota-interview-vol6';

const photos = {
  portrait: { url: '/images/casts/shota/portrait.webp', alt: '展望台で遠くを見る183cmのショウタさんの全身', caption: '身長183cm。「甘えたくなる」と言われる高さです', layout: 'portrait', width: 752, height: 1200 },
  pokemon:  { url: '/images/casts/shota/pokemon.webp',  alt: 'ショウタさんのポケモンぬいぐるみコレクション。ピカチュウやイーブイなど12体', caption: '小学校からずっとポケモン。今はカードの大会にも出場', layout: 'landscape', width: 1080, height: 720 },
  beauty:   { url: '/images/casts/shota/beauty.webp',   alt: 'ショウタさんが愛用している無印良品の化粧水と乳液(敏感肌用しっとり)', caption: 'ケアは化粧水と乳液だけ。「やりすぎない」のがコツ', layout: 'landscape', width: 1080, height: 810 },
  // staff_photos は意図的に未設定: /images/staff/ito.jpg がリポジトリに存在しない(2026-08-17確認)。
  // 設定するとイトウの吹き出しアイコンが全てリンク切れになる。未設定ならDialogueBubbleがイニシャル表示に自動フォールバックする。
};

const dialogue_data = { sections: [
  { id: 'sec-1', heading: '第一印象は「眼力」。でも、それは30分しか持ちませんでした', items: [
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ショウタさん、今日はよろしくお願いします。画面越しでも思ったんですけど、目鼻立ちがはっきりされてますね。眼力が強いというか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'ありがとうございます。目鼻立ちのことはよく言われるんですけど、眼力はあまり言われないです(笑)。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ご出身は福岡ですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'ずっと福岡です。今は市内から30分くらいのところに住んでます。' },
    { type: 'editor_note', text: '第一印象はクールな人。ですがこの取材、30分後にはポケモンの話で満面の笑みを見ることになります。最後まで読んでください。' },
  ]},
  { id: 'sec-2', heading: '元ドラッグストア店員、5年分の化粧品知識', items: [
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '画面越しでも肌ツヤがいいのが分かります。何かされてるんですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'ケアはしてます。といっても、化粧水と乳液だけですけど。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '以前はドラッグストアで働かれていたそうですね。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '5年働いてました。商品の説明をする仕事だったので、薬と、基本的なスキンケアや化粧品の知識はあります。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'では聞かせてください。おすすめの化粧品、1位から3位まで。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '1位は無印良品です。量があってコスパがよくて、ちゃんと効く。2位はドラッグストアで買えるものなら結構何でもよくて、ハトムギ化粧水とかでも十分です。あと、肌が弱い方にはキュレルがおすすめです。肌質で3種類に分かれているので選びやすいんですよ。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '高い化粧品って、実際のところ値段に見合うんですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '人それぞれです。肌に合う・合わないが結局すべてで。ただ、高いものは「合わない」が起こりにくいんです。100とは言わないけど、99くらいの感覚です。' },
    { type: 'narration', text: '触れた肌の質感に合わせて、化粧品や入浴剤を選んで提案する——取材の中で、ショウタさんの「美容鑑定」の構想が生まれた瞬間でした。手に取りやすい市販のものを、あなたの肌に合わせて。元ドラッグストア店員にしかできない気配りです。' },
    { type: 'photo', photo_key: 'beauty' },
  ]},
  { id: 'sec-3', heading: '小学校からずっとポケモン。大会にも出ます', items: [
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '趣味の話を聞かせてください。ハマっているものはありますか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '小学校からポケモンがずっと好きです。ゲームも、グッズも。今は特にポケモンカードにハマっていて、休みの日は朝からカードをやりに行きます。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'コレクションですか？' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '戦う方です。大会にも出ます。成績がいい方ではないですけど(笑)。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '世界大会もあるんですよね。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'あるので、いつかそこは頑張りたいなと思ってます。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'UFOキャッチャーにハマっていた時期もあったとか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'ぬいぐるみを取りに、わざわざ行ってました(笑)。' },
    { type: 'editor_note', text: '眼力の強いクールな人が、ポケモンの話になると声のトーンが上がる。このギャップは、ぜひ会って確かめてほしいところです。' },
    { type: 'photo', photo_key: 'pokemon' },
  ]},
  { id: 'sec-4', heading: '183cm、元ピッチャー。スポッチャは任せてください', items: [
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '運動はされてたんですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '高校まで野球をやってました。ピッチャーです。大学ではバレーボールのサークルに入って、まったく触ったことがなかったのに、できるようになっちゃいました。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '運動神経いいんですね。身長は？' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '183あります。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'それは……甘えたくなっちゃいますね。デートで体を動かしたい人にはよさそう。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'スポッチャなら任せてください。運動に関しては全然できるので。カラオケも、体で盛り上がるタイプです。踊りながら歌います(笑)。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'よく歌うのは？' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'backnumberが好きです。曲の長いやつ。あとは有名どころをノリで押さえてる感じです。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '料理もされるんですよね。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '一人暮らしをしていたので自炊はしてました。作るのは好きです。' },
    { type: 'photo', photo_key: 'portrait' },
  ]},
  { id: 'sec-5', heading: '「よく喋ってくれる方が嬉しい」— 聞き上手の本心は甘えん坊', items: [
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'どんなお客様が来てくれたら、いい時間を提供できそうですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: 'よく喋る方だと嬉しいです。話題を振るのがそんなに得意じゃないと思っているので。聞くのは得意です。聞き上手とはよく言われます。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '年下の扱いには慣れてるんですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '妹がいるので、年下のお世話は慣れてます。今まで、年下から慕われることが多かったですね。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '得意な関わり方のスタイルはありますか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '本心は結構、甘えん坊なんです。なので甘えられたい方が来ると、いいかもしれないです。……でも183cmなので、甘えたくなっちゃう方が多いかもしれませんね(笑)。甘やかしつつ、甘えつつ、で。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '最後に、この仕事でどうなっていきたいですか。' },
    { type: 'dialogue', speaker: 'cast', speaker_name: 'ショウタ', text: '帰るときに「癒されたな」「心が軽くなったな」と思ってもらえるようになりたいです。漠然とですけど、それが一番です。' },
    { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'ショウタさん、今日はありがとうございました。' },
  ]},
]};

const profile_data = { fields: [
  { label: '活動エリア', value: '福岡(博多・天神エリア中心)' },
  { label: '年齢', value: '27歳' },
  { label: '身長', value: '183cm' },
  { label: '前職の知識', value: '薬・化粧品・スキンケア(ドラッグストア勤務5年)' },
  { label: '趣味', value: 'ポケモンカード(大会出場)、カラオケ(backnumber)、料理' },
  { label: 'スポーツ', value: '野球(投手)・バレーボール。スポッチャ得意' },
  { label: '性格', value: '聞き上手。クールに見えて、本心は甘えん坊' },
  { label: 'ひとこと', value: 'よく喋ってくれる方、大歓迎です。聞くのは得意です。' },
]};

const faq_data = { items: [
  { question: '女性用風俗を利用するのが初めてで、緊張しています。会話が続くか不安です。',
    answer: 'ショウタさんは自他ともに認める聞き上手です。「話題を振るより、聞くのが得意」と話しているので、あなたのペースで好きなことを話してください。実はご本人も「初対面は緊張するタイプ」とのこと。一緒に少しずつほぐれていく感覚で大丈夫です。' },
  { question: '福岡で、ショウタさんとはどんな時間を過ごせますか。',
    answer: '「その人がしたいことを一番に考える」のがショウタさんのスタイルです。福岡市内なら動物園や水族館、体を動かしたい日はスポッチャ、盛り上がりたい日はカラオケ(backnumberを踊りながら歌うそうです)。元野球部・183cmの運動神経で、アクティブなデートは特に得意です。' },
  { question: '「美容鑑定」とは何ですか。',
    answer: '元ドラッグストア店員として5年間、薬や化粧品の説明をしてきたショウタさんならではの提案です。あなたの肌質に合わせて、無印良品やキュレルなど、手に取りやすい市販の化粧品や入浴剤を選んでアドバイスします。高いものを勧めるのではなく「あなたの肌に合うもの」を一緒に探すのがモットーです。' },
]};

const writer_note = [
  '「何を言うかで知性が測れて、何を言わないかで品性が測れる」という言葉がありますが、ショウタさんと話していて感じたのはまさに品性でした。余計なことを言わない。でも聞けば、ちゃんと面白い。',
  '眼力の強いクールな見た目で、中身はポケモンカードの大会に出る人。183cmで、本心は甘えん坊。このギャップの多さは、通うほど発見があるタイプだと思います。',
  '取材の中で生まれた「美容鑑定」、私はかなり本気で楽しみにしています。肌を見てもらいに、福岡へ。',
];

const cta_data = { heading: '次はこちらもどうぞ', links: [
  { label: 'ショウタの出勤スケジュールを見る', href: 'https://www.sutoroberrys.jp/store/fukuoka/schedule', description: '最新の出勤日と空き状況はこちらから確認できます' },
  { label: '料金・コースを確認する', href: 'https://www.sutoroberrys.jp/store/fukuoka/price', description: 'コース料金と延長・交通費の考え方をまとめています' },
  { label: '初めての方へ', href: 'https://www.sutoroberrys.jp/store/fukuoka/first-time', description: '予約から当日の流れまで、初めての方向けにご案内します' },
]};

const structured_data = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: '肌を見て、選んであげたい — 福岡の新人セラピスト・ショウタ(183cm)の「美容鑑定」',
  description: '福岡・ストロベリーボーイズの新人セラピスト「ショウタ」のインタビュー。元ドラッグストア店員5年の化粧品知識、肌質に合わせて選ぶ「美容鑑定」、183cmの聞き上手、ポケモンカードの大会に出る意外な素顔まで。',
  image: ['https://www.sutoroberrys.jp/images/casts/shota/portrait.webp'],
  author: { '@type': 'Person', name: 'イトウ' },
  publisher: { '@type': 'Organization', name: 'ストロベリーボーイズ' },
  about: { '@type': 'Person', name: 'ショウタ' },
  contentLocation: { '@type': 'Place', name: '福岡' },
};

async function main() {
  const cast = await prisma.cast.findFirst({ where: { name: { contains: 'ショウタ' } }, select: { id: true, name: true, slug: true } });
  if (!cast) throw new Error('casts テーブルに「ショウタ」が見つかりません。表記(ショータ/翔太)の可能性も確認し、キャスト登録後に再実行してください。');
  console.log('cast resolved:', cast);

  const titleText = 'イトウが行く！キャスト丸裸インタビュー vol.6｜肌を見て、選んであげたい — 福岡の新人セラピスト・ショウタ(183cm)の「美容鑑定」';

  const article = await prisma.mediaArticle.upsert({
    where: { slug: SLUG },
    update: {
      title: titleText,
      status: 'draft',
    },
    create: {
      slug: SLUG,
      title: titleText,
      content: 'dialogue_data 参照',
      excerpt: '第一印象は、眼力の強いクールな人。ところが30分後、ポケモンの話で満面の笑みに変わります。元ドラッグストア店員5年の化粧品知識で、あなたの肌に合うものを選んでくれる「美容鑑定」。183cmの聞き上手で、本心は甘えん坊。福岡の新人セラピスト・ショウタさんの素顔を、たっぷり聞きました。',
      thumbnail_url: '/images/casts/shota/portrait.webp',
      category: 'interview', status: 'draft',
      seo_title: '肌を見て、選んであげたい — 福岡の新人セラピスト・ショウタ(183cm)の「美容鑑定」',
      seo_description: '福岡・ストロベリーボーイズの新人セラピスト「ショウタ」のインタビュー。元ドラッグストア店員5年の化粧品知識、肌質に合わせて選ぶ「美容鑑定」、183cmの聞き上手、そしてポケモンカードの大会に出る意外な素顔まで。',
      author_name: 'イトウ',
    },
  });

  const meta = await prisma.interviewMeta.upsert({
    where: { article_id: article.id },
    update: {
      vol_number: 6,
    },
    create: {
      article_id: article.id, article_type: 'solo_interview', series_slug: 'cast-interview',
      area: 'fukuoka', vol_number: 6,
      seo_keywords: 'ショウタ, ストロベリーボーイズ, 女性用風俗 福岡, 女風 福岡, セラピスト 福岡, 美容鑑定, 博多',
      writer_note, ogp_image_url: '/images/casts/shota/portrait.webp',
    },
  });

  await prisma.$executeRawUnsafe(
    `UPDATE interview_meta SET dialogue_data=$1::jsonb, profile_data=$2::jsonb, faq_data=$3::jsonb, photos=$4::jsonb, cta_data=$5::jsonb, structured_data=$6::jsonb WHERE id=$7::uuid`,
    JSON.stringify(dialogue_data), JSON.stringify(profile_data), JSON.stringify(faq_data),
    JSON.stringify(photos), JSON.stringify(cta_data), JSON.stringify(structured_data), meta.id
  );

  await prisma.interviewCastLink.deleteMany({ where: { interview_meta_id: meta.id } });
  await prisma.interviewCastLink.createMany({ data: [
    { interview_meta_id: meta.id, cast_id: cast.id, cast_name: 'ショウタ', cast_name_romaji: cast.slug, role: 'interviewee', display_order: 0 },
    { interview_meta_id: meta.id, cast_name: 'イトウ', cast_name_romaji: 'ito', role: 'interviewer', display_order: 1 },
  ]});

  console.log('OK: shota-interview-vol6 を投入しました(status=draft)');
  console.log(`確認URL: /store/fukuoka/interview/${cast.slug}/${SLUG}`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
