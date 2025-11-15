'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewStorePage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    catch_copy: '',
    image_url: '',
    theme_color: '#a855f7', // デフォルトカラー
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 画像アップロード処理
  const handleUpload = async () => {
    if (!file) return alert('画像ファイルを選択してください');
    setUploading(true);

    const filePath = `stores/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('store-images')
      .upload(filePath, file);

    if (error) {
      alert('❌ 画像アップロード失敗: ' + error.message);
      setUploading(false);
      return;
    }

    // 公開URLを取得
    const { data } = supabase.storage
      .from('store-images')
      .getPublicUrl(filePath);

    setForm((prev) => ({ ...prev, image_url: data.publicUrl }));
    setUploading(false);
    alert('✅ 画像をアップロードしました');
  };

  // 店舗追加
  const handleSubmit = async () => {
    const { error } = await supabase.from('stores').insert([form]);
    if (error) {
      alert('❌ エラー: ' + error.message);
    } else {
      alert('✅ 店舗を追加しました');
      window.location.href = '/admin/stores';
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">新規店舗追加</h1>

      <input placeholder="店舗名" onChange={(e) => handleChange('name', e.target.value)} />
      <input placeholder="slug (例: tokyo)" onChange={(e) => handleChange('slug', e.target.value)} />
      <input placeholder="住所" onChange={(e) => handleChange('address', e.target.value)} />
      <input placeholder="電話番号" onChange={(e) => handleChange('phone', e.target.value)} />
      <input placeholder="キャッチコピー" onChange={(e) => handleChange('catch_copy', e.target.value)} />

      {/* 画像アップロード */}
      <div>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'アップロード中...' : '画像アップロード'}
        </button>
        {form.image_url && (
          <img src={form.image_url} alt="preview" className="mt-2 h-32 rounded" />
        )}
      </div>

      {/* テーマカラー */}
      <div>
        <label>テーマカラー: </label>
        <input
          type="color"
          value={form.theme_color}
          onChange={(e) => handleChange('theme_color', e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>保存</button>
    </div>
  );
}
