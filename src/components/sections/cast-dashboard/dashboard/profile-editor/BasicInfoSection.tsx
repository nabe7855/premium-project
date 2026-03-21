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
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">年齢</label>
          <input
            type="number"
            value={form.age ?? ''} // null/undefinedなら空文字
            onChange={(e) => onChange('age', Number(e.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">身長 (cm)</label>
          <input
            type="number"
            value={form.height ?? ''}
            onChange={(e) => onChange('height', Number(e.target.value))}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">キャッチコピー</label>
        <input
          type="text"
          value={form.catchCopy ?? ''}
          onChange={(e) => onChange('catchCopy', e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          placeholder="例: 癒やし度NO.1の新人セラピスト"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">血液型</label>
          <select
            value={form.bloodType ?? ''}
            onChange={(e) => onChange('bloodType', e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">秘密</option>
            <option value="A">A型</option>
            <option value="B">B型</option>
            <option value="O">O型</option>
            <option value="AB">AB型</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">変態係数 ({form.sexinessLevel ?? 0}%)</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              value={form.sexinessLevel ?? 0}
              onChange={(e) => onChange('sexinessLevel', Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-fuchsia-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="w-8 text-right text-sm font-bold text-fuchsia-500">{form.sexinessLevel ?? 0}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
