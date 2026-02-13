export interface FirstTimeHeroConfig {
  badge: string;
  mainHeading: string;
  subHeading: string;
  subHeadingAccent: string;
  isVisible: boolean;
}

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

export interface SevenReasonsConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface DayFlowConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface ReservationFlowConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface FAQConfig {
  imageUrl?: string;
  isVisible: boolean;
}

export interface PricingConfig {
  imageUrl?: string;
  isVisible: boolean;
}

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
  // 他のセクションも必要に応じて追加
}

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
    isVisible: true,
  },
  dayFlow: {
    imageUrl: '',
    isVisible: true,
  },
  reservationFlow: {
    imageUrl: '',
    isVisible: true,
  },
  faq: {
    imageUrl: '',
    isVisible: true,
  },
  pricing: {
    imageUrl: '',
    isVisible: true,
  },
};
