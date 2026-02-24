import { Cast, ChartData, Store, TimeSeriesData } from '../types/dashboard';

// FIX: Populated file with mock data to resolve import errors.
// Helper function to generate time series data
const generateTimeSeries = (
  days: number,
  names: string[],
  valueGenerator: (day: number) => { [key: string]: any },
): TimeSeriesData[] => {
  return Array.from({ length: days }, (_, i) => {
    const dayName = names[i % names.length];
    return {
      name: dayName,
      ...valueGenerator(i),
    };
  });
};

// Mock Stores
export const mockStores: Store[] = [
  {
    id: 'store-1',
    name: '新宿本店',
    slug: 'shinjuku-honten',
    catchphrase: '夢のひとときを、あなたに。',
    overview: '都心に佇む最高級の癒やし空間。厳選されたキャストが、忘れられない夜を演出します。',
    address: '東京都新宿区新宿1-1-1',
    phone: '03-1234-5678',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80',
  },
  {
    id: 'store-2',
    name: '渋谷店',
    slug: 'shibuya',
    catchphrase: '流行の最先端で、最高の出会いを。',
    overview:
      '若者文化の中心、渋谷。エネルギッシュで個性的なキャストたちと共に、刺激的な時間をお過ごしください。',
    address: '東京都渋谷区渋谷2-2-2',
    phone: '03-2345-6789',
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
  },
  {
    id: 'store-3',
    name: '銀座店',
    slug: 'ginza',
    catchphrase: '本物を知る大人のための隠れ家。',
    overview:
      '洗練された街、銀座にふさわしい、落ち着きと気品に満ちた空間。上質なサービスで心ゆくまでおくつろぎください。',
    address: '東京都中央区銀座3-3-3',
    phone: '03-3456-7890',
    photoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80',
  },
  {
    id: 'store-4',
    name: '六本木店',
    slug: 'roppongi',
    catchphrase: '眠らない街で、特別な夜を。',
    overview:
      '国際色豊かな六本木で、グラマラスなひとときを。最新のエンターテイメントと共にお楽しみください。',
    address: '東京都港区六本木4-4-4',
    phone: '03-4567-8901',
    photoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
  },
];

const dailyNames = ['月', '火', '水', '木', '金', '土', '日'];
const weeklyNames = ['4週前', '3週前', '2週前', '先週'];
const monthlyNames = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];
const yearlyNames = ['3年前', '2年前', '去年'];

// Mock Chart Data
export const mockSalesData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({
    value: Math.floor(Math.random() * 200000) + 100000,
  })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 1500000) + 500000,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 5000000) + 2000000,
  })),
  yearly: generateTimeSeries(3, yearlyNames, () => ({
    value: Math.floor(Math.random() * 60000000) + 30000000,
  })),
};

export const mockAvgCogsData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({
    value: Math.floor(Math.random() * 10000) + 20000,
  })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 10000) + 22000,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 8000) + 24000,
  })),
};

export const mockNewCustomersData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({ value: Math.floor(Math.random() * 10) + 5 })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 50) + 20,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 200) + 100,
  })),
};

export const mockRepeatRateData: ChartData = {
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 10) + 65,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 10) + 68,
  })),
};

export const mockAttendanceRateData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({ value: Math.floor(Math.random() * 15) + 80 })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 10) + 82,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 5) + 85,
  })),
};

export const mockDesignationsData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({
    designations: Math.floor(Math.random() * 15) + 20,
    free: Math.floor(Math.random() * 10) + 5,
  })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    designations: Math.floor(Math.random() * 80) + 100,
    free: Math.floor(Math.random() * 40) + 20,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    designations: Math.floor(Math.random() * 300) + 400,
    free: Math.floor(Math.random() * 150) + 80,
  })),
};

// Mock data for Advertising page
export const mockInquiryData: TimeSeriesData[] = [
  { name: '電話', value: 400 },
  { name: 'LINE', value: 300 },
  { name: 'Web', value: 300 },
  { name: 'その他', value: 200 },
];

export const mockInquiriesTrendData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({ value: Math.floor(Math.random() * 10) + 5 })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 40) + 25,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 150) + 100,
  })),
};

export const mockRoiData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({ value: Math.floor(Math.random() * 30) + 180 })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 20) + 190,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 15) + 200,
  })),
};

export const mockWebAccessData: ChartData = {
  daily: generateTimeSeries(7, dailyNames, () => ({
    value: Math.floor(Math.random() * 200) + 800,
  })),
  weekly: generateTimeSeries(4, weeklyNames, () => ({
    value: Math.floor(Math.random() * 1000) + 5000,
  })),
  monthly: generateTimeSeries(12, monthlyNames, () => ({
    value: Math.floor(Math.random() * 5000) + 20000,
  })),
};

export const mockReviewStats = {
  avg: 4.6,
  total: 258,
  complaints: 5,
};

export const mockReviewDistributionData: TimeSeriesData[] = [
  { name: '★5', value: 152 },
  { name: '★4', value: 78 },
  { name: '★3', value: 20 },
  { name: '★2', value: 5 },
  { name: '★1', value: 3 },
];

