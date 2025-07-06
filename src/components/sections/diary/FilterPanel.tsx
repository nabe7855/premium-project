'use client';
import React, { useState } from 'react';
import { Tag, X } from 'lucide-react';
import SearchBar from './SearchBar';

interface FilterPanelProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  onHashtagFilter?: (hashtags: string[]) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onHashtagFilter }) => {
  const [hashtagSearch, setHashtagSearch] = useState('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  // Popular hashtags from the data
  const popularHashtags = [
    '癒し系',
    '恋人感',
    '元気',
    '甘え',
    '優しい',
    '面白い',
    '日常',
    'カフェ',
    '美容',
    'メイク',
    '季節',
    '桜',
    '手作り',
    'お菓子',
    '料理',
    '映画',
    '感動',
    'エンタメ',
    'ヨガ',
    'リラックス',
    '健康',
    '散歩',
    '新しい',
  ];

  const filteredHashtags = popularHashtags.filter(
    (tag) =>
      tag.toLowerCase().includes(hashtagSearch.toLowerCase()) && !selectedHashtags.includes(tag),
  );

  const handleHashtagAdd = (hashtag: string) => {
    const newSelected = [...selectedHashtags, hashtag];
    setSelectedHashtags(newSelected);
    setHashtagSearch('');
    onHashtagFilter?.(newSelected);
  };

  const handleHashtagRemove = (hashtag: string) => {
    const newSelected = selectedHashtags.filter((tag) => tag !== hashtag);
    setSelectedHashtags(newSelected);
    onHashtagFilter?.(newSelected);
  };

  const handleHashtagSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && hashtagSearch.trim()) {
      const trimmedTag = hashtagSearch.trim();
      if (!selectedHashtags.includes(trimmedTag)) {
        handleHashtagAdd(trimmedTag);
      }
    }
  };

  return (
    <div className="rounded-lg border border-pink-200 bg-white p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Hashtag Search */}
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
            <Tag className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
            ハッシュタグで検索
          </label>

          {/* Selected Hashtags */}
          {selectedHashtags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-2">
              {selectedHashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-pink-500 px-2 py-1 text-xs text-white sm:px-3 sm:text-sm"
                >
                  #{tag}
                  <button
                    onClick={() => handleHashtagRemove(tag)}
                    className="rounded-full p-0.5 transition-colors hover:bg-pink-600"
                  >
                    <X size={10} className="sm:h-3 sm:w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search Input */}
          <SearchBar
            value={hashtagSearch}
            onChange={setHashtagSearch}
            placeholder="ハッシュタグを入力してEnterキーを押す..."
            className="mb-2 sm:mb-3"
            onKeyPress={handleHashtagSearchKeyPress}
          />

          {/* Popular Hashtags */}
          <div>
            <p className="mb-2 text-xs text-gray-600 sm:text-sm">人気のハッシュタグ</p>
            <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto sm:max-h-24 sm:gap-2">
              {filteredHashtags.slice(0, 12).map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleHashtagAdd(tag)}
                  className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700 transition-colors hover:bg-pink-200 sm:px-3 sm:text-sm"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emotion Tags */}
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
            感情で探す
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {['癒し系', '恋人感', '元気', '甘え', '優しい', '面白い'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleHashtagAdd(tag)}
                disabled={selectedHashtags.includes(tag)}
                className={`rounded-full px-2 py-1 text-xs transition-colors sm:px-3 sm:text-sm ${
                  selectedHashtags.includes(tag)
                    ? 'cursor-not-allowed bg-pink-500 text-white'
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedHashtags([]);
              setHashtagSearch('');
              onHashtagFilter?.([]);
            }}
            disabled={selectedHashtags.length === 0}
            className={`rounded-lg px-3 py-2 text-xs transition-colors sm:px-4 sm:text-sm ${
              selectedHashtags.length === 0
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            フィルターをクリア
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
