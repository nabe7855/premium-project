'use client';
import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles, Smile, HelpCircle, ChevronDown } from 'lucide-react';

interface EmotionFilterProps {
  onEmotionSelect: (emotion: string) => void;
  selectedEmotion: string;
}

const EmotionFilter: React.FC<EmotionFilterProps> = ({ onEmotionSelect, selectedEmotion }) => {
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
      id: 'undecided',
      icon: HelpCircle,
      text: '今日は何も決められない',
      color: 'from-gray-400 to-gray-600',
    },
  ];

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 fill-current text-pink-500" />
        <span className="text-sm text-gray-600">今日のあなたは、どんな気分？🍓</span>
      </div>

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
                <div className={`rounded-lg bg-gradient-to-r p-2 ${emotion.color} text-white`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-800">{emotion.text}</span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setShowDetailedFilters(!showDetailedFilters)}
        className="flex items-center gap-2 text-pink-600 transition-colors hover:text-pink-700"
      >
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showDetailedFilters ? 'rotate-180' : ''}`}
        />
        <span className="text-sm font-medium">さらに細かく探す</span>
      </button>

      {showDetailedFilters && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">利用店舗</label>
              <select className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option>すべて</option>
                <option>東京店</option>
                <option>大阪店</option>
                <option>名古屋店</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">評価</label>
              <select className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option>すべて</option>
                <option>🍓4以上</option>
                <option>🍓4.5以上</option>
                <option>🍓5のみ</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">年齢層</label>
              <select className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option>すべて</option>
                <option>20代</option>
                <option>30代</option>
                <option>40代</option>
                <option>50代以上</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">並び替え</label>
              <select className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option>最新順</option>
                <option>人気順</option>
                <option>高評価順</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionFilter;
