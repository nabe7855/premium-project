import { CastDiary } from '@/types/cast';
import { Calendar, Edit, Plus, Trash2 } from 'lucide-react';

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
      date.getMinutes(),
    ).padStart(2, '0')}`;
  };

  const getStatusBadge = (status?: string, publishedAt?: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
            下書き
          </span>
        );
      case 'scheduled':
        const isPast = publishedAt ? new Date(publishedAt) <= new Date() : false;
        return (
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${isPast ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
          >
            {isPast ? '予約投稿(公開済)' : '投稿予約中'}
          </span>
        );
      case 'published':
      default:
        return (
          <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
            公開中
          </span>
        );
    }
  };

  return (
    <div className="relative space-y-4">
      {/* PC/Tablet Header with Create Button */}
      <div className="mb-6 hidden items-center justify-between sm:flex">
        <h2 className="text-xl font-bold text-gray-800">写メ日記一覧</h2>
        <button
          onClick={onCreate}
          className="flex items-center rounded-xl bg-pink-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-pink-200 transition-all hover:scale-105 hover:bg-pink-600 active:scale-95"
        >
          <Plus className="mr-2 h-5 w-5" />
          新規投稿を作成
        </button>
      </div>

      {diaries.length === 0 ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center shadow-lg sm:p-8">
          <div className="mb-4 text-gray-400">
            <Calendar className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <h3 className="mb-4 text-base font-medium text-gray-600 sm:text-lg">
            まだ日記がありません
          </h3>
          <p className="mb-6 text-sm text-gray-500">最初の写メ日記を投稿してみましょう！</p>

          {/* Mobile-only button for empty state - show centered if no diaries */}
          <button
            onClick={onCreate}
            className="inline-flex items-center rounded-full bg-pink-500 px-6 py-2.5 text-base text-white shadow-lg transition hover:bg-pink-600 sm:hidden"
          >
            <Plus className="mr-2 h-5 w-5" />
            日記を書く
          </button>
        </div>
      ) : (
        diaries.map((diary) => (
          // ... (existing diary card code)
          <div
            key={diary.id}
            className="relative rounded-2xl border border-pink-100 bg-white p-4 shadow-lg sm:p-6"
          >
            {/* 編集・削除ボタン */}
            <div className="absolute right-2 top-2 flex space-x-2">
              <button
                onClick={() => onEdit(diary)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(diary.id)}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Header */}
            <div className="mb-4">
              <h3 className="mb-1 truncate text-base font-semibold text-gray-800 sm:text-lg">
                {diary.title}
              </h3>
              <div className="flex flex-col space-y-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 sm:text-sm">
                <div className="flex items-center gap-2">
                  {getStatusBadge(diary.status, diary.publishedAt)}
                  <span>{formatDate(diary.publishedAt || diary.createdAt)}</span>
                </div>
                <span>作成: {formatCreatedAt(diary.createdAt)}</span>
                {diary.status === 'scheduled' && (
                  <span className="font-medium text-blue-600">
                    公開予定: {formatCreatedAt(diary.publishedAt!)}
                  </span>
                )}
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
                      className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <img
                        src={image}
                        alt={`${diary.title} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-4">
              <p className="whitespace-pre-wrap text-sm text-gray-700 sm:text-base">
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
                      className="inline-block rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 sm:px-3 sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="text-xs text-gray-500">ID: {diary.id}</div>
            </div>
          </div>
        ))
      )}

      {/* ✅ モバイル用フローティングボタン（PCでは非表示） */}
      <button
        onClick={onCreate}
        className="fixed bottom-24 right-6 z-50 flex items-center rounded-full bg-pink-500 px-4 py-3 text-base text-white shadow-2xl transition-all hover:bg-pink-600 active:scale-90 sm:hidden"
      >
        <Plus className="mr-2 h-6 w-6" />
        投稿する
      </button>
    </div>
  );
}
