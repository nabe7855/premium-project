import React from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters: FeatureMaster[];
  category: 'appearance' | 'personality';
}

export default function FeatureSelector({ form, onChange, featureMasters, category }: Props) {
  // ✅ 選択中の ID リストを決定
  const selectedIds = category === 'appearance'
    ? form.appearanceIds ?? []
    : form.personalityIds ?? [];

  const toggle = (id: string) => {
    const newValue = selectedIds.includes(id)
      ? selectedIds.filter((v) => v !== id)
      : [...selectedIds, id];

    const key = category === 'appearance' ? 'appearanceIds' : 'personalityIds';
    onChange(key as keyof CastProfile, newValue);
  };

  // ✅ 該当カテゴリだけ抽出
  const options = featureMasters.filter((f) => f.category === category);

  if (options.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        {category === 'appearance' ? '外見特徴が未設定です' : '性格特徴が未設定です'}
      </p>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {category === 'appearance' ? '外見の特徴' : '性格の特徴'}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
