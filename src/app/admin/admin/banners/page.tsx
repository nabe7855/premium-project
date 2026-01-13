'use client';

import { supabase } from '@/lib/supabaseClient';
import {
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string; // Database column name snake_case
  link_url: string; // Database column name snake_case
  is_active: boolean; // Database column name snake_case
  display_order: number; // Database column name snake_case
  created_at: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '', // For preview
    linkUrl: '',
    isActive: true,
    displayOrder: 1,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      alert('バナー情報の取得に失敗しました');
    } else {
      setBanners(data || []);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (banner?: Banner) => {
    setSelectedFile(null);
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        description: banner.description,
        imageUrl: banner.image_url,
        linkUrl: banner.link_url,
        isActive: banner.is_active,
        displayOrder: banner.display_order,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        displayOrder: banners.length > 0 ? Math.max(...banners.map((b) => b.display_order)) + 1 : 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setSelectedFile(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('banners').upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const deleteStorageImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL
      // Expected URL format: .../storage/v1/object/public/banners/filename.jpg
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('/banners/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1]; // "filename.jpg"
        const { error } = await supabase.storage.from('banners').remove([filePath]);
        if (error) console.error('Error deleting storage image:', error);
      }
    } catch (e) {
      console.error('Error parsing image URL for deletion:', e);
    }
  };

  const handleSave = async () => {
    if (!formData.title) return alert('タイトルを入力してください');
    if (!selectedFile && !formData.imageUrl) return alert('画像を設定してください');

    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // 1. Upload new image if selected
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) throw new Error('画像のアップロードに失敗しました');

        // Delete old image if updating and image changed
        if (editingBanner && editingBanner.image_url && editingBanner.image_url !== uploadedUrl) {
          await deleteStorageImage(editingBanner.image_url);
        }

        finalImageUrl = uploadedUrl;
      }

      const bannerData = {
        title: formData.title,
        description: formData.description,
        image_url: finalImageUrl,
        link_url: formData.linkUrl,
        is_active: formData.isActive,
        display_order: formData.displayOrder,
        updated_at: new Date().toISOString(),
      };

      if (editingBanner) {
        // Update
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('banners').insert([bannerData]);
        if (error) throw error;
      }

      await fetchBanners();
      handleCloseModal();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert(`保存に失敗しました: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm('本当にこのバナーを削除してもよろしいですか？')) return;

    try {
      // 1. Delete image from storage
      if (banner.image_url) {
        await deleteStorageImage(banner.image_url);
      }

      // 2. Delete record
      const { error } = await supabase.from('banners').delete().eq('id', banner.id);
      if (error) throw error;

      setBanners(banners.filter((b) => b.id !== banner.id));
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      alert('削除に失敗しました');
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id);

      if (error) throw error;

      // Optimistic update
      setBanners(banners.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b)));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ステータス更新に失敗しました');
    }
  };

  return (
    <div className="p-2 md:p-0">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">バナー管理</h1>
            <p className="mt-2 text-sm text-brand-text-secondary">
              サイトに表示するバナーの管理・編集ができます
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-opacity-90 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            新規バナー追加
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-700/50 bg-brand-secondary p-6 shadow-lg">
            <div className="text-sm font-medium text-brand-text-secondary">総バナー数</div>
            <div className="mt-2 text-3xl font-bold text-white">{banners.length}</div>
          </div>
          <div className="rounded-2xl border border-gray-700/50 bg-brand-secondary p-6 shadow-lg">
            <div className="text-sm font-medium text-brand-text-secondary">公開中</div>
            <div className="mt-2 text-3xl font-bold text-emerald-400">
              {banners.filter((b) => b.is_active).length}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-700/50 bg-brand-secondary p-6 shadow-lg">
            <div className="text-sm font-medium text-brand-text-secondary">非公開</div>
            <div className="mt-2 text-3xl font-bold text-gray-500">
              {banners.filter((b) => !b.is_active).length}
            </div>
          </div>
        </div>

        {/* Banner List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand-accent" />
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-2xl border border-gray-700/50 bg-brand-secondary shadow-lg transition-all hover:border-gray-600"
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                  {/* Banner Preview */}
                  <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-800 md:w-48">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                    {!banner.is_active && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-bold text-gray-300">
                          非公開
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="flex-grow">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                        <p className="mt-1 text-sm text-brand-text-secondary">
                          {banner.description}
                        </p>
                      </div>
                      <span className="ml-4 rounded-full border border-gray-700 bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-text-secondary">
                        表示順: {banner.display_order}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <span className="max-w-[200px] truncate">{banner.link_url}</span>
                      </div>
                      <div>作成日: {new Date(banner.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row gap-2 md:flex-col">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        banner.is_active
                          ? 'border border-emerald-900 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                          : 'border border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {banner.is_active ? (
                        <>
                          <Eye className="h-4 w-4" />
                          公開中
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          非公開
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenModal(banner)}
                      className="flex items-center gap-2 rounded-lg border border-indigo-900 bg-indigo-900/30 px-4 py-2 text-sm font-semibold text-indigo-400 transition-all hover:bg-indigo-900/50"
                    >
                      <Edit2 className="h-4 w-4" />
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      className="flex items-center gap-2 rounded-lg border border-red-900 bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-400 transition-all hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4" />
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-gray-700 bg-brand-secondary p-12 text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-600" />
                <h3 className="mt-4 text-lg font-semibold text-white">バナーがありません</h3>
                <p className="mt-2 text-sm text-gray-500">新規バナーを追加してください</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-brand-secondary p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingBanner ? 'バナー編集' : '新規バナー追加'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">タイトル</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="バナーのタイトルを入力"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">説明文</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="バナーの説明を入力"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">バナー画像</label>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 transition-colors hover:bg-gray-800/50">
                  {formData.imageUrl ? (
                    <div className="relative w-full text-center">
                      <div className="mx-auto mb-4 overflow-hidden rounded-lg border border-gray-600 bg-gray-800">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="h-48 w-full object-contain"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: '' });
                          setSelectedFile(null);
                        }}
                        className="inline-flex items-center gap-2 rounded-md border border-red-900 bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-900/50"
                      >
                        <Trash2 className="h-4 w-4" />
                        画像を削除
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
                      <div className="mt-4 flex justify-center text-sm leading-6 text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-transparent font-semibold text-brand-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-accent focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-brand-accent/80"
                        >
                          <span>画像をアップロード</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedFile(file);
                                const url = URL.createObjectURL(file);
                                setFormData({ ...formData, imageUrl: url });
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ＆ドロップ</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-400">
                  リンク先URL
                </label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  placeholder="/recruit"
                />
              </div>

              {/* Display Order & Active Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">表示順</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">公開状態</label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === 'active',
                      })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
                  >
                    <option value="active">公開</option>
                    <option value="inactive">非公開</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="flex-1 rounded-lg border border-gray-600 px-6 py-3 font-semibold text-gray-300 transition-all hover:bg-gray-800 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex flex-1 items-center justify-center rounded-lg bg-brand-accent px-6 py-3 font-semibold text-white transition-all hover:bg-opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : editingBanner ? (
                  '更新'
                ) : (
                  '追加'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
