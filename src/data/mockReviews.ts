export interface Review {
  id: string;
  userName: string;
  ageGroup: string;
  castName: string;
  shopLocation: string;
  rating: number;
  purposeTags: string[];
  reviewText: string;
  postDate: string;
  likeCount: number;
  isVerified: boolean;
  visitCount: string;
  readTime: string;
  emotion: string;
}

export const mockReviews: Review[] = [
  {
    id: 'review_001',
    userName: 'さくらさん',
    ageGroup: '30代前半',
    castName: '健太',
    shopLocation: '東京店',
    rating: 5.0,
    purposeTags: ['癒し', '初めて利用'],
    reviewText: '初めての利用でしたが、とても丁寧で優しい対応をしていただきました。緊張していた私にも気を遣ってくださり、本当に癒されました。仕事で疲れきっていた心が、すっと軽くなりました。また機会があれば、ぜひお願いしたいと思います。',
    postDate: '2024-12-01',
    likeCount: 123,
    isVerified: true,
    visitCount: '初回利用',
    readTime: '約45秒',
    emotion: 'pampered'
  },
  {
    id: 'review_002',
    userName: 'みゆきさん',
    ageGroup: '40代',
    castName: '翔太',
    shopLocation: '東京店',
    rating: 4.8,
    purposeTags: ['話を聞いてもらいたい', 'リピート利用'],
    reviewText: '今回で3回目の利用になります。翔太さんは本当に話を聞くのが上手で、どんな些細なことでも真剣に聞いてくださいます。家族や友人にも話せないような悩みを聞いてもらえて、心がとても軽くなりました。',
    postDate: '2024-11-28',
    likeCount: 87,
    isVerified: true,
    visitCount: '3回目',
    readTime: '約35秒',
    emotion: 'listen'
  },
  {
    id: 'review_003',
    userName: 'あやかさん',
    ageGroup: '20代後半',
    castName: '大輝',
    shopLocation: '大阪店',
    rating: 5.0,
    purposeTags: ['非日常体験', '初めて利用'],
    reviewText: '想像以上の素敵な時間を過ごすことができました。とても紳士的で、女性として大切に扱ってもらえました。普段の生活では味わえない特別な時間で、まるで映画の世界にいるような気分でした。勇気を出して利用してよかったです。',
    postDate: '2024-11-25',
    likeCount: 156,
    isVerified: true,
    visitCount: '初回利用',
    readTime: '約40秒',
    emotion: 'fantasy'
  },
  {
    id: 'review_004',
    userName: 'ゆりさん',
    ageGroup: '40代',
    castName: '翔太',
    shopLocation: '東京店',
    rating: 4.9,
    purposeTags: ['元気をもらいたい', 'リピート利用'],
    reviewText: '翔太さんの明るい笑顔に、いつも元気をもらっています。どんなに疲れていても、翔太さんと過ごす時間は本当に楽しくて、自然と笑顔になれます。今日も明日からまた頑張ろうと思えました。',
    postDate: '2024-11-22',
    likeCount: 92,
    isVerified: true,
    visitCount: '5回目',
    readTime: '約30秒',
    emotion: 'cheerful'
  },
  {
    id: 'review_005',
    userName: 'まりさん',
    ageGroup: '30代後半',
    castName: '健太',
    shopLocation: '東京店',
    rating: 5.0,
    purposeTags: ['癒し', 'リピート利用'],
    reviewText: '健太さんには本当にいつもお世話になっています。優しい声と温かい雰囲気で、まるで恋人のように接してくださいます。日常の疲れやストレスを全て忘れさせてくれる、かけがえのない時間です。',
    postDate: '2024-11-20',
    likeCount: 134,
    isVerified: true,
    visitCount: '7回目',
    readTime: '約35秒',
    emotion: 'pampered'
  },
  {
    id: 'review_006',
    userName: 'かなさん',
    ageGroup: '20代前半',
    castName: '大輝',
    shopLocation: '大阪店',
    rating: 4.7,
    purposeTags: ['話を聞いてもらいたい', '初めて利用'],
    reviewText: '友人にも話せない悩みを抱えていましたが、大輝さんが親身になって聞いてくださいました。判断せずに、ただ寄り添ってくれる姿勢に心から感謝しています。一人で抱え込んでいた重荷が軽くなりました。',
    postDate: '2024-11-18',
    likeCount: 78,
    isVerified: true,
    visitCount: '初回利用',
    readTime: '約40秒',
    emotion: 'listen'
  }
];