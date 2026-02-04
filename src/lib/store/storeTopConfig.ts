// 店舗トップページの設定型定義

export interface NavLink {
  name: string;
  href: string;
  imageUrl?: string;
}

export interface HeaderConfig {
  logoText: string;
  logoUrl?: string;
  navLinks: NavLink[];
  reserveButtonText: string;
  isVisible: boolean;
  phoneNumber: string;
  receptionHours: string;
  businessHours: string;
  specialBanner: {
    imageUrl: string;
    subHeading: string;
    mainHeading: string;
    link: string;
  };
}

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
  orderedNewsPageIds?: string[];
  isVisible: boolean;
}

export interface CastItem {
  id: string;
  name: string;
  age: number;
  height: number;
  comment: string;
  status: string;
  tags: string[];
  imageUrl: string;
  schedule?: string[]; // YYYY-MM-DD 形式
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
  itemsByTab?: PriceItem[][];
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

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQConfig {
  heading: string;
  subHeading: string;
  items: FAQItem[];
  isVisible: boolean;
}

export interface FooterConfig {
  logoImageUrl: string;
  logoLink?: string;
  menuButtons: { label: string; link: string }[];
  banners: { imageUrl: string; link: string }[];
  smallBanners: { imageUrl: string; link: string }[];
  shopInfo: {
    name: string;
    address: string;
    phone: string;
    businessHours: string;
  };
  trustBadges: { imageUrl: string; link: string }[];
  largeBanner?: { imageUrl: string; link: string };
  copyright: string;
  isVisible: boolean;
}

export interface StoreTopPageConfig {
  header: HeaderConfig;
  hero: HeroConfig;
  concept: ConceptConfig;
  campaign: CampaignConfig;
  cast: CastConfig;
  price: PriceConfig;
  flow: FlowConfig;
  diary: DiaryConfig;
  newcomer: NewcomerConfig;
  faq: FAQConfig;
  footer: FooterConfig;
}

// デフォルト設定
export const DEFAULT_STORE_TOP_CONFIG: StoreTopPageConfig = {
  header: {
    logoText: 'LUMIÈRE',
    logoUrl: '',
    navLinks: [
      {
        name: '最新のお知らせ',
        href: '#news',
        imageUrl: '/福岡お知らせ.png',
      },
      {
        name: 'はじめての方へ',
        href: '#flow',
        imageUrl: '/福岡初めての方へ.png',
      },
      {
        name: 'おすすめホテル一覧',
        href: '#hotels',
        imageUrl: '/福岡おすすめホテル一覧.png',
      },
      {
        name: 'セラピスト一覧',
        href: '#casts',
        imageUrl: '/福岡セラピスト一覧.png',
      },
      {
        name: '本日の出勤情報',
        href: '#schedules',
        imageUrl: '/福岡本日の出勤.png',
      },
      {
        name: '口コミ・レビュー',
        href: '#reviews',
        imageUrl: '/福岡セラピスト一覧.png',
      },
      {
        name: '写メ日記（更新中）',
        href: '#diary',
        imageUrl: '/福岡出勤情報.png',
      },
      {
        name: 'プライバシーポリシー',
        href: '/privacy',
        imageUrl: '/プライバシーポリシー.png',
      },
      {
        name: 'メディア取材のご連絡',
        href: '/media',
        imageUrl: '/images/envelope.png',
      },
      {
        name: '女風求人情報',
        href: '/recruit',
        imageUrl: '/images/cast1.png',
      },
      {
        name: 'ラインで問い合わせる',
        href: 'https://line.me',
        imageUrl: '/images/envelope.png',
      },
    ],
    reserveButtonText: 'WEB予約',
    isVisible: true,
    phoneNumber: '03-6356-3860',
    receptionHours: '12:00〜23:00',
    businessHours: '12:00〜翌朝4時',
    specialBanner: {
      imageUrl: '/福岡募集バナー.png',
      subHeading: 'Strawberry Boys Premium',
      mainHeading: '甘い誘惑を、今夜貴女に。',
      link: '#recruit',
    },
  },
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
        id: '1',
        name: '蓮 (レン)',
        age: 26,
        height: 178,
        comment: '優しく包み込みます',
        status: '本日出勤',
        tags: ['聞き上手', '高身長'],
        imageUrl: 'https://picsum.photos/seed/cast1/300/400',
        schedule: ['2026-01-21', '2026-01-22', '2026-01-24', '2026-01-26'],
      },
      {
        id: '2',
        name: 'ハルト',
        age: 24,
        height: 175,
        comment: '笑顔で癒やします',
        status: '本日出勤',
        tags: ['爽やか', 'マッサージ◎'],
        imageUrl: 'https://picsum.photos/seed/cast2/300/400',
        schedule: ['2026-01-21', '2026-01-23', '2026-01-25'],
      },
      {
        id: '3',
        name: 'ユウキ',
        age: 28,
        height: 182,
        comment: '大人の癒しを',
        status: '',
        tags: ['落ち着き', '色気'],
        imageUrl: 'https://picsum.photos/seed/cast3/300/400',
        schedule: ['2026-01-22', '2026-01-24', '2026-01-27'],
      },
      {
        id: '4',
        name: 'ソラ',
        age: 22,
        height: 174,
        comment: '弟キャラです',
        status: '残りわずか',
        tags: ['癒し系', '甘え上手'],
        imageUrl: 'https://picsum.photos/seed/cast4/300/400',
        schedule: ['2026-01-21', '2026-01-22', '2026-01-23', '2026-01-25'],
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
  faq: {
    heading: 'よくあるご質問',
    subHeading: 'FAQ',
    items: [
      {
        id: '1',
        question: 'お店を利用する事が初めての経験で不安です',
        answer:
          'ご利用が初めてのお客様に対しても安心してご利用頂けるよう、経験豊富なセラピストさんによる優しいエスコートの後、入念なカウンセリングのお時間をお取りし、出来る限り不安無くご案内が出来るように努めております♫',
      },
      {
        id: '2',
        question: '風俗店という言葉に怖いイメージがあります',
        answer:
          '当店は国に定められた風俗営業法の許可を取得している正規店です、お店の電話回線も携帯電話ではなく一般回線での登録となりますので、ぜひご安心してお問い合わせください♫',
      },
      {
        id: '3',
        question: '本番はできますか?',
        answer:
          '風俗営業法上、本番行為は違法となりますので、そういった行為が目的、または強要の事実が発覚した場合、次回からのご利用をお断りさせていただく場合がございます。当店セラピストからも本番行為を強要することはございません。',
      },
      {
        id: '4',
        question: '衛生面や性病感染などの心配がありますが大丈夫ですか?',
        answer:
          '当店セラピストは施術前に、殺菌作用の高い洗浄液にて消毒いたしております。さらに、セラピスト全員に定期的な性病検査を義務付けておりますのでご安心ください♫',
      },
      {
        id: '5',
        question: '太っていて可愛くないけど相手してくれる?',
        answer:
          'もちろんです!選ぶのは私達ではなく、貴女です。何も遠慮することはありません。女性は気持ちのいいセックスをすると女性ホルモンの分泌で綺麗になると言われています。綺麗な女性はその機会が多く更に綺麗になります。そうでない女性は意地になって「私なんて」とマイナス思考になってしまいがちです。これを機会に心も身体も綺麗いに変身してはいかがですか?',
      },
      {
        id: '6',
        question: '初めての利用で何を伝えれば良いか分かりません....',
        answer:
          '基本的には、ご利用日程、駅等のお待ち合わせ場所、ご利用コース、セラピストの指名有無をお伝え頂ければご案内をお取りします。HPを参考にお問い合わせ下さいませ♫',
      },
      {
        id: '7',
        question: '当日予約はできますか?',
        answer:
          'もちろん可能です。その際、混雑の状況にもよりますがメール、LINEよりも直接お電話頂いた方がご案内がスムーズです♫',
      },
      {
        id: '8',
        question: '深夜に利用はできますか?',
        answer:
          '基本的に当日受付は23時で終了致しますので、深夜帯にご利用の場合は予め早い段階でのご連絡をお願い致します。かつ深夜帯の待機セラピストは少数ですのでお早めにご連絡を頂いた方がご案内がスムーズです♫',
      },
      {
        id: '9',
        question: '予約は何日先まで可能ですか?',
        answer:
          '基本的には長くとも2週間前程でお願いしております。例外として出張、ご旅行などで日程が予め決まっている場合は受付をしておりますのでお気軽にお問い合わせ下さい♫',
      },
      {
        id: '10',
        question: '待ち合わせはどうすれば良いですか?',
        answer:
          '基本的にセラピストは電車での移動となりますので駅でのお待ち合わせとなります。その際何処か改札口、お店の前、ホテルなど目印をご指定頂けると幸いです♫',
      },
      {
        id: '11',
        question: '自宅利用したいが住所は教えたくない',
        answer:
          '最寄りの駅でのお待ち合わせをして、そのままご自宅へ移動という事もできますので、受付にご相談下さい♫',
      },
      {
        id: '12',
        question: 'ホテルはどうすれば良いですか?',
        answer:
          'ご利用のお部屋はお客様で決めて頂き、先に入室されていても大丈夫です。もしお決まりでなければセラピストにお任せする事もできますのでお気軽にお伝え下さい♫',
      },
      {
        id: '13',
        question: 'セラピストが多くて選べない',
        answer:
          '年齢、タイプなどお伝え頂ければ受付の方でご希望に近いセラピストさんを選定致しますのでお気軽にお伝え下さい♫',
      },
      {
        id: '14',
        question: '本名を伝えたくありません',
        answer:
          '偽名で大丈夫です、セラピストにもお客様の個人情報は基本的にお伝えはしませんのでご安心ください♫',
      },
      {
        id: '15',
        question: '時間のカウントは会ってからですか?',
        answer:
          '施術コースのお時間のカウントはお部屋に入室後、カウンセリング、シャワーを浴びた後になりますので、お時間一杯ごゆっくりお過ごしください♫',
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
    trustBadges: [{ imageUrl: 'https://placehold.jp/150x150.png?text=TRUST%26SAFETY', link: '#' }],
    logoLink: '#',
    copyright: 'Copyright © ストロベリーボーイズ. All Rights Reserved.',
    isVisible: true,
  },
};
