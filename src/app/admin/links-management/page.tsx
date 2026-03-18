'use client';

import {
  deletePartnerLink,
  getAllPartnerLinks,
  upsertPartnerLink,
  PartnerLinkData,
} from '@/lib/actions/partnerLinks';
import { getInternalStores } from '@/lib/actions/store-actions';
import { supabase } from '@/lib/supabaseClient';
import {
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  X,
  Link2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const CATEGORIES = [
  { id: 'general', label: '女性用風俗 情報サイト' },
  { id: 'recruit', label: '求人・募集サイト' },
  { id: 'media', label: '関連メディア' },
];

const DEFAULT_LOCATIONS = [
  { id: 'all', label: '全店共通' },
];

interface PartnerLink extends Required<PartnerLinkData> {
  created_at: string;
  updated_at: string;
}

const emptyForm = (): PartnerLinkData => ({
  site_name: '',
  site_url: '',
  banner_url: '',
  description: '',
  seo_keywords: '',
  category: 'general',
  location: 'all',
  display_order: 1,
  is_active: true,
});

export default function LinksManagementPage() {
  const [links, setLinks] = useState<PartnerLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<PartnerLink | null>(null);
  const [form, setForm] = useState<PartnerLinkData>(emptyForm());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterLoc, setFilterLoc] = useState('all');
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);

  useEffect(() => { 
    fetchLinks(); 
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const result = await getInternalStores();
    if (result.success && result.stores) {
      const dbLocs = result.stores.map((s: any) => ({ id: s.slug, label: s.name }));
      setLocations([...DEFAULT_LOCATIONS, ...dbLocs]);
    }
  };

  const fetchLinks = async () => {
    setIsLoading(true);
    const result = await getAllPartnerLinks();
    if (result.success) setLinks((result.links as any) || []);
    setIsLoading(false);
  };

  const openModal = (link?: PartnerLink) => {
    setSelectedFile(null);
    if (link) {
      setEditing(link);
      setForm({
        id: link.id,
        site_name: link.site_name,
        site_url: link.site_url,
        banner_url: link.banner_url ?? '',
        description: link.description ?? '',
        seo_keywords: link.seo_keywords ?? '',
        category: link.category,
        location: link.location,
        display_order: link.display_order,
        is_active: link.is_active,
      });
      setPreviewUrl(link.banner_url ?? '');
    } else {
      setEditing(null);
      setForm({ ...emptyForm(), display_order: links.length + 1 });
      setPreviewUrl('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditing(null); };

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('WebP変換に失敗しました'));
        }, 'image/webp', 0.8);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadBanner = async (file: File): Promise<string | null> => {
    const webpBlob = await convertToWebP(file);
    const path = `partner-links/${Date.now()}.webp`;
    const { error } = await supabase.storage.from('banners').upload(path, webpBlob, { 
      upsert: false,
      contentType: 'image/webp'
    });
    if (error) { console.error(error); return null; }
    const { data } = supabase.storage.from('banners').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.site_name) return alert('サイト名を入力してください');
    if (!form.site_url) return alert('URLを入力してください');

    setIsSaving(true);
    try {
      let finalBannerUrl = form.banner_url ?? '';
      if (selectedFile) {
        const url = await uploadBanner(selectedFile);
        if (!url) throw new Error('バナー画像のアップロードに失敗しました');
        finalBannerUrl = url;
      }
      const result = await upsertPartnerLink({ ...form, banner_url: finalBannerUrl });
      if (!result.success) throw new Error(result.error);
      await fetchLinks();
      closeModal();
    } catch (e: any) {
      alert(`保存に失敗: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (link: PartnerLink) => {
    if (!confirm(`「${link.site_name}」を削除してよろしいですか？`)) return;
    const result = await deletePartnerLink(link.id!);
    if (!result.success) return alert('削除に失敗しました');
    setLinks(links.filter((l) => l.id !== link.id));
  };

  const handleToggle = async (link: PartnerLink) => {
    const result = await upsertPartnerLink({ ...link, is_active: !link.is_active });
    if (!result.success) return alert('更新に失敗しました');
    setLinks(links.map((l) => (l.id === link.id ? { ...l, is_active: !l.is_active } : l)));
  };

  const filtered = links.filter((l: any) => {
    const catMatch = filterCat === 'all' || l.category === filterCat;
    const locMatch = filterLoc === 'all' || l.location === filterLoc;
    return catMatch && locMatch;
  });

  return (
    <div className="p-2 md:p-0">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">パートナーリンク管理</h1>
            <p className="mt-1 text-sm text-brand-text-secondary">
              /links ページに表示される相互リンク先を管理します
            </p>
            <a
              href="/links"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs text-brand-accent hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              公開ページを確認
            </a>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            サイトを追加
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: '合計', value: links.length, color: 'text-white' },
            { label: '公開中', value: links.filter((l) => l.is_active).length, color: 'text-emerald-400' },
            { label: '非公開', value: links.filter((l) => !l.is_active).length, color: 'text-gray-500' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-700/50 bg-brand-secondary p-5 shadow-lg">
              <div className="text-sm text-brand-text-secondary">{s.label}</div>
              <div className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex flex-wrap gap-2">
            {[{ id: 'all', label: 'すべてのカテゴリ' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filterCat === c.id
                    ? 'bg-brand-accent text-white'
                    : 'border border-gray-700 bg-brand-secondary text-gray-400 hover:border-gray-500'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-gray-700 mx-2 hidden md:block" />
          <div className="flex flex-wrap gap-2">
            {[...locations].map((l) => (
              <button
                key={l.id}
                onClick={() => setFilterLoc(l.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  filterLoc === l.id
                    ? 'bg-brand-accent text-white'
                    : 'border border-gray-700 bg-brand-secondary text-gray-400 hover:border-gray-500'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-700 p-16 text-center">
            <Link2 className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-3 text-gray-500">リンクがありません。「サイトを追加」から登録してください。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-gray-700/50 bg-brand-secondary p-5 shadow-lg transition hover:border-gray-600"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Banner preview */}
                  <div className="relative h-20 w-36 flex-shrink-0 overflow-hidden rounded-xl bg-gray-800/50">
                    {link.banner_url ? (
                      <img src={link.banner_url} alt={link.site_name} className="h-full w-full object-contain p-1" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-600">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    {!link.is_active && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-[10px] text-gray-400">非公開</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-brand-primary px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                        {CATEGORIES.find((c) => c.id === link.category)?.label ?? link.category}
                      </span>
                      <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[10px] font-bold text-gray-400">
                        {locations.find((l) => l.id === link.location)?.label ?? link.location}
                      </span>
                      <span className="text-xs text-gray-500">表示順: {link.display_order}</span>
                    </div>
                    <h3 className="font-bold text-white">{link.site_name}</h3>
                    {link.description && (
                      <p className="mt-0.5 text-sm text-gray-400 line-clamp-1">{link.description}</p>
                    )}
                    <a href={link.site_url} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 truncate text-xs text-brand-accent hover:underline">
                      <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      {link.site_url}
                    </a>
                    {link.seo_keywords && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {link.seo_keywords.split(',').map((k) => (
                          <span key={k} className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] text-rose-300">{k.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(link)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                        link.is_active
                          ? 'border-emerald-800 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                          : 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {link.is_active ? <><Eye className="h-3.5 w-3.5" />公開</> : <><EyeOff className="h-3.5 w-3.5" />非公開</>}
                    </button>
                    <button
                      onClick={() => openModal(link)}
                      className="flex items-center gap-1.5 rounded-lg border border-indigo-900 bg-indigo-900/30 px-3 py-2 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-900/50"
                    >
                      <Edit2 className="h-3.5 w-3.5" />編集
                    </button>
                    <button
                      onClick={() => handleDelete(link)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-900 bg-red-900/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-900/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-700 bg-brand-secondary p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{editing ? 'サイト編集' : 'サイト追加'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>

            <div className="space-y-5">
              {/* Site name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-400">サイト名 *</label>
                <input
                  type="text"
                  value={form.site_name}
                  onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="例: 女風せらっぴ"
                />
              </div>

              {/* URL */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-400">リンク先URL *</label>
                <input
                  type="text"
                  value={form.site_url}
                  onChange={(e) => {
                    const val = e.target.value;
                    let finalUrl = val;
                    // HTMLタグからリンク先(href)と画像(src)を両方抽出
                    if (val.includes('<') && (val.includes('href=') || val.includes('src='))) {
                      const hrefMatch = val.match(/href=["'](.*?)["']/);
                      const srcMatch = val.match(/src=["'](.*?)["']/);
                      if (hrefMatch) finalUrl = hrefMatch[1];
                      if (srcMatch && !form.banner_url && !selectedFile) {
                        setForm(prev => ({ ...prev, site_url: finalUrl, banner_url: srcMatch[1] }));
                        setPreviewUrl(srcMatch[1]);
                        return;
                      }
                    }
                    setForm({ ...form, site_url: finalUrl });
                  }}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              {/* Category & Location & Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-400">カテゴリ</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-400">表示店舗</label>
                  <select
                    value={form.location ?? 'all'}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-400">表示順</label>
                  <input
                    type="number"
                    min={1}
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-400">紹介文（表示される説明）</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="サイトの特徴や紹介文を入力してください。SEOにも効果的です。"
                />
              </div>

              {/* SEO Keywords */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-400">SEOキーワード（カンマ区切り）</label>
                <input
                  type="text"
                  value={form.seo_keywords ?? ''}
                  onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-brand-primary px-4 py-3 text-white focus:border-brand-accent focus:outline-none"
                  placeholder="例: 福岡 女風, 博多 女性用風俗, 女風情報"
                />
                <p className="mt-1 text-xs text-gray-500">タグとして公開ページに表示されます</p>
              </div>

              {/* Banner upload */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-400">バナー画像</label>
                {previewUrl && (
                  <div className="mb-3 relative h-24 w-48 overflow-hidden rounded-xl border border-gray-700 bg-gray-900/50">
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-contain p-1" />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer rounded-lg border border-dashed border-gray-600 px-4 py-3 text-sm text-brand-accent hover:bg-gray-800 shrink-0">
                      画像をアップロード
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            setPreviewUrl(URL.createObjectURL(file));
                            setForm({ ...form, banner_url: '' }); // will be replaced after upload
                          }
                        }}
                      />
                    </label>
                    <span className="text-xs text-gray-500">または</span>
                    <input
                      type="text"
                      value={selectedFile ? '（ローカルファイルを選択中）' : (form.banner_url ?? '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        let finalUrl = val;
                        // HTMLタグからリンク先(href)と画像(src)を両方抽出
                        if (val.includes('<') && (val.includes('href=') || val.includes('src='))) {
                          const hrefMatch = val.match(/href=["'](.*?)["']/);
                          const srcMatch = val.match(/src=["'](.*?)["']/);
                          if (srcMatch) finalUrl = srcMatch[1];
                          if (hrefMatch && !form.site_url) {
                            setForm(prev => ({ ...prev, site_url: hrefMatch[1], banner_url: finalUrl }));
                            setPreviewUrl(finalUrl);
                            return;
                          }
                        }
                        setSelectedFile(null);
                        setPreviewUrl(finalUrl);
                        setForm({ ...form, banner_url: finalUrl });
                      }}
                      readOnly={!!selectedFile}
                      className="flex-1 rounded-lg border border-gray-600 bg-brand-primary px-3 py-3 text-sm text-white focus:border-brand-accent focus:outline-none disabled:opacity-50"
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    ※外部サイトのバナー用HTML（&lt;a href...&gt;等）を貼り付けると、自動で<span className="text-amber-400 font-semibold">リンク先と画像のURLを両方</span>抽出して設定します。
                  </p>
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.is_active ? 'bg-brand-accent' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-5 left-0.5' : 'left-0.5'}`} />
                </button>
                <span className="text-sm text-gray-300">{form.is_active ? '公開する' : '非公開にする'}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={closeModal} className="flex-1 rounded-lg border border-gray-600 px-6 py-3 text-gray-300 hover:bg-gray-800">キャンセル</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 rounded-lg bg-brand-accent px-6 py-3 font-bold text-white disabled:opacity-60"
              >
                {isSaving ? <><Loader2 className="inline h-4 w-4 animate-spin mr-2" />保存中...</> : editing ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