// Mock Casts
export const mockCasts: Cast[] = [
  {
    id: 'cast-1',
    name: '星野 あかり',
    storeIds: ['store-1', 'store-2'],
    storePriorities: {},
    status: '在籍中',
    storeStatuses: ['店長おすすめ'],
    tags: ['癒し系', '聞き上手', 'お酒好き'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    managerComment:
      '当店のエース。彼女の笑顔は百万ドルの価値があります。お客様一人ひとりに寄り添う丁寧な接客が魅力です。',
    catchphrase: 'あなたの心を照らす一番星になりたいな',
    stats: {
      designations: 120,
      repeatRate: 85,
      breakdown: { new: 30, repeat: 85, free: 5 },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 20) + 15,
      })),
    },
  },
  {
    id: 'cast-2',
    name: '月影 凛',
    storeIds: ['store-3'],
    storePriorities: {},
    status: '在籍中',
    storeStatuses: ['レギュラー'],
    tags: ['クールビューティー', 'ミステリアス', 'ワイン好き'],
    photoUrl: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=100&q=80',
    managerComment:
      'クールな見た目とは裏腹に、話すととても気さく。知的な会話で、お客様を魅了します。ワインの知識は当店一。',
    catchphrase: '月の光のように、静かにあなたを包み込みたい',
    stats: {
      designations: 95,
      repeatRate: 78,
      breakdown: { new: 25, repeat: 60, free: 10 },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 15) + 10,
      })),
    },
  },
  {
    id: 'cast-3',
    name: '桜井 ゆうな',
    storeIds: ['store-2'],
    storePriorities: {},
    status: '在籍中',
    storeStatuses: ['新人'],
    tags: ['元気', '妹キャラ', 'アニメ好き'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80',
    managerComment:
      '期待の新人！持ち前の明るさと元気で、場の雰囲気を一気に盛り上げます。今後の成長が楽しみな逸材です。',
    catchphrase: 'お兄ちゃんのこと、ゆうなが応援しちゃう！',
    stats: {
      designations: 40,
      repeatRate: 60,
      breakdown: { new: 30, repeat: 5, free: 5 },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 10) + 2,
      })),
    },
  },
  {
    id: 'cast-4',
    name: '白鳥 麗奈',
    storeIds: ['store-1', 'store-4'],
    storePriorities: {},
    status: '在籍中',
    storeStatuses: ['レギュラー'],
    tags: ['お姉さん系', '包容力', '聞き上手'],
    photoUrl: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?w=100&q=80',
    managerComment:
      '全てを包み込むような優しさを持つキャスト。疲れた心を癒やされたいお客様からの絶大な支持を得ています。',
    catchphrase: '頑張りすぎなあなたへ、癒やしの時間をプレゼント',
    stats: {
      designations: 110,
      repeatRate: 82,
      breakdown: { new: 20, repeat: 80, free: 10 },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 18) + 12,
      })),
    },
  },
  {
    id: 'cast-5',
    name: '黒崎 蘭',
    storeIds: ['store-4'],
    storePriorities: {},
    status: '離籍',
    storeStatuses: ['レギュラー'],
    tags: ['小悪魔', 'ミステリアス', '刺激的'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    managerComment:
      'お客様を翻弄する小悪魔的な魅力で人気を博しましたが、本人の都合により離籍となりました。',
    catchphrase: '退屈な夜は、私が終わらせてあげる',
    stats: {
      designations: 88,
      repeatRate: 75,
      breakdown: { new: 40, repeat: 40, free: 8 },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 15) + 8,
      })),
    },
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `cast-${i + 6}`,
    name: `サンプルキャスト ${i + 6}`,
    storeIds: [`store-${(i % 4) + 1}`],
    storePriorities: {},
    status: i % 5 === 0 ? ('離籍' as const) : ('在籍中' as const),
    storeStatuses: [['レギュラー', '新人', '店長おすすめ'][i % 3]],
    tags: ['サンプル', 'テスト'],
    photoUrl: `https://i.pravatar.cc/100?u=cast${i + 6}`,
    managerComment: 'これはサンプルキャストのコメントです。',
    catchphrase: `サンプルキャスト${i + 6}のキャッチコピーです。`,
    stats: {
      designations: Math.floor(Math.random() * 100),
      repeatRate: Math.floor(Math.random() * 50) + 40,
      breakdown: {
        new: Math.floor(Math.random() * 30),
        repeat: Math.floor(Math.random() * 60),
        free: Math.floor(Math.random() * 10),
      },
      monthlyPerformance: generateTimeSeries(6, ['1月', '2月', '3月', '4月', '5月', '6月'], () => ({
        value: Math.floor(Math.random() * 20),
      })),
    },
  })),
];

// Mock Tags
export const mockTags: string[] = [
  '癒し系',
  '聞き上手',
  'お酒好き',
  'クールビューティー',
  'ミステリアス',
  'ワイン好き',
  '元気',
  '妹キャラ',
  'アニメ好き',
  'お姉さん系',
  '包容力',
  '小悪魔',
  '刺激的',
  'インテリ',
  'スポーツ好き',
  'ゲーム好き',
  '音楽好き',
  '天然',
  'S系',
  'M系',
];
