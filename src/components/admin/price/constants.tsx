import { Campaign, Course, OptionItem, TransportItem } from './types';

export const MOCK_BASIC_SERVICES = [
  'カウンセリング',
  '指圧マッサージ',
  'パウダー性感',
  '乳首舐め',
  'クンニ',
  '指入れ',
  'Gスポット',
  'ボルチオ',
];

export const MOCK_FREE_OPTIONS = [
  'キス',
  'ハグ',
  'フェラ',
  '手コキ',
  'ボディータッチ',
  'ローター',
  'バイブ',
  'その他オプション多数',
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-60',
    name: '60分コース',
    description: '一部の施術のみとなるショートコースです。',
    icon: '⚡',
    plans: [{ minutes: 60, price: 12000 }],
    extensionPer30min: 6000,
    designationFees: {
      free: 0,
      first: 1000,
      follow: 1000,
      note: '全セラピスト一律。特にご希望がなければ無料となります♫',
    },
    notes:
      '60分コースについては施術時間が短く、当店の基本コースの行程を終える事が出来ませんので、一部の施術のみとさせて頂きます。',
  },
  {
    id: 'course-90',
    name: '90分コース',
    description: '60分コースよりもゆったりとお過ごしいただけます。',
    icon: '✨',
    plans: [{ minutes: 90, price: 16000 }],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: '60分コースよりも比較的ゆったりとお過ごしが出来るコースです♡',
  },
  {
    id: 'course-120',
    name: '120分コース',
    description: '当店のスタンダードコース。メインの施術行程をご堪能いただけます。',
    icon: '🍓',
    plans: [
      {
        minutes: 120,
        price: 20000,
        discountInfo: '初回2,000円OFF',
      },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '2時間をかけてメインの施術行程をご堪能いただける当店のスタンダードコースです♫ 非常にお得な料金設定です♡\n\n※当店のご利用が初めての方は2,000円割引き',
  },
  {
    id: 'course-150',
    name: '150分コース',
    description: '少しお時間に余裕を持ちたい時におすすめです。',
    icon: '🕰️',
    plans: [
      {
        minutes: 150,
        price: 24000,
        discountInfo: '初回2,000円OFF',
      },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '少しお時間に余裕を持ちたい時の150分コースです♡\n\n※当店のご利用が初めての方は2,000円割引き',
  },
  {
    id: 'course-180',
    name: '180分コース',
    description: '総額7,000円お得なロングコースです。',
    icon: '💖',
    plans: [
      {
        minutes: 180,
        price: 29000,
        discountInfo: '初回2,000円OFF',
      },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes: '総額7,000円お得な180分コースです♡\n\n※当店のご利用が初めての方は2,000円割引き',
  },
  {
    id: 'course-240',
    name: '240分コース',
    description: '洗体オプション(2,000円分)が無料のお得なコースです。',
    icon: '🛁',
    plans: [
      {
        minutes: 240,
        price: 39000,
        subLabel: '洗体OP無料',
        discountInfo: '初回4,000円OFF',
      },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '総額9,000円お得で洗体オプション(2,000円分)が無料の240分コースです♡\n\n※当店ご利用初めての方は4,000円割引き',
  },
  {
    id: 'course-300',
    name: '300分コース',
    description: 'セラピストを5時間独り占めできる贅沢コースです。',
    icon: '👑',
    plans: [
      {
        minutes: 300,
        price: 47000,
        subLabel: '洗体OP無料',
        discountInfo: '初回4,000円OFF',
      },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '総額13,000円お得で洗体オプション(2,000円分)が無料の300分コースです♡ セラピストを5時間、独り占めが出来ちゃいます♫\n\n※当店ご利用初めての方は4,000円割引き',
  },
  {
    id: 'course-stay',
    name: 'お泊りコース',
    description: '通常の120分コースが含まれ、それ以外の時間はお食事やデートなどに。',
    icon: '🌙',
    plans: [
      { minutes: 600, price: 55000, subLabel: '10時間' },
      { minutes: 720, price: 65000, subLabel: '12時間' },
      { minutes: 840, price: 75000, subLabel: '14時間' },
      { minutes: 960, price: 85000, subLabel: '16時間' },
      { minutes: 1080, price: 95000, subLabel: '18時間' },
    ],
    extensionPer30min: 6000, // 通常コースと同様
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '※通常の120分コースが含まれています、それ以外の時間はお食事やデートなどにご利用下さい。\n料金設定がとてもお得なコースになっておりますので、常識の範囲内でセラピストへ休息を与えて頂けると幸いです。(5〜6時間目安の睡眠時間)\nデート代お食事代はお客様ご負担でお願い致します。\n\n※大変お得なコースのため上限は18時間とさせて頂きます、18時間以上ご利用の場合は通常コースと同様に30分6,000円単位でのご利用料金が発生致しますので予めご確認ください。',
  },
  {
    id: 'course-date',
    name: 'デートコース',
    description: 'お食事やショッピング等のデートをお楽しみいただき、気持ちがほぐれた所でホテルへ。',
    icon: '🍰',
    plans: [
      { minutes: 180, price: 32000 },
      { minutes: 240, price: 42000, subLabel: '洗体OP無料' },
      { minutes: 300, price: 50000, subLabel: '洗体OP無料' },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      'いきなりホテルに入るのが抵抗ある方は、外でお食事やショッピング等のデートをお楽しみいただき、気持ちがほぐれた所でホテルへ♫\n240分以上のデートコースで洗体オプション(2,000円分)が無料です♡\n\n※コース時間に施術も含まれます。\nデート代、お食事代はお客様ご負担でお願い致します。',
  },
  {
    id: 'course-new',
    name: '新苺コース（90分）',
    description: '入店してまもない新人さんを格安のご利用料金にてご案内。',
    icon: '🌱',
    plans: [{ minutes: 90, price: 10000 }],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '入店してまもない新人さんを格安のご利用料金にてご案内させて頂きます♫ まだ淡い苺のセラピストさんをお客様色に染め上げてください☆',
  },
  {
    id: 'course-couple',
    name: 'カップルコース（60分〜）',
    description:
      '女性のお客様、男性のお客様、当店セラピストの3名にてご案内。日常ではありえない非現実的なプレイを。',
    icon: '👩‍❤️‍👨',
    plans: [
      { minutes: 60, price: 19000 },
      { minutes: 90, price: 28000 },
      { minutes: 120, price: 37000 },
    ],
    extensionPer30min: 10000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '女性のお客様、男性のお客様、当店セラピストの3名にてご案内をさせていただきます♫\nお客様のご要望通りにサービスを行いますので、日常ではありえない非現実的なプレイをお楽しみください♡',
  },
  {
    id: 'course-3p',
    name: '3Pコース（セラピスト2人 90分〜）',
    description:
      'お客様おひとりに対してセラピストが2名にて施術をする、まさに夢のようなコースです。',
    icon: '👯‍♀️',
    plans: [
      { minutes: 90, price: 30000 },
      { minutes: 120, price: 40000 },
    ],
    extensionPer30min: 10000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      'お客様おひとりに対してセラピストが2名にて施術をする、まさに夢のようなコースです♫ 当店の極楽コースを是非一度ご堪能ください☆\n\n※セラピストによって3Pコース対応不可の場合がありますので、ご指名の場合はお店までお問い合わせ下さいませ。',
  },
  {
    id: 'course-travel',
    name: 'トラベルコース',
    description: '3泊目以上のご旅行プランとなる場合は要相談。',
    icon: '✈️',
    plans: [
      { minutes: 1440, price: 100000, subLabel: '24時間以内' },
      { minutes: 1800, price: 125000, subLabel: '30時間以内' },
      { minutes: 2160, price: 150000, subLabel: '36時間以内' },
      { minutes: 2520, price: 175000, subLabel: '42時間以内' },
      { minutes: 2880, price: 200000, subLabel: '48時間以内' },
      { minutes: 3240, price: 225000, subLabel: '54時間以内' },
      { minutes: 3600, price: 250000, subLabel: '60時間以内' },
    ],
    extensionPer30min: 6000,
    designationFees: { free: 0, first: 1000, follow: 1000 },
    notes:
      '※交通費、飲食費、交遊費など、旅行中にかかる基本的な費用はお客様のご負担となります。\n\n※兼業の関係上トラベル対応が難しいセラピストもおりますので、事務局またはセラピスト本人までお気軽にお問い合わせください。\n\n※お泊まりコース同様、セラピストの睡眠時間を常識の範囲内(1日あたり5〜6時間)にて頂けますと幸いです。\n\n※大変お得なコースのため、トラベルコースには施術は含まれておりません、施術をご希望のお客様は通常の施術コースを60分コースから追加にてご提供が可能ですので、担当セラピスト又はお店までお気軽にご相談くださいませ。\n※メール、LINEも対応しておりますが、順次対応をしておりますので返信が遅くなる恐れがございます。当日予約などお急ぎの方はお電話頂いた方が対応が早く、ご案内がスムーズです。',
  },
];

export const MOCK_TRANSPORT_AREAS: TransportItem[] = [
  { id: 'tr1', area: '東京23区', price: 1000, label: '1,000円エリア' },
  { id: 'tr2', area: '東京23区外', price: 2000, label: '2,000円エリア' },
  { id: 'tr3', area: 'その他、関東近郊', price: 3000, label: '3,000円エリア' },
  {
    id: 'tr4',
    area: 'タクシー代',
    price: 'negotiable',
    label: '応相談',
    note: '深夜利用の場合、駅から遠方の場合など',
  },
];

export const MOCK_OPTIONS: OptionItem[] = [
  {
    id: 'o1',
    name: '指名料',
    description:
      '当店は全セラピスト一律の指名料金です♫ 特にご希望がなければ無料となりますので、受付時に年齢、タイプなどセラピストさんのご希望をお気軽にお伝えください☆',
    price: 1000,
  },
  {
    id: 'o2',
    name: '洗体オプション',
    description: 'お風呂にてお客様のお身体を丁寧に、そしていやらしく洗体をさせて頂きます♡',
    price: 2000,
    isRelative: true,
  },
  {
    id: 'o3',
    name: 'ドMオプション',
    description:
      '「目一杯男性に虐められたい」その非日常の願望を叶えます☆ 通常プレイよりもゾクゾク感10倍間違い無し！',
    price: 2000,
    isRelative: true,
  },
  {
    id: 'o4',
    name: 'アイラインタッチ無し',
    description:
      '女性風俗に対して抵抗のあるお客様でも、ご安心してご利用頂けるオプションとなります。',
    price: -1000,
    isRelative: true,
  },
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cp1',
    title: '初回限定！最大4,000円OFF',
    description:
      '120〜180分コースで2,000円引、240分コース以上なら4,000円引！対象コースからお値引きいたします♫',
    imageUrl:
      'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'WELCOME DISCOUNT',
    priceInfo: 'MAX 4,000円引',
  },
  {
    id: 'cp2',
    title: '口コミ＆アンケート割引',
    description:
      '口コミとアンケートの両方ご記入で、次回1,000円引！短文でも大歓迎です。他割引との併用も可能♫',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    needEntry: true,
    accentText: 'REVIEW & SURVEY',
    priceInfo: '1,000円引',
  },
  {
    id: 'cp3',
    title: 'お友達紹介割引',
    description: 'ご紹介者様・お友達の双方ともコース料金から1,000円引！LINE予約時にお伝えください♫',
    imageUrl:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    needEntry: true,
    accentText: 'REFER A FRIEND',
    priceInfo: '1,000円引',
  },
  {
    id: 'cp4',
    title: '遠方のお客様限定割引',
    description:
      '関東外からお越しの方、150分以上のご利用で2,000円引！新幹線等のチケットをご提示ください♫',
    imageUrl:
      'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'TRAVELER DISCOUNT',
    priceInfo: '2,000円引',
  },
  {
    id: 'cp5',
    title: 'お誕生日特別割引',
    description:
      '誕生月なら180分以上のコースが5,000円引！口コミ割併用で最大6,000円もお得にお祝いさせてください♡',
    imageUrl:
      'https://images.unsplash.com/photo-1530103862676-fa394024a06b?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'BIRTHDAY SPECIAL',
    priceInfo: '5,000円引',
  },
  {
    id: 'cp6',
    title: '毎月15日は「苺DAY」',
    description:
      '月に一度の究極特売！120分コースを15,000円でご提供☆合言葉「イチゴDAY！」をお忘れなく♫',
    imageUrl:
      'https://images.unsplash.com/photo-1464965224025-20ac7fd8367d?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'ICHIGO DAY (15th)',
    priceInfo: '15,000円均一',
  },
  {
    id: 'cp7',
    title: '2/16 創立記念感謝祭',
    description:
      '全てのお客様に感謝を込めて。全コース施術10分延長サービス＆指名料を無料サービスしちゃいます☆',
    imageUrl:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'ANNIVERSARY (2/16)',
    priceInfo: '10分＋指名無料',
  },
  {
    id: 'cp8',
    title: '7/13 齊藤店長生誕祭',
    description:
      '当日の受付・ご利用限定！全コース施術時間を10分間無料サービスいたします♪みんなでお祝いしましょう！',
    imageUrl:
      'https://images.unsplash.com/photo-1464349153735-7db51edc3944?auto=format&fit=crop&q=80&w=800',
    needEntry: false,
    accentText: 'MANAGER BDAY (7/13)',
    priceInfo: '10分サービス',
  },
];
