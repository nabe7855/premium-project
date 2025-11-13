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
  onSortChange: (sort: string) => void;
  onTagChange: (tagId: string) => void;
  onCastChange: (castId: string) => void;
  tags: { id: string; name: string }[];
  casts: { id: string; name: string }[];
}

const EmotionFilter: React.FC<EmotionFilterProps> = ({
  onEmotionSelect,
  selectedEmotion,
  onSortChange,
  onTagChange,
  onCastChange,
  tags,
  casts,
}) => {
  const [showEmotions, setShowEmotions] = useState(false);
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);

  const emotions = [
    {
      id: 'pampered',
      icon: Heart,
      text: 'とにかく甘やかされたい',
      color: 'from-pink-400 to-pink-600',
    },
    {
      id: 'listen',
      icon: MessageCircle,
      text: 'じっくり話を聞いてほしい',
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 'fantasy',
      icon: Sparkles,
      text: '非日常の世界に飛び込みたい',
      color: 'from-purple-400 to-purple-600',
    },
    {
      id: 'cheerful',
      icon: Smile,
      text: '明るい笑顔に元気をもらいたい',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      id: 'handsome',
      icon: HelpCircle,
      text: 'ビジュアルで惹かれたい',
      color: 'from-red-400 to-red-600',
    },
    {
      id: 'technique',
      icon: HelpCircle,
      text: 'テクニックを重視したい',
      color: 'from-green-400 to-green-600',
    },
  ];

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* 見出し */}
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 fill-current text-pink-500" />
        <span className="text-sm font-medium text-gray-700">気分で検索 🍓</span>
      </div>

      {/* 気分選択 開閉タブ */}
      <button
        onClick={() => setShowEmotions(!showEmotions)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-gray-100 mb-4"
      >
        <span>気分を選ぶ</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            showEmotions ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 気分選択ボタン一覧 */}
      {showEmotions && (
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
      )}

      {/* 詳細フィルター 開閉タブ */}
      <button
        onClick={() => setShowDetailedFilters(!showDetailedFilters)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-gray-100"
      >
        <span>詳細フィルター</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            showDetailedFilters ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 詳細フィルター */}
      {showDetailedFilters && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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

            {/* キャストフィルタ */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">キャスト</label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                onChange={(e) => onCastChange(e.target.value)}
              >
                <option value="all">すべて</option>
                {casts.map((cast) => (
                  <option key={cast.id} value={cast.id}>
                    {cast.name}
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
