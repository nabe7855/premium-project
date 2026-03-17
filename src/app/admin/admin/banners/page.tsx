'use client';

import {
  deleteBanner,
  getAllBanners,
  upsertBanner,
  BannerData
} from '@/lib/actions/banners';
import { deleteStorageFile } from '@/actions/storage';
import { supabase } from '@/lib/supabaseClient';
import {
  Edit2,
  Eye,
  EyeOff,
  Filter,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Plus,
  Trash2,
  X,
  Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';

// 表示場所の定義（拡張性を考慮）
const BANNER_CATEGORIES = [
  { id: 'all', label: 'すべて' },
  { id: 'sweetstay', label: 'スイートステイ' },
  { id: 'amolab', label: 'アモラボ' },
  { id: 'ikeo', label: 'イケオラボ' },
];

const BANNER_LOCATIONS = [
  { id: 'all', label: 'すべて' },
  { id: 'hero', label: 'ヒーローバナー' },
  { id: 'secondary', label: 'セカンダリバナー' },
  { id: 'magazine', label: 'マガジンバナー' },
  { id: 'carousel', label: 'カルーセル' },
];

interface Banner extends BannerData {
  id: string;
  created_at: string;
  updated_at: string;
}

export default function BannerManagementPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    displayOrder: 1,
    category: 'sweetstay',
    location: 'hero',
    metadata: {},
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    const result = await getAllBanners();
    if (result.success) {
      setBanners((result.banners as any) || []);
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (banner?: Banner) => {
    setSelectedFile(null);
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        imageUrl: banner.image_url,
        linkUrl: banner.link_url || '',
        isActive: banner.is_active,
        displayOrder: banner.display_order,
        category: banner.category,
        location: banner.location,
        metadata: banner.metadata || {},
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        displayOrder: banners.length > 0 ? Math.max(...banners.map((b) => b.display_order)) + 1 : 1,
        category: filterCategory !== 'all' ? filterCategory : 'sweetstay',
        location: filterLocation !== 'all' ? filterLocation : 'hero',
        metadata: {},
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

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, { upsert: false });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('banners').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.title) return alert('タイトルを入力してください');
    if (!selectedFile && !formData.imageUrl) return alert('画像を設定してください');

    setIsSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;

      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) throw new Error('画像のアップロードに失敗しました');
        if (editingBanner && editingBanner.image_url && editingBanner.image_url !== uploadedUrl) {
          await deleteStorageFile(editingBanner.image_url);
        }
        finalImageUrl = uploadedUrl;
      }

      const bannerData: any = {
        title: formData.title,
        subtitle: formData.subtitle,
        image_url: finalImageUrl,
        link_url: formData.linkUrl,
        category: formData.category,
        location: formData.location,
        metadata: formData.metadata,
      };

      if (editingBanner) {
        bannerData.id = editingBanner.id;
      }

      const result = await upsertBanner(bannerData);
      if (!result.success) throw new Error(result.error);

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
      if (banner.image_url) await deleteStorageFile(banner.image_url);
      const result = await deleteBanner(banner.id);
      if (!result.success) throw new Error(result.error);
      setBanners(banners.filter((b) => b.id !== banner.id));
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      alert('削除に失敗しました');
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const result = await upsertBanner({
        id: banner.id,
        category: banner.category,
        location: banner.location,
        title: banner.title,
        image_url: banner.image_url,
        display_order: banner.display_order,
        is_active: !banner.is_active,
      });
      if (!result.success) throw new Error(result.error);
      setBanners(banners.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b)));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('ステータス更新に失敗しました');
    }
  };

  const filteredBanners = banners.filter((b) => {
    const categoryMatch = filterCategory === 'all' || b.category === filterCategory;
    const locationMatch = filterLocation === 'all' || b.location === filterLocation;
    return categoryMatch && locationMatch;
  });

  return (
    <div className="p-2 md:p-0">
      <div className="mx-auto max-w-7xl">
        {/* Media Tabs */}
        <div className="mb-8 flex space-x-1 rounded-xl bg-slate-900/50 p-1">
          {BANNER_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilterCategory(category.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                filterCategory === category.id
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Setup Visualization & Header */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Instructions & Add Button */}
          <div className="lg:col-span-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">バナー管理</h1>
                <p className="mt-2 text-sm text-brand-text-secondary">
                  「{BANNER_CATEGORIES.find((c) => c.id === filterCategory)?.label}」のバナーを編集しています
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
            
            {/* Location Filter Chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="mr-2 self-center text-xs font-medium text-gray-500">クイックフィルタ:</span>
              {BANNER_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setFilterLocation(loc.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    filterLocation === loc.id
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-700 bg-brand-secondary text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Map View */}
          <div className="lg:col-span-4 rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 shadow-lg h-full">
            <h3 className="mb-3 text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-2">
              <Settings className="w-3 h-3" />
              ロケーションマップ
            </h3>
            <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-lg border border-gray-800 bg-brand-primary overflow-hidden p-2 space-y-1.5">
              {/* Schematic Web Page Representation */}
              <div 
                className={`h-4 w-full rounded border ${filterLocation === 'hero' ? 'border-brand-accent bg-brand-accent/20' : 'border-gray-800 bg-gray-900/40 text-[6px] text-gray-700 flex items-center justify-center'}`}
                onClick={() => setFilterLocation('hero')}
              >
                {filterLocation === 'hero' ? <div className="w-full h-full bg-brand-accent/30 animate-pulse" /> : 'Header'}
              </div>
              <div 
                className={`h-16 w-full rounded border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${filterLocation === 'hero' ? 'border-brand-accent bg-brand-accent/20 ring-2 ring-brand-accent/50' : 'border-gray-800 bg-gray-900'}`}
                onClick={() => setFilterLocation('hero')}
              >
                <div className="text-[8px] font-bold text-gray-600">HERO</div>
              </div>
              <div className="flex gap-1.5 h-12">
                <div 
                  className={`flex-1 rounded border transition-all cursor-pointer flex flex-col items-center justify-center ${filterLocation === 'secondary' ? 'border-brand-accent bg-brand-accent/20 ring-2 ring-brand-accent/50' : 'border-gray-800 bg-gray-900'}`}
                  onClick={() => setFilterLocation('secondary')}
                >
                   <div className="text-[6px] font-bold text-gray-600 uppercase">Secondary</div>
                </div>
                <div className="flex-[0.4] rounded border border-gray-800 bg-gray-900/30"></div>
              </div>
              <div 
                className={`h-14 w-full rounded border transition-all cursor-pointer flex flex-col items-center justify-center ${filterLocation === 'magazine' ? 'border-brand-accent bg-brand-accent/20 ring-2 ring-brand-accent/50' : 'border-gray-800 bg-gray-900'}`}
                onClick={() => setFilterLocation('magazine')}
              >
                 <div className="text-[8px] font-bold text-gray-600 uppercase">Magazine</div>
              </div>
              <div 
                className={`h-10 w-full rounded border transition-all cursor-pointer flex flex-col items-center justify-center ${filterLocation === 'carousel' ? 'border-brand-accent bg-brand-accent/20 ring-2 ring-brand-accent/50' : 'border-gray-800 bg-gray-900'}`}
                onClick={() => setFilterLocation('carousel')}
              >
                 <div className="text-[6px] font-bold text-gray-600 uppercase">Carousel</div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-center text-gray-500 italic">
              図のエリアをクリックして絞り込み可能
            </p>
          </div>
        </div>

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

        {/* Banner List Grouped by Location */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand-accent" />
          </div>
        ) : (
          <div className="space-y-12">
            {BANNER_LOCATIONS.filter(loc => (filterLocation === 'all' || loc.id === filterLocation) && loc.id !== 'all').map(locationGroup => {
              const groupBanners = filteredBanners.filter(b => b.location === locationGroup.id);
              if (groupBanners.length === 0 && filterLocation === 'all') return null;

              return (
                <div key={locationGroup.id} className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-px flex-grow bg-gray-800"></div>
                    <h2 className="flex-shrink-0 text-sm font-bold uppercase tracking-widest text-indigo-400">
                      {locationGroup.label}
                    </h2>
                    <div className="h-px flex-grow bg-gray-800"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {groupBanners.map((banner) => (
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
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="rounded-md bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                                    {BANNER_CATEGORIES.find((c) => c.id === banner.category)?.label ||
                                      banner.category}
                                  </span>
                                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                                    {BANNER_LOCATIONS.find((l) => l.id === banner.location)?.label ||
                                      banner.location}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                                {banner.subtitle && (
                                  <p className="mt-1 text-sm text-brand-text-secondary">
                                    {banner.subtitle}
                                  </p>
                                )}
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
                  </div>
                </div>
              );
            })}
            
            {filteredBanners.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-gray-700 bg-brand-secondary p-12 text-center">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-600" />
                <h3 className="mt-4 text-lg font-semibold text-white">バナーがありません</h3>
                <p className="mt-2 text-sm text-gray-500">
                  {filterLocation !== 'all' 
                    ? `「${BANNER_LOCATIONS.find(l => l.id === filterLocation)?.label}」にバナーが登録されていません` 
                    : '新規バナーを追加してください'}
                </p>
                {filterLocation !== 'all' && (
                   <button 
                    onClick={() => setFilterLocation('all')}
                    className="mt-4 text-xs text-brand-accent hover:underline"
                   >
                     すべてのロケーションを表示
                   </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Form Side */}
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">タイトル</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    placeholder="バナーのタイトルを入力"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">サブタイトル / 説明文</label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    placeholder="バナーの説明を入力"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-400">表示メディア</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    >
                      {BANNER_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-400">表示箇所</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    >
                      {BANNER_LOCATIONS.filter((l) => l.id !== 'all').map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">バナー画像</label>
                  <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-4 hover:bg-gray-800/50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-500" />
                      <label htmlFor="file-upload" className="cursor-pointer text-brand-accent text-xs font-bold block mt-2">
                        画像をアップロード
                        <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { setSelectedFile(file); setFormData({ ...formData, imageUrl: URL.createObjectURL(file) }); }
                        }} />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-400">リンク先URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    placeholder="/recruit/etc"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-400">表示順</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-400">公開状態</label>
                    <select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                      className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                    >
                      <option value="active">公開</option>
                      <option value="inactive">非公開</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Preview Side */}
              <div className="rounded-2xl border border-gray-700 bg-brand-primary/50 p-6">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">リアルタイムプレビュー</h3>
                <div className="space-y-6">
                  {/* Card Preview */}
                  <div className="overflow-hidden rounded-xl border border-gray-700 bg-brand-secondary shadow-xl transition-all">
                    <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-700">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-[10px]">画像が未設定です</span>
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                         <span className="rounded bg-brand-accent/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            {BANNER_CATEGORIES.find(c => c.id === formData.category)?.label}
                         </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mb-1">
                        {BANNER_LOCATIONS.find(l => l.id === formData.location)?.id}
                      </div>
                      <h4 className="text-sm font-bold text-white truncate">{formData.title || 'タイトル未入力'}</h4>
                      <p className="mt-1 text-xs text-gray-400 line-clamp-1">{formData.subtitle || '説明文未入力'}</p>
                    </div>
                  </div>

                  {/* Context Info */}
                  <div className="space-y-3 rounded-lg bg-black/40 p-4 text-[10px] text-gray-400">
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                       <span>配置メディア:</span>
                       <span className="font-bold text-gray-200">{BANNER_CATEGORIES.find(c => c.id === formData.category)?.label}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-800 pb-2">
                       <span>配置セクション:</span>
                       <span className="font-bold text-gray-200">{BANNER_LOCATIONS.find(l => l.id === formData.location)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>リンク先:</span>
                       <span className="font-bold text-gray-200 truncate max-w-[120px]">{formData.linkUrl || '未設定'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 rounded-lg bg-brand-accent/10 border border-brand-accent/20 p-3">
                    <Settings className="w-4 h-4 text-brand-accent shrink-0" />
                    <p className="text-[10px] text-brand-accent leading-relaxed">
                      このバナーは、{BANNER_CATEGORIES.find(c => c.id === formData.category)?.label}の「{BANNER_LOCATIONS.find(l => l.id === formData.location)?.label}」エリアに、優先度 {formData.displayOrder} で表示されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>



            <div className="mt-8 flex gap-4">
              <button onClick={handleCloseModal} className="flex-1 rounded-lg border border-gray-600 px-6 py-3 text-gray-300">キャンセル</button>
              <button onClick={handleSave} className="flex-1 bg-brand-accent px-6 py-3 rounded-lg font-bold text-white">
                {isSaving ? '保存中...' : editingBanner ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
