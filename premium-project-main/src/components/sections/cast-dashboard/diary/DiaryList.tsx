import React from 'react';
import { Edit, Trash2, Calendar, Plus } from 'lucide-react';
import { CastDiary } from '@/types/cast';

interface DiaryListProps {
  diaries: CastDiary[];
  onEdit: (diary: CastDiary) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function DiaryList({ diaries, onEdit, onDelete, onCreate }: DiaryListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatCreatedAt = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
      date.getMinutes()
    ).padStart(2, '0')}`;
  };

  return (
    <div className="relative space-y-4">
      {diaries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-pink-100 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
            まだ日記がありません
          </h3>
          <p className="text-gray-500 text-sm">最初の写メ日記を投稿してみましょう！</p>
        </div>
      ) : (
        diaries.map((diary) => (
          <div
            key={diary.id}
            className="relative bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-pink-100"
          >
            {/* 編集・削除ボタン */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                onClick={() => onEdit(diary)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(diary.id)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 truncate">
                {diary.title}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                <span>{formatDate(diary.createdAt)}</span>
                <span>投稿: {formatCreatedAt(diary.createdAt)}</span>
              </div>
            </div>

            {/* Images */}
            {diary.images.length > 0 && (
              <div className="mb-4">
                <div
                  className={`grid gap-2 ${
                    diary.images.length === 1
                      ? 'grid-cols-1'
                      : diary.images.length === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}
                >
                  {diary.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
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
              <div className="text-xs text-gray-500">ID: {diary.id}</div>
            </div>
          </div>
        ))
      )}

      {/* ✅ 共通の新規投稿ボタン（右下固定） */}
      <button
        onClick={onCreate}
        className="fixed bottom-20 right-6 flex items-center px-4 py-2 bg-pink-500 text-white text-base rounded-full shadow-lg hover:bg-pink-600 transition z-50"
      >
        <Plus className="w-5 h-5 mr-2" />
        投稿
      </button>
    </div>
  );
}
