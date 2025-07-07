import React from 'react';
import { Heart, Edit, Trash2, Calendar } from 'lucide-react';
import { CastDiary } from '@/types/cast-dashboard';

interface DiaryListProps {
  diaries: CastDiary[];
  onEdit: (diary: CastDiary) => void;
  onDelete: (id: string) => void;
}

export default function DiaryList({ diaries, onEdit, onDelete }: DiaryListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatCreatedAt = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (diaries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-pink-100 text-center">
        <div className="text-gray-400 mb-4">
          <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
          まだ日記がありません
        </h3>
        <p className="text-gray-500 text-sm">
          最初の写メ日記を投稿してみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {diaries.map((diary) => (
        <div key={diary.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-pink-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
                {diary.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                <span>{formatDate(diary.date)}</span>
                <span>投稿: {formatCreatedAt(diary.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
              <button
                onClick={() => onEdit(diary)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => onDelete(diary.id)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Images */}
          {diary.images.length > 0 && (
            <div className="mb-4">
              <div className={`grid gap-2 ${
                diary.images.length === 1 ? 'grid-cols-1' : 
                diary.images.length === 2 ? 'grid-cols-2' : 
                'grid-cols-3'
              }`}>
                {diary.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image}
                      alt={`${diary.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap text-sm sm:text-base">
              {diary.content}
            </p>
          </div>

          {/* Tags */}
          {diary.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {diary.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-pink-100 text-pink-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-pink-600">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="text-xs sm:text-sm font-medium">{diary.likes}</span>
            </div>
            <div className="text-xs text-gray-500">
              ID: {diary.id}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}