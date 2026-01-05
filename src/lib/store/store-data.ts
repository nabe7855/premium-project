export interface Store {
  slug: string;
<<<<<<< HEAD
=======
  template: 'common' | 'fukuoka';
>>>>>>> animation-test
  name: string;
  city: string;
  theme: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    accent: string;
    bodyClass: string;
    gradient: string;
    gradientHover: string;
  };
  hero: {
    title: string;
    subtitle: string;
    catchphrase: string;
    backgroundImage: string;
  };
  contact: {
    phone: string;
    line: string;
    email: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  casts: Array<{
    id: string;
    name: string;
    age: number;
    image: string;
    specialty: string;
    isWorking: boolean;
    schedule: string[];
  }>;
  newcomers: Array<{
    id: string;
    name: string;
    age: number;
    image: string;
    introduction: string;
    startDate: string;
  }>;
  events: Array<{
    id: string;
    title: string;
    date: string;
    type: 'live' | 'event' | 'campaign';
    description: string;
    image: string;
  }>;
  diaries: Array<{
    id: string;
    castName: string;
    title: string;
    excerpt: string;
    image: string;
    date: string;
  }>;
  media: Array<{
    id: string;
    title: string;
    publication: string;
    date: string;
    image: string;
    url: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
    date: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    content: string;
    date: string;
    service: string;
  }>;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    duration: string;
    description: string;
    features: string[];
    popular: boolean;
  }>;
}

