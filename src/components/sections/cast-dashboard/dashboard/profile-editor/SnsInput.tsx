import React from 'react';
import { CastProfile } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor';

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
}

export default function SnsInput({ form, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium">SNS URL</label>
      <input
        type="text"
        value={form.snsUrl ?? ''}
        onChange={(e) => onChange('snsUrl', e.target.value)}
        className="w-full mt-1 rounded border px-3 py-2"
        placeholder="https://..."
      />
    </div>
  );
}
