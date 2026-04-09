'use client';

import { supabase } from '@/lib/supabaseClient';
import { Info, Camera, X, Check, Trash2, Heart, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';

interface GalleryItem {
  id: string;
  cast_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
  file_path?: string;
}

interface GalleryEditorProps {
  castId: string;
}

// ✅ ファイル名を完全に英数字に変換（日本語・スペース対策）
function sanitizeFileName(fileName: string): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `${Date.now()}_${random}.webp`;
}

// ✅ WebP 変換関数
async function convertToWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Conversion failed'));
          },
          'image/webp',
          0.85 // 画質 85%
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function GalleryEditor({ castId }: GalleryEditorProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // ✅ ギャラリー & メイン画像取得
  useEffect(() => {
    const loadGallery = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('cast_id', castId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ギャラリー取得エラー:', error);
        return;
      }
      setItems(data ?? []);

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

  // ✅ ファイル選択時のプレビュー生成
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // ✅ アップロード
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const webpBlob = await convertToWebP(file);
      const webpFile = new File([webpBlob], sanitizeFileName(file.name), { type: 'image/webp' });
      const filePath = `${castId}/${webpFile.name}`;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(filePath, webpFile, {
          upsert: true,
          cacheControl: '3600',
        });

      if (storageError) throw storageError;

      const { data: publicData } = supabase.storage.from('gallery').getPublicUrl(filePath);
      const publicUrl = publicData.publicUrl;
      if (!publicUrl) throw new Error('公開URLの取得に失敗しました');

      // 新しいアイテムのsort_orderは末尾(最大値+1)
      const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;

      const { data: inserted, error: insertError } = await supabase
        .from('gallery_items')
        .insert([
          {
            cast_id: castId,
            image_url: publicUrl,
            caption: caption || null,
            file_path: filePath,
            sort_order: maxOrder,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      const newItem = inserted as GalleryItem;

      if (items.length === 0) {
        await supabase
          .from('casts')
          .update({ main_image_url: newItem.image_url })
          .eq('id', castId);
        setMainImageUrl(newItem.image_url);
      }

      setItems([...items, newItem]);
      setFile(null);
      setPreviewUrl(null);
      setCaption('');
      alert('写真をアップロードしました！');
    } catch (err) {
      console.error('❌ 画像アップロード失敗:', err);
      alert('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

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

  const handleSetMain = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('casts')
        .update({ main_image_url: imageUrl })
        .eq('id', castId);

      if (error) throw error;

      setMainImageUrl(imageUrl);
      alert('メイン画像に設定しました！');
    } catch (err) {
      console.error('❌ メイン画像設定エラー:', err);
      alert('メイン画像の設定に失敗しました');
    }
  };

  // ✅ 並べ替え: アイテムを上に移動
  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setItems(prev => {
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems.map((item, i) => ({ ...item, sort_order: i }));
    });
  }, []);

  // ✅ 並べ替え: アイテムを下に移動
  const moveDown = useCallback((index: number) => {
    setItems(prev => {
      if (index >= prev.length - 1) return prev;
      const newItems = [...prev];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return newItems.map((item, i) => ({ ...item, sort_order: i }));
    });
  }, []);

  // ✅ 並べ替え順序をDBに保存
  const saveOrder = async () => {
    setSavingOrder(true);
    try {
      const updates = items.map((item, index) =>
        supabase
          .from('gallery_items')
          .update({ sort_order: index })
          .eq('id', item.id)
      );
      await Promise.all(updates);
      setIsReordering(false);
      alert('並び順を保存しました！');
    } catch (err) {
      console.error('❌ 並び順保存エラー:', err);
      alert('並び順の保存に失敗しました');
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">宣材写真・管理</h3>
        <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
          合計 {items.length} 枚
        </span>
      </div>

      {/* ✅ モバイル最適化されたアップロードエリア */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-pink-200 bg-white p-6 shadow-sm transition-all hover:border-pink-300">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左側: 写真選択/プレビュー */}
          <div className="relative mx-auto h-48 w-48 shrink-0 lg:mx-0">
            {previewUrl ? (
              <div className="group relative h-full w-full">
                <img
                  src={previewUrl}
                  className="h-full w-full rounded-2xl object-cover shadow-lg"
                  alt="プレビュー"
                />
                <button
                  onClick={() => { setFile(null); setPreviewUrl(null); }}
                  className="absolute -right-2 -top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-lg transition hover:scale-110"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-2xl bg-pink-50 text-pink-400 transition-colors hover:bg-pink-100/50">
                <Camera size={48} strokeWidth={1.5} className="mb-2" />
                <span className="text-xs font-bold">写真をえらぶ</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* 右側: 入力とボタン */}
          <div className="flex flex-1 flex-col justify-center gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400">キャプション (任意)</label>
              <input
                type="text"
                placeholder="例: お気に入りの私服です✨"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm transition focus:border-pink-400 focus:bg-white focus:ring-0"
              />
            </div>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 py-3.5 font-bold text-white shadow-lg shadow-pink-100 transition active:scale-95 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>送信中...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>この写真をアップロードする</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ✅ ギャラリー一覧 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <span>📸</span> 登録済みの写真
          </h4>
          {items.length > 1 && (
            <button
              onClick={() => {
                if (isReordering) {
                  // キャンセル時は元の順序に戻す（リロード）
                  setIsReordering(false);
                  // 再取得
                  supabase
                    .from('gallery_items')
                    .select('*')
                    .eq('cast_id', castId)
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false })
                    .then(({ data }) => { if (data) setItems(data); });
                } else {
                  setIsReordering(true);
                }
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                isReordering
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              <GripVertical size={14} />
              {isReordering ? 'キャンセル' : '並べ替え'}
            </button>
          )}
        </div>

        {/* 並べ替えモード時の保存ボタン */}
        {isReordering && (
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-3 border border-indigo-100">
            <p className="flex-1 text-xs text-indigo-700">
              ↕ 矢印ボタンで写真の順番を変更してください。変更後は「保存」を押してください。
            </p>
            <button
              onClick={saveOrder}
              disabled={savingOrder}
              className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              {savingOrder ? '保存中...' : '💾 保存'}
            </button>
          </div>
        )}

        {items.length > 0 ? (
          isReordering ? (
            /* ✅ 並べ替えモード: リスト表示（モバイルフレンドリー） */
            <div className="space-y-2">
              {items.map((item, index) => {
                const isMain = mainImageUrl === item.image_url;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* 順番表示 */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-500">
                      {index + 1}
                    </div>

                    {/* サムネイル */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <img
                        src={item.image_url}
                        alt={item.caption ?? ''}
                        className="h-full w-full object-cover"
                      />
                      {isMain && (
                        <div className="absolute inset-0 flex items-center justify-center bg-pink-500/20">
                          <Heart size={16} fill="white" className="text-white drop-shadow" />
                        </div>
                      )}
                    </div>

                    {/* キャプション */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-700">
                        {item.caption || (isMain ? 'メイン画像' : '(キャプションなし)')}
                      </p>
                    </div>

                    {/* 上下ボタン */}
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-indigo-100 hover:text-indigo-600 active:scale-90 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                        title="上に移動"
                      >
                        <ChevronUp size={20} />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === items.length - 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition hover:bg-indigo-100 hover:text-indigo-600 active:scale-90 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
                        title="下に移動"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ✅ 通常表示モード: グリッド（既存デザイン維持） */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const isMain = mainImageUrl === item.image_url;
                return (
                  <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm ring-pink-500 transition-all hover:shadow-md">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 text-[0] leading-[0]">
                      <img
                        src={item.image_url}
                        alt={item.caption ?? ''}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* ステータスバッジ */}
                      {isMain && (
                        <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
                          <Heart size={10} fill="currentColor" />
                          <span>メイン</span>
                        </div>
                      )}

                      {/* モバイルで常に見えるようにボタン配置を工夫 */}
                      <div className="absolute inset-x-0 bottom-0 z-20 flex bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                        <div className="flex w-full gap-1.5 pt-4">
                          {!isMain && (
                            <button
                              onClick={() => handleSetMain(item.image_url)}
                              className="flex flex-1 items-center justify-center rounded-lg bg-white/20 px-2 py-2 text-[10px] font-bold backdrop-blur-md transition hover:bg-white/40"
                              title="メインに設定"
                            >
                              メイン
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/80 text-white backdrop-blur-md transition hover:bg-rose-600"
                            title="削除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    {item.caption && (
                      <div className="p-2 text-center text-[10px] font-medium text-gray-600 truncate border-t border-gray-50">
                        {item.caption}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-16 text-center">
            <div className="mb-4 rounded-full bg-white p-4 text-gray-300 shadow-sm">
              <Camera size={32} />
            </div>
            <p className="text-sm font-bold text-gray-400">
              まだ写真がありません
            </p>
          </div>
        )}
      </div>

      {/* インストラクション */}
      {items.length > 0 && !isReordering && (
        <div className="flex gap-3 rounded-2xl bg-blue-50/50 p-4 text-xs leading-relaxed text-blue-700">
          <Info size={16} className="shrink-0" />
          <p>
            登録した写真の下にある「メイン」ボタンを押すと、お店の一覧ページであなたの顔として表示される画像が決まります。一番自信のある写真を選んでくださいね！「並べ替え」ボタンで写真の表示順を変更できます。
          </p>
        </div>
      )}
    </div>
  );
}
