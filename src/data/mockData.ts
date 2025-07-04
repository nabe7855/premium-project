import { CastMember, NewsItem } from '@/types/store';

export const mockCastMembers: CastMember[] = [
  {
    id: '1',
    name: '翔太',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    isWorking: true,
    schedule: '18:00-24:00'
  },
  {
    id: '2',
    name: '健太郎',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    isWorking: true,
    schedule: '19:00-翌2:00'
  },
  {
    id: '3',
    name: '遼',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    isWorking: true,
    schedule: '20:00-翌3:00'
  },
  {
    id: '4',
    name: '大輝',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    isWorking: true,
    schedule: '18:30-翌1:00'
  },
  {
    id: '5',
    name: '颯斗',
    image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    isWorking: true,
    schedule: '19:30-翌2:30'
  }
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '新人キャスト「蒼」デビュー決定！',
    date: '2025-01-13',
    category: 'new-staff',
    excerpt: '爽やかな笑顔が魅力的な新人キャストが仲間入り。初回限定特典もご用意しています。'
  },
  {
    id: '2',
    title: '新春キャンペーン開催中',
    date: '2025-01-12',
    category: 'event',
    excerpt: '1月31日まで特別料金でご利用いただけます。この機会をお見逃しなく。'
  },
  {
    id: '3',
    title: '翔太の写メ日記更新',
    date: '2025-01-13',
    category: 'diary',
    excerpt: '今日のコーディネートとお気に入りのカフェをご紹介！プライベートな一面をお楽しみください。'
  },
  {
    id: '4',
    title: '雑誌「Tokyo Night」に掲載されました',
    date: '2025-01-10',
    category: 'media',
    excerpt: '人気月刊誌の特集ページに当店が紹介されました。記事の詳細をチェック！'
  }
];