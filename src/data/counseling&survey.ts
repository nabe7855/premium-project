export const FORM_VERSION = '1.0.0';

export const COUNSELING_SECTIONS = [
  {
    id: 'intro_profile',
    title: 'はじめに',
    questions: [
      {
        id: 'nickname',
        label: 'ニックネーム (任意)',
        description: 'セラピストがあなたをお呼びする際のお名前に使用します。',
        type: 'text',
        optional: true,
      },
    ],
  },
  {
    id: 'atmosphere',
    title: '施術の雰囲気',
    questions: [
      {
        id: 'treatmentExpectation',
        label: '施術に求めること (複数選択可)',
        type: 'checkbox',
        options: [
          '快楽重視',
          '癒し重視',
          '会話多め',
          '会話少なめ',
          '初めてなのでソフト',
          'おまかせ',
        ],
        hasOther: true,
      },
      {
        id: 'treatmentVibe',
        label: 'セラピストとの接し方',
        type: 'radio',
        options: ['友達フランク', 'お店形式', '恋人イチャイチャ'],
        hasOther: true,
      },
      {
        id: 'trigger',
        label: '受けるきっかけ',
        type: 'radio',
        options: ['非日常を楽しみたい', 'パートナーに不満がある', '自分の感度を開発してほしい'],
        hasOther: true,
      },
    ],
  },
  {
    id: 'body',
    title: 'マッサージ・体調',
    questions: [
      {
        id: 'massageType',
        label: '希望マッサージ',
        type: 'radio',
        options: ['オイル', 'パウダー', 'どちらでもない'],
      },
      {
        id: 'troubleAreas',
        label: '疲れや気になる箇所 (複数選択可)',
        type: 'checkbox',
        options: ['頭痛', '目', '肩', '首', '腕', '背中', '腰', '足（足裏〜太もも）'],
      },
      {
        id: 'skinType',
        label: 'お肌の状態',
        type: 'radio',
        options: ['弱い（アトピー等）', '普通', '強い'],
        hasOther: true,
      },
    ],
  },
  {
    id: 'experience',
    title: '経験・感じ方',
    questions: [
      {
        id: 'experienceLevel',
        label: '経験',
        type: 'radio',
        options: ['なし', '1〜2回', '5回以上', '定期的に受けている'],
        hasOther: true,
      },
      {
        id: 'sensitivity',
        label: 'ご自身の感じやすさ',
        type: 'radio',
        options: ['感じやすい', '普通', '感じにくい'],
        hasOther: true,
      },
      {
        id: 'wetness',
        label: '濡れやすさ',
        type: 'radio',
        options: ['濡れやすい', '普通', '濡れにくい'],
        hasOther: true,
      },
      {
        id: 'erogenousZones',
        label: '性感帯 (任意)',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'boundaries',
    title: '境界線・可否',
    questions: [
      {
        id: 'ngItems',
        label: 'NG項目 (複数選択可)',
        description: '理由を問わず、してほしくないことをお選びください。',
        type: 'checkbox',
        options: [
          'ハグ',
          'キス',
          '情熱的キス',
          '乳首舐め',
          'クンニ',
          '指入れ',
          'Gスポット',
          'ボルチオ',
        ],
      },
      {
        id: 'tongueUsage',
        label: '唇や舌の接触',
        type: 'radio',
        options: ['使ってほしくない', '顔以外ならOK', 'どこでもOK'],
        hasOther: true,
      },
      {
        id: 'closeness',
        label: '密着度',
        type: 'radio',
        options: ['恋人のようにイチャイチャ', '抵抗がある'],
        hasOther: true,
      },
      {
        id: 'toys',
        label: 'おもちゃの使用',
        type: 'radio',
        options: ['使ってほしい', 'ほしくない', '様子見'],
      },
      {
        id: 'shower',
        label: 'シャワー',
        type: 'radio',
        options: ['1人で', '一緒に'],
      },
      {
        id: 'allowableActions',
        label: 'セラピストにしたい行為 (許容範囲)',
        type: 'checkbox',
        options: ['ボディタッチ', 'ハグ', '乳首舐め', 'フェラ', '手コキ'],
      },
    ],
  },
];

export const SURVEY_SECTIONS = [
  {
    id: 'attributes',
    title: '属性アンケート',
    questions: [
      {
        id: 'ageGroup',
        label: '年代',
        type: 'radio',
        options: ['20代前半', '20代後半', '30代前半', '30代後半', '40代以上', '答えたくない'],
      },
      {
        id: 'partnerStatus',
        label: '現在の状況',
        type: 'radio',
        options: ['独身', 'パートナーはいるが未婚', '既婚', '離婚・別居', '答えたくない'],
      },
    ],
  },
  {
    id: 'inflow',
    title: '流入経路',
    questions: [
      {
        id: 'inflowChannel',
        label: 'どこで知りましたか？',
        type: 'checkbox',
        options: [
          'ポータル',
          '紹介',
          'ブログ',
          '公式Twitter',
          'セラピストTwitter',
          '公式YouTube',
          '公式Instagram',
          'ネット検索',
        ],
        hasOther: true,
      },
      {
        id: 'searchKeyword',
        label: 'ネット検索の場合のワード (任意)',
        type: 'text',
      },
    ],
  },
  {
    id: 'needs',
    title: '性に関する認識・ニーズ',
    questions: [
      {
        id: 'resistanceToTalking',
        label: '性について話すことへの抵抗感',
        type: 'scale',
        minLabel: '抵抗がある',
        maxLabel: '全くない',
      },
      {
        id: 'sexualSatisfaction',
        label: '現在の性的満足度',
        type: 'scale',
        minLabel: '不満',
        maxLabel: '満足',
      },
      {
        id: 'interestReason',
        label: 'サービスに興味を持った理由 (複数)',
        type: 'checkbox',
        options: ['癒し', '好奇心', '自己理解', '非日常', '安心感', '答えたくない'],
        hasOther: true,
      },
      {
        id: 'priorityToday',
        label: '今日の体験で重視したいこと (複数)',
        type: 'checkbox',
        options: ['安心', '優しさ', '距離感', '会話', '刺激', '答えたくない'],
        hasOther: true,
      },
    ],
  },
];
