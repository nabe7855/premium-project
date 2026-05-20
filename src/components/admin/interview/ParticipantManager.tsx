'use client';

import { getAllCasts } from '@/lib/actions/interview';
import { PlusIcon, TrashIcon, UserIcon, Camera, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Participant } from './types';
import { uploadMediaImage } from '@/lib/uploadMediaImage';

interface ParticipantManagerProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
}

export default function ParticipantManager({ participants, onChange }: ParticipantManagerProps) {
  const [availableCasts, setAvailableCasts] = useState<any[]>([]);
  const [showCastSelector, setShowCastSelector] = useState(false);
  const [showStaffSelector, setShowStaffSelector] = useState(false);
  const [staffArchive, setStaffArchive] = useState<{ name: string; photoUrl: string }[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCasts = async () => {
      const result = await getAllCasts();
      if (result.success) {
        setAvailableCasts(result.casts || []);
      }
    };
    fetchCasts();

    // ローカルストレージからスタッフのアーカイブ（画像履歴）を読み込み
    try {
      const saved = localStorage.getItem('sutoroberrys_staff_archive');
      if (saved) {
        setStaffArchive(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load staff archive:', e);
    }
  }, []);

  const addStaffFromArchive = (staff: { name: string; photoUrl: string }) => {
    const newParticipant: Participant = {
      id: `staff-${Date.now()}`,
      name: staff.name,
      photoUrl: staff.photoUrl,
      type: 'staff',
    };
    onChange([...participants, newParticipant]);
    setShowStaffSelector(false);
  };

  const createNewStaff = () => {
    const name = window.prompt('新しいスタッフ名を入力してください');
    if (!name) return;
    
    const newParticipant: Participant = {
      id: `staff-${Date.now()}`,
      name,
      photoUrl: '', 
      type: 'staff',
    };
    onChange([...participants, newParticipant]);

    // アーカイブにも登録
    setStaffArchive(prev => {
      if (prev.some(s => s.name === name)) return prev;
      const next = [...prev, { name, photoUrl: '' }];
      localStorage.setItem('sutoroberrys_staff_archive', JSON.stringify(next));
      return next;
    });

    setShowStaffSelector(false);
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
    const updated = participants.map(p => p.id === id ? { ...p, photoUrl: url } : p);
    onChange(updated);

    // アップロードされたスタッフの画像URLをアーカイブにも同期保存
    const target = updated.find(p => p.id === id);
    if (target && target.type === 'staff') {
      setStaffArchive(prev => {
        const filtered = prev.filter(s => s.name !== target.name);
        const next = [...filtered, { name: target.name, photoUrl: url }];
        localStorage.setItem('sutoroberrys_staff_archive', JSON.stringify(next));
        return next;
      });
    }
  };

  const handleFileChange = async (id: string, file: File) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const url = await uploadMediaImage(file);
      if (url) {
        updatePhotoUrl(id, url);
      } else {
        alert('画像のアップロードに失敗しました。');
      }
    } catch (e) {
      console.error(e);
      alert('アップロード中にエラーが発生しました。');
    } finally {
      setUploadingId(null);
      setActiveUploadId(null);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
        <UserIcon size={20} className="text-brand-accent" />
        インタビュー参加者
      </h3>

      {/* スタッフ画像用共通隠しファイル入力 (フック違反を避けるためループ外に設置) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeUploadId) {
            handleFileChange(activeUploadId, file);
          }
          if (e.target) e.target.value = ''; // 連続アップロード可能にリセット
        }}
        accept="image/*"
        className="hidden"
      />
      
      <div className="flex flex-wrap gap-4">
        {participants.map((p) => {
          const isUploading = uploadingId === p.id;

          return (
            <div key={p.id} className="group relative flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 pr-10 shadow-sm transition-all hover:border-brand-accent/30">
              {/* アバターコンポーネント (スタッフの場合はクリックでアップロード可能に) */}
              <div 
                onClick={() => {
                  if (p.type === 'staff' && !isUploading) {
                    setActiveUploadId(p.id);
                    // 確実にステートが反映されてからクリックイベントをトリガー
                    setTimeout(() => {
                      fileInputRef.current?.click();
                    }, 10);
                  }
                }}
                className={`relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm bg-neutral-100 select-none ${
                  p.type === 'staff' ? 'cursor-pointer hover:ring-2 hover:ring-brand-accent/50 transition-all' : ''
                }`}
              >
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                    <UserIcon size={24} />
                  </div>
                )}

                {/* スタッフのホバー時カメラアイコン＆ロード中インジケータ */}
                {p.type === 'staff' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <Camera className="h-5 w-5 text-white" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">{p.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  {p.type === 'staff' ? 'スタッフ' : 'キャスト'}
                </p>
              </div>
              
              <button
                type="button"
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
          );
        })}

        <div className="flex gap-2">
          {/* スタッフ追加ボタン (ドロップダウン) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowStaffSelector(!showStaffSelector);
                setShowCastSelector(false);
              }}
              className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-gray-400 transition-all hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent"
            >
              <PlusIcon size={20} />
              <span className="text-[10px] font-bold">スタッフ</span>
            </button>

            {showStaffSelector && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border bg-white p-2.5 shadow-xl">
                <p className="mb-2 px-2 text-[10px] font-bold text-gray-400">スタッフを選択</p>
                
                {staffArchive.length > 0 ? (
                  <div className="mb-2 max-h-40 overflow-y-auto space-y-1 font-sans">
                    {staffArchive.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addStaffFromArchive(s)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100"
                      >
                        {s.photoUrl ? (
                          <img src={s.photoUrl} className="h-5 w-5 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <UserIcon size={10} />
                          </div>
                        )}
                        <span className="truncate flex-1">{s.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mb-3 px-2 text-[10px] text-gray-400 italic">保存された履歴はありません</p>
                )}
                
                <div className="border-t pt-2">
                  <button
                    type="button"
                    onClick={createNewStaff}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-brand-accent/10 py-1.5 text-center text-xs font-bold text-brand-accent hover:bg-brand-accent hover:text-white transition-colors"
                  >
                    <PlusIcon size={14} />
                    新規登録
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* キャスト追加ボタン (ドロップダウン) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCastSelector(!showCastSelector);
                setShowStaffSelector(false);
              }}
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
                    type="button"
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
