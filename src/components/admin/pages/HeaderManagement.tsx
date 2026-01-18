'use client';

import { ChevronLeft, ExternalLink, Eye, Link2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { getAllStores } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';

export default function HeaderManagement() {
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [config, setConfig] = useState<StoreTopPageConfig>(DEFAULT_STORE_TOP_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 設定の取得
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getStoreTopConfig(selectedStore);
        if (result.success && result.config) {
          setConfig(result.config as StoreTopPageConfig);
        } else {
          setConfig(DEFAULT_STORE_TOP_CONFIG);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        toast.error('設定の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [selectedStore]);

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveStoreTopConfig(selectedStore, config);
      if (result.success) {
        toast.success('設定を保存しました');
      } else {
        toast.error(`保存に失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  // インライン更新処理
  const handleUpdate = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof StoreTopPageConfig] as any),
        [key]: value,
      },
    }));
  };

  // 画像アップロード処理
  const handleImageUpload = async (section: string, file: File, index?: number, key?: string) => {
    if (!selectedStore) return;

    const toastId = toast.loading('画像をアップロード中...');
    try {
      const publicUrl = await uploadStoreTopImage(selectedStore, section, file);

      if (!publicUrl) {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
        return;
      }

      if (section === 'header' && key === 'navLinks' && typeof index === 'number') {
        const newNavLinks = [...config.header.navLinks];
        newNavLinks[index] = { ...newNavLinks[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          header: { ...config.header, navLinks: newNavLinks },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      }

      toast.success('画像をアップロードしました', { id: toastId });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('画像のアップロードに失敗しました', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between rounded-2xl border border-gray-700/50 bg-brand-secondary px-6 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">共通ヘッダー管理</h1>
            <p className="text-[10px] text-brand-text-secondary">
              ナビゲーションメニューとロゴを編集できます
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-9 w-[160px] border-gray-700 bg-brand-primary text-xs text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getAllStores().map((store) => (
                <SelectItem key={store.slug} value={store.slug}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-gray-700"></div>

          <Button
            variant={isPreviewMode ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={isPreviewMode ? 'h-9 bg-white/10' : 'h-9 border-gray-700 text-gray-300'}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? '編集モードに戻る' : 'プレビュー'}
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-9 bg-brand-accent font-bold hover:bg-brand-accent/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? '保存中...' : '公開する'}
          </Button>
        </div>
      </div>

      <div className="flex flex-grow gap-4 overflow-hidden">
        {/* Sidebar: Controls */}
        <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-700/30 bg-brand-primary/30 p-3">
            <span className="text-sm font-medium text-gray-200">ヘッダーを表示する</span>
            <Switch
              checked={config.header.isVisible}
              onCheckedChange={(checked) => handleUpdate('header', 'isVisible', checked)}
              className="scale-75"
            />
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <Link2 className="h-3 w-3" />
              メニュー構成
            </h2>

            <div className="space-y-3">
              {config.header.navLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      className="flex-grow bg-transparent text-sm font-bold text-white outline-none transition-colors focus:text-brand-accent"
                      value={link.name}
                      onChange={(e) => {
                        const newLinks = [...config.header.navLinks];
                        newLinks[idx] = { ...newLinks[idx], name: e.target.value };
                        handleUpdate('header', 'navLinks', newLinks);
                      }}
                      placeholder="メニュー名"
                    />
                    <button
                      onClick={() => {
                        const newLinks = config.header.navLinks.filter((_, i) => i !== idx);
                        handleUpdate('header', 'navLinks', newLinks);
                      }}
                      className="text-gray-500 transition-colors hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-black/20 px-2 py-1">
                    <ExternalLink size={12} className="text-gray-500" />
                    <input
                      className="w-full bg-transparent text-[10px] text-gray-400 outline-none"
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...config.header.navLinks];
                        newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                        handleUpdate('header', 'navLinks', newLinks);
                      }}
                      placeholder="/store/slug/..."
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed border-gray-700 bg-transparent text-xs text-gray-400 hover:bg-white/5"
                onClick={() => {
                  const newLinks = [
                    ...config.header.navLinks,
                    { name: '新規メニュー', href: '#', imageUrl: '' },
                  ];
                  handleUpdate('header', 'navLinks', newLinks);
                }}
              >
                <Plus size={14} className="mr-2" />
                メニューを追加
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-[10px] leading-relaxed text-blue-300">
              <span className="mb-1 block font-bold">💡 編集のヒント</span>
              右側のプレビュー画面でロゴやメニュー名を直接クリックして編集できます。また、メニュー画像のアイコンをクリックして新しい画像をアップロードできます。
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white">
          <div className="absolute inset-0 overflow-y-auto bg-white p-8">
            <div className="mx-auto max-w-md space-y-6">
              {/* Header Preview */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🍓</span>
                    <span
                      className="font-serif text-2xl font-black italic tracking-tighter text-[#D43D6F]"
                      contentEditable={!isPreviewMode}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdate('header', 'logoText', e.currentTarget.innerText)}
                    >
                      {config.header.logoText}
                    </span>
                  </div>
                  <div className="rounded-xl bg-pink-50 px-3 py-1.5 text-sm font-bold text-pink-500">
                    {config.header.reserveButtonText}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Preview */}
              <div className="space-y-6 rounded-2xl border-2 border-pink-100 bg-white p-6">
                <h3 className="text-sm font-bold text-gray-500">モバイルメニュープレビュー</h3>

                {/* Highlights (News) */}
                {config.header.navLinks[0] && (
                  <div className="group relative overflow-hidden rounded-[40px] bg-white shadow-[0_12px_24px_-8px_rgba(219,39,119,0.12)]">
                    <div className="flex items-center gap-6 px-4 py-6">
                      <div className="relative h-24 w-24 flex-shrink-0">
                        {config.header.navLinks[0].imageUrl ? (
                          <img
                            src={config.header.navLinks[0].imageUrl}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-3xl bg-pink-50">
                            <span className="text-2xl font-bold text-pink-300">
                              {config.header.navLinks[0].name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {!isPreviewMode && (
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload('header', file, 0, 'navLinks');
                              };
                              input.click();
                            }}
                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <svg
                              className="h-8 w-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="flex-grow">
                        <span className="text-xl font-black tracking-widest text-[#4A4A4A]">
                          {config.header.navLinks[0].name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {config.header.navLinks.slice(1, 7).map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-center justify-center gap-2 rounded-[40px] border border-transparent bg-white px-2 py-8 shadow-[0_12px_24px_-8px_rgba(219,39,119,0.12)]"
                    >
                      <div className="relative mb-4 h-28 w-28 flex-shrink-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-3xl bg-pink-50">
                            <span className="text-2xl font-bold text-pink-300">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        {!isPreviewMode && (
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload('header', file, idx + 1, 'navLinks');
                              };
                              input.click();
                            }}
                            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                      <span className="px-2 text-center text-[15px] font-bold tracking-wider text-[#4A4A4A]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Secondary Buttons */}
                <div className="space-y-4">
                  {config.header.navLinks.slice(7).map((item, idx) => {
                    const getButtonColor = (name: string) => {
                      if (name.includes('プライバシー')) return 'bg-[#9BA3AF] border-[#818B9A]';
                      if (name.includes('メディア')) return 'bg-[#C5A368] border-[#A88B5A]';
                      if (name.includes('求人')) return 'bg-[#FAD231] border-[#C8A811]';
                      if (name.includes('ライン') || name.includes('LINE'))
                        return 'bg-[#56C361] border-[#3E9A47]';
                      return 'bg-pink-500 border-pink-600';
                    };
                    const colorClass = getButtonColor(item.name);
                    const isYellow = item.name.includes('求人');

                    return (
                      <div key={idx} className="group relative">
                        <div
                          className={`flex w-full items-center gap-4 rounded-2xl border-b-[6px] ${colorClass} px-6 py-4 shadow-lg`}
                        >
                          <div className="relative h-10 w-10 flex-shrink-0">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="h-full w-full object-contain"
                              />
                            )}
                            {!isPreviewMode && (
                              <button
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file)
                                      handleImageUpload('header', file, idx + 7, 'navLinks');
                                  };
                                  input.click();
                                }}
                                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <svg
                                  className="h-5 w-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <span
                            className={`flex-1 text-center text-lg font-black tracking-widest ${isYellow ? 'text-black' : 'text-white'}`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
