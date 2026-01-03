// src/components/admin/pages/StoreCast.tsx
'use client';

import React, { useState } from 'react';
import { mockCasts, mockStores, mockTags } from '@/data/admin-mockData';
import { Cast } from '@/types/dashboard';
import Card from '@/components/admin/ui/Card';
import { PlusIcon } from '../admin-assets/Icons';

// Component for displaying a single tag
const Tag: React.FC<{ tag: string; onRemove: () => void }> = ({ tag, onRemove }) => (
  <span className="bg-brand-accent/20 text-brand-accent text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full flex items-center">
    {tag}
    <button
      onClick={onRemove}
      className="ml-1.5 text-brand-accent/70 hover:text-brand-accent"
    >
      &times;
    </button>
  </span>
);

// Card for managing a cast member within a specific store
const StoreCastCard: React.FC<{ cast: Cast; onUpdate: (cast: Cast) => void }> = ({
  cast,
  onUpdate,
}) => {
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);

  const handleAddTag = (tagToAdd: string) => {
    if (!cast.tags.includes(tagToAdd)) {
      onUpdate({ ...cast, tags: [...cast.tags, tagToAdd] });
    }
    setIsTagSelectorOpen(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ ...cast, tags: cast.tags.filter((t) => t !== tagToRemove) });
  };

  const availableTags = mockTags.filter((t) => !cast.tags.includes(t));

  return (
    <Card title={cast.name} className="flex flex-col">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={cast.photoUrl}
          alt={cast.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <select
          value={cast.storeStatus}
          onChange={(e) =>
            onUpdate({ ...cast, storeStatus: e.target.value as Cast['storeStatus'] })
          }
          className="bg-brand-primary border border-gray-700 rounded-md p-2 text-sm"
        >
          <option>レギュラー</option>
          <option>新人</option>
          <option>店長おすすめ</option>
        </select>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2 min-h-[24px]">
        {cast.tags.map((tag) => (
          <Tag key={tag} tag={tag} onRemove={() => handleRemoveTag(tag)} />
        ))}
      </div>
      <div className="mt-auto relative">
        <button
          onClick={() => setIsTagSelectorOpen(!isTagSelectorOpen)}
          className="w-full flex items-center justify-center text-sm bg-brand-primary border border-gray-700 rounded-md p-2 hover:bg-gray-700 transition-colors"
        >
          <PlusIcon />
          <span className="ml-2">タグを追加</span>
        </button>

        {isTagSelectorOpen && (
          <div className="absolute bottom-full left-0 w-full mb-2 bg-brand-secondary border border-gray-700 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddTag(tag)}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-primary hover:text-white"
                >
                  {tag}
                </button>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-brand-text-secondary">
                追加できるタグがありません。
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

// Dummy form for creating a new tag with preview
const TagGeneratorForm: React.FC = () => {
  const [tagName, setTagName] = useState('');
  const [bgColor, setBgColor] = useState('#FF69B4'); // default pink
  const [textColor, setTextColor] = useState('#FFFFFF'); // default white

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`タグ作成: ${tagName} (背景: ${bgColor}, 文字: ${textColor})`);
    setTagName('');
  };

  return (
    <Card title="タグ生成フォーム">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">タグ名</label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="例: イケメン"
            className="w-full rounded-md bg-brand-primary border border-gray-700 p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">背景色</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-16 h-8 p-0 border border-gray-700 rounded-md cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">文字色</label>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-16 h-8 p-0 border border-gray-700 rounded-md cursor-pointer"
          />
        </div>

        {/* ✅ プレビュー表示 */}
        <div>
          <p className="text-sm mb-2 text-brand-text-secondary">プレビュー</p>
          <span
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {tagName || 'サンプルタグ'}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-brand-accent text-white rounded-md py-2 px-4 hover:bg-brand-accent/90 transition-colors"
        >
          タグを作成
        </button>
      </form>
    </Card>
  );
};

// Main page for managing cast within a specific store
export default function StoreCast() {
  const [selectedStore, setSelectedStore] = useState(mockStores[0].id);
  const [casts, setCasts] = useState(mockCasts);

  const handleUpdateCast = (updatedCast: Cast) => {
    setCasts(casts.map((c) => (c.id === updatedCast.id ? updatedCast : c)));
  };

  const filteredCasts = casts.filter(
    (c) => c.storeIds.includes(selectedStore) && c.status === '在籍中'
  );

  return (
    <div className="space-y-6">
      <Card title="店舗を選択">
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full md:w-1/3"
        >
          {mockStores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Card>

      {/* ✅ タグ生成フォーム（プレビュー付き） */}
      <TagGeneratorForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCasts.length > 0 ? (
          filteredCasts.map((cast) => (
            <StoreCastCard key={cast.id} cast={cast} onUpdate={handleUpdateCast} />
          ))
        ) : (
          <p className="text-brand-text-secondary col-span-full text-center py-8">
            この店舗に在籍中のキャストはいません。
          </p>
        )}
      </div>
    </div>
  );
}
