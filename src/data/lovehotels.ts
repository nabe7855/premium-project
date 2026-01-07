
import { Hotel, Prefecture, Review, FeatureArticle } from '@/types/lovehotels';

export const AMENITIES = [
  '無料Wi-Fi', 'VOD/DVDプレーヤー', 'カラオケ', '大型テレビ', '電子レンジ', 
  '冷蔵庫', 'マッサージチェア', 'ドライヤー', 'ジェットバス', 'サウナ', '浴室テレビ'
];

export const SERVICES = [
  'クレジットカード可', '駐車場有り', '外出可', '予約可', '1人利用可', 
  '3名以上可', 'ルームサービス有り'
];

export const PREFECTURES: Prefecture[] = [
  {
    id: 'tokyo',
    name: '東京都',
    count: 156,
    cities: [
      { id: 'shinjuku', name: '新宿区', count: 42, areas: ['歌舞伎町', '新大久保'] },
      { id: 'shibuya', name: '渋谷区', count: 28, areas: ['道玄坂', '円山町'] },
      { id: 'ueno', name: '台東区', count: 15, areas: ['上野', '鶯谷'] },
      { id: 'ikebukuro', name: '豊島区', count: 20, areas: ['池袋北口'] }
    ]
  },
  {
    id: 'aichi',
    name: '愛知県',
    count: 112,
    cities: [
      { id: 'nagoya-naka', name: '名古屋市中区', count: 38, areas: ['栄', '錦', '金山'] },
      { id: 'nagoya-nakamura', name: '名古屋市中村区', count: 22, areas: ['名駅', '太閤通'] },
      { id: 'nagoya-chikusa', name: '名古屋市千種区', count: 15, areas: ['今池', '池下'] }
    ]
  },
  {
    id: 'osaka',
    name: '大阪府',
    count: 124,
    cities: [
      { id: 'namba', name: '大阪市中央区', count: 35, areas: ['難波', '心斎橋'] },
      { id: 'umeda', name: '大阪市北区', count: 22, areas: ['梅田', '兎我野町'] }
    ]
  },
  {
    id: 'fukuoka',
    name: '福岡県',
    count: 94,
    cities: [
      { id: 'fukuoka-hakata', name: '福岡市博多区', count: 32, areas: ['中洲', '博多駅前'] },
      { id: 'fukuoka-chuo', name: '福岡市中央区', count: 28, areas: ['天神', '今泉'] },
      { id: 'kitakyushu', name: '北九州市', count: 18, areas: ['小倉', '黒崎'] }
    ]
  },
  {
    id: 'kanagawa',
    name: '神奈川県',
    count: 98,
    cities: [
      { id: 'yokohama', name: '横浜市', count: 30, areas: ['新横浜', '関内'] }
    ]
  }
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'ホテル ロイヤルガーデン 新宿',
    prefecture: '東京都',
    city: '新宿区',
    area: '歌舞伎町',
    address: '東京都新宿区歌舞伎町1-2-3',
    phone: '03-1234-5678',
    website: 'https://example.com/hotel1',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    minPriceRest: 4500,
    minPriceStay: 9800,
    rating: 4.5,
    reviewCount: 128,
    amenities: ['無料Wi-Fi', 'VOD/DVDプレーヤー', 'ジェットバス', 'サウナ'],
    services: ['クレジットカード可', '外出可', '予約可'],
    distanceFromStation: '新宿駅より徒歩5分',
    roomCount: 45,
    description: '都会の喧騒を忘れる極上の空間。最新設備と最高級のアメニティで至福のひとときを。'
  },
  {
    id: 'a1',
    name: '名古屋プラチナム・スイート',
    prefecture: '愛知県',
    city: '名古屋市中区',
    area: '栄',
    address: '愛知県名古屋市中区栄3-x-x',
    phone: '052-123-4567',
    website: 'https://example.com/hotel-a1',
    imageUrl: 'https://images.unsplash.com/photo-1582719478237-c26ad0c9a0d6?auto=format&fit=crop&q=80&w=800',
    minPriceRest: 5000,
    minPriceStay: 11000,
    rating: 4.7,
    reviewCount: 92,
    amenities: ['無料Wi-Fi', '大型テレビ', 'サウナ'],
    services: ['クレジットカード可', '駐車場有り'],
    distanceFromStation: '栄駅より徒歩4分',
    roomCount: 28,
    description: '名古屋随一の繁華街、栄に位置するハイエンドホテル。贅を尽くした内装が人気です。'
  },
  {
    id: 'f1',
    name: 'ホテル 中洲リバーサイド',
    prefecture: '福岡県',
    city: '福岡市博多区',
    area: '中洲',
    address: '福岡県福岡市博多区中洲x-x-x',
    phone: '092-123-4567',
    website: 'https://example.com/hotel-f1',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    minPriceRest: 3900,
    minPriceStay: 8500,
    rating: 4.4,
    reviewCount: 76,
    amenities: ['無料Wi-Fi', 'カラオケ', '浴室テレビ'],
    services: ['クレジットカード可', '外出可'],
    distanceFromStation: '中洲川端駅より徒歩2分',
    roomCount: 40,
    description: '中洲の夜景を臨む絶好のロケーション。モダンなデザインと充実の設備で快適な滞在を。'
  }
];

