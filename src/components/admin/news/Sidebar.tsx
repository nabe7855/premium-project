import React, { useState } from 'react';
import { SECTION_TEMPLATES } from './constants';
import { SectionData, SectionType } from './types';

interface SidebarProps {
  sections: SectionData[];
  activeSectionId: string | null;
  onAddSection: (type: SectionType) => void;
  onSelectSection: (id: string | null) => void;
  onReorderSections: (startIndex: number, endIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSectionId,
  onAddSection,
  onSelectSection,
  onReorderSections,
}) => {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddSection = (type: SectionType) => {
    onAddSection(type);
    setIsAddingSection(false);
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    onReorderSections(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-slate-800">Luxury CMS</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Visual Editor
          </p>
        </div>
        <button
          onClick={() => onSelectSection(null)}
          className={`rounded-2xl p-2.5 transition-all ${activeSectionId === null ? 'scale-110 bg-rose-500 text-white shadow-xl' : 'border border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
          title="ページ全体の設定"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <div className="border-b border-slate-50 p-4">
        <button
          onClick={() => setIsAddingSection(!isAddingSection)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all ${
            isAddingSection
              ? 'bg-slate-800 text-white'
              : 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-md'
          }`}
        >
          {isAddingSection ? 'キャンセル' : 'セクションを追加'}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isAddingSection ? 'mt-4 max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="grid grid-cols-1 gap-2 p-1">
            {SECTION_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.type}
                onClick={() => handleAddSection(tmpl.type)}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50"
              >
                <div className="rounded-lg bg-slate-50 p-1.5 transition-colors group-hover:bg-white group-hover:text-rose-600">
                  {tmpl.icon}
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-rose-700">
                  {tmpl.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            レイヤー構成
          </p>
        </div>
        <div className="relative space-y-2">
          {sections.length === 0 && (
            <p className="py-10 text-center text-[10px] italic text-slate-300">
              セクションがありません
            </p>
          )}
          {sections.map((section, index) => {
            const isActive = activeSectionId === section.id;
            const template = SECTION_TEMPLATES.find((t) => t.type === section.type);
            return (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, index)}
                onClick={() => onSelectSection(section.id)}
                className={`group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all ${
                  isActive
                    ? 'border-rose-200 bg-rose-50 shadow-sm'
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className={`shrink-0 rounded-xl p-2 ${isActive ? 'bg-white text-rose-500 shadow-sm' : 'bg-slate-50 text-slate-400'}`}
                >
                  {template?.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-[11px] font-black ${isActive ? 'text-rose-700' : 'text-slate-700'}`}
                  >
                    {section.content.title || template?.label || '名称未設定'}
                  </p>
                  <p className="text-[9px] uppercase tracking-tighter text-slate-300">
                    {section.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
