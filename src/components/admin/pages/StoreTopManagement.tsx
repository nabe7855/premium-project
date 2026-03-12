'use client';

import {
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  Eye,
  Layout,
  Link2,
  Menu,
  Save,
} from 'lucide-react';
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
import { PageData } from '@/components/admin/news/types';
import FukuokaPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import YokohamaPage from '@/components/templates/store/yokohama/page-templates/TopPage';
import { StoreProvider } from '@/contexts/StoreContext';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getAllStoresFromDb, updateStoreRedirect } from '@/lib/actions/store-actions';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';

const SECTION_LABELS: Record<string, string> = {
  hero: 'メインビジュアル',
  concept: 'コンセプト',
  campaign: 'キャンペーン',
  cast: 'セラピスト',
  price: '料金プラン',
  flow: '利用の流れ',
  diary: '写メ日記',
  newcomer: '新人セラピスト',
  faq: 'よくあるご質問',
  quickAccess: 'クイックアクセス',
  beginnerGuide: '初体験バナー',
  footer: 'フッター',
  snsProfile: 'SNSプロフィール',
};

const SECTION_ORDER = [
  'hero',
  'concept',
  'campaign',
  'diary',
  'cast',
  'newcomer',
  'price',
  'flow',
  'faq',
  'quickAccess',
  'beginnerGuide',
  'snsProfile',
  'footer',
];

