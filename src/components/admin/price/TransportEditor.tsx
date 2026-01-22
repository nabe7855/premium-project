'use client';

import type { EditableTransportArea } from '@/types/priceConfig';
import { Plus, Trash2 } from 'lucide-react';

interface TransportEditorProps {
  transportAreas: EditableTransportArea[];
  onUpdate: (areas: EditableTransportArea[]) => void;
}

export default function TransportEditor({ transportAreas, onUpdate }: TransportEditorProps) {
  const addArea = () => {
    const newArea: EditableTransportArea = {
      area: '',
      price: 1000,
      label: '1,000円エリア',
      note: '',
      display_order: transportAreas.length,
    };
    onUpdate([...transportAreas, newArea]);
  };

  const updateArea = (index: number, updates: Partial<EditableTransportArea>) => {
    const newAreas = [...transportAreas];
    newAreas[index] = { ...newAreas[index], ...updates };
    onUpdate(newAreas);
  };

  const deleteArea = (index: number) => {
    if (!confirm('このエリアを削除しますか？')) return;
    const newAreas = transportAreas.filter((_, i) => i !== index);
    onUpdate(newAreas);
  };

  return (
    <div className="space-y-6 rounded-2xl border-2 border-rose-100 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-rose-900">送迎エリア設定</h3>
        <button
          onClick={addArea}
          className="flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-200"
        >
          <Plus className="h-4 w-4" />
          エリア追加
        </button>
      </div>

      <div className="space-y-4">
        {transportAreas.map((area, index) => (
          <div
            key={index}
            className="flex flex-wrap items-start gap-4 rounded-xl border border-rose-100 bg-rose-50/50 p-4 transition-colors hover:border-rose-200 hover:bg-white"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={area.area}
                  onChange={(e) => updateArea(index, { area: e.target.value })}
                  className="w-full rounded-lg border border-rose-200 p-2 font-bold text-rose-900 placeholder-rose-300"
                  placeholder="エリア名（例: 東京23区）"
                />
              </div>
              <input
                type="text"
                value={area.note || ''}
                onChange={(e) => updateArea(index, { note: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-2 text-sm text-rose-600 placeholder-rose-300"
                placeholder="備考（例: 深夜利用の場合、駅から遠方の場合など）"
              />
            </div>

            <div className="w-48 space-y-2">
              <input
                type="text"
                value={area.label}
                onChange={(e) => updateArea(index, { label: e.target.value })}
                className="w-full rounded-lg border border-rose-200 p-2 text-xs font-bold uppercase tracking-widest text-rose-400 placeholder-rose-300"
                placeholder="ラベル（例: 1,000円エリア）"
              />
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-2 py-1.5">
                <span className="text-sm font-bold text-rose-300">¥</span>
                <input
                  type="number"
                  value={area.price === undefined ? '' : area.price}
                  onChange={(e) =>
                    updateArea(index, {
                      price: e.target.value === '' ? undefined : parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-transparent text-lg font-black text-rose-500 placeholder-rose-200 outline-none"
                  placeholder="応相談"
                />
              </div>
            </div>

            <button
              onClick={() => deleteArea(index)}
              className="mt-1 rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
              title="削除"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {transportAreas.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-rose-100 py-8 text-center text-rose-400">
            送迎エリアが設定されていません
          </div>
        )}
      </div>
    </div>
  );
}
