'use client';

import {
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  Eye,
  History,
  Layout,
  Menu,
  Save,
  Settings,
  Plus,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';

import { deleteStorageFile } from '@/actions/storage';
import { PageData } from '@/components/admin/news/types';
import FukuokaPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import YokohamaPage from '@/components/templates/store/yokohama/page-templates/TopPage';
import { StoreProvider } from '@/contexts/StoreContext';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getAllStoresFromDb } from '@/lib/actions/store-actions';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { 
  saveStoreTopConfig,
  getHomePageHistory,
  deleteHomePageHistory
} from '@/lib/store/saveStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';
import HistoryManager from '@/components/admin/HistoryManager';

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
  quickAccess: 'クインスアクセス',
  beginnerGuide: '初体験バナー 1',
  beginnerGuide2: '初体験バナー 2',
  footer: 'フッター',
  bottomNav: '固定フッターナビ (モバイル限定)',
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
  'beginnerGuide2',
  'snsProfile',
  'footer',
  'bottomNav',
];

export default function StoreTopManagement() {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [config, setConfig] = useState<StoreTopPageConfig>(DEFAULT_STORE_TOP_CONFIG);
  const [newsPages, setNewsPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);
  const [showBottomNavEditor, setShowBottomNavEditor] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // 履歴一覧の取得
  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const result = await getHomePageHistory(selectedStore);
      if (result.success && result.history) {
        setHistory(result.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [selectedStore]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // 設定の取得
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
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

  const safeSaveConfig = async (currentConfig: StoreTopPageConfig) => {
    const serializableConfig = JSON.parse(JSON.stringify(currentConfig));
    return await saveStoreTopConfig(selectedStore, serializableConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await safeSaveConfig(config);
      if (result.success) {
        toast.success('設定を保存しました');
        fetchHistory(); // 履歴更新
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

  const handleApplyHistory = (historyConfig: any) => {
    const merged = { ...DEFAULT_STORE_TOP_CONFIG, ...historyConfig };
    setConfig(merged);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `top_config_${selectedStore}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('設定ファイルをダウンロードしました');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('書き出しに失敗しました');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedConfig = JSON.parse(content);
        const merged = { ...DEFAULT_STORE_TOP_CONFIG, ...importedConfig };
        setConfig(merged);
        toast.success('設定ファイルを読み込みました。「公開」ボタンを押すと本番に反映されます。');
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('ファイルの読み込みに失敗しました。正しいJSON形式か確認してください。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUpdate = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof StoreTopPageConfig] as any),
        [key]: value,
      },
    }));
  };

  const handleBottomNavUpdate = (index: number, field: string, value: any) => {
    setConfig((prev) => {
      if (field === 'isVisibleGlobal') {
        return {
          ...prev,
          footer: { ...prev.footer, isBottomNavVisible: value },
        };
      }
      const bottomNav = prev.footer?.bottomNav || [];
      const newBottomNav = [...bottomNav];
      newBottomNav[index] = { ...newBottomNav[index], [field]: value };
      return {
        ...prev,
        footer: {
          ...prev.footer,
          bottomNav: newBottomNav,
        },
      };
    });
  };

  const addBottomNavItem = () => {
    setConfig((prev) => {
      const bottomNav = prev.footer?.bottomNav || [];
      const newBottomNav = [...bottomNav];
      newBottomNav.push({
        label: '新規項目',
        icon: 'HelpCircle',
        href: `/store/${selectedStore}/`,
        color: 'text-slate-600',
        isVisible: true,
      });
      return {
        ...prev,
        footer: {
          ...prev.footer,
          bottomNav: newBottomNav,
        },
      };
    });
  };

  const removeBottomNavItem = (index: number) => {
    if (!confirm('この項目を削除しますか？')) return;
    setConfig((prev) => {
      const bottomNav = prev.footer?.bottomNav || [];
      const newBottomNav = [...bottomNav];
      newBottomNav.splice(index, 1);
      return {
        ...prev,
        footer: {
          ...prev.footer,
          bottomNav: newBottomNav,
        },
      };
    });
  };

  const toggleVisibility = (section: keyof StoreTopPageConfig) => {
    if ((section as string) === 'bottomNav') {
      setConfig((prev) => ({
        ...prev,
        footer: {
          ...prev.footer,
          isBottomNavVisible: !prev.footer.isBottomNavVisible,
        },
      }));
      return;
    }
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        isVisible: !(prev[section] as any).isVisible,
      },
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageUpload = async (section: string, file: File, index?: number, key?: string) => {
    if (!selectedStore) return;

    const toastId = toast.loading('画像をアップロード中...');
    try {
      // セクションに応じた圧縮オプションの設定
      let options: { maxWidth?: number; quality?: number } = { maxWidth: 1200, quality: 0.8 };
      if (section === 'header' && key === 'logoUrl') {
        options = { maxWidth: 600, quality: 0.9 };
      } else if (section === 'hero') {
        options = { maxWidth: 1600, quality: 0.85 };
      }

      const publicUrl = await uploadStoreTopImage(selectedStore, section, file, options);

      if (!publicUrl) {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
        return;
      }

      // Functional update to avoid stale state issues and ensure latest state is used
      let configToSave: StoreTopPageConfig | null = null;
      
      setConfig((prev) => {
        if (!prev) return prev;
        const newConfig = { ...prev };

        if (section === 'header' && key === 'navLinks' && typeof index === 'number') {
          const newNavLinks = [...prev.header.navLinks];
          newNavLinks[index] = { ...newNavLinks[index], imageUrl: publicUrl };
          newConfig.header = { ...prev.header, navLinks: newNavLinks };
        } else if (section === 'hero' && typeof index === 'number') {
          let newImages = [...prev.hero.images];
          while (newImages.length < index) {
            newImages.push('');
          }
          if (index === newImages.length) {
            newImages.push(publicUrl);
          } else {
            newImages[index] = publicUrl;
          }
          const newLinks = [...(prev.hero.imageLinks || [])];
          while (newLinks.length < newImages.length) {
            newLinks.push('');
          }
          newConfig.hero = { ...prev.hero, images: newImages, imageLinks: newLinks };
        } else if (section === 'concept' && key === 'items' && typeof index === 'number') {
          const newItems = [...prev.concept.items];
          newItems[index] = { ...newItems[index], imageUrl: publicUrl };
          newConfig.concept = { ...prev.concept, items: newItems };
        } else if (section === 'campaign' && key === 'items' && typeof index === 'number') {
          const newItems = [...prev.campaign.items];
          newItems[index] = { ...newItems[index], imageUrl: publicUrl };
          newConfig.campaign = { ...prev.campaign, items: newItems };
        } else if (section === 'flow' && typeof index === 'number' && key !== 'headingImageUrl') {
          const newSteps = [...prev.flow.steps];
          newSteps[index] = { ...newSteps[index], image: publicUrl };
          newConfig.flow = { ...prev.flow, steps: newSteps };
        } else if (section === 'footer' && key === 'banners' && typeof index === 'number') {
          const newBanners = [...prev.footer.banners];
          newBanners[index] = { ...newBanners[index], imageUrl: publicUrl };
          newConfig.footer = { ...prev.footer, banners: newBanners };
        } else {
          const sectionName = section as keyof StoreTopPageConfig;
          const sectionKey = key || 'imageUrl';
          newConfig[sectionName] = { 
            ...(prev[sectionName] as any), 
            [sectionKey]: publicUrl 
          };
        }
        
        configToSave = newConfig;
        return newConfig;
      });

      // DBに保存
      if (configToSave) {
        await safeSaveConfig(configToSave);
        toast.success('画像を最適化してアップロードしました', { id: toastId });
        fetchHistory(); // 履歴更新
      }
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
          const sectionData = sectionId === 'bottomNav' 
            ? { isVisible: config.footer?.isBottomNavVisible ?? true }
            : (config as any)[sectionId];

          if (!sectionData || (sectionId !== 'bottomNav' && typeof sectionData.isVisible !== 'boolean')) return null;

          return (
            <div key={sectionId} className="flex flex-col gap-1">
              <div className="flex items-center justify-between rounded-lg border border-gray-700/30 bg-brand-primary/30 p-3">
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
              {sectionId === 'bottomNav' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBottomNavEditor(true)}
                  className="w-full flex justify-between items-center text-[10px] font-bold h-7 bg-brand-primary/50 text-brand-accent hover:bg-brand-accent/10 border border-brand-accent/20 px-3"
                >
                  <span className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    ナビ項目を編集
                  </span>
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                </Button>
              )}
            </div>
          );
        })}
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

  const baseStaticStore = getStoreData(selectedStore) || getStoreData('fukuoka')!;
  const mergedStore = currentStoreData ? {
    ...baseStaticStore,
    name: currentStoreData.name || baseStaticStore.name,
    address: currentStoreData.address || baseStaticStore.address,
    businessHours: currentStoreData.business_hours || baseStaticStore.businessHours,
    contact: {
      ...(baseStaticStore.contact || {}),
      phone: currentStoreData.phone || baseStaticStore.contact?.phone || '',
      line:
        currentStoreData.line_url ||
        ((currentStoreData as any).line_id
          ? `https://line.me/R/ti/p/${(currentStoreData as any).line_id.startsWith('@') ? (currentStoreData as any).line_id : '@' + (currentStoreData as any).line_id}`
          : baseStaticStore.contact?.line || ''),
      email: currentStoreData.notification_email || baseStaticStore.contact?.email || '',
    }
  } : baseStaticStore;

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-4 overflow-hidden">
      <div className="flex flex-shrink-0 flex-col items-stretch justify-between gap-4 rounded-2xl border border-gray-700/50 bg-brand-secondary px-4 py-4 sm:flex-row sm:items-center">
        <div className="flex flex-shrink-0 items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          </Button>
          <h1 className="text-base font-bold text-white sm:text-lg whitespace-nowrap">店舗トップ管理</h1>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          <HistoryManager
            title="トップページ"
            history={history}
            isLoading={isHistoryLoading}
            onApply={handleApplyHistory}
            onDelete={deleteHomePageHistory}
            onRefresh={fetchHistory}
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              title="バックアップをダウンロード"
              className="h-9 border-gray-700 px-3 text-gray-300"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline text-xs">書き出し</span>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 cursor-pointer opacity-0"
                style={{ fontSize: '1px' }}
              />
              <Button
                variant="outline"
                size="sm"
                title="バックアップから復元"
                className="h-9 border-gray-700 px-3 text-gray-300"
              >
                <Upload className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-xs">読み込み</span>
              </Button>
            </div>
          </div>

          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-9 min-w-[130px] flex-grow sm:flex-initial sm:min-w-[180px] border-pink-500/50 bg-pink-500/10 text-xs sm:text-sm font-bold text-pink-500">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white text-black shadow-xl">
              {dbStores.filter(s => !!s.slug).map((store) => (
                <SelectItem key={store.slug} value={store.slug} className="font-bold">
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <Button
              variant={isPreviewMode ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="border-gray-700 text-gray-300 hidden sm:flex"
            >
              <Eye className="mr-2 h-4 w-4" />
              {isPreviewMode ? '編集モードへ' : 'プレビュー'}
            </Button>

            <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-brand-accent font-bold px-6">
              <Save className="mr-2 h-4 w-4" />
              公開
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-grow gap-4 overflow-hidden">
        <div className="hidden w-64 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 sm:block">
          {renderSidebarContent()}
        </div>

        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white">
          <div className="absolute inset-0 overflow-y-auto">
            <StoreProvider store={mergedStore as any}>
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
        </div>
      </div>

      <Sheet open={showBottomNavEditor} onOpenChange={setShowBottomNavEditor}>
        <SheetContent side="right" className="w-full sm:max-w-md border-gray-700 bg-brand-secondary p-0">
          <SheetHeader className="p-6 border-b border-gray-700">
            <SheetTitle className="text-white flex items-center gap-2">
              <Layout className="h-5 w-5 text-brand-accent" />
              固定ナビ編集
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {(config.footer?.bottomNav || []).map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-700 bg-brand-primary/50 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <span className="text-xs font-bold text-gray-400">項目 {idx + 1}</span>
                    <div className="flex items-center gap-2">
                       <Switch 
                          checked={item.isVisible} 
                          onCheckedChange={(val) => handleBottomNavUpdate(idx, 'isVisible', val)}
                          className="scale-75"
                       />
                       <Button variant="ghost" size="sm" onClick={() => removeBottomNavItem(idx)} className="h-7 w-7 p-0 text-red-500">
                         <Trash2 className="h-3.5 w-3.5" />
                       </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">ラベル</label>
                      <input 
                        type="text" 
                        value={item.label} 
                        onChange={(e) => handleBottomNavUpdate(idx, 'label', e.target.value)}
                        className="w-full bg-black/20 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500">アイコン</label>
                      <input 
                        type="text" 
                        value={item.icon} 
                        onChange={(e) => handleBottomNavUpdate(idx, 'icon', e.target.value)}
                        className="w-full bg-black/20 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500">リンク URL</label>
                    <input 
                      type="text" 
                      value={item.href} 
                      onChange={(e) => handleBottomNavUpdate(idx, 'href', e.target.value)}
                      className="w-full bg-black/20 border border-gray-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addBottomNavItem} variant="outline" className="w-full border-dashed border-gray-700 text-gray-400">
                <Plus className="h-4 w-4 mr-2" /> 項目を追加
              </Button>
            </div>
            <div className="p-6 border-t border-gray-700 bg-brand-secondary">
              <Button onClick={() => setShowBottomNavEditor(false)} className="w-full bg-brand-accent font-bold">保存して閉じる</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
