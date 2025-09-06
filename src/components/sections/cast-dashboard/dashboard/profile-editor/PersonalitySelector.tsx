import React from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters: FeatureMaster[];
}

export default function PersonalitySelector({ form, onChange, featureMasters }: Props) {
  const toggle = (id: string) => {
    const current = form.personalityIds ?? [];
    onChange(
      'personalityIds',
      current.includes(id)
        ? current.filter((v) => v !== id)
        : [...current, id]
    );
  };

  // ✅ personality カテゴリのみ抽出
  const options = featureMasters.filter((f) => f.category === 'personality');

  if (options.length === 0) {
    return <p className="text-sm text-gray-500">性格カテゴリのマスターが未設定です</p>;
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">性格カテゴリ</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = form.personalityIds?.includes(opt.id) ?? false;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-pink-500 text-white border-pink-500'
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
