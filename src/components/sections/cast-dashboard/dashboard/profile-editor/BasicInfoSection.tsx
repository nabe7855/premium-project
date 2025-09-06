import React from 'react';
import { CastProfile } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor'; // 共通ハンドラ型

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
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
            value={form.age ?? ''} // null/undefinedなら空文字
            onChange={(e) => onChange('age', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">身長 (cm)</label>
          <input
            type="number"
            value={form.height ?? ''} // null/undefinedなら空文字
            onChange={(e) => onChange('height', Number(e.target.value))}
            className="w-full mt-1 rounded border px-3 py-2"
          />
        </div>
      </div>
    </>
  );
}
