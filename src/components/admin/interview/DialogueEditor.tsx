'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { DialogueSection, DialogueItem, Participant } from './types';

interface DialogueEditorProps {
  sections: DialogueSection[];
  participants: Participant[];
  onChange: (sections: DialogueSection[]) => void;
}

export default function DialogueEditor({ sections, participants, onChange }: DialogueEditorProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());

  const updateSections = (newSections: DialogueSection[]) => {
    onChange(newSections);
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
                      <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center">
                        <p className="text-xs font-bold text-gray-400">画像差し込みスロット: {item.photo_key}</p>
                        <input 
                          type="text" 
                          value={item.photo_key} 
                          onChange={(e) => updateItem(section.id, item.id, { photo_key: e.target.value })}
                          className="mt-2 rounded border border-gray-200 px-2 py-1 text-[10px]"
                          placeholder="photo_keyを入力..."
                        />
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
