'use client';

import { ChevronLeft, Eye, Layout, Save } from 'lucide-react';
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

import FukuokaPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { getAllStores } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';

export default function StoreTopManagement() {
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

  // 表示切り替えトグル用
  const toggleVisibility = (section: keyof StoreTopPageConfig) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        isVisible: !(prev[section] as any).isVisible,
      },
    }));
  };

  // 画像アップロード処理
  const handleImageUpload = async (section: string, file: File, index?: number, key?: string) => {
    const toastId = toast.loading('画像をアップロード中...');
    try {
      const url = await uploadStoreTopImage(selectedStore, section, file);
      if (url) {
        if (index !== undefined && key) {
          // 配列内のアイテムの画像を更新 (concept, campaign, cast, etc)
          const sectionData = config[section as keyof StoreTopPageConfig] as any;
          const newItems = [...sectionData.items];
          newItems[index] = { ...newItems[index], [key]: url };
          handleUpdate(section, 'items', newItems);
        } else if (section === 'hero' && index !== undefined) {
          // Heroの画像スライダーを更新
          const newImages = [...config.hero.images];
          newImages[index] = url;
          handleUpdate(section, 'images', newImages);
        } else if (section === 'footer') {
          // フッターの画像を更新
          if (key === 'logoImageUrl') {
            handleUpdate(section, 'logoImageUrl', url);
          } else if (index !== undefined && (key === 'banners' || key === 'smallBanners')) {
            const currentBanners = [...(config.footer as any)[key]];
            currentBanners[index] = { ...currentBanners[index], imageUrl: url };
            handleUpdate(section, key, currentBanners);
          } else if (index !== undefined && key === 'trustBadges') {
            const currentBadges = [...config.footer.trustBadges];
            currentBadges[index] = url;
            handleUpdate(section, key, currentBadges);
          }
        }
        toast.success('画像をアップロードしました', { id: toastId });
      } else {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('アップロード中にエラーが発生しました', { id: toastId });
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
            <h1 className="text-lg font-bold text-white">店舗トップ管理</h1>
            <p className="text-[10px] text-brand-text-secondary">プレビュー上で直接編集できます</p>
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
        <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Layout className="h-3 w-3" />
            表示セクション
          </h2>

          <div className="space-y-2">
            {[
              { id: 'hero', label: 'メインビジュアル' },
              { id: 'concept', label: 'コンセプト' },
              { id: 'campaign', label: 'キャンペーン' },
              { id: 'cast', label: 'セラピスト' },
              { id: 'price', label: '料金プラン' },
              { id: 'flow', label: '利用の流れ' },
              { id: 'footer', label: 'フッター' },
            ].map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg border border-gray-700/30 bg-brand-primary/30 p-3"
              >
                <span className="text-sm font-medium text-gray-200">{section.label}</span>
                <Switch
                  checked={(config as any)[section.id].isVisible}
                  onCheckedChange={() => toggleVisibility(section.id as any)}
                  className="scale-75"
                />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-[10px] leading-relaxed text-blue-300">
              <span className="mb-1 block font-bold">💡 編集のヒント</span>
              右側のプレビュー画面でテキストを直接クリックしたり、画像アイコンをクリックすることで編集が可能です。
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white">
          <div className="absolute inset-0 overflow-y-auto">
            <FukuokaPage
              config={config}
              isEditing={!isPreviewMode}
              onUpdate={handleUpdate}
              onImageUpload={handleImageUpload}
            />
          </div>

          {/* Mobile switcher mockup */}
          <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gray-700 bg-brand-secondary/80 px-4 py-2 shadow-2xl backdrop-blur-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-accent">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex h-6 w-6 cursor-not-allowed items-center justify-center rounded-md opacity-50 hover:bg-white/10">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
