'use client';

import React from 'react';
import DiaryEditor from '../../diary/DiaryEditor';
import DiaryList from '../../diary/DiaryList';
import { CastDiary } from '@/types/cast-dashboard';

interface Props {
  diaries: CastDiary[];
  showEditor: boolean;
  onSave: (data: Omit<CastDiary, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onToggleEditor: (value: boolean) => void;
}

export default function DiarySection({
  diaries,
  showEditor,
  onSave,
  onDelete,
  onToggleEditor,
}: Props) {
  return (
    <div>
      {!showEditor ? (
        <DiaryList diaries={diaries} onEdit={() => onToggleEditor(true)} onDelete={onDelete} />
      ) : (
        <DiaryEditor onSave={onSave} onCancel={() => onToggleEditor(false)} />
      )}
    </div>
  );
}
