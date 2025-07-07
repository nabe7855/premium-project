import { Cast, Review } from '@/types/casts';

export const mockCasts: Cast[] = [
  {
    id: '1',
    name: '田中太郎',
    catchphrase: '優しさに包まれる至福の時間',
    avatar:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    age: 28,
    rating: 4.9,
    reviewCount: 23,
    isOnline: true,
    tags: ['とことん甘やかされたい', '仕事を忘れる時間', '癒しの時間'],
    profile: {
      introduction:
        '心の疲れを癒す特別な時間を提供いたします。お客様一人ひとりのペースに合わせて、ゆったりとした時間をお過ごしください。',
      experience: '3年間の経験で培った、お客様の心に寄り添うサービスを心がけております。',
      specialties: ['リラクゼーション', 'カウンセリング', 'アロマテラピー'],
      hobbies: ['読書', '映画鑑賞', 'ヨガ'],
    },
    story:
      '忙しい日常から離れ、心の安らぎを求めるお客様に寄り添い続けて3年。一人ひとりの大切な時間を、最高の癒しで満たしたいと思っています。',
    availability: generateSchedule(),
    radarData: [
      { label: 'イケメン度', value: 4.5, emoji: '💖' },
      { label: 'ユーモア力', value: 4.0, emoji: '🎭' },
      { label: '傾聴力', value: 4.8, emoji: '👂' },
      { label: 'テクニック', value: 4.2, emoji: '🔥' },
      { label: '癒し度', value: 4.9, emoji: '🌿' },
      { label: '余韻力', value: 4.6, emoji: '✨' },
    ],
  },
  {
    id: '2',
    name: '佐藤次郎',
    catchphrase: '記念日を特別な思い出に',
    avatar:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    age: 32,
    rating: 4.8,
    reviewCount: 31,
    isOnline: false,
    tags: ['記念日デート', '大人の贅沢', '特別な時間'],
    profile: {
      introduction: '特別な日をより特別にする、心に残るひとときをご提供いたします。',
      experience: '5年間の経験で、数多くの記念日を演出してまいりました。',
      specialties: ['イベント演出', 'エスコート', 'ワインソムリエ'],
      hobbies: ['料理', 'ワイン', 'ピアノ'],
    },
    story:
      '大切な記念日や特別な日を、忘れられない思い出にしたい。そんな想いで、一つひとつの出会いを大切にしています。',
    availability: generateSchedule(),
    radarData: [
      { label: 'イケメン度', value: 4.7, emoji: '💖' },
      { label: 'ユーモア力', value: 4.3, emoji: '🎭' },
      { label: '傾聴力', value: 4.1, emoji: '👂' },
      { label: 'テクニック', value: 4.6, emoji: '🔥' },
      { label: '癒し度', value: 4.2, emoji: '🌿' },
      { label: '余韻力', value: 4.8, emoji: '✨' },
    ],
  },
  {
    id: '3',
    name: '鈴木三郎',
    catchphrase: '心の扉を開く安らぎの時間',
    avatar:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    age: 29,
    rating: 4.7,
    reviewCount: 18,
    isOnline: true,
    tags: ['心の癒し', '深い会話', '信頼関係'],
    profile: {
      introduction:
        '心の奥底にある想いを大切に、深い信頼関係を築きながら特別な時間をお過ごしいただきます。',
      experience: '心理学を学び、2年間の実践経験を積んでおります。',
      specialties: ['心理カウンセリング', '傾聴', 'メンタルケア'],
      hobbies: ['心理学', '瞑想', 'ガーデニング'],
    },
    story:
      '心の支えが欲しい時、誰かに話を聞いてもらいたい時。そんな心の声に寄り添い、安らぎの時間をお届けします。',
    availability: generateSchedule(),
    radarData: [
      { label: 'イケメン度', value: 4.1, emoji: '💖' },
      { label: 'ユーモア力', value: 3.8, emoji: '🎭' },
      { label: '傾聴力', value: 4.9, emoji: '👂' },
      { label: 'テクニック', value: 4.0, emoji: '🔥' },
      { label: '癒し度', value: 4.8, emoji: '🌿' },
      { label: '余韻力', value: 4.4, emoji: '✨' },
    ],
  },
];

// 直近2週間のスケジュールを生成する関数
function generateSchedule() {
  const schedule: { [key: string]: string[] } = {};
  const today = new Date();

  // 直近14日間のスケジュールを生成
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    // ランダムに出勤日を決定（70%の確率で出勤）
    if (Math.random() > 0.3) {
      const possibleTimes = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

      // ランダムに2-4個の時間枠を選択
      const numSlots = Math.floor(Math.random() * 3) + 2;
      const selectedTimes = possibleTimes
        .sort(() => 0.5 - Math.random())
        .slice(0, numSlots)
        .sort();

      schedule[dateString] = selectedTimes;
    }
  }

  return schedule;
}

export const mockReviews: Review[] = [
  {
    id: '1',
    castId: '1',
    rating: 5,
    comment: '素晴らしい時間を過ごすことができました。田中さんの温かい人柄に癒されました。',
    date: '2024-12-01',
    author: '匿名希望',
    tags: ['癒された', 'また会いたい', 'プロ意識'],
  },
  {
    id: '2',
    castId: '1',
    rating: 5,
    comment: '忙しい日常を忘れて、心からリラックスできました。ありがとうございました。',
    date: '2024-11-28',
    author: '匿名希望',
    tags: ['時間を忘れる', '癒された', 'リラックス'],
  },
  {
    id: '3',
    castId: '2',
    rating: 5,
    comment: '記念日を特別な思い出にしていただき、感謝しています。最高の時間でした。',
    date: '2024-12-03',
    author: '匿名希望',
    tags: ['記念日に利用', '特別な時間', 'プロ意識'],
  },
];

export const flavorTags = [
  'とことん甘やかされたい',
  '仕事を忘れる時間',
  '記念日デート',
  '癒しの時間',
  '大人の贅沢',
  '心の癒し',
  '深い会話',
  '信頼関係',
  '特別な時間',
  'リラックス',
];
