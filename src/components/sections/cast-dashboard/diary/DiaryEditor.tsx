import React, { useState } from 'react';
import { Save, Hash, X } from 'lucide-react';
import { CastDiary } from '@/types/cast-dashboard';
import ImageUpload from './ImageUpload';

interface DiaryEditorProps {
  onSave: (diary: Omit<CastDiary, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function DiaryEditor({ onSave, onCancel }: DiaryEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const suggestedTags = [
    '#癒し系',
    '#メガネ男子',
    '#筋肉',
    '#優しい',
    '#面白い',
    '#イケメン',
    '#話し上手',
    '#聞き上手',
    '#テクニシャン',
    '#余韻',
  ];

  const handleSave = () => {
    setError('');

    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (!content.trim()) {
      setError('内容を入力してください');
      return;
    }

    if (content.length > 500) {
      setError('内容は500文字以内で入力してください');
      return;
    }

    const diaryData: Omit<CastDiary, 'id' | 'createdAt'> = {
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      images,
      tags,
      likes: 0,
    };

    onSave(diaryData);
  };

  const addTag = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!tags.includes(cleanTag) && tags.length < 10) {
      setTags([...tags, cleanTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput('');
    }
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-lg sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">写メ日記投稿</h3>
        <button
          onClick={onCancel}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Title Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="今日の出来事やメッセージを入力"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:px-4 sm:py-3 sm:text-base"
          />
        </div>

        {/* Image Upload */}
        <ImageUpload images={images} onImagesChange={setImages} maxImages={3} />

        {/* Content Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">内容</label>
            <span className={`text-xs ${content.length > 500 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/500
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="今日の気持ちや出来事を書いてみましょう..."
            rows={6}
            className="w-full resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:px-4 sm:py-3 sm:text-base"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">ハッシュタグ</label>

          {/* Tag Input */}
          <div className="mb-3 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="タグを入力してEnter"
                className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              onClick={() => {
                if (tagInput.trim()) {
                  addTag(tagInput.trim());
                  setTagInput('');
                }
              }}
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600"
            >
              追加
            </button>
          </div>

          {/* Current Tags */}
          {tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-pink-500 hover:text-pink-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Suggested Tags */}
          <div>
            <p className="mb-2 text-xs text-gray-500">おすすめタグ:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={tags.includes(tag)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    tags.includes(tag)
                      ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-base"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-pink-600 hover:to-rose-600 sm:text-base"
          >
            <Save className="mr-2 h-4 w-4" />
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
}
