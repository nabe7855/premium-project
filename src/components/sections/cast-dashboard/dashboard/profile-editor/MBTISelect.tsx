import React from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters: FeatureMaster[]; // ✅ DBから渡す
}

export default function MBTISelect({ form, onChange, featureMasters }: Props) {
  // ✅ MBTI カテゴリのみに絞り込む
  const mbtiOptions = featureMasters.filter(
  (f) => f.category.toLowerCase() === 'mbti'
);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">MBTI</label>
      <select
        value={form.mbtiId ?? ''}
        onChange={(e) => onChange('mbtiId', e.target.value)}
        className="w-full rounded border px-3 py-2"
      >
        <option value="">選択してください</option>
        {mbtiOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
