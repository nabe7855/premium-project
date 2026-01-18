// 店舗トップページの設定型定義

export interface HeroConfig {
  images: string[];
  badge: string;
  badgeText: string;
  mainHeading: string;
  subHeading: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  isVisible: boolean;
}

export interface ConceptItem {
  title: string;
  desc: string;
  imageUrl: string;
}

export interface ConceptConfig {
  heading: string;
  subHeading: string;
  badge: string;
  items: ConceptItem[];
  footerText: string;
  isVisible: boolean;
}

export interface CampaignItem {
  id: number;
  title: string;
  desc: string;
  badge: string;
  color: 'primary' | 'secondary';
  icon: string;
  imageUrl: string;
}

export interface CampaignConfig {
  heading: string;
  subHeading: string;
  items: CampaignItem[];
  isVisible: boolean;
}

export interface CastItem {
  id: number;
  name: string;
  age: number;
  height: number;
  comment: string;
  status: string;
  tags: string[];
  imageUrl: string;
}

export interface CastConfig {
  heading: string;
  subHeading: string;
  items: CastItem[];
  isVisible: boolean;
}

export interface PriceItem {
  title: string;
  duration: number;
  price: number;
  description: string;
  isPopular?: boolean;
}

export interface PriceConfig {
  heading: string;
  subHeading: string;
  items: PriceItem[];
  notes: string[];
  isVisible: boolean;
}

export interface FlowStep {
  num: number;
  icon: string;
  title: string;
  desc: string;
}

export interface FlowConfig {
  heading: string;
  subHeading: string;
  steps: FlowStep[];
  isVisible: boolean;
}

export interface DiaryItem {
  id: string;
  castName: string;
  title: string;
  image: string;
  date: string;
}

export interface DiaryConfig {
  heading: string;
  subHeading: string;
  items: DiaryItem[];
  isVisible: boolean;
}

export interface NewcomerItem {
  id: string;
  name: string;
  age: string;
  height: string;
  imageUrl: string;
}

export interface NewcomerConfig {
  heading: string;
  subHeading: string;
  courseText: string;
  items: NewcomerItem[];
  isVisible: boolean;
}

export interface FooterConfig {
  logoImageUrl: string;
  menuButtons: { label: string; link: string }[];
  banners: { imageUrl: string; link: string }[];
  smallBanners: { imageUrl: string; link: string }[];
  shopInfo: {
    name: string;
    address: string;
    phone: string;
    businessHours: string;
  };
  trustBadges: string[];
  copyright: string;
  isVisible: boolean;
}

export interface StoreTopPageConfig {
  hero: HeroConfig;
  concept: ConceptConfig;
  campaign: CampaignConfig;
  cast: CastConfig;
  price: PriceConfig;
  flow: FlowConfig;
  diary: DiaryConfig;
  newcomer: NewcomerConfig;
  footer: FooterConfig;
}

