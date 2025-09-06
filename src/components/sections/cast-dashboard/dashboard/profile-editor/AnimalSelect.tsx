import React from 'react';
import { CastProfile, FeatureMaster } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
  featureMasters: FeatureMaster[]; // ✅ animal マスターを渡す
}

export default function AnimalSelect({ form, onChange, featureMasters }: Props) {
  // ✅ animal カテゴリのみ抽出
  const options = featureMasters.filter((f) => f.category === 'animal');

  return (
    <div>
      <label className="block text-sm font-medium mb-1">動物占い</label>
      <select
        value={form.animalId ?? ''}
        onChange={(e) => onChange('animalId', e.target.value)}
        className="w-full rounded border px-3 py-2"
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}
