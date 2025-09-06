import React from 'react';

const animalOptions = [
  "狼", "こじか", "猿", "チータ", "黒ひょう", "ライオン",
  "虎", "たぬき", "子守熊", "ゾウ", "ひつじ", "ペガサス",
];

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function AnimalSelect({ form, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">動物占い</label>
      <select
        value={form.animal || ''}
        onChange={(e) => onChange('animal', e.target.value)}
        className="w-full rounded border px-3 py-2"
      >
        <option value="">選択してください</option>
        {animalOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