export const MOCK_FEATURES: FeatureArticle[] = [
  {
    id: 'tokyo-night',
    prefectureId: 'tokyo',
    title: '眠らない街・新宿歌舞伎町で極上の夜を過ごすための厳選3選',
    summary: '最新設備から隠れ家的な人気店まで、今新宿で最も熱いホテルをピックアップ。',
    content: `
      新宿歌舞伎町。日本最大の歓楽街として知られるこのエリアには、数多くのラブホテルが軒を連ねています。
      しかし、あまりに多すぎてどこを選べばいいか迷ってしまうことも多いはず。

      今回の特集では、特に「内装の豪華さ」「設備の充実度」「プライバシーへの配慮」の3点に絞り、
      絶対に外さないおすすめホテルをご紹介します。

      ### 1. 進化し続けるエンターテインメント空間
      最近のトレンドは、もはや「泊まるだけ」ではないこと。大型テレビでのシネマ鑑賞や、
      最新のカラオケ機器、さらには本格的なサウナを完備した部屋が増えています。

      ### 2. 女性に嬉しいアメニティの充実
      手ぶらでも安心して利用できるよう、高級ブランドのスキンケアセットや、
      ダイソンのドライヤーなどを備えるホテルが急増中。

      新宿の夜を、より豊かに、より特別にするための参考にしてください。
    `,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    date: '2024.06.01',
    tags: ['新宿', '歌舞伎町', '高級'],
    relatedHotelIds: ['1']
  },
  {
    id: 'aichi-luxury',
    prefectureId: 'aichi',
    title: '名古屋・栄エリアで「大人な贅沢」を楽しむデザイナーズホテル特集',
    summary: '洗練されたデザインと開放的な空間。名古屋のど真ん中で味わう非日常。',
    content: `
      愛知県名古屋市の中心部、栄。ビジネスとレジャーが交差するこの地には、
      洗練された大人のためのデザイナーズホテルが数多く存在します。

      特に今注目なのは、コンクリート打ちっぱなしのモダンな内装や、
      ラグジュアリーな照明設計が施された「視覚的に美しい」ホテルです。

      ### 名古屋スタイルのおもてなし
      広い浴槽や、ゆったりとしたリビングスペース。名古屋のホテルは
      面積が広く取られていることが多く、窮屈さを感じさせないのが特徴です。
    `,
    imageUrl: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&q=80&w=800',
    date: '2024.05.20',
    tags: ['名古屋', '栄', 'デザイナーズ'],
    relatedHotelIds: ['a1']
  },
  {
    id: 'fukuoka-view',
    prefectureId: 'fukuoka',
    title: '中洲の夜景を独り占め！リバーサイドのおすすめホテルガイド',
    summary: '那珂川の煌めきを眺めながら過ごす、福岡ならではのロマンチックなひととき。',
    content: `
      博多・中洲エリア。川沿いに並ぶ屋台の明かりと、ネオンが水面に映る景色は、
      福岡を代表するロマンチックな風景の一つです。

      このエリアのホテルの中には、川側の部屋からその絶景を独り占めできるスポットがあります。

      ### デートの締めくくりに
      美味しい福岡グルメを楽しんだ後、喧騒から少し離れた静かな部屋で
      夜景を眺めながらリラックスする。そんな完璧なデートプランを叶えるホテルをご紹介。
    `,
    imageUrl: 'https://images.unsplash.com/photo-1590447158019-883d8d5f8bc7?auto=format&fit=crop&q=80&w=800',
    date: '2024.05.28',
    tags: ['福岡', '中洲', '夜景'],
    relatedHotelIds: ['f1']
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    hotelId: '1',
    userName: 'サトシ',
    rating: 5,
    cleanliness: 5,
    service: 4,
    rooms: 5,
    value: 4,
    content: '部屋が非常に綺麗で、ジェットバスが最高でした。また利用したいです。',
    date: '2024-05-15'
  }
];
