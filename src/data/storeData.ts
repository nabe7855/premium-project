export interface StoreData {
  id: string;
  name: string;
  link: string;
  bannerImage: string;
  description: string;
  hashtags: string[];
  gradient: string;
}

export const stores: StoreData[] = [
  {
    id: 'tokyo',
    name: '東京店',
    link: '/store/tokyo',
    bannerImage: '/images/tokyo.png',
    description: '心とろける極上のひとときを、東京で。',
    hashtags: ['高級感', '癒し', '可愛さ'],
    gradient: 'from-rose-300 to-pink-400',
  },
  {
    id: 'osaka',
    name: '大阪店',
    link: '/store/osaka',
    bannerImage: '/images/osaka.png',
    description: 'え、やばい。こんな楽しいの反則やん。',
    hashtags: ['おもろい', '元気系', '親しみやすい'],
    gradient: 'from-yellow-300 to-orange-400',
  },
  {
    id: 'nagoya',
    name: '名古屋店',
    link: '/store/nagoya',
    bannerImage: '/images/nagoya.png',
    description: '誰にも言えない魅惑のご褒美。',
    hashtags: ['秘密の時間', 'ご褒美感', '大人'],
    gradient: 'from-purple-300 to-indigo-400',
  },
];
