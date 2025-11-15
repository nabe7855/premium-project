import React from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters?: FeatureMaster[]; // ✅ optional にして安全性アップ
}

export default function FaceSelector({ form, onChange, featureMasters }: Props) {
  // ✅ face カテゴリだけ抽出（null/undefined でも安全に）
  const options = (featureMasters ?? []).filter((f) => f.category === 'face');

  if (options.length === 0) {
    return (
      <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
        顔タイプのマスターが未設定です。管理画面から追加してください。
      </p>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">顔タイプ</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = form.faceId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange('faceId', opt.id)}
              className={`px-3 py-1 rounded-full border text-sm transition ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500'
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
