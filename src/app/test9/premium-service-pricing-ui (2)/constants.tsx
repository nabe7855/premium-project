
import { Course, TransportItem, OptionItem, Campaign } from './types';

export const MOCK_BASIC_SERVICES = [
  'カウンセリング', '指圧マッサージ', 'パウダー性感', '乳首舐め',
  'クンニ', '指入れ', 'Gスポット', 'ボルチオ'
];

export const MOCK_FREE_OPTIONS = [
  'キス', 'ハグ', 'フェラ', '手コキ', 'ボディータッチ',
  'ローター', 'バイブ', 'その他オプション多数'
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'standard',
    name: 'スタンダードコース',
    description: '当店の基本となる施術コース。時間に合わせて最適な行程をご提供します。',
    icon: '🍓',
    plans: [
      { minutes: 60, price: 12000, subLabel: '一部の施術のみ' },
      { minutes: 90, price: 16000, subLabel: '比較的ゆったり' },
      { minutes: 120, price: 20000, subLabel: '当店のスタンダード', discountInfo: '初回2,000円OFF' },
      { minutes: 150, price: 24000, subLabel: '余裕を持ちたい時に', discountInfo: '初回2,000円OFF' },
      { minutes: 180, price: 29000, subLabel: '7,000円お得', discountInfo: '初回2,000円OFF' },
      { minutes: 240, price: 39000, subLabel: '9,000円お得・洗体無料', discountInfo: '初回4,000円OFF' },
      { minutes: 300, price: 47000, subLabel: '13,000円お得・洗体無料', discountInfo: '初回4,000円OFF' },
    ],
    extensionPer30min: 6000,
    designationFees: {
      free: 0,
      first: 1000,
      follow: 1000,
      note: '全セラピスト一律。特にご希望がなければ無料となります♫'
    },
    notes: '120分コースは、2時間をかけてメインの施術行程をご堪能いただける当店のスタンダードコースです。非常にお得な料金設定となっております♡\n\n※60分コースについては施術時間が短いため、一部の施術のみとさせて頂きます。'
  },
  {
    id: 'stay',
    name: 'お泊りコース',
    description: '通常の120分コースが含まれ、それ以外の時間はデートなどに。',
    icon: '🎀',
    plans: [
      { minutes: 600, price: 55000, subLabel: '10時間' },
      { minutes: 720, price: 65000, subLabel: '12時間' },
      { minutes: 840, price: 75000, subLabel: '14時間' },
      { minutes: 960, price: 85000, subLabel: '16時間' },
      { minutes: 1080, price: 95000, subLabel: '18時間' },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: '常識の範囲内でセラピストへ休息（5〜6時間目安の睡眠時間）を与えて頂けると幸いです。デート代・食事代は実費負担となります。'
  },
  {
    id: 'date',
    name: 'デートコース',
    description: '外でのデートから始まり、気持ちがほぐれた所でホテルへ。',
    icon: '🍰',
    plans: [
      { minutes: 180, price: 32000 },
      { minutes: 240, price: 42000, subLabel: '洗体オプション無料' },
      { minutes: 300, price: 50000, subLabel: '洗体オプション無料' },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: 'いきなりホテルに入るのが抵抗ある方は、外でのデートからお楽しみください♫'
  },
  {
    id: 'new',
    name: '新苺コース（90分）',
    description: '入店してまもない新人さんを格安料金でご案内。',
    icon: '🌱',
    plans: [
      { minutes: 90, price: 10000 },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: '新人セラピストを格安のご利用料金にてご案内させて頂きます♫'
  },
  {
    id: 'couple',
    name: 'カップルコース',
    description: 'お客様お二人と、当店セラピストの3名でのご案内。',
    icon: '👩‍❤️‍👨',
    plans: [
      { minutes: 60, price: 19000 },
      { minutes: 90, price: 28000 },
      { minutes: 120, price: 37000 },
    ],
    extensionPer30min: 10000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: 'お客様のご要望通りにサービスを行います。非現実的なプレイをお楽しみください♡'
  },
  {
    id: '3p',
    name: '3Pコース',
    description: 'お客様おひとりに対してセラピスト2名で施術する夢のコース。',
    icon: '🍓🍓',
    plans: [
      { minutes: 90, price: 30000 },
      { minutes: 120, price: 40000 },
    ],
    extensionPer30min: 10000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: 'お客様おひとりに対してセラピストが2名にて施術をする、極楽コースです☆'
  },
  {
    id: 'travel',
    name: 'トラベルコース',
    description: '旅行中ずっと一緒に過ごせる特別プラン。',
    icon: '✈️',
    plans: [
      { minutes: 1440, price: 100000, subLabel: '24時間以内' },
      { minutes: 1800, price: 125000, subLabel: '30時間以内' },
      { minutes: 2160, price: 150000, subLabel: '36時間以内' },
      { minutes: 2880, price: 200000, subLabel: '48時間以内' },
      { minutes: 3600, price: 250000, subLabel: '60時間以内' },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: '大変お得なコースのため、トラベルコースには施術は含まれておりません。'
  }
];

export const MOCK_TRANSPORT_AREAS: TransportItem[] = [
  { id: 'tr1', area: '東京23区', price: 1000, label: '1,000円エリア' },
  { id: 'tr2', area: '東京23区外', price: 2000, label: '2,000円エリア' },
  { id: 'tr3', area: 'その他、関東近郊', price: 3000, label: '3,000円エリア' },
  { id: 'tr4', area: 'タクシー代', price: 'negotiable', label: '応相談', note: '深夜利用の場合、駅から遠方の場合など' },
];

export const MOCK_OPTIONS: OptionItem[] = [
  { 
    id: 'o1', 
    name: '指名料', 
    description: '当店は全セラピスト一律の指名料金です♫ 特にご希望がなければ無料となります。', 
    price: 1000 
  },
  { 
    id: 'o2', 
    name: '洗体オプション', 
    description: 'お風呂にてお客様のお身体を丁寧に、そしていやらしく洗体をさせて頂きます♡', 
    price: 2000,
    isRelative: true
  },
  { 
    id: 'o3', 
    name: 'ドMオプション', 
    description: '「目一杯男性に虐められたい」その非日常の願望を叶えます☆ 通常プレイよりもゾクゾク感10倍間違い無し！', 
    price: 2000,
    isRelative: true
  },
  { 
    id: 'o4', 
    name: 'アイラインタッチ無し', 
    description: '女性風俗に対して抵抗のあるお客様でも、ご安心してご利用頂けるオプションとなります。', 
    price: -1000,
    isRelative: true
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cp1',
    title: '初回限定！最大4,000円OFF',
    description: '120〜180分コースで2,000円引、240分コース以上なら4,000円引！対象コースからお値引きいたします♫',
    imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'WELCOME DISCOUNT',
    priceInfo: 'MAX 4,000円引'
  },
  {
    id: 'cp2',
    title: '口コミ＆アンケート割引',
    description: '口コミとアンケートの両方ご記入で、次回1,000円引！短文でも大歓迎です。他割引との併用も可能♫',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    needEntry: true,
    accentText: 'REVIEW & SURVEY',
    priceInfo: '1,000円引'
  },
  {
    id: 'cp3',
    title: 'お友達紹介割引',
    description: 'ご紹介者様・お友達の双方ともコース料金から1,000円引！LINE予約時にお伝えください♫',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    needEntry: true,
    accentText: 'REFER A FRIEND',
    priceInfo: '1,000円引'
  },
  {
    id: 'cp4',
    title: '遠方のお客様限定割引',
    description: '関東外からお越しの方、150分以上のご利用で2,000円引！新幹線等のチケットをご提示ください♫',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'TRAVELER DISCOUNT',
    priceInfo: '2,000円引'
  },
  {
    id: 'cp5',
    title: 'お誕生日特別割引',
    description: '誕生月なら180分以上のコースが5,000円引！口コミ割併用で最大6,000円もお得にお祝いさせてください♡',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-fa394024a06b?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'BIRTHDAY SPECIAL',
    priceInfo: '5,000円引'
  },
  {
    id: 'cp6',
    title: '毎月15日は「苺DAY」',
    description: '月に一度の究極特売！120分コースを15,000円でご提供☆合言葉「イチゴDAY！」をお忘れなく♫',
    imageUrl: 'https://images.unsplash.com/photo-1464965224025-20ac7fd8367d?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'ICHIGO DAY (15th)',
    priceInfo: '15,000円均一'
  },
  {
    id: 'cp7',
    title: '2/16 創立記念感謝祭',
    description: '全てのお客様に感謝を込めて。全コース施術10分延長サービス＆指名料を無料サービスしちゃいます☆',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'ANNIVERSARY (2/16)',
    priceInfo: '10分＋指名無料'
  },
  {
    id: 'cp8',
    title: '7/13 齊藤店長生誕祭',
    description: '当日の受付・ご利用限定！全コース施術時間を10分間無料サービスいたします♪みんなでお祝いしましょう！',
    imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db51edc3944?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'MANAGER BDAY (7/13)',
    priceInfo: '10分サービス'
  }
];
