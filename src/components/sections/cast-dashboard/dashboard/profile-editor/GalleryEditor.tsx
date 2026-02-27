'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  cast_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  file_path?: string;
}

interface GalleryEditorProps {
  castId: string;
}

// ✅ ファイル名を完全に英数字に変換（日本語・スペース対策）
function sanitizeFileName(fileName: string): string {
  const ext = fileName.includes('.') ? fileName.split('.').pop() : 'png';
  // ランダム文字列を付けて衝突も防ぐ
  const random = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}_${random}.${ext}`;
}

export default function GalleryEditor({ castId }: GalleryEditorProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);

  // ✅ ギャラリー & メイン画像取得
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

      // casts から main_image_url を取得
      const { data: cast, error: castError } = await supabase
        .from('casts')
        .select('main_image_url')
        .eq('id', castId)
        .maybeSingle();

      if (!castError) {
        setMainImageUrl(cast?.main_image_url ?? null);
      }
    };

    loadGallery();
  }, [castId]);

  // ✅ アップロード
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      // ファイル名を安全化
      const safeFileName = sanitizeFileName(file.name);
      const filePath = `${castId}/${safeFileName}`;

      const { error: storageError } = await supabase.storage
        .from('gallery') // ← バケット名を確認
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (storageError) throw storageError;

      const { data: publicData } = supabase.storage.from('gallery').getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      if (!publicUrl) throw new Error('公開URLの取得に失敗しました');

      const { data: inserted, error: insertError } = await supabase
        .from('gallery_items')
        .insert([
          {
            cast_id: castId,
            image_url: publicUrl,
            caption: caption || null,
            file_path: filePath,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

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

  // ✅ 削除
  const handleDelete = async (id: string) => {
    if (!confirm('この画像を削除しますか？')) return;

    try {
      const { data: record, error: fetchError } = await supabase
        .from('gallery_items')
        .select('file_path')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const filePath = record?.file_path as string | undefined;

      if (filePath) {
        const { error: storageError } = await supabase.storage.from('gallery').remove([filePath]);
        if (storageError) throw storageError;
      }

      const { error: dbError } = await supabase.from('gallery_items').delete().eq('id', id);
      if (dbError) throw dbError;

      setItems(items.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ 削除エラー:', err);
      alert('削除に失敗しました');
    }
  };

  // ✅ メイン画像に設定
  const handleSetMain = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('casts')
        .update({ main_image_url: imageUrl })
        .eq('id', castId);

      if (error) throw error;

      setMainImageUrl(imageUrl);
      alert('一覧ページ用のメイン画像を設定しました！');
    } catch (err) {
      console.error('❌ メイン画像設定エラー:', err);
      alert('メイン画像の設定に失敗しました');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">ギャラリー管理</h3>

      {/* アップロードフォーム */}
      <div className="flex flex-col items-center gap-4 rounded-xl border border-pink-100 bg-pink-50/50 p-5 sm:flex-row">
        <div className="relative w-full sm:flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-100 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-pink-700 hover:file:bg-pink-200"
          />
        </div>
        <input
          type="text"
          placeholder="キャプション (任意)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full rounded-lg border-gray-300 px-4 py-2.5 text-sm transition focus:border-transparent focus:ring-2 focus:ring-pink-400 sm:flex-1"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full shrink-0 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2.5 font-medium text-white shadow-sm transition hover:from-pink-600 hover:to-rose-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {uploading ? 'アップロード中…' : 'アップロード'}
        </button>
      </div>

      {/* ギャラリー一覧 */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={item.image_url}
                  alt={item.caption ?? 'ギャラリー画像'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {item.caption && (
                <div className="border-t border-gray-100 p-3">
                  <p className="truncate text-sm text-gray-700" title={item.caption}>
                    {item.caption}
                  </p>
                </div>
              )}

              {/* メイン表示ラベル */}
              {mainImageUrl === item.image_url && (
                <span className="absolute left-2 top-2 z-10 rounded bg-pink-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                  メイン画像
                </span>
              )}

              {/* ホバーアクション */}
              <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
                <button
                  onClick={() => handleSetMain(item.image_url)}
                  className="pointer-events-auto rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-pink-600 shadow-lg transition hover:scale-105 hover:bg-pink-50"
                >
                  メインに設定
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="pointer-events-auto rounded-full bg-black/70 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:scale-105 hover:bg-black/90"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
          <p className="text-sm text-gray-400">
            画像がまだありません。
            <br />
            素敵な写真をアップロードしましょう！
          </p>
        </div>
      )}
    </div>
  );
}
