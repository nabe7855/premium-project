'use client';

import React, { useState, useRef } from 'react';
import { 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  GripVertical, 
  PlusIcon, 
  Square, 
  TrashIcon, 
  TypeIcon,
  UserIcon,
  XCircle,
  MessageSquare,
  X,
  Camera,
  Loader2
} from 'lucide-react';
import { DialogueSection, DialogueItem, Participant } from './types';
import { uploadMediaImage } from '@/lib/uploadMediaImage';

interface DialogueEditorProps {
  sections: DialogueSection[];
  participants: Participant[];
  photos: Record<string, any>;
  onPhotosChange: (photos: Record<string, any>) => void;
  onChange: (sections: DialogueSection[]) => void;
}

export default function DialogueEditor({ sections, participants, photos, onPhotosChange, onChange }: DialogueEditorProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [uploadingSlotId, setUploadingSlotId] = useState<string | null>(null);
  const [activeSlotPhotoKey, setActiveSlotPhotoKey] = useState<string | null>(null);
  const slotFileInputRef = useRef<HTMLInputElement>(null);

  const updateSections = (newSections: DialogueSection[]) => {
    onChange(newSections);
  };

  const handlePhotoKeyChange = (oldKey: string, newKey: string) => {
    if (!oldKey || !newKey || oldKey === newKey) return;
    const newPhotos = { ...photos };
    if (newPhotos[oldKey]) {
      newPhotos[newKey] = newPhotos[oldKey];
      delete newPhotos[oldKey];
      onPhotosChange(newPhotos);
    }
  };

  const triggerSlotUpload = (photoKey: string) => {
    setActiveSlotPhotoKey(photoKey);
    setTimeout(() => {
      slotFileInputRef.current?.click();
    }, 10);
  };

  const handleSlotFileChange = async (photoKey: string, file: File) => {
    if (!file || !photoKey) return;

    setUploadingSlotId(photoKey);
    try {
      const url = await uploadMediaImage(file);
      if (url) {
        const newPhotos = { ...photos };
        newPhotos[photoKey] = {
          url,
          layout: 'landscape', // default layout
          alt: '',
          caption: '',
        };
        onPhotosChange(newPhotos);
      } else {
        alert('画像のアップロードに失敗しました。');
      }
    } catch (e) {
      console.error(e);
      alert('アップロード中にエラーが発生しました。');
    } finally {
      setUploadingSlotId(null);
      setActiveSlotPhotoKey(null);
    }
  };

  const deleteSlotPhoto = (photoKey: string) => {
    if (!photoKey) return;
    if (!window.confirm('この画像をスロットおよびデータベースから完全に削除しますか？')) return;
    
    const newPhotos = { ...photos };
    delete newPhotos[photoKey];
    onPhotosChange(newPhotos);
  };

  const addSection = () => {
    const newSection: DialogueSection = {
      id: `section-${Date.now()}`,
      heading: '新しいセクション',
      items: [],
    };
    updateSections([...sections, newSection]);
  };

  const addItem = (sectionId: string, type: DialogueItem['type']) => {
    const newSections = sections.map(s => {
      if (s.id === sectionId) {
        const newItem: DialogueItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          type,
          text: '',
          speaker: participants[0]?.id || 'interviewer',
          speaker_name: participants[0]?.name || 'イトウ',
        };
        return { ...s, items: [...s.items, newItem] };
      }
      return s;
    });
    updateSections(newSections);
  };

  const toggleItemSelection = (id: string) => {
    const newSet = new Set(selectedItemIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItemIds(newSet);
  };

  const selectAllInSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const newSet = new Set(selectedItemIds);
    section.items.forEach(item => newSet.add(item.id));
    setSelectedItemIds(newSet);
  };

  const clearSelection = () => {
    setSelectedItemIds(new Set());
  };

  const bulkAssignSpeaker = (participant: Participant) => {
    const newSections = sections.map(s => ({
      ...s,
      items: s.items.map(item => {
        if (selectedItemIds.has(item.id)) {
          return {
            ...item,
            speaker: participant.id,
            speaker_name: participant.name,
            type: 'dialogue' as const,
          };
        }
        return item;
      }),
    }));
    updateSections(newSections);
    clearSelection();
  };

  const updateItem = (sectionId: string, itemId: string, data: Partial<DialogueItem>) => {
    const newSections = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: s.items.map(item => item.id === itemId ? { ...item, ...data } : item)
        };
      }
      return s;
    });
    updateSections(newSections);
  };

  const removeItem = (sectionId: string, itemId: string) => {
    const newSections = sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, items: s.items.filter(item => item.id !== itemId) };
      }
      return s;
    });
    updateSections(newSections);
  };

  return (
    <div className="space-y-8">
      {/* 画像差し込みスロット用 共通隠しファイル入力 */}
      <input
        type="file"
        ref={slotFileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeSlotPhotoKey) {
            handleSlotFileChange(activeSlotPhotoKey, file);
          }
          if (e.target) e.target.value = '';
        }}
        accept="image/*"
        className="hidden"
      />
      {selectedItemIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-4 rounded-full bg-slate-900 px-6 py-3 shadow-2xl ring-4 ring-brand-accent/30">
          <span className="text-sm font-bold text-white">{selectedItemIds.size}件選択中</span>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="flex gap-2">
            {participants.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => bulkAssignSpeaker(p)}
                className="flex items-center gap-2 rounded-full bg-brand-accent/20 px-4 py-1.5 text-xs font-bold text-brand-accent transition-all hover:bg-brand-accent hover:text-white"
              >
                <img src={p.photoUrl} className="h-4 w-4 rounded-full object-cover" alt="" />
                {p.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSections = sections.map(s => ({
                  ...s,
                  items: s.items.map(item => selectedItemIds.has(item.id) ? { ...item, type: 'narration' as const } : item)
                }));
                updateSections(newSections);
                clearSelection();
              }}
              className="rounded-full bg-gray-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-gray-600"
            >
              ナレーション化
            </button>
          </div>
          <button type="button" onClick={clearSelection} className="ml-2 text-gray-400 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>
      )}

      {sections.map((section, sIdx) => (
        <div key={section.id} className="group relative rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex flex-1 items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-400">
                {sIdx + 1}
              </span>
              <input
                type="text"
                value={section.heading}
                onChange={(e) => {
                  const newSections = [...sections];
                  newSections[sIdx].heading = e.target.value;
                  updateSections(newSections);
                }}
                className="flex-1 bg-transparent text-lg font-bold text-gray-800 focus:outline-none focus:ring-b-2 focus:ring-brand-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => selectAllInSection(section.id)}
                className="text-xs font-bold text-brand-accent hover:underline"
              >
                セクション内全選択
              </button>
              <button 
                type="button"
                onClick={() => {
                  if(confirm('セクションを削除しますか？')) {
                    updateSections(sections.filter(s => s.id !== section.id));
                  }
                }}
                className="text-gray-300 hover:text-red-500"
              >
                <TrashIcon size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {section.items.map((item) => {
              const participant = participants.find(p => {
                if (!p) return false;
                // 1. IDでの完全一致
                if (p.id === item.speaker) return true;
                
                // 2. 名前での完全一致 (例: "イトウ" === "イトウ")
                if (p.name === item.speaker || p.name === item.speaker_name) return true;
                
                // 3. 部分一致・あいまい一致 (例: "采（サイ）" に "サイ" が含まれる場合)
                if (item.speaker && (p.name.includes(item.speaker) || item.speaker.includes(p.name))) return true;
                if (item.speaker_name && (p.name.includes(item.speaker_name) || item.speaker_name.includes(p.name))) return true;

                // 4. "interviewer" のフォールバック (スタッフ名「イトウ」へのマッピング)
                if (item.speaker === 'interviewer' && p.type === 'staff' && p.name === 'イトウ') return true;

                return false;
              });
              const isSelected = selectedItemIds.has(item.id);

              return (
                <div 
                  key={item.id} 
                  className={`group/item relative flex gap-4 rounded-xl p-3 transition-all ${
                    isSelected ? 'bg-brand-accent/5 ring-2 ring-brand-accent/30' : 'hover:bg-gray-50'
                  }`}
                >
                  <button 
                    type="button"
                    onClick={() => toggleItemSelection(item.id)}
                    className={`mt-2 h-5 w-5 rounded border-2 transition-all ${
                      isSelected ? 'border-brand-accent bg-brand-accent text-white' : 'border-gray-200 group-hover/item:border-gray-300'
                    }`}
                  >
                    {isSelected ? <CheckSquare size={16} /> : <Square size={16} className="opacity-0" />}
                  </button>

                  <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="h-10 w-10 overflow-hidden rounded-full border bg-gray-100 shadow-sm">
                      {participant?.photoUrl ? (
                        <img src={participant.photoUrl} className="h-full w-full object-cover" alt={item.speaker_name} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <UserIcon size={20} />
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400">{item.speaker_name}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    {item.type === 'dialogue' || item.type === 'narration' || item.type === 'editor_note' ? (
                      <textarea
                        value={item.text}
                        onChange={(e) => updateItem(section.id, item.id, { text: e.target.value })}
                        rows={1}
                        placeholder={item.type === 'dialogue' ? "セリフを入力..." : "注釈を入力..."}
                        className={`w-full resize-none bg-transparent py-2 text-sm text-gray-800 focus:outline-none ${
                          item.type === 'narration' ? 'italic text-gray-500' : 
                          item.type === 'editor_note' ? 'bg-yellow-50 px-2' : ''
                        }`}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                      ) : item.type === 'photo' ? (
                      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-neutral-50 p-5 text-center transition-all hover:border-brand-accent/40">
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold text-gray-500">スロット名 (photo_key):</span>
                          <input 
                            type="text" 
                            value={item.photo_key || ''} 
                            onChange={(e) => {
                              const newKey = e.target.value;
                              const oldKey = item.photo_key || '';
                              updateItem(section.id, item.id, { photo_key: newKey });
                              handlePhotoKeyChange(oldKey, newKey);
                            }}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-accent w-full sm:w-48"
                            placeholder="例: fullbody"
                          />
                        </div>

                        {/* Layout Selector */}
                        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t pt-3 border-gray-200/50">
                          <span className="text-xs font-bold text-gray-500">表示レイアウト:</span>
                          <select 
                            value={photos[item.photo_key || '']?.layout || 'landscape'} 
                            onChange={(e) => {
                              if (!item.photo_key) return;
                              const newPhotos = { ...photos };
                              if (newPhotos[item.photo_key]) {
                                newPhotos[item.photo_key] = {
                                  ...newPhotos[item.photo_key],
                                  layout: e.target.value
                                };
                                onPhotosChange(newPhotos);
                              }
                            }}
                            disabled={!item.photo_key || !photos[item.photo_key]}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-accent w-full sm:w-48 disabled:opacity-50"
                          >
                            <option value="landscape">横長 (フルサイズ表示)</option>
                            <option value="portrait">縦長 (中央寄せ最大400px表示)</option>
                          </select>
                        </div>

                        {/* Caption Input */}
                        <div className="mb-4 flex flex-col gap-1 border-t pt-3 border-gray-200/50">
                          <span className="text-xs font-bold text-gray-500">写真の説明文 (caption):</span>
                          <input
                            type="text"
                            value={photos[item.photo_key || '']?.caption || ''}
                            onChange={(e) => {
                              if (!item.photo_key) return;
                              const newPhotos = { ...photos };
                              if (newPhotos[item.photo_key]) {
                                newPhotos[item.photo_key] = {
                                  ...newPhotos[item.photo_key],
                                  caption: e.target.value
                                };
                                onPhotosChange(newPhotos);
                              }
                            }}
                            disabled={!item.photo_key || !photos[item.photo_key]}
                            placeholder="例: 撮影場所・補足コメントなど（任意）"
                            className="w-full rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-brand-accent disabled:opacity-50"
                          />
                          <p className="text-[10px] text-gray-400">入力した説明文は写真の下に小さく表示されます。</p>
                        </div>

                        {/* 画像アップロード & プレビュー */}
                        {item.photo_key ? (
                          (() => {
                            const photoData = photos[item.photo_key];
                            const imageUrl = photoData?.url || photoData?.filename;
                            const isSlotUploading = uploadingSlotId === item.photo_key;
                            const currentLayout = photoData?.layout || 'landscape';

                            return imageUrl ? (
                              <div className={`group/photo relative mx-auto overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ${
                                currentLayout === 'portrait' ? 'max-w-[200px] aspect-[3/4]' : 'max-w-sm aspect-[16/9]'
                              }`}>
                                <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity group-hover/photo:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() => triggerSlotUpload(item.photo_key!)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 hover:bg-neutral-100 shadow-md"
                                    title="画像を差し替え"
                                  >
                                    <Camera size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteSlotPhoto(item.photo_key!)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 hover:bg-red-50 shadow-md"
                                    title="画像を削除"
                                  >
                                    <TrashIcon size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                onClick={() => triggerSlotUpload(item.photo_key!)}
                                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white py-6 transition-all hover:bg-brand-accent/5 hover:border-brand-accent/40"
                              >
                                {isSlotUploading ? (
                                  <>
                                    <Loader2 className="h-6 w-6 animate-spin text-brand-accent" />
                                    <span className="text-[10px] font-bold text-gray-400">アップロード中...</span>
                                  </>
                                ) : (
                                  <>
                                    <Camera className="h-6 w-6 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500">画像を選択してアップロード</span>
                                    <span className="text-[10px] text-gray-400">※自動的にWebP圧縮され、データベースに保存されます</span>
                                  </>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          <p className="text-xs text-gray-400 italic">スロット名を入力してください</p>
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover/item:opacity-100">
                    <button 
                      type="button"
                      onClick={() => removeItem(section.id, item.id)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <TrashIcon size={14} />
                    </button>
                    <div className="cursor-grab text-gray-300 hover:text-gray-500">
                      <GripVertical size={14} />
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center gap-4 pt-4 opacity-0 transition-all group-hover:opacity-100">
              <button 
                type="button"
                onClick={() => addItem(section.id, 'dialogue')}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-brand-accent/10 hover:text-brand-accent"
              >
                <MessageSquare size={14} />
                発言を追加
              </button>
              <button 
                type="button"
                onClick={() => addItem(section.id, 'narration')}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-200"
              >
                <TypeIcon size={14} />
                ナレーション
              </button>
              <button 
                type="button"
                onClick={() => addItem(section.id, 'photo')}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-200"
              >
                <PlusIcon size={14} />
                画像スロット
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-10 text-gray-400 transition-all hover:border-brand-accent hover:bg-brand-accent/5 hover:text-brand-accent"
      >
        <PlusIcon size={24} />
        <span className="text-sm font-bold">新しいセクションを追加</span>
      </button>
    </div>
  );
}
