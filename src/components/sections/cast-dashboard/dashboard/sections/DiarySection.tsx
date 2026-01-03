// DiarySection.tsx (切り替え管理)
'use client';
import React, { useState } from 'react';
import { CastDiary } from '@/types/cast';
import DiaryList from './DiaryList';
import DiaryEditor from '../../diary/DiaryEditor';

interface Props {
  diaries: CastDiary[];
  castId: string;
  onSave: (data: Omit<CastDiary, 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export default function DiarySection({ diaries, castId, onSave, onDelete }: Props) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingDiary, setEditingDiary] = useState<CastDiary | undefined>();

  return (
    <div>
      {!showEditor ? (
        <DiaryList
          diaries={diaries}
          onEdit={(diary) => {
            setEditingDiary(diary);
            setShowEditor(true);
          }}
          onDelete={onDelete}
          onCreate={() => {
            setEditingDiary(undefined);
            setShowEditor(true);
          }}
        />
      ) : (
        <DiaryEditor
          castId={castId}
          initialData={editingDiary}
          onSave={onSave}
          onCancel={() => {
            setEditingDiary(undefined);
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
}
