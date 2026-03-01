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
  const [activeView, setActiveView] = useState<'settings' | 'preview'>('settings');

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
    let newSectionData;
    if (section === 'notificationEmail' || section === 'lineId') {
      newSectionData = value;
    } else {
      newSectionData = {
        ...(config[section as keyof StoreTopPageConfig] as any),
        [key]: value,
      };
    }

    const newConfig = {
      ...config,
      [section]: newSectionData,
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
        } else if (key === 'menuBottomBanner') {
          // ハンバーガーメニュー最下部バナー画像の更新
          const oldImageUrl = config.header.menuBottomBanner?.imageUrl;
          if (
            oldImageUrl &&
            oldImageUrl.startsWith('http') &&
            !oldImageUrl.includes('placehold') &&
            !oldImageUrl.includes('福岡募集バナー')
          ) {
            const deleteResult = await deleteStorageFile(oldImageUrl);
            if (!deleteResult.success) {
              console.warn('⚠️ Menu bottom banner deletion failed:', deleteResult.error);
              toast.error('古いバナー画像の削除に失敗しました', { id: toastId });
            }
          }

          newHeader.menuBottomBanner = {
            ...config.header.menuBottomBanner,
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
    <div className="flex h-[calc(100vh-100px)] flex-col gap-3 overflow-hidden p-2 sm:gap-4 sm:p-0 lg:h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col gap-3 rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 text-white lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-3">
        <div className="flex items-center justify-between lg:justify-start lg:gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:bg-white/10 lg:h-9 lg:w-9 lg:p-2"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-white lg:text-lg">共通ヘッダー管理</h1>
              <p className="hidden text-[10px] text-brand-text-secondary lg:block">
                ナビゲーションメニューとロゴを編集できます
              </p>
            </div>
          </div>

          <div className="lg:hidden">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="h-8 bg-brand-accent px-3 text-xs font-bold hover:bg-brand-accent/90"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              {isSaving ? '保存中' : '保存'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:gap-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-8 w-full border-pink-500/50 bg-pink-500/10 text-xs font-bold text-pink-500 lg:h-9 lg:min-w-[200px] lg:text-sm">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white text-black shadow-xl">
              {getAllStores().map((store) => {
                const displayName = store.name.replace(/ストロベリーボーイズ?/, '').trim();
                const finalName = displayName.endsWith('店') ? displayName : `${displayName}店`;
                return (
                  <SelectItem
                    key={store.slug}
                    value={store.slug}
                    className="cursor-pointer font-bold focus:bg-slate-100 focus:text-black"
                  >
                    {finalName}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <div className="hidden h-6 w-px bg-gray-700 lg:block"></div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 flex-1 border-gray-700 px-2 text-[10px] text-gray-300 hover:bg-red-500/10 hover:text-red-400 lg:h-9 lg:flex-none lg:px-3 lg:text-xs"
            >
              <Trash2 className="mr-1 h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />
              リセット
            </Button>

            <Button
              variant={isPreviewMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => {
                setIsPreviewMode(!isPreviewMode);
                if (!isPreviewMode) setActiveView('preview');
              }}
              className={`h-8 flex-1 border-gray-700 px-2 text-[10px] lg:h-9 lg:flex-none lg:px-3 lg:text-xs ${isPreviewMode ? 'bg-white/10' : 'text-gray-300'}`}
            >
              <Eye className="mr-1 h-3 w-3 lg:mr-2 lg:h-4 lg:w-4" />
              <span className="inline">{isPreviewMode ? '戻る' : 'プレビュー'}</span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="hidden h-9 bg-brand-accent font-bold hover:bg-brand-accent/90 lg:flex"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? '保存中...' : '設定を保存'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-3 overflow-hidden lg:flex-row lg:gap-4">
        {/* View Switcher for Mobile */}
        <div className="flex lg:hidden">
          <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-brand-secondary p-1">
            <button
              onClick={() => setActiveView('settings')}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                activeView === 'settings'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              設定項目
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${
                activeView === 'preview'
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              プレビュー
            </button>
          </div>
        </div>

        {/* Sidebar: Controls */}
        <div
          className={`flex flex-col gap-4 overflow-y-auto lg:h-full lg:w-80 lg:flex-shrink-0 lg:rounded-2xl lg:border lg:border-gray-700/50 lg:bg-brand-secondary lg:p-4 ${activeView === 'settings' ? 'flex flex-grow' : 'hidden lg:flex'}`}
        >
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
                  <div className="flex flex-col gap-2">
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
                    <div className="mt-2 space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-500">
                        ボタン画像 (任意)
                      </label>
                      <div className="group relative aspect-[4/1] w-full overflow-hidden rounded-md bg-black/40">
                        {link.imageUrl ? (
                          <img
                            src={link.imageUrl}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-600">
                            画像なし（デフォルトUI使用）
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload('header', file, idx, 'navLinks');
                              };
                              input.click();
                            }}
                            className="rounded bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
                          >
                            <Camera size={12} />
                          </button>
                          {link.imageUrl && (
                            <button
                              onClick={() => handleImageDelete(idx)}
                              className="rounded bg-red-500/80 p-1 text-white backdrop-blur-sm hover:bg-red-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <Camera className="h-3 w-3" />
              特別バナー設定
            </h2>
            <div className="space-y-3 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">バナー画像</label>
                <div className="group relative aspect-[16/7] overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={config.header.specialBanner?.imageUrl || '/福岡募集バナー.png'}
                    alt="Special Banner"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                      className="rounded bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <Camera size={16} />
                    </button>
                    {config.header.specialBanner?.imageUrl &&
                      config.header.specialBanner.imageUrl !== '/福岡募集バナー.png' && (
                        <button
                          onClick={handleBannerDelete}
                          className="rounded bg-red-500/80 p-2 text-white backdrop-blur-sm hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">リンク先URL</label>
                <div className="flex items-center gap-2 rounded-md bg-black/20 px-2 py-1">
                  <Link2 size={12} className="text-gray-500" />
                  <input
                    className="w-full bg-transparent text-[10px] text-gray-400 outline-none"
                    value={config.header.specialBanner?.link || ''}
                    onChange={(e) => {
                      const newBanner = {
                        ...(config.header.specialBanner || {
                          imageUrl: '',
                          subHeading: '',
                          mainHeading: '',
                        }),
                        link: e.target.value,
                      };
                      handleUpdate('header', 'specialBanner', newBanner);
                    }}
                    placeholder="/store/slug/recruit"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              <Camera className="h-3 w-3" />
              ハンバーガーメニュー最下部バナー
            </h2>
            <div className="space-y-3 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  バナーを表示する
                </label>
                <Switch
                  checked={config.header.menuBottomBanner?.isVisible ?? true}
                  onCheckedChange={(checked) => {
                    const newBanner = {
                      ...(config.header.menuBottomBanner || {
                        imageUrl: '',
                        subHeading: '',
                        mainHeading: '',
                        link: '',
                      }),
                      isVisible: checked,
                    };
                    handleUpdate('header', 'menuBottomBanner', newBanner);
                  }}
                  className="scale-75"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">バナー画像</label>
                <div className="group relative aspect-[16/7] overflow-hidden rounded-lg bg-black/40">
                  <img
                    src={config.header.menuBottomBanner?.imageUrl || '/福岡募集バナー.png'}
                    alt="Menu Bottom Banner"
                    className="h-full w-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) handleImageUpload('header', file, 0, 'menuBottomBanner');
                        };
                        input.click();
                      }}
                      className="rounded bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      <Camera size={16} />
                    </button>
                    {config.header.menuBottomBanner?.imageUrl &&
                      config.header.menuBottomBanner.imageUrl !== '/福岡募集バナー.png' && (
                        <button
                          onClick={async () => {
                            if (!selectedStore) return;
                            const imageUrl = config.header.menuBottomBanner?.imageUrl;
                            if (!imageUrl || imageUrl === '/福岡募集バナー.png') {
                              toast.error('この画像は削除できません');
                              return;
                            }
                            const toastId = toast.loading('画像を削除中...');
                            try {
                              if (imageUrl.startsWith('http')) {
                                const deleteResult = await deleteStorageFile(imageUrl);
                                if (!deleteResult.success) {
                                  toast.error(`画像の削除に失敗しました: ${deleteResult.error}`, {
                                    id: toastId,
                                  });
                                  return;
                                }
                              }
                              const newConfig = {
                                ...config,
                                header: {
                                  ...config.header,
                                  menuBottomBanner: {
                                    ...config.header.menuBottomBanner,
                                    imageUrl: '',
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
                          }}
                          className="rounded bg-red-500/80 p-2 text-white backdrop-blur-sm hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">リンク先URL</label>
                <div className="flex items-center gap-2 rounded-md bg-black/20 px-2 py-1">
                  <Link2 size={12} className="text-gray-500" />
                  <input
                    className="w-full bg-transparent text-[10px] text-gray-400 outline-none"
                    value={config.header.menuBottomBanner?.link || ''}
                    onChange={(e) => {
                      const newBanner = {
                        ...(config.header.menuBottomBanner || {
                          imageUrl: '',
                          subHeading: '',
                          mainHeading: '',
                        }),
                        link: e.target.value,
                      };
                      handleUpdate('header', 'menuBottomBanner', newBanner);
                    }}
                    placeholder="/store/slug/recruit"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">サブ見出し</label>
                <input
                  className="w-full rounded-md bg-black/20 px-2 py-1 text-[10px] text-gray-400 outline-none"
                  value={config.header.menuBottomBanner?.subHeading || ''}
                  onChange={(e) => {
                    const newBanner = {
                      ...(config.header.menuBottomBanner || {
                        imageUrl: '',
                        mainHeading: '',
                        link: '',
                      }),
                      subHeading: e.target.value,
                    };
                    handleUpdate('header', 'menuBottomBanner', newBanner);
                  }}
                  placeholder="Strawberry Boys Premium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500">
                  メイン見出し
                </label>
                <input
                  className="w-full rounded-md bg-black/20 px-2 py-1 text-[10px] text-gray-400 outline-none"
                  value={config.header.menuBottomBanner?.mainHeading || ''}
                  onChange={(e) => {
                    const newBanner = {
                      ...(config.header.menuBottomBanner || {
                        imageUrl: '',
                        subHeading: '',
                        link: '',
                      }),
                      mainHeading: e.target.value,
                    };
                    handleUpdate('header', 'menuBottomBanner', newBanner);
                  }}
                  placeholder="甘い誘惑を、今夜貴女に。"
                />
              </div>
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
        <div
          className={`relative flex-grow overflow-hidden bg-white lg:rounded-2xl lg:border lg:border-gray-700/50 ${activeView === 'preview' ? 'flex flex-grow' : 'hidden lg:block'}`}
        >
          <div className="absolute inset-0 overflow-y-auto bg-white p-4 sm:p-8">
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

                  {/* Special Banner Preview in Header */}
                  <div className="group relative mx-2 h-8 w-auto flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 md:h-10">
                    <img
                      src={config.header.specialBanner?.imageUrl || '/福岡募集バナー.png'}
                      alt="Banner Preview"
                      className="h-full w-full object-cover opacity-80"
                    />
                    {!isPreviewMode && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                          className="rounded bg-white/20 p-1 text-white backdrop-blur-sm hover:bg-white/30"
                          title="バナー画像をアップロード"
                        >
                          <Camera className="h-3 w-3" />
                        </button>
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

                <div className="grid grid-cols-2 gap-4">
                  {config.header.navLinks.slice(1, 9).map((item, idx) => (
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
                  {config.header.navLinks.slice(9).map((item, idx) => {
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
                        {item.imageUrl ? (
                          <div className="w-full overflow-hidden rounded-2xl shadow-lg transition-transform active:translate-y-[2px]">
                            <div className="relative aspect-[4/1] w-full">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                              {!isPreviewMode && (
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <button
                                    onClick={() => {
                                      const input = document.createElement('input');
                                      input.type = 'file';
                                      input.accept = 'image/*';
                                      input.onchange = (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file)
                                          handleImageUpload('header', file, idx + 9, 'navLinks');
                                      };
                                      input.click();
                                    }}
                                    className="rounded bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30"
                                  >
                                    <Camera size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleImageDelete(idx + 9)}
                                    className="rounded bg-red-500/80 p-2 text-white backdrop-blur-sm hover:bg-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`flex w-full items-center gap-4 rounded-2xl border-b-[6px] ${colorClass} px-6 py-4 shadow-lg transition-transform active:translate-y-[2px]`}
                          >
                            <div className="relative h-10 w-10 flex-shrink-0">
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
                                          handleImageUpload('header', file, idx + 9, 'navLinks');
                                      };
                                      input.click();
                                    }}
                                    className="rounded bg-white/20 p-1 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                                  >
                                    <Camera size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                            <span
                              className={`flex-1 text-center text-lg font-black tracking-widest ${isYellow ? 'text-black' : 'text-white'}`}
                            >
                              {item.name}
                            </span>
                          </div>
                        )}
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

                {/* Menu Bottom Banner */}
                <div className="group relative overflow-hidden rounded-[40px] bg-neutral-900 shadow-2xl">
                  <div className="relative block aspect-[16/7]">
                    <img
                      src={config.header.menuBottomBanner?.imageUrl || '/福岡募集バナー.png'}
                      alt="Menu Bottom Banner"
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
                              if (file) handleImageUpload('header', file, 0, 'menuBottomBanner');
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
                        {config.header.menuBottomBanner?.imageUrl &&
                          config.header.menuBottomBanner.imageUrl !== '/福岡募集バナー.png' && (
                            <button
                              onClick={async () => {
                                if (!selectedStore) return;
                                const imageUrl = config.header.menuBottomBanner?.imageUrl;
                                if (!imageUrl || imageUrl === '/福岡募集バナー.png') {
                                  toast.error('この画像は削除できません');
                                  return;
                                }
                                const toastId = toast.loading('画像を削除中...');
                                try {
                                  if (imageUrl.startsWith('http')) {
                                    const deleteResult = await deleteStorageFile(imageUrl);
                                    if (!deleteResult.success) {
                                      toast.error(
                                        `画像の削除に失敗しました: ${deleteResult.error}`,
                                        {
                                          id: toastId,
                                        },
                                      );
                                      return;
                                    }
                                  }
                                  const newConfig = {
                                    ...config,
                                    header: {
                                      ...config.header,
                                      menuBottomBanner: {
                                        ...(config.header.menuBottomBanner || {}),
                                        imageUrl: '',
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
                              }}
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
                            ...(config.header.menuBottomBanner || {}),
                            subHeading: e.currentTarget.textContent || '',
                          };
                          handleUpdate('header', 'menuBottomBanner', newBanner);
                        }}
                        suppressContentEditableWarning
                      >
                        {config.header.menuBottomBanner?.subHeading || 'Strawberry Boys Premium'}
                      </p>
                      <h3
                        className="text-xl font-black leading-tight text-white outline-none focus:border-b focus:border-white/50"
                        contentEditable={!isPreviewMode}
                        onBlur={(e) => {
                          const newBanner = {
                            ...(config.header.menuBottomBanner || {}),
                            mainHeading: e.currentTarget.textContent || '',
                          };
                          handleUpdate('header', 'menuBottomBanner', newBanner);
                        }}
                        suppressContentEditableWarning
                      >
                        {config.header.menuBottomBanner?.mainHeading || '甘い誘惑を、今夜貴女に。'}
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
