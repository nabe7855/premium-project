'use client';

import { Camera, ChevronLeft, ExternalLink, Eye, Link2, Plus, Save, Trash2 } from 'lucide-react';
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

import { deleteStorageFile } from '@/actions/storage';
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
  const handleUpdate = async (section: string, key: string, value: any) => {
    const newConfig = {
      ...config,
      [section]: {
        ...(config[section as keyof StoreTopPageConfig] as any),
        [key]: value,
      },
    };
    setConfig(newConfig);

    // 即時保存
    const toastId = toast.loading('設定を保存中...');
    try {
      const result = await saveStoreTopConfig(selectedStore, newConfig);
      if (result.success) {
        toast.success('設定を保存しました', { id: toastId });
      } else {
        toast.error(`保存に失敗しました: ${result.error}`, { id: toastId });
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('エラーが発生しました', { id: toastId });
    }
  };

  // 画像アップロード処理
  const handleImageUpload = async (section: string, file: File, index?: number, key?: string) => {
    if (!selectedStore) return;

    const toastId = toast.loading('画像をアップロード中...');
    console.log('Starting image upload...', { section, index, key });
    try {
      const publicUrl = await uploadStoreTopImage(selectedStore, section, file);
      console.log('Upload completed. Public URL:', publicUrl);

      if (!publicUrl) {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
        return;
      }

      if (section === 'header') {
        console.log('Processing header image upload for key:', key);
        const newHeader = { ...config.header };

        if (key === 'logoUrl') {
          console.log('Updating logoUrl. publicUrl:', publicUrl);
          // 古いロゴを削除
          const oldImageUrl = config.header.logoUrl;
          if (oldImageUrl && oldImageUrl.startsWith('http')) {
            console.log('Deleting old logo via server action:', oldImageUrl);
            const deleteResult = await deleteStorageFile(oldImageUrl);
            if (!deleteResult.success) {
              console.warn('⚠️ Old logo deletion failed:', deleteResult.error);
              // アップロード自体は成功しているので、継続するが警告を出す
              toast.error('古い画像の削除に失敗しました', { id: toastId });
            }
          }
          newHeader.logoUrl = publicUrl;
        } else if (key === 'navLinks' && typeof index === 'number') {
          // 古い画像を削除
          const oldImageUrl = config.header.navLinks[index]?.imageUrl;
          if (oldImageUrl && oldImageUrl.startsWith('http')) {
            console.log('Deleting old nav link image via server action:', oldImageUrl);
            const deleteResult = await deleteStorageFile(oldImageUrl);
            if (!deleteResult.success) {
              console.warn('⚠️ Nav link image deletion failed:', deleteResult.error);
              toast.error('古いナビ画像の削除に失敗しました', { id: toastId });
            }
          }

          const newNavLinks = [...config.header.navLinks];
          newNavLinks[index] = { ...newNavLinks[index], imageUrl: publicUrl };
          newHeader.navLinks = newNavLinks;
        } else if (key === 'specialBanner') {
          // バナー画像の更新
          const oldImageUrl = config.header.specialBanner?.imageUrl;
          if (
            oldImageUrl &&
            oldImageUrl.startsWith('http') &&
            !oldImageUrl.includes('placehold') &&
            !oldImageUrl.includes('福岡募集バナー')
          ) {
            const deleteResult = await deleteStorageFile(oldImageUrl);
            if (!deleteResult.success) {
              console.warn('⚠️ Special banner deletion failed:', deleteResult.error);
              toast.error('古いバナー画像の削除に失敗しました', { id: toastId });
            }
          }

          newHeader.specialBanner = {
            ...config.header.specialBanner,
            imageUrl: publicUrl,
          };
        }

        const newConfig = {
          ...config,
          header: newHeader,
        };
        console.log('Saving new config with header:', newConfig.header);

        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      }

      toast.success('画像をアップロードしました', { id: toastId });
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('画像のアップロードに失敗しました', { id: toastId });
    }
  };

  // 画像削除処理
  const handleImageDelete = async (index: number) => {
    if (!selectedStore) return;

    const imageUrl = config.header.navLinks[index]?.imageUrl;
    if (!imageUrl) return;

    const toastId = toast.loading('画像を削除中...');
    try {
      const deleteResult = await deleteStorageFile(imageUrl);
      if (deleteResult.success) {
        const newNavLinks = [...config.header.navLinks];
        newNavLinks[index] = { ...newNavLinks[index], imageUrl: '' };
        const newConfig = {
          ...config,
          header: { ...config.header, navLinks: newNavLinks },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
        toast.success('画像を削除しました', { id: toastId });
      } else {
        toast.error(`画像の削除に失敗しました: ${deleteResult.error}`, { id: toastId });
      }
    } catch (error) {
      console.error('Image delete failed:', error);
      toast.error('画像の削除に失敗しました', { id: toastId });
    }
  };

  // ロゴ画像削除処理
  const handleLogoDelete = async () => {
    if (!selectedStore) return;

    const imageUrl = config.header.logoUrl;
    if (!imageUrl) return;

    const toastId = toast.loading('画像を削除中...');
    try {
      if (imageUrl.startsWith('http')) {
        const deleteResult = await deleteStorageFile(imageUrl);
        if (!deleteResult.success) {
          toast.error(`画像の削除に失敗しました: ${deleteResult.error}`, { id: toastId });
          return;
        }
      }

      const newConfig = {
        ...config,
        header: { ...config.header, logoUrl: '' },
      };
      setConfig(newConfig);
      await saveStoreTopConfig(selectedStore, newConfig);
      toast.success('画像を削除しました', { id: toastId });
    } catch (error) {
      console.error('Logo delete failed:', error);
      toast.error('画像の削除に失敗しました', { id: toastId });
    }
  };

  // バナー画像削除処理
  const handleBannerDelete = async () => {
    if (!selectedStore) return;

    const imageUrl = config.header.specialBanner?.imageUrl;
    // デフォルト画像は削除しない
    if (!imageUrl || imageUrl === '/福岡募集バナー.png') {
      toast.error('この画像は削除できません');
      return;
    }

    const toastId = toast.loading('画像を削除中...');
    try {
      // httpで始まる場合のみ削除を試みる
      if (imageUrl.startsWith('http')) {
        const deleteResult = await deleteStorageFile(imageUrl);
        if (!deleteResult.success) {
          toast.error(`画像の削除に失敗しました: ${deleteResult.error}`, { id: toastId });
          return;
        }
      }

      const newConfig = {
        ...config,
        header: {
          ...config.header,
          specialBanner: {
            ...config.header.specialBanner,
            imageUrl: '', // またはデフォルト画像に戻す
          },
        },
      };
      setConfig(newConfig);
      await saveStoreTopConfig(selectedStore, newConfig);
      toast.success('画像を削除しました', { id: toastId });
    } catch (error) {
      console.error('Banner delete failed:', error);
      toast.error('画像の削除に失敗しました', { id: toastId });
    }
  };

  // ヘッダー設定のリセット
  const handleReset = async () => {
    if (!confirm('ヘッダー設定をデフォルトに戻しますか？この操作は取り消せません。')) return;

    const toastId = toast.loading('リセット中...');
    try {
      const newConfig = {
        ...config,
        header: DEFAULT_STORE_TOP_CONFIG.header,
      };
      setConfig(newConfig);
      await saveStoreTopConfig(selectedStore, newConfig);
      toast.success('ヘッダー設定をリセットしました', { id: toastId });
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error('リセットに失敗しました', { id: toastId });
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
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-9 border-gray-700 text-gray-300 hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            リセット
          </Button>

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
            {isSaving ? '保存中...' : '設定を保存'}
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
                  <div className="group relative flex items-center gap-2">
                    {config.header.logoUrl ? (
                      <img
                        key={config.header.logoUrl}
                        src={config.header.logoUrl}
                        alt="Logo"
                        className="h-10 w-auto object-contain"
                      />
                    ) : (
                      <>
                        <span className="text-3xl">🍓</span>
                        <span
                          className="font-serif text-2xl font-black italic tracking-tighter text-[#D43D6F]"
                          contentEditable={!isPreviewMode}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleUpdate('header', 'logoText', e.currentTarget.innerText)
                          }
                        >
                          {config.header.logoText}
                        </span>
                      </>
                    )}

                    {!isPreviewMode && (
                      <div className="absolute -right-8 top-1/2 flex -translate-y-1/2 flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleImageUpload('header', file, 0, 'logoUrl');
                            };
                            input.click();
                          }}
                          className="rounded bg-gray-200 p-1 hover:bg-gray-300"
                          title="ロゴ画像をアップロード"
                        >
                          <Camera className="h-4 w-4 text-gray-600" />
                        </button>
                        {config.header.logoUrl && (
                          <button
                            onClick={handleLogoDelete}
                            className="rounded bg-red-100 p-1 hover:bg-red-200"
                            title="ロゴ画像を削除"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    )}
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
                          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                              className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
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
                            {config.header.navLinks[0].imageUrl && (
                              <button
                                onClick={() => handleImageDelete(0)}
                                className="rounded-lg bg-red-500/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
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
                          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                              className="rounded-lg bg-white/20 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
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
                            {item.imageUrl && (
                              <button
                                onClick={() => handleImageDelete(idx + 1)}
                                className="rounded-lg bg-red-500/80 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
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
                              <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                                  className="rounded bg-white/20 p-1 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                >
                                  <svg
                                    className="h-4 w-4"
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
                                {item.imageUrl && (
                                  <button
                                    onClick={() => handleImageDelete(idx + 7)}
                                    className="rounded bg-red-500/80 p-1 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </div>
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

                {/* Phone Section */}
                {/* Phone Section */}
                <div className="rounded-[40px] border border-pink-50/50 bg-white p-8 text-center shadow-[0_12px_24px_-8px_rgba(0,0,0,0.05)]">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 flex items-center justify-center gap-4 text-[#D43D6F]">
                      <div className="rounded-full bg-pink-50 p-3 ring-8 ring-pink-50/30">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <span
                        className="text-4xl font-black tabular-nums tracking-tighter outline-none focus:border-b-2 focus:border-pink-300"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) =>
                          handleUpdate('header', 'phoneNumber', e.currentTarget.textContent)
                        }
                        suppressContentEditableWarning
                      >
                        {config.header.phoneNumber || '03-6356-3860'}
                      </span>
                    </div>
                    <p className="flex items-center gap-2 text-sm font-bold text-gray-400">
                      電話受付:
                      <span
                        className="outline-none focus:border-b focus:border-gray-400"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) =>
                          handleUpdate('header', 'receptionHours', e.currentTarget.textContent)
                        }
                        suppressContentEditableWarning
                      >
                        {config.header.receptionHours || '12:00〜23:00'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-sm font-bold text-gray-400">
                      営業時間:
                      <span
                        className="outline-none focus:border-b focus:border-gray-400"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) =>
                          handleUpdate('header', 'businessHours', e.currentTarget.textContent)
                        }
                        suppressContentEditableWarning
                      >
                        {config.header.businessHours || '12:00〜翌朝4時'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Special Banner */}
                <div className="group relative overflow-hidden rounded-[40px] bg-neutral-900 shadow-2xl">
                  <div className="relative block aspect-[16/7]">
                    <img
                      src={config.header.specialBanner?.imageUrl || '/福岡募集バナー.png'}
                      alt="Special Banner"
                      className="h-full w-full object-cover opacity-60"
                    />

                    {!isPreviewMode && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleImageUpload('header', file, 0, 'specialBanner');
                            };
                            input.click();
                          }}
                          className="rounded-lg bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
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
                        {config.header.specialBanner?.imageUrl &&
                          config.header.specialBanner.imageUrl !== '/福岡募集バナー.png' && (
                            <button
                              onClick={handleBannerDelete}
                              className="rounded-lg bg-red-500/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                      </div>
                    )}

                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6">
                      <p
                        className="text-[10px] font-black uppercase tracking-widest text-white/70 outline-none focus:border-b focus:border-white/50"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) => {
                          const newBanner = {
                            ...config.header.specialBanner,
                            subHeading: e.currentTarget.textContent || '',
                          };
                          handleUpdate('header', 'specialBanner', newBanner);
                        }}
                        suppressContentEditableWarning
                      >
                        {config.header.specialBanner?.subHeading || 'Strawberry Boys Premium'}
                      </p>
                      <h3
                        className="text-xl font-black leading-tight text-white outline-none focus:border-b focus:border-white/50"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) => {
                          const newBanner = {
                            ...config.header.specialBanner,
                            mainHeading: e.currentTarget.textContent || '',
                          };
                          handleUpdate('header', 'specialBanner', newBanner);
                        }}
                        suppressContentEditableWarning
                      >
                        {config.header.specialBanner?.mainHeading || '甘い誘惑を、今夜貴女に。'}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