export default function StoreTopManagement() {
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [config, setConfig] = useState<StoreTopPageConfig>(DEFAULT_STORE_TOP_CONFIG);
  const [newsPages, setNewsPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);

  // 設定の取得
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        // 店舗リストを取得
        const storesResult = await getAllStoresFromDb();
        if (storesResult.success) {
          setDbStores(storesResult.stores || []);
          const current = storesResult.stores?.find((s: any) => s.slug === selectedStore);
          setCurrentStoreData(current || null);
        }

        const result = await getStoreTopConfig(selectedStore);
        if (result.success && result.config) {
          setConfig(result.config as StoreTopPageConfig);
        } else {
          console.warn('[StoreTopManagement] Config fetch failed or empty, using default');
          setConfig(DEFAULT_STORE_TOP_CONFIG);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        toast.error('データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchNews = async () => {
      try {
        const pages = await getPublishedPagesByStore(selectedStore);
        setNewsPages(pages);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast.error('ニュースの取得に失敗しました');
      }
    };

    fetchConfig();
    fetchNews();
  }, [selectedStore]);

  // 保存処理用ヘルパー（Server Actionに渡す前に確実にシリアライズ可能な状態にする）
  const safeSaveConfig = async (currentConfig: StoreTopPageConfig) => {
    // Client Functions cannot be passed... エラー対策としてディープコピーで関数等を除去
    const serializableConfig = JSON.parse(JSON.stringify(currentConfig));
    return await saveStoreTopConfig(selectedStore, serializableConfig);
  };

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await safeSaveConfig(config);
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
        await safeSaveConfig(newConfig);
      } else if (section === 'hero' && typeof index === 'number') {
        // Hero images array handling
        const newImages = [...config.hero.images];

        // If index equals length, we're adding a new image
        if (index === newImages.length) {
          newImages.push(publicUrl);
        } else {
          // Otherwise, we're replacing an existing image
          const oldImageUrl = newImages[index];
          if (oldImageUrl && oldImageUrl.startsWith('http')) {
            await deleteStorageFile(oldImageUrl);
          }
          newImages[index] = publicUrl;
        }

        const newConfig = {
          ...config,
          hero: { ...config.hero, images: newImages },
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
      } else if (section === 'flow' && typeof index === 'number') {
        const newSteps = [...config.flow.steps];
        const oldImageUrl = newSteps[index]?.image;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        newSteps[index] = { ...newSteps[index], image: publicUrl };
        const newConfig = {
          ...config,
          flow: { ...config.flow, steps: newSteps },
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
      } else if (section === 'diary' && typeof index === 'number') {
        const newItems = [...config.diary.items];
        newItems[index] = { ...newItems[index], image: publicUrl };
        const newConfig = {
          ...config,
          diary: { ...config.diary, items: newItems },
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
      } else if (section === 'beginnerGuide' && key === 'imageUrl') {
        const oldImageUrl = config.beginnerGuide?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        const newConfig = {
          ...config,
          beginnerGuide: { ...config.beginnerGuide, imageUrl: publicUrl },
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
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
        await safeSaveConfig(newConfig);
      } else if (section === 'footer' && key === 'largeBanner') {
        const oldImageUrl = config.footer.largeBanner?.imageUrl;
        if (oldImageUrl && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }
        const newConfig = {
          ...config,
          footer: {
            ...config.footer,
            largeBanner: { imageUrl: publicUrl, link: config.footer.largeBanner?.link || '#' },
          },
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
      } else {
        const sectionKey = key || 'imageUrl';
        const sectionName = section as Exclude<
          keyof StoreTopPageConfig,
          'notificationEmail' | 'lineId'
        >;
        const oldImageUrl = (config[sectionName] as any)?.[sectionKey];
        if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.startsWith('http')) {
          await deleteStorageFile(oldImageUrl);
        }

        // セクションの中身がオブジェクトか値かによって更新方法を変える
        const currentSection = config[sectionName] as any;
        let updatedSection;
        if (typeof currentSection[sectionKey] === 'object' && currentSection[sectionKey] !== null) {
          // 例: largeBanner: { imageUrl: '...', link: '...' } の imageUrl だけ更新する場合
          updatedSection = {
            ...currentSection,
            [sectionKey]: { ...currentSection[sectionKey], imageUrl: publicUrl },
          };
        } else {
          // 単純なプロパティ (例: logoUrl: '...') の場合
          updatedSection = { ...currentSection, [sectionKey]: publicUrl };
        }

        const newConfig = {
          ...config,
          [sectionName]: updatedSection,
        };
        setConfig(newConfig);
        await safeSaveConfig(newConfig);
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

      <div className="space-y-4 border-t border-gray-700/50 pt-4">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link2 className="h-3 w-3" />
          誘導設定 (Redirect)
        </h2>

        <div className="space-y-3 rounded-lg border border-gray-700/30 bg-brand-primary/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">外部URLへ誘導</span>
            <Switch
              checked={currentStoreData?.use_external_url || false}
              onCheckedChange={async (checked) => {
                if (!currentStoreData) return;
                const toastId = toast.loading('更新中...');
                const res = await updateStoreRedirect(
                  currentStoreData.id,
                  checked,
                  currentStoreData.external_url || '',
                );
                if (res.success) {
                  setCurrentStoreData({ ...currentStoreData, use_external_url: checked });
                  toast.success('更新しました', { id: toastId });
                } else {
                  toast.error('更新に失敗しました', { id: toastId });
                }
              }}
              className="scale-75"
            />
          </div>

          {currentStoreData?.use_external_url && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">誘導先URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full rounded border border-gray-700 bg-black/40 p-1.5 text-[11px] text-white focus:border-brand-accent focus:outline-none"
                  placeholder="https://..."
                  defaultValue={currentStoreData.external_url || ''}
                  onBlur={async (e) => {
                    const val = e.target.value;
                    if (val === currentStoreData.external_url) return;
                    const toastId = toast.loading('保存中...');
                    const res = await updateStoreRedirect(
                      currentStoreData.id,
                      currentStoreData.use_external_url,
                      val,
                    );
                    if (res.success) {
                      setCurrentStoreData({ ...currentStoreData, external_url: val });
                      toast.success('URLを更新しました', { id: toastId });
                    } else {
                      toast.error('更新に失敗しました', { id: toastId });
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
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
              <SelectTrigger className="h-8 flex-grow border-pink-500/50 bg-pink-500/10 text-xs font-bold text-pink-500 sm:h-9 sm:min-w-[200px] sm:text-sm">
                <SelectValue placeholder="店舗を選択" />
              </SelectTrigger>
              <SelectContent className="border-gray-200 bg-white text-black shadow-xl">
                {dbStores.length > 0 ? (
                  dbStores.map((store) => {
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
                  })
                ) : (
                  <SelectItem value="loading" disabled>
                    読み込み中...
                  </SelectItem>
                )}
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

      {/* Redirect Status Banner */}
      {currentStoreData?.use_external_url && (
        <div className="mb-2 flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-500/20 p-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-200">外部サイト誘導モードが有効です</p>
              <p className="text-xs text-amber-200/70">
                「入店する」ボタンは以下の外部URLにリダイレクトされます：
                <span
                  className="ml-2 cursor-help break-all font-mono text-amber-400 underline"
                  title={currentStoreData.external_url}
                >
                  {currentStoreData.external_url}
                </span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 shrink-0 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 sm:flex"
            onClick={() => window.open(currentStoreData.external_url, '_blank')}
          >
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            URLを確認
          </Button>
        </div>
      )}

      <div className="flex flex-grow flex-col gap-2 overflow-hidden sm:flex-row sm:gap-4">
        {/* Sidebar: Controls (Desktop Only) */}
        <div className="hidden w-64 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 sm:block">
          {renderSidebarContent()}
        </div>

        {/* Preview Area */}
        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white">
          <div className="absolute inset-0 overflow-y-auto">
            <StoreProvider store={(getStoreData(selectedStore) || getStoreData('fukuoka'))!}>
              {getStoreData(selectedStore)?.template === 'yokohama' ? (
                <YokohamaPage
                  config={config}
                  newsPages={newsPages}
                  isEditing={!isPreviewMode}
                  onUpdate={handleUpdate}
                  onImageUpload={handleImageUpload}
                  hideHeader={true}
                  storeSlug={selectedStore}
                />
              ) : (
                <FukuokaPage
                  config={config}
                  newsPages={newsPages}
                  isEditing={!isPreviewMode}
                  onUpdate={handleUpdate}
                  onImageUpload={handleImageUpload}
                  hideHeader={true}
                  storeSlug={selectedStore}
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
