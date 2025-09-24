'use client';
import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Sparkles,
  Smile,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface EmotionFilterProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion: string;
  onSortChange: (sort: string) => void; // ✅ ソート用
  onTagChange: (tagId: string) => void; // ✅ タグ用
  tags: { id: string; name: string }[]; // ✅ 動的に渡す
}

const EmotionFilter: React.FC<EmotionFilterProps> = ({
  onEmotionSelect,
  selectedEmotion,
  onSortChange,
  onTagChange,
  tags,
}) => {
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);

const emotions = [
  {
    id: 'pampered',
    icon: Heart,
    text: 'とにかく甘やかされたい',
    category: '余韻力',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'listen',
    icon: MessageCircle,
    text: 'じっくり話を聞いてほしい',
    category: '傾聴力',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'fantasy',
    icon: Sparkles,
    text: '非日常の世界に飛び込みたい',
    category: 'ユーモア力',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'cheerful',
    icon: Smile,
    text: '明るい笑顔に元気をもらいたい',
    category: '癒し度',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'handsome',
    icon: HelpCircle,
    text: 'ビジュアルで惹かれたい',
    category: 'イケメン度',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'technique',
    icon: HelpCircle,
    text: 'テクニックを重視したい',
    category: 'テクニック',
    color: 'from-green-400 to-green-600',
  },
];


  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* 見出し */}
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 fill-current text-pink-500" />
        <span className="text-sm text-gray-600">今日のあなたは、どんな気分？🍓</span>
      </div>

      {/* 気分選択ボタン */}
      <div className="mb-6 space-y-3">
        {emotions.map((emotion) => {
          const IconComponent = emotion.icon;
          const isSelected = selectedEmotion === emotion.id;

          return (
            <button
              key={emotion.id}
              onClick={() => onEmotionSelect(emotion.id)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-pink-300 bg-gradient-to-r from-pink-50 to-pink-100 shadow-md'
                  : 'border-gray-200 hover:border-pink-200 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg bg-gradient-to-r p-2 ${emotion.color} text-white`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-800">{emotion.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 詳細フィルター開閉ボタン */}
      <button
        onClick={() => setShowDetailedFilters(!showDetailedFilters)}
        className="flex items-center gap-2 text-pink-600 transition-colors hover:text-pink-700"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            showDetailedFilters ? 'rotate-180' : ''
          }`}
        />
        <span className="text-sm font-medium">さらに細かく探す</span>
      </button>

      {/* 詳細フィルター */}
      {showDetailedFilters && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* タグフィルタ */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">タグ</label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                onChange={(e) => onTagChange(e.target.value)}
              >
                <option value="all">すべて</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* キャスト名ソート */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                キャスト名で並び替え
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="none">指定なし</option>
                <option value="castNameAsc">キャスト名昇順</option>
                <option value="castNameDesc">キャスト名降順</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionFilter;
