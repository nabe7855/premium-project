import React, { useState } from 'react';
import DiaryEditor from '../../diary/DiaryEditor';
import DiaryList from '../../diary/DiaryList';
import { CastDiary } from '@/types/cast';

interface Props {
  diaries: CastDiary[];
  showEditor: boolean;
  castId: string;
onSave: (data: Omit<CastDiary, 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onToggleEditor: (value: boolean) => void;
}

export default function DiarySection({
  diaries,
  showEditor,
  castId,
  onSave,
  onDelete,
  onToggleEditor,
}: Props) {
  // 👇 編集中の日記を保持する state を追加
  const [editingDiary, setEditingDiary] = useState<CastDiary | undefined>(undefined);

  return (
    <div>
      {!showEditor ? (
        <DiaryList
          diaries={diaries}
          onEdit={(diary) => {          // 編集開始
            setEditingDiary(diary);     // 編集対象をセット
            onToggleEditor(true);
          }}
          onDelete={onDelete}
          onCreate={() => {
            setEditingDiary(undefined); // 新規作成なので初期化
            onToggleEditor(true);
          }}
        />
      ) : (
        <DiaryEditor
          castId={castId}
          initialData={editingDiary}   // ✅ ここで渡す
          onSave={onSave}
          onCancel={() => {
            setEditingDiary(undefined); // キャンセルしたらクリア
            onToggleEditor(false);
          }}
        />
      )}
    </div>
  );
}
