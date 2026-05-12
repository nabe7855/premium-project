'use client';

import { getAllCasts } from '@/lib/actions/interview';
import { PlusIcon, TrashIcon, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Participant } from './types';

interface ParticipantManagerProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
}

export default function ParticipantManager({ participants, onChange }: ParticipantManagerProps) {
  const [availableCasts, setAvailableCasts] = useState<any[]>([]);
  const [showCastSelector, setShowCastSelector] = useState(false);

  useEffect(() => {
    const fetchCasts = async () => {
      const result = await getAllCasts();
      if (result.success) {
        setAvailableCasts(result.casts || []);
      }
    };
    fetchCasts();
  }, []);

  const addStaff = () => {
    const name = window.prompt('スタッフ名を入力してください', 'イトウ');
    if (!name) return;
    
    const newParticipant: Participant = {
      id: `staff-${Date.now()}`,
      name,
      photoUrl: '', // Will be handled by image uploader later
      type: 'staff',
    };
    onChange([...participants, newParticipant]);
  };

  const addCast = (cast: any) => {
    if (participants.some(p => p.id === cast.id)) {
      alert('既に登録されています');
      return;
    }

    const newParticipant: Participant = {
      id: cast.id,
      name: cast.name,
      photoUrl: cast.photoUrl || '',
      type: 'cast',
    };
    onChange([...participants, newParticipant]);
    setShowCastSelector(false);
  };

  const removeParticipant = (id: string) => {
    onChange(participants.filter(p => p.id !== id));
  };

  const updatePhotoUrl = (id: string, url: string) => {
    onChange(participants.map(p => p.id === id ? { ...p, photoUrl: url } : p));
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
        <UserIcon size={20} className="text-brand-accent" />
        インタビュー参加者
      </h3>
      
      <div className="flex flex-wrap gap-4">
        {participants.map((p) => (
          <div key={p.id} className="group relative flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 pr-10 shadow-sm transition-all hover:border-brand-accent/30">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
              {p.photoUrl ? (
                <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                  <UserIcon size={24} />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{p.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{p.type}</p>
            </div>
            
            <button
              onClick={() => removeParticipant(p.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 transition-colors hover:text-red-500"
            >
              <TrashIcon size={16} />
            </button>
            
            <input
              type="text"
              placeholder="画像URL"
              value={p.photoUrl}
              onChange={(e) => updatePhotoUrl(p.id, e.target.value)}
              className="absolute -bottom-1 left-0 w-full scale-0 rounded bg-white px-2 py-0.5 text-[9px] shadow-md transition-transform group-hover:scale-100"
            />
          </div>
        ))}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={addStaff}
            className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition-all hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent"
          >
            <PlusIcon size={20} />
            <span className="text-[10px] font-bold">スタッフ</span>
          </button>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCastSelector(!showCastSelector)}
              className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition-all hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent"
            >
              <PlusIcon size={20} />
              <span className="text-[10px] font-bold">キャスト</span>
            </button>
            
            {showCastSelector && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-48 overflow-y-auto rounded-lg border bg-white p-2 shadow-xl">
                <p className="mb-2 px-2 text-[10px] font-bold text-gray-400">キャストを選択</p>
                {availableCasts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => addCast(c)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                  >
                    <img src={c.photoUrl} className="h-6 w-6 rounded-full object-cover" />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-[11px] text-gray-500">
        ※最初に参加者を登録してください。対話の割り当てでこれらのアイコンが使用されます。
      </p>
    </div>
  );
}
