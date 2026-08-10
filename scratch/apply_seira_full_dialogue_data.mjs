import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function applySeiraDialogueData() {
  console.log('=== APPLYING FULL DIALOGUE DATA TO SEIRA INTERVIEW META ===\n');

  const article = await prisma.mediaArticle.findUnique({
    where: { slug: 'seira-interview-vol4' }
  });

  if (!article) {
    console.error('Article seira-interview-vol4 not found!');
    return;
  }

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

  const existingMeta = await prisma.interviewMeta.findFirst({
    where: { article_id: article.id }
  });

  if (existingMeta) {
    await prisma.interviewMeta.update({
      where: { id: existingMeta.id },
      data: {
        dialogue_data: dialogueData,
        profile_data: profileData,
        faq_data: faqData,
        photos: photosData,
        cta_data: ctaData,
        writer_note: { note: '35歳で挑戦したセイラさんの誠実で優しい人柄が、一人でも多くのお客様に伝われば幸いです。（イトウ）' }
      }
    });
    console.log('✅ Updated existing interview_meta with dialogue_data!');
  } else {
    const newMeta = await prisma.interviewMeta.create({
      data: {
        article_id: article.id,
        article_type: 'solo_interview',
        series_slug: 'seira-interview',
        vol_number: 4,
        area: 'fukuoka',
        dialogue_data: dialogueData,
        profile_data: profileData,
        faq_data: faqData,
        photos: photosData,
        cta_data: ctaData,
        writer_note: { note: '35歳で挑戦したセイラさんの誠実で優しい人柄が、一人でも多くのお客様に伝われば幸いです。（イトウ）' }
      }
    });
    console.log('✅ Created interview_meta with dialogue_data:', newMeta.id);
  }
}

applySeiraDialogueData().catch(console.error);
