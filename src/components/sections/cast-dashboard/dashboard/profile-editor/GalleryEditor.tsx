'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface GalleryItem {
  id: string;
  cast_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  file_path?: string; // 👈 追加
}

interface GalleryEditorProps {
  castId: string;
}

export default function GalleryEditor({ castId }: GalleryEditorProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // ✅ ギャラリー一覧取得
  useEffect(() => {
    const loadGallery = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('cast_id', castId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ギャラリー取得エラー:', error);
        return;
      }
      setItems(data ?? []);
    };

    loadGallery();
  }, [castId]);

  // ✅ 画像アップロード
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const filePath = `${castId}/${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (storageError) throw storageError;

      const { data: publicData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      if (!publicUrl) throw new Error('公開URLの取得に失敗しました');

      // DBに保存
      const { data: inserted, error: insertError } = await supabase
        .from('gallery_items')
        .insert([
          {
            cast_id: castId,
            image_url: publicUrl,
            caption: caption || null,
            file_path: filePath, // 👈 保存
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // UI更新
      setItems([inserted as GalleryItem, ...items]);
      setFile(null);
      setCaption('');
    } catch (err) {
      console.error('❌ 画像アップロード失敗:', err);
      alert('画像アップロードできなかった！');
    } finally {
      setUploading(false);
    }
  };

  // ✅ 削除 (DB + Storage)
  const handleDelete = async (id: string) => {
    if (!confirm('この画像を削除しますか？')) return;

    try {
      // 1. gallery_items から file_path を取得
      const { data: record, error: fetchError } = await supabase
        .from('gallery_items')
        .select('file_path')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const filePath = record?.file_path as string | undefined;

      // 2. Storageから削除
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('gallery')
          .remove([filePath]);
        if (storageError) throw storageError;
      }

      // 3. DBから削除
      const { error: dbError } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;

      // 4. UI更新
      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ 削除エラー:', err);
      alert('削除に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">ギャラリー管理</h3>

      {/* アップロードフォーム */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          type="text"
          placeholder="キャプション (任意)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          {uploading ? 'アップロード中…' : 'アップロード'}
        </button>
      </div>

      {/* ギャラリー一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative group border rounded-lg overflow-hidden"
          >
            <img
              src={item.image_url}
              alt={item.caption ?? 'ギャラリー画像'}
              className="w-full h-40 object-cover"
            />
            {item.caption && (
              <p className="p-2 text-sm text-gray-700">{item.caption}</p>
            )}
            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
