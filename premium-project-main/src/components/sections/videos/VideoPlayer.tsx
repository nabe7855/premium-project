import React, { useState, useEffect } from 'react';
import { X, Heart, Share2, SkipBack, SkipForward, Play, Pause, Volume2 } from 'lucide-react';
import { Video } from '@/types/videos';

interface VideoPlayerProps {
  video: Video | null;
  onClose: () => void;
  onToggleFavorite: (videoId: string) => void;
  onUpdateProgress: (videoId: string, progress: number) => void;
  currentTheme: any;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onClose,
  onToggleFavorite,
  onUpdateProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    if (video) {
      setProgress(video.watchProgress || 0);
    }
  }, [video]);

  if (!video) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    onUpdateProgress(video.id, newProgress);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-all duration-200 hover:bg-black/70"
        >
          <X size={24} />
        </button>

        {/* Video area */}
        <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
          <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />

          {/* Video overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center text-white">
              <div className="mb-4 rounded-full bg-white/20 p-6 backdrop-blur-sm">
                <Play size={48} className="ml-2 fill-white text-white" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">{video.title}</h2>
              <p className="text-lg opacity-90">{video.cast}</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-black p-6 text-white">
          {/* Progress bar */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm">{formatTime(progress)}</span>
              <span className="text-sm">{formatTime(video.duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={video.duration}
              value={progress}
              onChange={handleProgressChange}
              className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="rounded-full p-2 transition-colors hover:bg-white/10">
                <SkipBack size={24} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="rounded-full p-2 transition-colors hover:bg-white/10">
                <SkipForward size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 size={20} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="slider h-1 w-20 cursor-pointer appearance-none rounded-lg bg-gray-700"
                />
              </div>

              <button
                onClick={() => onToggleFavorite(video.id)}
                className={`rounded-full p-2 transition-colors ${
                  video.isFavorite ? 'bg-red-500 text-white' : 'hover:bg-white/10'
                }`}
              >
                <Heart size={20} className={video.isFavorite ? 'fill-current' : ''} />
              </button>

              <button className="rounded-full p-2 transition-colors hover:bg-white/10">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Video info */}
        <div className="bg-gray-900 p-6 text-white">
          <h3 className="mb-2 text-xl font-bold">{video.title}</h3>
          <p className="mb-4 text-gray-300">{video.description}</p>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span key={index} className="rounded-full bg-purple-600 px-3 py-1 text-sm text-white">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
