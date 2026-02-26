// 初めての方へページのヒーローセクション設定
export interface FirstTimeHeroConfig {
  badge: string;
  mainHeading: string;
  subHeading: string;
  subHeadingAccent: string;
  priceBadgeTitle: string;
  priceBadgeCourse: string;
  priceBadgeOldPrice: string;
  priceBadgeNewPrice: string;
  priceBadgeDescription: string;
  isVisible: boolean;
}

// 歓迎メッセージセクション設定
export interface WelcomeConfig {
  heading: string;
  subHeading: string;
  imageUrl?: string;
  content: string[];
  isVisible: boolean;
}

export interface ForbiddenItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ForbiddenConfig {
  heading: string;
  subHeading: string;
  imageUrl?: string;
  items: ForbiddenItem[];
  isVisible: boolean;
}

export interface CastSectionConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface ThreePointsConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface SevenReasonItem {
  title: string;
  desc: string;
}

export interface SevenReasonsConfig {
  imageUrl?: string;
  reasons: SevenReasonItem[];
  isVisible: boolean;
}

export interface DayFlowStep {
  title: string;
  desc: string;
}

export interface DayFlowConfig {
  imageUrl?: string;
  steps: DayFlowStep[];
  footerNote: string;
  isVisible: boolean;
}

export interface ReservationStep {
  title: string;
  desc: string;
  details?: string[];
}
export interface ReservationFlowConfig {
  imageUrl?: string;
  steps: ReservationStep[];
  isVisible: boolean;
}

export interface FAQConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface PricingCourse {
  title: string;
  courseName: string;
  oldPrice: string;
  newPrice: string;
  description: string;
  isMain?: boolean;
}

export interface PricingConfig {
  imageUrl?: string;
  subHeading: string;
  courses: PricingCourse[];
  isVisible: boolean;
}

export interface CTAConfig {
  imageUrl?: string;
  isVisible: boolean;
}

// 初めての方へページ全体の構成
export interface FirstTimeConfig {
  banner: {
    imageUrl: string;
    isVisible: boolean;
  };
  hero: FirstTimeHeroConfig;
  welcome: WelcomeConfig;
  forbidden: ForbiddenConfig;
  casts: CastSectionConfig;
  threePoints: ThreePointsConfig;
  sevenReasons: SevenReasonsConfig;
  dayFlow: DayFlowConfig;
  reservationFlow: ReservationFlowConfig;
  faq: FAQConfig;
  pricing: PricingConfig;
  cta: CTAConfig;
  // 他のセクションも必要に応じて追加
}