const storeData: Record<string, Store> = {
  tokyo: {
    slug: 'tokyo',
<<<<<<< HEAD
=======
    template: 'common',
>>>>>>> animation-test
    name: 'ストロベリーボーイ東京店',
    city: '東京',
    theme: {
      primary: 'rgb(236, 72, 153)',
      primaryLight: 'rgb(251, 207, 232)',
      primaryDark: 'rgb(157, 23, 77)',
      accent: 'rgb(244, 114, 182)',
      bodyClass: 'bg-gradient-to-br from-pink-50 to-rose-100',
      gradient: 'from-pink-500 to-rose-600',
      gradientHover: 'from-pink-600 to-rose-700',
    },
    hero: {
      title: '甘くとろける夢の世界へ',
      subtitle: '東京で一番特別な時間を',
      catchphrase: 'あなただけの王子様が、心を込めておもてなし',
      backgroundImage: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg',
    },
    contact: {
      phone: '03-1234-5678',
      line: '@strawberry-tokyo',
      email: 'tokyo@strawberry-boy.com',
    },
    seo: {
      title: '【東京店】甘くとろける夢の世界へ｜ストロベリーボーイ',
<<<<<<< HEAD
      description: '東京で癒しのひとときを。AIマッチング型イケメン派遣サービス。20代後半〜40代女性に選ばれる上質な癒し体験をお届けします。',
=======
      description:
        '東京で癒しのひとときを。AIマッチング型イケメン派遣サービス。20代後半〜40代女性に選ばれる上質な癒し体験をお届けします。',
>>>>>>> animation-test
      keywords: 'イケメン派遣,東京,癒し,女性向け,マッチング,ホスト,エンターテイメント',
      ogImage: 'https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg',
    },
    casts: [
      {
        id: '1',
        name: '蓮',
        age: 25,
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        specialty: '癒し系トーク',
        isWorking: true,
        schedule: ['19:00-24:00'],
      },
      {
        id: '2',
        name: '翔太',
        age: 28,
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
        specialty: 'エンターテイナー',
        isWorking: true,
        schedule: ['18:00-23:00'],
      },
      {
        id: '3',
        name: '颯',
        age: 26,
        image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
        specialty: '大人の会話',
        isWorking: false,
        schedule: ['20:00-25:00'],
      },
    ],
    newcomers: [
      {
        id: '1',
        name: '海斗',
        age: 24,
        image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
<<<<<<< HEAD
        introduction: '笑顔が素敵な癒し系新人です。お話するのが大好きで、どんな話題でも楽しくお話しできます。',
=======
        introduction:
          '笑顔が素敵な癒し系新人です。お話するのが大好きで、どんな話題でも楽しくお話しできます。',
>>>>>>> animation-test
        startDate: '2025-01-15',
      },
    ],
    events: [
      {
        id: '1',
        title: '新春スペシャルライブ配信',
        date: '2025-01-20',
        type: 'live',
        description: '人気キャストによる特別ライブ配信イベント',
        image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
      },
      {
        id: '2',
        title: 'バレンタイン限定プラン',
        date: '2025-02-14',
        type: 'campaign',
        description: '特別料金でロマンチックな時間をお過ごしいただけます',
        image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg',
      },
    ],
    diaries: [
      {
        id: '1',
        castName: '蓮',
        title: '今日の出来事',
        excerpt: '素敵なお客様との楽しい時間を過ごしました...',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
        date: '2025-01-10',
      },
      {
        id: '2',
        castName: '翔太',
        title: '新年のご挨拶',
        excerpt: '今年もよろしくお願いします！新しい出会いを...',
        image: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
        date: '2025-01-08',
      },
    ],
    media: [
      {
        id: '1',
        title: '注目の新サービス特集',
        publication: 'Tokyo Walker',
        date: '2025-01-05',
        image: 'https://images.pexels.com/photos/518244/pexels-photo-518244.jpeg',
        url: '#',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'キャスト紹介動画',
        thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
        duration: '3:45',
        views: 1250,
        date: '2025-01-08',
      },
    ],
    reviews: [
      {
        id: '1',
        author: 'M.K様',
        rating: 5,
<<<<<<< HEAD
        content: '本当に素敵な時間を過ごせました。スタッフの方々も親切で、また利用したいと思います。',
=======
        content:
          '本当に素敵な時間を過ごせました。スタッフの方々も親切で、また利用したいと思います。',
>>>>>>> animation-test
        date: '2025-01-09',
        service: 'プレミアムプラン',
      },
      {
        id: '2',
        author: 'A.S様',
        rating: 5,
        content: '癒しの時間をありがとうございました。心からリラックスできました。',
        date: '2025-01-07',
        service: 'スタンダードプラン',
      },
    ],
    plans: [
      {
        id: '1',
        name: 'スタンダードプラン',
        price: '¥8,000',
        duration: '60分',
        description: '初めての方におすすめの基本プラン',
        features: ['カウンセリング', 'ドリンクサービス', 'フォトサービス'],
        popular: false,
      },
      {
        id: '2',
        name: 'プレミアムプラン',
        price: '¥15,000',
        duration: '90分',
        description: '特別な時間を過ごしたい方におすすめ',
<<<<<<< HEAD
        features: ['カウンセリング', 'ドリンクサービス', 'フォトサービス', 'デートプラン', 'お土産付き'],
=======
        features: [
          'カウンセリング',
          'ドリンクサービス',
          'フォトサービス',
          'デートプラン',
          'お土産付き',
        ],
>>>>>>> animation-test
        popular: true,
      },
    ],
  },
  osaka: {
    slug: 'osaka',
<<<<<<< HEAD
=======
    template: 'common',
>>>>>>> animation-test
    name: 'ストロベリーボーイ大阪店',
    city: '大阪',
    theme: {
      primary: 'rgb(249, 115, 22)',
      primaryLight: 'rgb(254, 215, 170)',
      primaryDark: 'rgb(154, 52, 18)',
      accent: 'rgb(251, 146, 60)',
      bodyClass: 'bg-gradient-to-br from-orange-50 to-amber-100',
      gradient: 'from-orange-500 to-amber-600',
      gradientHover: 'from-orange-600 to-amber-700',
    },
    hero: {
      title: '情熱的な関西の魅力',
      subtitle: '大阪で味わう特別な癒し',
      catchphrase: 'あったかい笑顔で、心も軽やか',
      backgroundImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    },
    contact: {
      phone: '06-1234-5678',
      line: '@strawberry-osaka',
      email: 'osaka@strawberry-boy.com',
    },
    seo: {
      title: '【大阪店】情熱的な関西の魅力｜ストロベリーボーイ',
<<<<<<< HEAD
      description: '大阪で心温まる癒しの時間を。関西弁で親しみやすいイケメンキャストがあなたをお待ちしています。',
=======
      description:
        '大阪で心温まる癒しの時間を。関西弁で親しみやすいイケメンキャストがあなたをお待ちしています。',
>>>>>>> animation-test
      keywords: 'イケメン派遣,大阪,関西,癒し,女性向け,マッチング,ホスト',
      ogImage: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    },
    // ... (similar structure with Osaka-specific data)
    casts: [
      {
        id: '1',
        name: '大樹',
        age: 27,
        image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
        specialty: '関西弁トーク',
        isWorking: true,
        schedule: ['19:00-24:00'],
      },
    ],
    newcomers: [],
    events: [],
    diaries: [],
    media: [],
    videos: [],
    reviews: [],
    plans: [
      {
        id: '1',
        name: 'ベーシックプラン',
        price: '¥7,500',
        duration: '60分',
        description: '関西ならではのあったかい時間',
        features: ['カウンセリング', 'ドリンクサービス'],
        popular: false,
      },
    ],
  },
  nagoya: {
    slug: 'nagoya',
<<<<<<< HEAD
=======
    template: 'common',
>>>>>>> animation-test
    name: 'ストロベリーボーイ名古屋店',
    city: '名古屋',
    theme: {
      primary: 'rgb(147, 51, 234)',
      primaryLight: 'rgb(221, 214, 254)',
      primaryDark: 'rgb(88, 28, 135)',
      accent: 'rgb(168, 85, 247)',
      bodyClass: 'bg-gradient-to-br from-purple-50 to-violet-100',
      gradient: 'from-purple-500 to-violet-600',
      gradientHover: 'from-purple-600 to-violet-700',
    },
    hero: {
      title: '上品で洗練された時間',
      subtitle: '名古屋で過ごす優雅なひととき',
      catchphrase: '品格ある大人の癒し空間',
      backgroundImage: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
    },
    contact: {
      phone: '052-1234-5678',
      line: '@strawberry-nagoya',
      email: 'nagoya@strawberry-boy.com',
    },
    seo: {
      title: '【名古屋店】上品で洗練された時間｜ストロベリーボーイ',
      description: '名古屋で上質な癒しを。洗練されたキャストがあなたに特別な時間をお届けします。',
      keywords: 'イケメン派遣,名古屋,上品,癒し,女性向け,マッチング,ホスト',
      ogImage: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
    },
    // ... (similar structure with Nagoya-specific data)
    casts: [
      {
        id: '1',
        name: '雅人',
        age: 29,
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
        specialty: '大人の会話',
        isWorking: true,
        schedule: ['20:00-25:00'],
      },
    ],
    newcomers: [],
    events: [],
    diaries: [],
    media: [],
    videos: [],
    reviews: [],
    plans: [
      {
        id: '1',
        name: 'エレガントプラン',
        price: '¥9,000',
        duration: '75分',
        description: '上品で洗練された時間をお過ごしください',
        features: ['カウンセリング', 'プレミアムドリンク', 'フォトサービス'],
        popular: true,
      },
    ],
  },
<<<<<<< HEAD
=======
  fukuoka: {
    slug: 'fukuoka',
    template: 'fukuoka',
    name: 'ストロベリーボーイズ福岡',
    city: '福岡',
    theme: {
      primary: 'rgb(239, 68, 68)',
      primaryLight: 'rgb(254, 202, 202)',
      primaryDark: 'rgb(185, 28, 28)',
      accent: 'rgb(248, 113, 113)',
      bodyClass: 'bg-gradient-to-br from-red-50 to-rose-100',
      gradient: 'from-red-500 to-rose-600',
      gradientHover: 'from-red-600 to-rose-700',
    },
    hero: {
      title: '博多の夜に咲く一輪の花',
      subtitle: '福岡で過ごす極上のひととき',
      catchphrase: '情熱的な夜をあなたに',
      backgroundImage: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
    },
    contact: {
      phone: '092-1234-5678',
      line: '@strawberry-fukuoka',
      email: 'fukuoka@strawberry-boy.com',
    },
    seo: {
      title: '【福岡店】博多の夜に咲く一輪の花｜ストロベリーボーイズ',
      description: '福岡で極上の癒し体験を。厳選されたキャストがあなたをお待ちしています。',
      keywords: 'イケメン派遣,福岡,博多,中洲,癒し,女性向け,マッチング',
      ogImage: 'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg',
    },
    casts: [],
    newcomers: [],
    events: [],
    diaries: [],
    media: [],
    videos: [],
    reviews: [],
    plans: [
      {
        id: '1',
        name: '博多スペシャルプラン',
        price: '¥8,000',
        duration: '60分',
        description: '初めての方におすすめの基本プラン',
        features: ['カウンセリング', 'ドリンクサービス'],
        popular: false,
      },
    ],
  },
>>>>>>> animation-test
};

export function getStoreData(slug: string): Store | null {
  return storeData[slug] || null;
}

export function getAllStores(): Store[] {
  return Object.values(storeData);
<<<<<<< HEAD
}
=======
}
>>>>>>> animation-test
