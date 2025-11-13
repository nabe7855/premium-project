'use client';
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/sections/videos/Header';
import { MoodSelector } from '@/components/sections/videos/MoodSelector';
import { SortSelector } from '@/components/sections/videos/SortSelector';
import { VideoCard } from '@/components/sections/videos/VideoCard';
import { VideoPlayer } from '@/components/sections/videos/VideoPlayer';
import { ParticleBackground } from '@/components/sections/videos/ParticleBackground';
import { useTimeBasedTheme } from '@/hooks/useTimeBasedTheme';
import { useVideoData } from '@/hooks/useVideoData';
import { Video } from '@/types/videos';

function App() {
  const { currentTheme, isNightMode } = useTimeBasedTheme();
  const { videos, favorites, toggleFavorite, updateViewHistory } = useVideoData();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(videos);
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    let filtered = videos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.cast.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Filter by mood
    if (selectedMood) {
      filtered = filtered.filter((video) => {
        switch (selectedMood) {
          case 'healing':
            return video.category === 'healing' || video.mood === 'calm';
          case 'romance':
            return video.category === 'romance' || video.mood === 'romantic';
          case 'motivation':
            return video.category === 'motivation' || video.mood === 'energetic';
          case 'sleep':
            return (
              video.category === 'sleep' || video.category === 'asmr' || video.mood === 'sleepy'
            );
          default:
            return true;
        }
      });
    }

    // Sort videos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Favorites first, then by upload date
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'popular':
          // Favorites first, then by view count
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return b.viewCount - a.viewCount;
        case 'favorites':
          // Favorites first, then by view count
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return b.viewCount - a.viewCount;
        default:
          return b.viewCount - a.viewCount;
      }
    });

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedMood, sortBy]);

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    if (hour < 21) return 'こんばんは';
    return 'お疲れ様でした';
  };

  const getResultsText = () => {
    const total = filteredVideos.length;
    let text = `${total}件の動画`;

    if (selectedMood) {
      const moodText =
        {
          healing: '癒し系',
          romance: 'ロマンス系',
          motivation: '励まし系',
          sleep: 'おやすみ系',
        }[selectedMood] || '';
      text += ` (${moodText})`;
    }

    if (searchTerm) {
      text += ` 「${searchTerm}」の検索結果`;
    }

    return text;
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.background} transition-all duration-1000`}
    >
      <ParticleBackground isNightMode={isNightMode} />

      <div className="relative z-10">
        <Header
          currentTheme={currentTheme}
          isNightMode={isNightMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          favoriteCount={favorites.length}
        />

        <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-8">
          {/* Welcome message */}
          <div className="mb-6 text-center sm:mb-8">
            <h2 className={`mb-2 text-2xl font-bold sm:text-3xl ${currentTheme.text}`}>
              {getGreeting()}
            </h2>
            <p className={`text-base sm:text-lg ${currentTheme.text} opacity-80`}>
              {isNightMode
                ? '今日もお疲れ様でした。ゆっくりとお過ごしください。'
                : 'あなたの特別な時間をお手伝いします。'}
            </p>
          </div>

          {/* Mood selector */}
          <MoodSelector onMoodSelect={handleMoodSelect} currentTheme={currentTheme} />

          {/* Sort selector */}
          <SortSelector
            currentSort={sortBy}
            onSortChange={handleSortChange}
            currentTheme={currentTheme}
          />

          {/* Results summary */}
          <div className="mb-4 sm:mb-6">
            <p className={`text-sm ${currentTheme.text} opacity-70`}>{getResultsText()}</p>
          </div>

          {/* Video grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onToggleFavorite={toggleFavorite}
                onPlay={handleVideoPlay}
                currentTheme={currentTheme}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredVideos.length === 0 && (
            <div className="py-8 text-center sm:py-12">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xl font-bold text-white sm:h-24 sm:w-24 sm:text-2xl">
                SB
              </div>
              <h3 className={`mb-2 text-lg font-bold sm:text-xl ${currentTheme.text}`}>
                動画が見つかりませんでした
              </h3>
              <p className={`text-sm sm:text-base ${currentTheme.text} opacity-70`}>
                検索条件や並び順を変更してみてください
              </p>
            </div>
          )}
        </main>

        {/* Video player modal */}
        <VideoPlayer
          video={selectedVideo}
          onClose={handleClosePlayer}
          onToggleFavorite={toggleFavorite}
          onUpdateProgress={updateViewHistory}
          currentTheme={currentTheme}
        />
      </div>
    </div>
  );
}

export default App;
