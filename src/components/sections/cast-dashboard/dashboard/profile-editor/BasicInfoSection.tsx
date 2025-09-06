import React from 'react';

interface Props {
  form: any;
  onChange: (key: string, value: any) => void;
}

export default function BasicInfoSection({ form, onChange }: Props) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium">名前</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="w-full mt-1 rounded border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">年齢</label>
          <input
            type="number"
            value={form.age || ''}
            onChange={(e) => onChange('age', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">身長 (cm)</label>
          <input
            type="number"
            value={form.height || ''}
            onChange={(e) => onChange('height', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>
      </div>
    </>
  );
}