// デフォルト設定
export const DEFAULT_FIRST_TIME_CONFIG: FirstTimeConfig = {
  banner: {
    imageUrl: '/初めてのお客様へバナー.png',
    isVisible: true,
  },
  hero: {
    badge: 'FOR FIRST TIME VISITORS',
    mainHeading: '頑張るあなたの心に、',
    subHeading: '一粒のご褒美を。',
    subHeadingAccent: '一粒のご褒美を。',
    priceBadgeTitle: '＼ 初回限定特典 ／',
    priceBadgeCourse: '120分コース',
    priceBadgeOldPrice: '¥20,000',
    priceBadgeNewPrice: '¥16,000',
    priceBadgeDescription:
      '一番人気の満足プラン。\n技術もマインドも超一流な\nセラピストにお任せください。',
    isVisible: true,
  },
  welcome: {
    heading: 'ストロベリーボーイズへ、ようこそ。',
    subHeading: 'ABOUT STRAWBERRY BOYS',
    imageUrl: '',
    content: [
      '日々、忙しく働く女性の皆様。',
      'たまには自分を甘やかして、心も身体もとろけるような最高の癒やしを体験してみませんか？',
      'ストロベリーボーイズは、そんな貴女のために誕生した、福岡随一のプレミアム・メンズエステです。',
    ],
    isVisible: true,
  },
  forbidden: {
    heading: '安心・安全のために',
    subHeading: 'FORBIDDEN ITEMS',
    imageUrl: '',
    items: [
      {
        id: '1',
        title: '性的サービスの要求',
        description:
          '当店は健全なリラクゼーション・マッサージを提供する店舗です。それ以外の目的でのご利用は固くお断りしております。',
        icon: 'Ban',
      },
      {
        id: '2',
        title: 'セラピストへの嫌がらせ',
        description:
          '言葉や行動によるセクシャルハラスメント、暴力、暴言などは絶対におやめください。',
        icon: 'AlertCircle',
      },
      {
        id: '3',
        title: '店外での接触要求',
        description:
          'セラピストとの店外での接触、個人的な連絡先の交換、SNS等での執拗なコンタクトは禁止しております。',
        icon: 'UserMinus',
      },
      {
        id: '4',
        title: '過度の飲酒状態でのご利用',
        description: '安全のため、泥酔状態でのご利用はお断りさせていただく場合がございます。',
        icon: 'Beer',
      },
      {
        id: '5',
        title: '違法行為・公序良俗に反する行為',
        description:
          'その他、法律に抵触する恐れのある行為や、運営が不適切と判断した場合は即刻中断させていただきます。',
        icon: 'ShieldAlert',
      },
    ],
    isVisible: true,
  },
  casts: {
    imageUrl: '',
    isVisible: true,
  },
  threePoints: {
    imageUrl: '',
    isVisible: true,
  },
  sevenReasons: {
    imageUrl: '',
    reasons: [
      {
        title: '業界初！200件以上の受付口コミ！',
        desc: '透明性を重視し、お店の雰囲気を感じてもらうためHP内に受付口コミ欄をご用意。皆様の声が200件以上投稿されており、利用の参考にしていただけます。',
      },
      {
        title: '業界一の受付対応を目指しています！',
        desc: '予約だけでなく、悩み事やご相談など、ご予約に関係のないお問い合わせでも構いません。ハートフルで丁寧な対応をスタッフ一同一人一人に提供します。',
      },
      {
        title: '大手プロ出身セラピスト多数在籍！',
        desc: '各ジャンルの元プロダクション出身者や、社会経験が豊富な男性を厳選採用。教育においてもお客様の満足度を第一に考え、業界最高レベルの人選を徹底しています。',
      },
      {
        title: '業界熟練の講師による確かな人材育成！',
        desc: '風俗業界で10年以上の経験豊富な専属講師がマンツーマンで指導。一般的な素人男性のレベルを超えた、プロならではの高品質なサービスをお約束します。',
      },
      {
        title: '安心と安定、直営店での全国展開！',
        desc: 'フランチャイズとは違い、全国展開している店舗は全て営業歴6年以上の東京本店にて直接運営に携わったスタッフが管理。どの地域でも安定のおもてなしを提供します。',
      },
      {
        title: '定期的な性病検査の義務付け！',
        desc: '「さくら検査研究所」様とのパートナーシップ契約を結んでおり、全てのセラピストに定期的な性病検査を徹底しています。心ゆくまで安心してお楽しみください！',
      },
      {
        title: '7年以上の運営実績は信頼の証！',
        desc: '急速に成長する業界で、1年未満で姿を消す店舗も珍しくありません。当店は皆様の支持を受け、7年以上にわたり大勢の皆様の女風デビューをサポートし続けています。',
      },
    ],
    isVisible: true,
  },
  dayFlow: {
    imageUrl: '',
    steps: [
      {
        title: 'セラピストと合流',
        desc: '駅改札前やUNIQLO前など、事前に伝えた貴女の服装を元にセラピストからお声がけします。スムーズに合流できない場合はお店が仲介するのでご安心を！',
      },
      {
        title: 'ホテルへ移動',
        desc: 'セラピストがいくつかピックアップしてご提案。デート気分でエスコートされます。入室後、ご利用料金を現金でセラピストにお渡しください。',
      },
      {
        title: 'カウンセリング',
        desc: '10〜15分程度。カウンセリングシートを使い、要望や重点的にしてほしい項目、NG項目を確認します。「寄り添う事」がテーマの特別な時間です。',
      },
      {
        title: 'シャワー',
        desc: 'リラックスしていただくためにお客様から先にシャワー。洗体オプション（+2,000円）で一緒に入浴して、お身体を丁寧に洗うプランも人気です♡',
      },
      {
        title: 'カウント開始',
        desc: 'お客様がシャワーを出たタイミングでコース時間スタート！ここまでの時間は完全無料です。心地よい非日常のひとときを存分にお楽しみください。',
      },
    ],
    footerNote: '※シャワー後のカウント開始までのお時間は全て【無料】です',
    isVisible: true,
  },
  reservationFlow: {
    imageUrl: '',
    steps: [
      {
        title: 'セラピストを決める',
        desc: 'まずはセラピスト一覧から.写メ日記や口コミを参考に.ご指名がある場合はその方を,決まっていない場合はお店にご相談ください.貴女に合った方をスタッフが選定します.',
      },
      {
        title: 'お店に問い合わせ・申し込み',
        desc: '電話・メール・LINE・X(旧Twitter)のDMから.お急ぎの場合は電話かLINEがスムーズです.',
        details: [
          '【日時】第三希望まであるとスムーズです',
          '【待ち合わせ場所】新宿、渋谷、池袋、鶯谷などが推奨ですが、ご自宅も可能です',
          '【コース内容】初回の方は120分16,000円コースが推奨です',
          '【指名の有無】ご希望がある場合はお伝えください',
        ],
      },
      {
        title: '担当セラピストの決定',
        desc: 'ご指名がある場合はお店が確認後、ご報告。指名がない場合はお客様の要望（年齢、性格など）に合ったセラピストを厳選してご報告いたします。',
      },
      {
        title: 'ご予約完了',
        desc: '最終確認を行い受付完了。変更点があればお気軽にお申し付けください。当店ではセラピストとの事前のメッセージ交換を推奨しており、当日を安心して迎えられます。',
      },
    ],
    isVisible: true,
  },
  faq: {
    imageUrl: '',
    isVisible: true,
  },
  pricing: {
    imageUrl: '',
    subHeading: '当店一番人気の初回120分コースを推奨しております♪',
    courses: [
      {
        title: '初回120分',
        courseName: '金額',
        oldPrice: '20,000円',
        newPrice: '16,000円',
        description:
          '初めてご利用のお客様から、多くのご指示を頂いている当店一番人気コースです♡\n2時間をかけてメインの施術行程を存分にご堪能いただけます。指圧、パウダー、オイル、性感マッサージの全てを網羅したトータルリラクゼーションに最適です！',
        isMain: true,
      },
      {
        title: '初回150分コース',
        courseName: '150分コース',
        oldPrice: '24,000円',
        newPrice: '22,000円',
        description: 'もう少しお時間に余裕を持ちたい時の150分コースです♡',
      },
      {
        title: '初回180分コース',
        courseName: '180分コース',
        oldPrice: '29,000円',
        newPrice: '27,000円',
        description: '総額7,000円お得な180分コース。究極の癒しに。',
      },
    ],
    isVisible: true,
  },
  cta: {
    imageUrl: '',
    isVisible: true,
  },
};

/**
 * 部分的な設定とデフォルト設定をセクション単位でマージする
 * データベースに古い形式のデータがある場合でも、新しいフィールドがデフォルト値で補完されるようにする
 */
export const mergeConfig = (partialConfig: any): FirstTimeConfig => {
  const merged = { ...DEFAULT_FIRST_TIME_CONFIG };
  if (!partialConfig) return merged;

  Object.keys(DEFAULT_FIRST_TIME_CONFIG).forEach((key) => {
    const sectionKey = key as keyof FirstTimeConfig;
    if (partialConfig[sectionKey]) {
      merged[sectionKey] = {
        ...(DEFAULT_FIRST_TIME_CONFIG[sectionKey] as any),
        ...partialConfig[sectionKey],
      };
    }
  });

  return merged;
};
