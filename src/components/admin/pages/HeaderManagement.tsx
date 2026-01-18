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

import Header from '@/components/sections/layout/Header';
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
          <div className="absolute inset-0 overflow-y-auto">
            <div className="sticky top-0 z-50">
              <Header
                config={config.header}
                isEditing={!isPreviewMode}
                onUpdate={handleUpdate}
                onImageUpload={handleImageUpload}
              />
            </div>
            {/* Background dummy content to show header scroll effect */}
            <div className="min-h-screen space-y-12 bg-gray-50 p-8 pt-24">
              <div className="flex h-64 items-center justify-center rounded-3xl bg-neutral-100 text-3xl font-bold italic text-gray-300">
                PREVIEW CONTENT
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-48 rounded-3xl bg-neutral-100"></div>
                <div className="h-48 rounded-3xl bg-neutral-100"></div>
              </div>
              <div className="h-96 rounded-3xl bg-neutral-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
