import React, { useState, useEffect } from 'react';
import { X, Clock, Save, Trash2, CalendarRange } from 'lucide-react';
import { CastSchedule } from '@/types/cast-dashboard';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: { startTime: string; endTime: string; status: string }) => void;
  onDelete?: (id: string) => void;
  selectedDate: string | null;
  existingSchedule?: CastSchedule;
}

// ✅ 状態の候補（DBの enum schedule_status と一致させる）
const STATUS_OPTIONS = ['予約可能', '残りあとわずか', '満員御礼', '応相談'];

// ✅ プリセットの定義
const PRESETS = [
  { name: '通し', start: '12:00', end: '24:00' },
  { name: '早番', start: '12:00', end: '18:00' },
  { name: '中番', start: '15:00', end: '21:00' },
  { name: '遅番', start: '18:00', end: '24:00' },
  { name: '深夜', start: '21:00', end: '05:00' }, // 05:00は翌日のつもり
];

// ✅ 時間の選択肢生成 (00:00 - 33:00)
const HOURS = Array.from({ length: 34 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  existingSchedule,
}: ScheduleModalProps) {
  const [startH, setStartH] = useState('12');
  const [startM, setStartM] = useState('00');
  const [endH, setEndH] = useState('24');
  const [endM, setEndM] = useState('00');
  const [status, setStatus] = useState('予約可能');
  const [error, setError] = useState('');

  // ✅ 28時対応フォーマッター (HH:mm 形式を H と M に分解)
  useEffect(() => {
    if (existingSchedule && selectedDate) {
      const dStart = new Date(existingSchedule.start_datetime);
      const dEnd = new Date(existingSchedule.end_datetime);
      const base = new Date(selectedDate + 'T00:00:00+09:00');

      let sh = dStart.getHours();
      if (dStart.getDate() > base.getDate()) sh += 24;
      setStartH(String(sh).padStart(2, '0'));
      setStartM(String(dStart.getMinutes()).padStart(2, '0'));

      let eh = dEnd.getHours();
      if (dEnd.getDate() > base.getDate()) eh += 24;
      setEndH(String(eh).padStart(2, '0'));
      setEndM(String(dEnd.getMinutes()).padStart(2, '0'));

      setStatus(existingSchedule.status || '予約可能');
    } else {
      setStartH('12');
      setStartM('00');
      setEndH('24');
      setEndM('00');
      setStatus('予約可能');
    }
    setError('');
  }, [existingSchedule, isOpen, selectedDate]);

  const handlePresetClick = (start: string, end: string) => {
    const [sh, sm] = start.split(':');
    const [eh, em] = end.split(':');
    
    // 深夜帯の24時以降の表記対応
    let ehNum = parseInt(eh);
    if (ehNum < parseInt(sh) && ehNum < 12) {
      ehNum += 24;
    }

    setStartH(sh);
    setStartM(sm);
    setEndH(String(ehNum).padStart(2, '0'));
    setEndM(em);
  };

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleSave = () => {
    const startTime = `${startH}:${startM}`;
    const endTime = `${endH}:${endM}`;
    onSave({ startTime, endTime, status });
  };

  const handleDelete = () => {
    if (existingSchedule && onDelete) {
      if (confirm('この日のスケジュールを削除（休み設定）にしますか？')) {
        onDelete(existingSchedule.id);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-pink-50/30 px-6 py-5">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-pink-500" />
            <h3 className="text-lg font-bold text-gray-800">勤務時間の登録</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 本文 */}
        <div className="p-6">
          <div className="mb-6 rounded-2xl bg-gray-50 p-3 text-center">
            <span className="text-sm font-bold text-gray-600">📅 {formatDateDisplay(selectedDate)}</span>
          </div>

          {/* クイック選択 */}
          <div className="mb-8">
            <label className="mb-3 block text-xs font-bold text-gray-400 uppercase tracking-wider">クイック選択</label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePresetClick(p.start, p.end)}
                  className="rounded-full border border-pink-100 bg-white px-4 py-1.5 text-xs font-bold text-pink-600 shadow-sm transition-all hover:bg-pink-500 hover:text-white active:scale-95"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* 入力フィールド */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* 開始時間 */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <Clock className="h-3 w-3" />
                  開始
                </label>
                <div className="flex items-center gap-1">
                  <select
                    value={startH}
                    onChange={(e) => setStartH(e.target.value)}
                    className="flex-1 rounded-xl border-gray-200 bg-gray-50 px-2 py-3 text-sm font-bold shadow-sm focus:border-pink-300 focus:bg-white outline-none"
                  >
                    {HOURS.map(h => <option key={h} value={h}>{h}時</option>)}
                  </select>
                  <span className="text-gray-400">:</span>
                  <select
                    value={startM}
                    onChange={(e) => setStartM(e.target.value)}
                    className="flex-1 rounded-xl border-gray-200 bg-gray-50 px-2 py-3 text-sm font-bold shadow-sm focus:border-pink-300 focus:bg-white outline-none"
                  >
                    {MINUTES.map(m => <option key={m} value={m}>{m}分</option>)}
                  </select>
                </div>
              </div>

              {/* 終了時間 */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                  <Clock className="h-3 w-3" />
                  終了
                </label>
                <div className="flex items-center gap-1">
                  <select
                    value={endH}
                    onChange={(e) => setEndH(e.target.value)}
                    className="flex-1 rounded-xl border-gray-200 bg-gray-50 px-2 py-3 text-sm font-bold shadow-sm focus:border-pink-300 focus:bg-white outline-none"
                  >
                    {HOURS.map(h => <option key={h} value={h}>{h}時</option>)}
                  </select>
                  <span className="text-gray-400">:</span>
                  <select
                    value={endM}
                    onChange={(e) => setEndM(e.target.value)}
                    className="flex-1 rounded-xl border-gray-200 bg-gray-50 px-2 py-3 text-sm font-bold shadow-sm focus:border-pink-300 focus:bg-white outline-none"
                  >
                    {MINUTES.map(m => <option key={m} value={m}>{m}分</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 状態 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500">予約状況</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setStatus(option)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${
                      status === option
                        ? 'border-pink-500 bg-pink-500 text-white shadow-md shadow-pink-100'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-pink-200 hover:text-pink-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* アクション */}
          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 font-bold text-white shadow-xl shadow-pink-100 transition active:scale-95"
            >
              <Save size={18} />
              設定を保存する
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-xs font-bold text-gray-500 transition hover:bg-gray-200"
              >
                閉じる
              </button>
              {existingSchedule && onDelete && (
                <button
                  onClick={handleDelete}
                  className="flex flex-[1.5] items-center justify-center gap-1.5 rounded-xl bg-rose-50 py-3 text-xs font-bold text-rose-500 transition hover:bg-rose-100"
                >
                  <Trash2 size={14} />
                  休み（削除）にする
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
