import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function publishSeiraAll() {
  console.log('=== INSERTING SEIRA ARTICLES (DRAFT STATUS) ===\n');

  // 1. Find Seira cast ID (-130642 or 青空（せいら）)
  const cast = await prisma.cast.findFirst({
    where: {
      OR: [
        { slug: '-130642' },
        { name: { contains: '青空' } },
        { name: { contains: 'せいら' } }
      ]
    }
  });

  const castId = cast?.id;
  const castSlug = cast?.slug || '-130642';
  console.log(`Found Cast: Name="${cast?.name}", ID="${castId}", Slug="${castSlug}"`);

  // ---------------------------------------------------------------------------
  // 1. CUSTOMER INTERVIEW ARTICLE: seira-interview-vol4 (status: 'draft')
  // ---------------------------------------------------------------------------
  const customerSlug = 'seira-interview-vol4';
  const customerTitle = 'イトウが行く！キャスト丸裸インタビュー vol.4｜35歳、最後のチャンス — 福岡の新人セラピスト・セイラが「尽くしたい」と言う理由';
  const customerSeoTitle = '35歳、最後のチャンス — 福岡の新人セラピスト・セイラが「尽くしたい」と言う理由';
  const customerDescription = '福岡・ストロベリーボーイズの新人セラピスト「セイラ」のインタビュー。35歳で一歩を踏み出した理由、7〜8年続けた全身脱毛、部活で身につけた気配り、博多のラーメン愛まで。初めての方へのメッセージも掲載しています。';

  const customerArticle = await prisma.article.upsert({
    where: { slug: customerSlug },
    update: {
      title: customerTitle,
      category: 'interview',
      status: 'draft',
      author_name: 'イトウ',
      seo_title: customerSeoTitle,
      seo_description: customerDescription,
      thumbnail_url: '/images/casts/seira/portrait.webp',
      updated_at: new Date(),
    },
    create: {
      slug: customerSlug,
      title: customerTitle,
      category: 'interview',
      status: 'draft',
      author_name: 'イトウ',
      seo_title: customerSeoTitle,
      seo_description: customerDescription,
      thumbnail_url: '/images/casts/seira/portrait.webp',
      published_at: new Date(),
    }
  });

  console.log(`✅ Upserted Customer Article: ID="${customerArticle.id}", Status="draft"`);

  // Upsert InterviewMeta
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

  const photosData = {
    portrait: {
      url: '/images/casts/seira/portrait.webp',
      alt: '174cm細身のセイラ'
    },
    fullbody: {
      url: '/images/casts/seira/fullbody.webp',
      alt: '白Tシャツに黒パンツのシンプルな私服姿のセイラ'
    }
  };

  const profileData = {
    fields: [
      { key: '年齢', value: '35歳' },
      { key: '身長', value: '174cm' },
      { key: '体型', value: '細身' },
      { key: 'チャームポイント', value: '7〜8年続けた全身脱毛ツルスベ肌' },
      { key: '性格', value: '尽くし型・聞き上手' }
    ]
  };

  const dialogueData = {
    sections: [
      {
        heading: '35歳で一歩を踏み出した理由',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: 'セイラさん、本日はよろしくお願いします！まずは女性用風俗のセラピストに応募したきっかけを教えてください。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'よろしくお願いします！数年前からずっと興味はあったんですが、35歳になって「もう最後のチャンスかもしれない」と思って思い切って応募しました。' },
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '最後のチャンス、ですか。すごく勇気がいる一歩だったんじゃないですか？' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: 'そうですね。でも、やらずに後悔するより挑戦してみたい気持ちが強かったんです。' },
          { type: 'photo', photo_key: 'portrait' }
        ]
      },
      {
        heading: '徹底した自分磨きと気配り',
        items: [
          { type: 'dialogue', speaker: 'interviewer', speaker_name: 'イトウ', text: '普段から意識されている自分磨きについて教えてください。' },
          { type: 'dialogue', speaker: 'cast', speaker_name: 'セイラ', text: '7〜8年前から全身脱毛に通っていて、お肌の手入れや清潔感にはかなり気を配っています。また、相手の話をじっくり聞くことが好きなので、お客様にリラックスしていただける空間づくりを大切にしています。' },
          { type: 'photo', photo_key: 'fullbody' }
        ]
      }
    ]
  };

  const faqData = {
    items: [
      {
        question: '初めて利用する場合でも大丈夫ですか？',
        answer: 'はい、完全未経験や初めてのご利用の方でも安心して楽しんでいただけるよう、事前の丁寧なご案内と優しい接客を徹底しております。'
      },
      {
        question: 'どんなデートや過ごし方ができますか？',
        answer: 'お部屋でのまったりオイルマッサージから、カフェ・ドライブなどのデートまで、お客様のご要望に合わせて柔軟に対応いたします。'
      }
    ]
  };

  await prisma.interviewMeta.upsert({
    where: { article_id: customerArticle.id },
    update: {
      article_type: 'single',
      series_slug: 'cast-interview',
      vol_number: 4,
      area: '福岡',
      dialogue_data: dialogueData,
      profile_data: profileData,
      faq_data: faqData,
      photos: photosData,
      cta_data: ctaData,
      writer_note: '35歳で挑戦したセイラさんの誠実で優しい人柄が、一人でも多くのお客様に伝われば幸いです。（イトウ）'
    },
    create: {
      article_id: customerArticle.id,
      article_type: 'single',
      series_slug: 'cast-interview',
      vol_number: 4,
      area: '福岡',
      dialogue_data: dialogueData,
      profile_data: profileData,
      faq_data: faqData,
      photos: photosData,
      cta_data: ctaData,
      writer_note: '35歳で挑戦したセイラさんの誠実で優しい人柄が、一人でも多くのお客様に伝われば幸いです。（イトウ）'
    }
  });

  if (castId) {
    await prisma.interviewCastLink.upsert({
      where: { article_id_cast_id: { article_id: customerArticle.id, cast_id: castId } },
      update: { cast_name_romaji: 'seira' },
      create: { article_id: customerArticle.id, cast_id: castId, cast_name_romaji: 'seira' }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. RECRUIT COLUMN ARTICLE (IKEO): seira-35-recruit-story (status: 'draft')
  // ---------------------------------------------------------------------------
  const recruitSlug = 'seira-35-recruit-story';
  const recruitTitle = '35歳・未経験で女性用風俗のセラピスト求人に応募したら？セイラさん、デビューまでの全記録';
  const recruitSeoTitle = '35歳・未経験で女性用風俗のセラピスト求人に応募したら？セイラさん、デビューまでの全記録｜イケオラボ';
  const recruitDescription = '「もう35ですし、最後のチャンスかなと思って」。数年迷い続けたセイラさん（35）が、女性用風俗のセラピスト求人に応募してからデビューを迎えるまで。お店選びの基準、面接の空気、必要な検査と書類、講習のこと——本人の言葉と一緒に、そのまま記録しました。応募を迷っているあなたへ。';

  const customerArticleUrl = `https://www.sutoroberrys.jp/store/fukuoka/interview/${castSlug}/${customerSlug}`;

  const recruitContent = `
<p>「もう35ですし、最後のチャンスかなと思って」。数年迷い続けたセイラさん（35）が、女性用風俗のセラピスト求人に応募してからデビューを迎えるまで。お店選びの基準、面接の空気、必要な検査と書類、講習のこと——本人の言葉と一緒に、そのまま記録しました。</p>

<h2>女性用風俗のセラピストとは、どんな仕事なのか</h2>
<p>女性用風俗のセラピストは、女性のお客様と1対1で向き合い、会話やデート、施術を通じて「安心して過ごせる時間」をつくる仕事です。ストロベリーボーイズは福岡と横浜で店舗を運営していて、セラピストの多くは昼の仕事と両立しながら活動しています。</p>
<p>主役は、2026年夏に福岡店へ応募し、まもなくデビューを迎えるセイラさん（35）。「未経験35歳」のリアルなプロセスをお届けします。</p>

<h2>35歳・未経験で応募を決意した理由</h2>
<p>数年前から求人サイトを見ては閉じ、迷い続けていたセイラさん。「35歳という年齢で本当に採用されるのか？」「未経験の自分に勤まるのか？」という不安を抱えながらも、最後の一歩を踏み出しました。</p>

<h2>面接・講習からデビューまでの流れ</h2>
<p>面接ではこれまでの経歴や希望の働き方を丁寧にヒアリングされ、無理な強要は一切ありませんでした。講習でも女性講師による技術・マナー指導をマンツーマンで受け、自信を持ってお客様の前に立てる状態までサポートされます。</p>
<p>お客様目線でのセイラさんの魅力や実際のインタビュー内容は、ぜひ<a href="${customerArticleUrl}">セイラさんの顧客向けインタビュー記事</a>も合わせてご覧ください。</p>

<h3>Q. 35歳未経験でも本当に応募できますか？</h3>
<p>A. はい、年齢に関わらず誠意と清潔感を持ってお客様に向き合える方であれば、30代・40代・50代からでも十分にご活躍いただけます。</p>

<h3>Q. 講習費や登録料などの費用はかかりますか？</h3>
<p>A. 一切かかりません。研修費・システム登録料などの自己負担は0円ですのでご安心ください。</p>
`;

  const recruitArticle = await prisma.article.upsert({
    where: { slug: recruitSlug },
    update: {
      title: recruitTitle,
      content: recruitContent,
      excerpt: recruitDescription,
      category: 'ikeo',
      target_audience: 'recruit',
      status: 'draft',
      author_name: 'イケオラボ 編集部',
      seo_title: recruitSeoTitle,
      seo_description: recruitDescription,
      thumbnail_url: '/images/casts/seira/fullbody.webp',
      updated_at: new Date(),
    },
    create: {
      slug: recruitSlug,
      title: recruitTitle,
      content: recruitContent,
      excerpt: recruitDescription,
      category: 'ikeo',
      target_audience: 'recruit',
      status: 'draft',
      author_name: 'イケオラボ 編集部',
      seo_title: recruitSeoTitle,
      seo_description: recruitDescription,
      thumbnail_url: '/images/casts/seira/fullbody.webp',
      published_at: new Date(),
    }
  });

  console.log(`✅ Upserted Recruit Column Article (Ikeo): ID="${recruitArticle.id}", Slug="${recruitSlug}", Status="draft"`);

  // 3. Add link from fukuoka-recruit-guide to seira-35-recruit-story
  const fukuokaGuide = await prisma.article.findUnique({ where: { slug: 'fukuoka-recruit-guide' } });
  if (fukuokaGuide && fukuokaGuide.content && !fukuokaGuide.content.includes(recruitSlug)) {
    const additionLink = `\n\n<div class="my-6 rounded-xl border border-blue-200 bg-blue-50/50 p-4"><p class="text-xs font-bold text-blue-900">💡 35歳未経験からの挑戦事例</p><p class="mt-1 text-xs text-blue-700">数年迷った末に35歳で一歩を踏み出したセイラさんの実体験ルポは<a href="https://www.sutoroberrys.jp/ikeo/${recruitSlug}" class="font-bold text-blue-600 underline">【35歳未経験】セイラさんのデビュー全記録</a>をご覧ください。</p></div>`;
    await prisma.article.update({
      where: { id: fukuokaGuide.id },
      data: { content: fukuokaGuide.content + additionLink }
    });
    console.log('✅ Added link from fukuoka-recruit-guide to seira-35-recruit-story');
  }
}

publishSeiraAll().catch(console.error);
