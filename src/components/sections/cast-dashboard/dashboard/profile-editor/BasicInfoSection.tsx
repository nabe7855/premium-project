import { CastProfile } from '@/types/cast';
import { OnChangeHandler } from '@/types/profileEditor'; // 共通ハンドラ型

interface Props {
  form: CastProfile;
  onChange: OnChangeHandler;
}

export default function BasicInfoSection({ form, onChange }: Props) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">名前</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 outline-none"
            placeholder="お名前を入力"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">キャッチコピー</label>
          <input
            type="text"
            value={form.catchCopy ?? ''}
            onChange={(e) => onChange('catchCopy', e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100 outline-none"
            placeholder="例: 癒やし度NO.1の新人セラピスト"
          />
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 p-5 border border-pink-100/50">
        <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-pink-700">
          <span>📏</span> 体型・基本スペック
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-pink-400">年齢</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={form.age ?? ''}
                onChange={(e) => onChange('age', Number(e.target.value))}
                className="w-full rounded-lg border-2 border-white bg-white/80 px-3 py-2.5 text-center text-sm font-bold text-gray-700 shadow-sm focus:border-pink-300 focus:ring-0 outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">歳</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-pink-400">身長</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={form.height ?? ''}
                onChange={(e) => onChange('height', Number(e.target.value))}
                className="w-full rounded-lg border-2 border-white bg-white/80 px-3 py-2.5 text-center text-sm font-bold text-gray-700 shadow-sm focus:border-pink-300 focus:ring-0 outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">cm</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-pink-400">体重</label>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                value={form.weight ?? ''}
                onChange={(e) => onChange('weight', Number(e.target.value))}
                className="w-full rounded-lg border-2 border-white bg-white/80 px-3 py-2.5 text-center text-sm font-bold text-gray-700 shadow-sm focus:border-pink-300 focus:ring-0 outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">kg</span>
            </div>
          </div>
        </div>
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
          <label className="block text-sm font-medium">エロス係数 ({form.sexinessLevel ?? 100}%)</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              value={form.sexinessLevel ?? 100}
              onChange={(e) => onChange('sexinessLevel', Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-fuchsia-500"
              min="0"
              max="150"
              step="1"
            />
            <span className="w-8 text-right text-sm font-bold text-fuchsia-500">{form.sexinessLevel ?? 100}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
