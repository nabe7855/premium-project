// DiaryList.tsx (今の中身そのまま)
'use client';
import React from 'react';
import { CastDiary } from '@/types/cast';

interface DiaryListProps {
  diaries: CastDiary[];
  onEdit: (diary: CastDiary) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export default function DiaryList({ diaries, onEdit, onDelete, onCreate }: DiaryListProps) {
  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onCreate}
        className="rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
      >
        ✨ 新しい日記を書く
      </button>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {diaries.map((diary) => {
          const thumbnail = diary.images?.[0];
          return (
            <div key={diary.id} className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
              {thumbnail ? (
                <img src={thumbnail} alt={diary.title || '日記画像'} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-bold text-gray-900">{diary.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{diary.content?.slice(0, 100) ?? ''}</p>
                {diary.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {diary.tags.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <button type="button" onClick={() => onEdit(diary)} className="text-pink-600 hover:underline">
                    編集
                  </button>
                  <button type="button" onClick={() => onDelete(diary.id)} className="text-red-500 hover:underline">
                    削除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
