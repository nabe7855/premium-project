'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewStorePage() {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    address: '',
    phone: '',
    business_hours: '',
    catch_copy: '',
    description: '',
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

      <div className="grid gap-4 max-w-xl">
        <div className="space-y-1">
          <label className="text-sm font-medium">店舗名 (必須)</label>
          <input className="w-full border rounded p-2" placeholder="例: ストロベリーボーイズ福岡" onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">slug (URL用、例: fukuoka)</label>
          <input className="w-full border rounded p-2" placeholder="fukuoka" onChange={(e) => handleChange('slug', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">住所</label>
          <input className="w-full border rounded p-2" placeholder="福岡県福岡市..." onChange={(e) => handleChange('address', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">電話番号</label>
          <input className="w-full border rounded p-2" placeholder="092-1234-5678" onChange={(e) => handleChange('phone', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">営業時間</label>
          <input className="w-full border rounded p-2" placeholder="12:00〜翌朝4時" onChange={(e) => handleChange('business_hours', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">キャッチコピー</label>
          <input className="w-full border rounded p-2" placeholder="情熱的な夜をあなたに" onChange={(e) => handleChange('catch_copy', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">店舗説明</label>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="店舗の紹介文を入力してください" onChange={(e) => handleChange('description', e.target.value)} />
        </div>
      </div>

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
