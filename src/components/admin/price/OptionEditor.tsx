'use client';

import type { EditablePriceOption } from '@/types/priceConfig';
import { Plus, Trash2 } from 'lucide-react';

interface OptionEditorProps {
  options: EditablePriceOption[];
  onUpdate: (options: EditablePriceOption[]) => void;
}

export default function OptionEditor({ options, onUpdate }: OptionEditorProps) {
  const addOption = () => {
    const newOption: EditablePriceOption = {
      name: '',
      description: '',
      price: 1000,
      is_relative: true,
      display_order: options.length,
    };
    onUpdate([...options, newOption]);
  };

  const updateOption = (index: number, updates: Partial<EditablePriceOption>) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], ...updates };
    onUpdate(newOptions);
  };

  const deleteOption = (index: number) => {
    if (!confirm('このオプションを削除しますか？')) return;
    const newOptions = options.filter((_, i) => i !== index);
    onUpdate(newOptions);
  };

  return (
    <div className="space-y-6 rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-rose-900">オプション設定</h3>
        <button
          onClick={addOption}
          className="flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-200"
        >
          <Plus className="h-4 w-4" />
          オプション追加
        </button>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex flex-wrap items-start gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 transition-colors hover:border-rose-200 hover:bg-white"
          >
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={option.name}
                onChange={(e) => updateOption(index, { name: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-2 font-bold text-rose-900 placeholder-rose-300"
                placeholder="オプション名（例: 指名料）"
              />
              <textarea
                value={option.description || ''}
                onChange={(e) => updateOption(index, { description: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-2 text-sm text-rose-600 placeholder-rose-300"
                rows={2}
                placeholder="説明文"
              />
            </div>

            <div className="w-32 space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-2 py-1.5">
                <span className="text-sm font-bold text-rose-300">¥</span>
                <input
                  type="number"
                  value={option.price}
                  onChange={(e) => updateOption(index, { price: parseInt(e.target.value) })}
                  className="w-full bg-transparent text-lg font-black text-rose-500 placeholder-rose-200 outline-none"
                  placeholder="0"
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <input
                  type="checkbox"
                  checked={option.is_relative}
                  onChange={(e) => updateOption(index, { is_relative: e.target.checked })}
                  className="rounded border-rose-300 text-rose-500 focus:ring-rose-200"
                />
                相対価格表示 (+)
              </label>
            </div>

            <button
              onClick={() => deleteOption(index)}
              className="mt-1 rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
              title="削除"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {options.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-rose-100 py-8 text-center text-rose-400">
            オプションが設定されていません
          </div>
        )}
      </div>
    </div>
  );
}
