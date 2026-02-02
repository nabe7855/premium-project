'use client';

import { ChevronLeft, Eye, Layout, Menu, Save } from 'lucide-react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

import { deleteStorageFile } from '@/actions/storage';
import FukuokaPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import YokohamaPage from '@/components/templates/store/yokohama/page-templates/TopPage';
import { StoreProvider } from '@/contexts/StoreContext';
import { stores } from '@/data/stores';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { getAllStores } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';

const SECTION_LABELS: Record<string, string> = {
  header: '共通ヘッダー',
  hero: 'メインビジュアル',
  concept: 'コンセプト',
  campaign: 'キャンペーン',
  cast: 'セラピスト',
  price: '料金プラン',
  flow: '利用の流れ',
  diary: '写メ日記',
  newcomer: '新人セラピスト',
  faq: 'よくあるご質問',
  footer: 'フッター',
};

const SECTION_ORDER = [
  'header',
  'hero',
  'concept',
  'campaign',
  'diary',
  'cast',
  'newcomer',
  'price',
  'flow',
  'faq',
  'footer',
];

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
          console.warn('[StoreTopManagement] Config fetch failed or empty, using default');
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

  // セクションへスクロール
  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      } else if (section === 'hero' && typeof index === 'number') {
        // Hero images array handling
        const newImages = [...config.hero.images];
        const oldImageUrl = newImages[index];
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newImages[index] = publicUrl;
        const newConfig = {
          ...config,
          hero: { ...config.hero, images: newImages },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'concept' && key === 'items' && typeof index === 'number') {
        // Concept items handling
        const newItems = [...config.concept.items];
        const oldImageUrl = newItems[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newItems[index] = { ...newItems[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          concept: { ...config.concept, items: newItems },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'campaign' && key === 'items' && typeof index === 'number') {
        // Campaign items handling
        const newItems = [...config.campaign.items];
        const oldImageUrl = newItems[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newItems[index] = { ...newItems[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          campaign: { ...config.campaign, items: newItems },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'diary' && typeof index === 'number') {
        const newItems = [...config.diary.items];
        newItems[index] = { ...newItems[index], image: publicUrl };
        const newConfig = {
          ...config,
          diary: { ...config.diary, items: newItems },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'newcomer' && typeof index === 'number') {
        const oldImageUrl = config.newcomer.items[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }

        const newItems = [...config.newcomer.items];
        newItems[index] = { ...newItems[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          newcomer: { ...config.newcomer, items: newItems },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'footer' && key === 'banners' && typeof index === 'number') {
        const newBanners = [...config.footer.banners];
        const oldImageUrl = newBanners[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newBanners[index] = { ...newBanners[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          footer: { ...config.footer, banners: newBanners },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'footer' && key === 'smallBanners' && typeof index === 'number') {
        const newSmallBanners = [...config.footer.smallBanners];
        const oldImageUrl = newSmallBanners[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newSmallBanners[index] = { ...newSmallBanners[index], imageUrl: publicUrl };
        const newConfig = {
          ...config,
          footer: { ...config.footer, smallBanners: newSmallBanners },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else if (section === 'footer' && key === 'trustBadges' && typeof index === 'number') {
        const newTrustBadges = [...config.footer.trustBadges];
        const oldImageUrl = newTrustBadges[index]?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newTrustBadges[index] = {
          ...(newTrustBadges[index] || { link: '#' }),
          imageUrl: publicUrl,
        };
        const newConfig = {
          ...config,
          footer: { ...config.footer, trustBadges: newTrustBadges },
        };
        setConfig(newConfig);
        await saveStoreTopConfig(selectedStore, newConfig);
      } else {
        const sectionKey = key || 'imageUrl';
        const oldImageUrl = (config[section as keyof StoreTopPageConfig] as any)?.[sectionKey];
        if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }

        const newConfig = {
          ...config,
          [section]: { ...config[section as keyof StoreTopPageConfig], [sectionKey]: publicUrl },
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

  const renderSidebarContent = () => (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Layout className="h-3 w-3" />
        表示セクション
      </h2>

      <div className="space-y-2">
        {SECTION_ORDER.map((sectionId) => {
          const label = SECTION_LABELS[sectionId] || sectionId;
          const sectionData = (config as any)[sectionId];

          if (!sectionData || typeof sectionData.isVisible !== 'boolean') return null;

          return (
            <div
              key={sectionId}
              className="flex items-center justify-between rounded-lg border border-gray-700/30 bg-brand-primary/30 p-3"
            >
              <button
                onClick={() => scrollToSection(sectionId)}
                className="flex-grow text-left text-sm font-medium text-gray-200 transition-colors hover:text-brand-accent"
              >
                {label}
              </button>
              <Switch
                checked={sectionData.isVisible}
                onCheckedChange={() => toggleVisibility(sectionId as any)}
                className="scale-75"
              />
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
        <p className="text-[10px] leading-relaxed text-blue-300">
          <span className="mb-1 block font-bold">💡 編集のヒント</span>
          右側のプレビュー画面でテキストを直接クリックしたり、画像アイコンをクリックすることで編集が可能です。
        </p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-2 overflow-hidden sm:gap-4">
      {/* Header */}
      <div className="flex flex-shrink-0 flex-col items-stretch justify-between gap-2 rounded-2xl border border-gray-700/50 bg-brand-secondary px-4 py-2 sm:flex-row sm:items-center sm:px-6 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 sm:h-9 sm:w-auto sm:px-3"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-white sm:text-lg">店舗トップ管理</h1>
              <p className="hidden text-[10px] text-brand-text-secondary sm:block">
                プレビュー上で直接編集できます
              </p>
            </div>
          </div>

          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 border-gray-700 p-0 text-gray-400"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] border-gray-700 bg-brand-secondary p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-left text-white">表示セクション</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-100px)] overflow-y-auto pb-8">
                  {renderSidebarContent()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
          <div className="flex flex-grow items-center gap-2 sm:flex-grow-0">
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="h-8 flex-grow border-gray-700 bg-brand-primary text-[10px] text-white sm:h-9 sm:w-[160px] sm:text-xs">
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
          </div>

          <div className="hidden h-6 w-px bg-gray-700 sm:block"></div>

          <div className="flex items-center gap-2">
            <Button
              variant={isPreviewMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={
                isPreviewMode
                  ? 'h-8 bg-white/10 px-2 sm:h-9 sm:px-4'
                  : 'h-8 border-gray-700 px-2 text-gray-300 sm:h-9 sm:px-4'
              }
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">
                {isPreviewMode ? '編集モードに戻る' : 'プレビュー'}
              </span>
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="h-8 bg-brand-accent px-3 font-bold hover:bg-brand-accent/90 sm:h-9 sm:px-4"
            >
              <Save className="h-4 w-4 sm:mr-2" />
              <span>{isSaving ? '...' : '公開'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-2 overflow-hidden sm:flex-row sm:gap-4">
        {/* Sidebar: Controls (Desktop Only) */}
        <div className="hidden w-64 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 sm:block">
          {renderSidebarContent()}
        </div>

        {/* Preview Area */}
        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white">
          <div className="absolute inset-0 overflow-y-auto">
            <StoreProvider store={(stores[selectedStore] || stores['fukuoka']) as any}>
              {stores[selectedStore]?.template === 'yokohama' ? (
                <YokohamaPage
                  config={config}
                  isEditing={!isPreviewMode}
                  onUpdate={handleUpdate}
                  onImageUpload={handleImageUpload}
                />
              ) : (
                <FukuokaPage
                  config={config}
                  isEditing={!isPreviewMode}
                  onUpdate={handleUpdate}
                  onImageUpload={handleImageUpload}
                />
              )}
            </StoreProvider>
          </div>

          {/* Mobile switcher mockup - Hidden on small screens to avoid confusion since the page itself is now responsive */}
          <div className="absolute bottom-4 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-gray-700 bg-brand-secondary/80 px-4 py-2 shadow-2xl backdrop-blur-sm sm:flex">
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
