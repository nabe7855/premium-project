import React, { useState, useRef, useEffect } from 'react';
import { Heart, Play, Clock, Eye, Volume2 } from 'lucide-react';
import { Video } from '@/types/videos';

interface VideoCardProps {
  video: Video;
  onToggleFavorite: (videoId: string) => void;
  onPlay: (video: Video) => void;
  currentTheme: any;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onToggleFavorite, 
  onPlay,
  currentTheme 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 1000);
    } else {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowPreview(false);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(video.id);
  };

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105
        ${currentTheme.cardBg} hover:shadow-xl cursor-pointer
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
            <Play size={24} className="text-white fill-white ml-1 sm:ml-1" />
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs sm:text-sm flex items-center gap-1">
          <Clock size={12} />
          {formatDuration(video.duration)}
        </div>
        
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`
            absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-300
            ${video.isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
            }
          `}
        >
          <Heart 
            size={16} 
            className={video.isFavorite ? 'fill-current' : ''} 
          />
        </button>
        
        {/* Preview indicator */}
        {showPreview && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 animate-pulse">
            <Volume2 size={12} />
            <span className="hidden sm:inline">音声プレビュー</span>
            <span className="sm:hidden">プレビュー</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className={`font-bold text-base sm:text-lg mb-2 line-clamp-2 ${currentTheme.text}`}>
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${currentTheme.text} opacity-80`}>
            {video.cast}
          </span>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
            <Eye size={12} />
            {video.viewCount.toLocaleString()}
          </div>
        </div>
        
        <p className={`text-xs sm:text-sm ${currentTheme.text} opacity-70 line-clamp-2 mb-3`}>
          {video.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {video.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Progress bar if previously watched */}
        {video.watchProgress && video.watchProgress > 0 && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(video.watchProgress / video.duration) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              続きから: {formatDuration(video.watchProgress)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};