import { useState, useEffect } from 'react';
import { Video } from '@/types/videos';

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'おやすみボイス - 優しい声で一日の疲れを癒して',
    cast: '佐藤誠',
    thumbnail:
      'https://images.pexels.com/photos/7242411/pexels-photo-7242411.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/7242411/pexels-photo-7242411.jpeg',
    duration: 1200,
    category: 'sleep',
    mood: 'sleepy',
    tags: ['おやすみ', '癒し', 'ASMR'],
    description: '疲れた一日の終わりに、優しい声で心を癒します',
    uploadDate: new Date('2024-02-15'),
    viewCount: 1250,
    isFavorite: false,
  },
  {
    id: '2',
    title: '元気が出るモーニングコール - 新しい一日を始めよう',
    cast: '田中陽太',
    thumbnail:
      'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1056251/pexels-photo-1056251.jpeg',
    duration: 900,
    category: 'motivation',
    mood: 'energetic',
    tags: ['モーニング', '元気', 'ポジティブ'],
    description: '爽やかな朝の始まりに、前向きな気持ちになれる応援メッセージ',
    uploadDate: new Date('2024-02-20'),
    viewCount: 980,
    isFavorite: true,
  },
  {
    id: '3',
    title: 'ロマンチックなお食事デート - 君だけの特別な時間',
    cast: '山田玲央',
    thumbnail:
      'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg',
    duration: 1800,
    category: 'romance',
    mood: 'romantic',
    tags: ['デート', 'ロマンス', '特別'],
    description: '特別な夜に、あなただけのためのロマンチックな時間を',
    uploadDate: new Date('2024-02-25'),
    viewCount: 1450,
    isFavorite: false,
  },
  {
    id: '4',
    title: 'カフェでのんびり - 雨の日のリラックスタイム',
    cast: '小林海斗',
    thumbnail:
      'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg',
    duration: 1500,
    category: 'healing',
    mood: 'calm',
    tags: ['カフェ', 'リラックス', '雨'],
    description: '雨の日のカフェで、心地よい時間を一緒に過ごしませんか',
    uploadDate: new Date('2024-01-30'),
    viewCount: 875,
    isFavorite: true,
  },
  {
    id: '5',
    title: 'お疲れ様でした - 頑張ったあなたへの応援メッセージ',
    cast: '鈴木翼',
    thumbnail:
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
    duration: 1100,
    category: 'healing',
    mood: 'calm',
    tags: ['お疲れ様', '応援', '癒し'],
    description: '今日も一日お疲れ様。あなたの頑張りを認めて労います',
    uploadDate: new Date('2024-02-05'),
    viewCount: 1180,
    isFavorite: false,
  },
  {
    id: '6',
    title: 'ASMR囁き声 - 耳元で優しく語りかけて',
    cast: '高橋蓮',
    thumbnail:
      'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg',
    duration: 2000,
    category: 'asmr',
    mood: 'sleepy',
    tags: ['ASMR', '囁き', '耳元'],
    description: 'リラックスできるASMR体験で、深い眠りへと誘います',
    uploadDate: new Date('2024-02-10'),
    viewCount: 1680,
    isFavorite: true,
  },
  {
    id: '7',
    title: '朝のストレッチタイム - 一緒に体を動かそう',
    cast: '青木健太',
    thumbnail:
      'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg',
    duration: 1350,
    category: 'motivation',
    mood: 'energetic',
    tags: ['ストレッチ', '健康', '朝活'],
    description: '爽やかな朝に、一緒に体を動かして素敵な一日をスタート',
    uploadDate: new Date('2024-02-28'),
    viewCount: 720,
    isFavorite: false,
  },
  {
    id: '8',
    title: '読書の時間 - 君のために詩を読んであげる',
    cast: '伊藤雅人',
    thumbnail:
      'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    previewUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg',
    duration: 1650,
    category: 'romance',
    mood: 'romantic',
    tags: ['読書', '詩', '文学'],
    description: '美しい詩の朗読で、心に響く特別なひとときを',
    uploadDate: new Date('2024-02-12'),
    viewCount: 1320,
    isFavorite: false,
  },
];

export const useVideoData = () => {
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewHistory, setViewHistory] = useState<
    Record<string, { watchProgress: number; lastWatched: Date }>
  >({});

  useEffect(() => {
    const savedFavorites = localStorage.getItem('strawberry-boys-favorites');
    const savedHistory = localStorage.getItem('strawberry-boys-history');

    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(favoriteIds);

      // Update videos with favorite status
      setVideos((prev) =>
        prev.map((video) => ({
          ...video,
          isFavorite: favoriteIds.includes(video.id),
        })),
      );
    }

    if (savedHistory) {
      setViewHistory(JSON.parse(savedHistory));
    }
  }, []);

  const toggleFavorite = (videoId: string) => {
    setVideos((prev) =>
      prev.map((video) =>
        video.id === videoId ? { ...video, isFavorite: !video.isFavorite } : video,
      ),
    );

    setFavorites((prev) => {
      const newFavorites = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];

      localStorage.setItem('strawberry-boys-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const updateViewHistory = (videoId: string, progress: number) => {
    const newHistory = {
      ...viewHistory,
      [videoId]: { watchProgress: progress, lastWatched: new Date() },
    };

    setViewHistory(newHistory);
    localStorage.setItem('strawberry-boys-history', JSON.stringify(newHistory));

    // Update video with watch progress
    setVideos((prev) =>
      prev.map((video) => (video.id === videoId ? { ...video, watchProgress: progress } : video)),
    );
  };

  return {
    videos,
    favorites,
    viewHistory,
    toggleFavorite,
    updateViewHistory,
  };
};