// デフォルト設定
export const DEFAULT_STORE_TOP_CONFIG: StoreTopPageConfig = {
  hero: {
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920',
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920',
    ],
    badge: 'Premium Relaxation Fukuoka',
    badgeText: 'PREMIUM RELAXATION FUKUOKA',
    mainHeading: '日常を忘れる、',
    subHeading: '至福のひととき。',
    description:
      '福岡で愛される女性専用リラクゼーション。\n厳選されたセラピストが、心を込めてお迎えします。',
    primaryButtonText: 'セラピストを探す',
    primaryButtonLink: '#cast',
    secondaryButtonText: '初めての方へ',
    secondaryButtonLink: '#flow',
    isVisible: true,
  },
  concept: {
    heading: '安心と癒やしを、',
    subHeading: 'すべての女性の日常に。',
    badge: 'Our Concept',
    items: [
      {
        title: '厳選セラピスト',
        desc: '容姿だけでなく、高いホスピタリティと社会人としてのマナーを兼ね備えた男性のみを採用。厳しい研修をクリアしたプロフェッショナルが伺います。',
        imageUrl:
          'https://images.unsplash.com/photo-1519735812324-ecb585a06a26?auto=format&fit=crop&q=80&w=1000',
      },
      {
        title: '女性目線の安心感',
        desc: '女性スタッフによる運営・管理を徹底。女性ならではの細やかな配慮と、万全のセキュリティ体制で、初めての方でも安心してご利用いただけます。',
        imageUrl:
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
      },
      {
        title: '完全プライベート',
        desc: 'ご自宅やホテルなど、ご指定の場所がプライベートサロンに。周りの目を気にせず、心ゆくまでリラックスできる時間をご提供します。',
        imageUrl:
          'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1000',
      },
      {
        title: '明朗会計',
        desc: '不透明な追加料金は一切ございません。WEBサイトに記載の料金プランに基づき、事前に正確な金額をご提示いたします。',
        imageUrl:
          'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=1000',
      },
    ],
    footerText:
      '「自分へのご褒美」を、もっと身近で、もっと心地よいものに。LUMIÈREは福岡の女性を応援します。',
    isVisible: true,
  },
  campaign: {
    heading: '最新情報・キャンペーン',
    subHeading: 'News & Campaigns',
    items: [
      {
        id: 1,
        title: '初回限定キャンペーン',
        desc: '全コース¥2,000 OFF！初めての方も安心してお試しいただけます。ご予約時にサイトを見たとお伝えください。',
        badge: 'Limited',
        color: 'primary',
        icon: 'Gift',
        imageUrl:
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800',
      },
      {
        id: 2,
        title: 'SNSフォロー特典',
        desc: '公式Instagramをフォロー＆DMで指名料が1回無料に。最新の出勤情報や限定動画も配信中です。',
        badge: 'Campaign',
        color: 'secondary',
        icon: 'Instagram',
        imageUrl:
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
      },
      {
        id: 3,
        title: '深夜割スタート',
        desc: '23時以降のご予約で、アロマオイルオプションをサービス中。一日の疲れを極上の香りで癒やしませんか。',
        badge: 'NEW',
        color: 'primary',
        icon: 'Zap',
        imageUrl:
          'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800',
      },
    ],
    isVisible: true,
  },
  cast: {
    heading: '本日出勤のセラピスト',
    subHeading: 'Therapists',
    items: [
      {
        id: 1,
        name: '蓮 (レン)',
        age: 26,
        height: 178,
        comment: '優しく包み込みます',
        status: '本日出勤',
        tags: ['聞き上手', '高身長'],
        imageUrl: 'https://picsum.photos/seed/cast1/300/400',
      },
      {
        id: 2,
        name: 'ハルト',
        age: 24,
        height: 175,
        comment: '笑顔で癒やします',
        status: '本日出勤',
        tags: ['爽やか', 'マッサージ◎'],
        imageUrl: 'https://picsum.photos/seed/cast2/300/400',
      },
      {
        id: 3,
        name: 'ユウキ',
        age: 28,
        height: 182,
        comment: '大人の癒しを',
        status: '',
        tags: ['落ち着き', '色気'],
        imageUrl: 'https://picsum.photos/seed/cast3/300/400',
      },
      {
        id: 4,
        name: 'ソラ',
        age: 22,
        height: 174,
        comment: '弟キャラです',
        status: '残りわずか',
        tags: ['癒し系', '甘え上手'],
        imageUrl: 'https://picsum.photos/seed/cast4/300/400',
      },
    ],
    isVisible: true,
  },
  price: {
    heading: '料金プラン',
    subHeading: 'Price Menu',
    items: [
      {
        title: 'Short',
        duration: 60,
        price: 12000,
        description: 'お試し・部分的な集中ケアに',
        isPopular: false,
      },
      {
        title: 'Standard',
        duration: 90,
        price: 17000,
        description: '全身をゆっくりほぐす定番コース',
        isPopular: true,
      },
      {
        title: 'Long',
        duration: 120,
        price: 23000,
        description: '心身ともに深く癒される贅沢な時間',
        isPopular: false,
      },
    ],
    notes: [
      '全てのプランに消費税が含まれております。延長は30分 ¥6,000にて承ります。',
      '指名料（¥1,000〜）および出張交通費が別途発生いたします。',
    ],
    isVisible: true,
  },
  flow: {
    heading: 'ご利用までのステップ',
    subHeading: 'Guide',
    steps: [
      {
        num: 1,
        icon: 'User',
        title: 'キャスト選択',
        desc: '当サイトのプロフィールを参考に、お気に入りのセラピストを選びます。',
      },
      {
        num: 2,
        icon: 'Calendar',
        title: 'ご予約確定',
        desc: 'WEBまたはLINEで簡単予約。場所と時間を伝えて、予約完了です。',
      },
      {
        num: 3,
        icon: 'MapPin',
        title: 'ご訪問',
        desc: 'セラピストが到着しましたら、簡単なカウンセリングを行います。',
      },
      {
        num: 4,
        icon: 'Heart',
        title: '施術開始',
        desc: '最高のリラクゼーションをご堪能ください。お支払いは事前精算です。',
      },
    ],
    isVisible: true,
  },
  diary: {
    heading: '写メ日記',
    subHeading: 'Photo Diary',
    items: [
      {
        id: '1',
        castName: '蓮',
        title: '今日はいい天気ですね',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
        date: '2025.01.18',
      },
      {
        id: '2',
        castName: 'ハルト',
        title: '美味しいカフェを見つけました',
        image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
        date: '2025.01.17',
      },
      {
        id: '3',
        castName: 'ユウキ',
        title: 'トレーニング頑張りました',
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        date: '2025.01.16',
      },
      {
        id: '4',
        castName: 'ソラ',
        title: 'お散歩中にパシャリ',
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
        date: '2025.01.15',
      },
    ],
    isVisible: true,
  },
  newcomer: {
    heading: '新人セラピスト(4名)',
    subHeading: 'Newcomers',
    courseText: '新人超お得コース 【150分10,000円】',
    items: [
      {
        id: '1',
        name: '遊貴(ユウキ)',
        age: '30代',
        height: '173',
        imageUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      },
      {
        id: '2',
        name: '雷我(ライガ)',
        age: '20代',
        height: '180',
        imageUrl: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
      },
      {
        id: '3',
        name: '拓哉(タクヤ)',
        age: '20代',
        height: '181',
        imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      },
      {
        id: '4',
        name: '海斗(カイト)',
        age: '20代',
        height: '175',
        imageUrl: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      },
    ],
    isVisible: true,
  },
  footer: {
    logoImageUrl:
      'https://images.unsplash.com/photo-1519735812324-ecb585a06a26?auto=format&fit=crop&q=80&w=1000',
    menuButtons: [
      { label: 'ご案内', link: '#' },
      { label: 'セラピスト一覧', link: '#' },
      { label: '出勤スケジュール', link: '#' },
      { label: 'ご利用料金', link: '#' },
      { label: 'コース', link: '#' },
      { label: '口コミ', link: '#' },
      { label: '写メ日記', link: '#' },
      { label: '動画', link: '#' },
      { label: 'ホテル', link: '#' },
      { label: '求人募集', link: '#' },
      { label: 'お問合わせ', link: '#' },
      { label: 'メディア様お問合わせ', link: '#' },
    ],
    banners: [
      {
        imageUrl: 'https://placehold.jp/24/22c55e/ffffff/400x100.png?text=LINE@友だち追加',
        link: '#',
      },
      {
        imageUrl: 'https://placehold.jp/24/e11d48/ffffff/400x100.png?text=050-5212-5818',
        link: '#',
      },
      {
        imageUrl: 'https://placehold.jp/24/db2777/ffffff/400x100.png?text=セラピスト大募集',
        link: '#',
      },
    ],
    smallBanners: [
      {
        imageUrl: 'https://placehold.jp/24/f43f5e/ffffff/300x80.png?text=モニターさん大募集',
        link: '#',
      },
      {
        imageUrl: 'https://placehold.jp/24/ec4899/ffffff/300x80.png?text=マッサージ女性講師大募集',
        link: '#',
      },
      { imageUrl: 'https://placehold.jp/24/e11d48/ffffff/300x80.png?text=STOP AIDS', link: '#' },
    ],
    shopInfo: {
      name: 'ストロベリーボーイズ',
      address: '東京都新宿区',
      phone: '050-5212-5818',
      businessHours:
        '24時間営業（受付 8:00〜23:00）\n※あくまでも23時までの受付になり、それ以降のお申込みは翌日に対応をさせて頂きます。\n年中無休',
    },
    trustBadges: ['https://placehold.jp/150x150.png?text=TRUST%26SAFETY'],
    copyright: 'Copyright © ストロベリーボーイズ. All Rights Reserved.',
    isVisible: true,
  },
};
