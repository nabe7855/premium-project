'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Plus, Save, Trash2 } from 'lucide-react';

interface Status {
  id: string;
  name: string;
  label_color?: string;
  text_color?: string;
}

export default function StatusManagement() {
  const [statuses, setStatuses] = useState<Status[]>([]);

  // 新規追加用
  const [newStatusName, setNewStatusName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('#06b6d4'); // デフォルト: cyan
  const [newTextColor, setNewTextColor] = useState('#ffffff');

  // 編集用
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingLabelColor, setEditingLabelColor] = useState('#06b6d4');
  const [editingTextColor, setEditingTextColor] = useState('#ffffff');

  // 初期ロード
  useEffect(() => {
    const loadStatuses = async () => {
      const { data, error } = await supabase
        .from('status_master')
        .select('id, name, label_color, text_color');

      if (error) {
        console.error(error);
        return;
      }
      setStatuses(data || []);
    };
    loadStatuses();
  }, []);

  // 追加
  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    const { data, error } = await supabase
      .from('status_master')
      .insert([{ name: newStatusName, label_color: newLabelColor, text_color: newTextColor }])
      .select();

    if (error) {
      console.error(error);
      alert('状態タグの追加に失敗しました');
      return;
    }

    if (data && data.length > 0) {
      setStatuses((prev) => [...prev, data[0]]);
      setNewStatusName('');
      setNewLabelColor('#06b6d4');
      setNewTextColor('#ffffff');
    }
  };

  // 削除
  const handleDeleteStatus = async (id: string) => {
    const { error } = await supabase.from('status_master').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('状態タグの削除に失敗しました');
      return;
    }
    setStatuses((prev) => prev.filter((s) => s.id !== id));
  };

  // 更新
  const handleUpdateStatus = async () => {
    if (!editingStatusId || !editingName.trim()) return;

    const { error } = await supabase
      .from('status_master')
      .update({
        name: editingName,
        label_color: editingLabelColor,
        text_color: editingTextColor,
      })
      .eq('id', editingStatusId);

    if (error) {
      console.error(error);
      alert('状態タグの更新に失敗しました');
      return;
    }

    setStatuses((prev) =>
      prev.map((s) =>
        s.id === editingStatusId
          ? { ...s, name: editingName, label_color: editingLabelColor, text_color: editingTextColor }
          : s
      )
    );

    setEditingStatusId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-cyan-100 p-4 sm:p-6">
      {/* タイトル */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-cyan-400 tracking-wide drop-shadow">
        状態タグ管理
      </h1>

      {/* 追加フォーム */}
      <div className="mb-8 p-4 rounded-xl border border-cyan-700/50 bg-gray-900/70 shadow-lg shadow-cyan-500/20">
        <h3 className="text-md font-semibold mb-3 text-cyan-300">新しい状態タグを追加</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            placeholder="例: 新人 / 店長一押し"
            className="flex-1 rounded bg-gray-800 border border-cyan-600/50 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-cyan-400"
          />
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={newLabelColor}
              onChange={(e) => setNewLabelColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
            />
            <input
              type="color"
              value={newTextColor}
              onChange={(e) => setNewTextColor(e.target.value)}
              className="w-8 h-8 cursor-pointer"
            />
          </div>
          <span
            className="px-3 py-1 rounded text-sm font-medium"
            style={{ backgroundColor: newLabelColor, color: newTextColor }}
          >
            {newStatusName || 'プレビュー'}
          </span>
          <button
            onClick={handleAddStatus}
            className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-md hover:from-cyan-500 hover:to-blue-500 transition"
          >
            <Plus size={16} />
            追加
          </button>
        </div>
      </div>

      {/* 状態タグ一覧 */}
      <h2 className="text-lg font-semibold mb-3 text-cyan-300">既存の状態タグ</h2>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div
            key={status.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/70 hover:bg-gray-800 transition"
          >
            <div className="flex items-center gap-3">
              {editingStatusId === status.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="rounded bg-gray-900 border border-cyan-600/50 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-cyan-400"
                  />
                  <input
                    type="color"
                    value={editingLabelColor}
                    onChange={(e) => setEditingLabelColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <input
                    type="color"
                    value={editingTextColor}
                    onChange={(e) => setEditingTextColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer"
                  />
                  <button
                    onClick={handleUpdateStatus}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded shadow"
                  >
                    <Save size={14} />
                    保存
                  </button>
                </>
              ) : (
                <span
                  onClick={() => {
                    setEditingStatusId(status.id);
                    setEditingName(status.name);
                    setEditingLabelColor(status.label_color || '#06b6d4');
                    setEditingTextColor(status.text_color || '#ffffff');
                  }}
                  className="cursor-pointer px-3 py-1 rounded text-sm font-medium shadow-sm"
                  style={{
                    backgroundColor: status.label_color || '#06b6d4',
                    color: status.text_color || '#ffffff',
                  }}
                >
                  {status.name}
                </span>
              )}
            </div>

            {/* 削除ボタン */}
            <button
              onClick={() => handleDeleteStatus(status.id)}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
            >
              <Trash2 size={14} />
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
