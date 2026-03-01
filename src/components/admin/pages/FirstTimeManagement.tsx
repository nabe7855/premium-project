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

import FirstTimePageContent from '@/components/sections/guide/first-time/FirstTimePageContent';
import { StoreProvider } from '@/contexts/StoreContext';
import { stores } from '@/data/stores';
import { getFirstTimeConfig, saveFirstTimeConfig } from '@/lib/store/firstTimeActions';
import {
  DEFAULT_FIRST_TIME_CONFIG,
  FirstTimeConfig,
  mergeConfig,
} from '@/lib/store/firstTimeConfig';
import { getAllStores } from '@/lib/store/store-data';

const SECTION_LABELS: Record<string, string> = {
  banner: 'バナー',
  hero: 'メインビジュアル',
  welcome: 'ストロベリーボーイズとは',
  threePoints: '3つの安心ポイント',
  casts: '自慢のセラピストたち',
  sevenReasons: '7つの理由',
  reservationFlow: 'ご利用までの流れ',
  dayFlow: 'ご予約当日の流れ',
  pricing: 'ご利用プランの一覧',
  forbidden: '禁止事項',
  faq: 'よくあるご質問',
  cta: 'フッター問い合わせ内容',
};

const SECTION_ORDER = [
  'banner',
  'hero',
  'welcome',
  'threePoints',
  'casts',
  'sevenReasons',
  'reservationFlow',
  'dayFlow',
  'pricing',
  'forbidden',
  'faq',
  'cta',
];

export default function FirstTimeManagement() {
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [config, setConfig] = useState<FirstTimeConfig>(DEFAULT_FIRST_TIME_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 設定の取得
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getFirstTimeConfig(selectedStore);
        if (result.success && result.config) {
          setConfig(mergeConfig(result.config));
        } else {
          setConfig(DEFAULT_FIRST_TIME_CONFIG);
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
      const result = await saveFirstTimeConfig(selectedStore, config);
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

  const handleImageUpload = async (section: string, file: File) => {
    toast.info('画像のアップロードを開始します...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', `stores/${selectedStore}/first-time/${section}`);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;

      // 古い画像を削除（オプション。もしあれば）
      const oldImageUrl = (config[section as keyof FirstTimeConfig] as any)?.imageUrl;
      if (oldImageUrl && typeof oldImageUrl === 'string' && oldImageUrl.startsWith('http')) {
        try {
          // server actionを介して削除
          const { deleteStorageFile } = await import('@/actions/storage');
          await deleteStorageFile(oldImageUrl);
        } catch (e) {
          console.warn('Failed to delete old image:', e);
        }
      }

      handleUpdate(section, 'imageUrl', imageUrl);

      // 設定を自動保存（永続化を確実にするため）
      const newConfig = {
        ...config,
        [section]: {
          ...(config[section as keyof FirstTimeConfig] as any),
          imageUrl: imageUrl,
        },
      };

      try {
        const saveResult = await saveFirstTimeConfig(selectedStore, newConfig);
        if (saveResult.success) {
          toast.success('画像を保存しました');
        } else {
          console.error('Auto-save failed:', saveResult.error);
          toast.error('DBへの保存に失敗しました。公開ボタンを押してください。');
        }
      } catch (saveError) {
        console.error('Auto-save unexpected error:', saveError);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`画像のアップロードに失敗しました: ${error.message}`);
    }
  };

  // インライン更新処理
  const handleUpdate = (section: string, key: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof FirstTimeConfig] as any),
        [key]: value,
      },
    }));
  };

  // 表示切り替えトグル用
  const toggleVisibility = (section: keyof FirstTimeConfig) => {
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
          右側のプレビュー画面でテキストを直接クリックすることで編集が可能です。
        </p>
      </div>
    </div>
  );

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
              <h1 className="text-sm font-bold text-white sm:text-lg">初めての方へページ管理</h1>
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
              <div className="pointer-events-auto">
                {/* 
                  Passing props to the page component. 
                  Note: We might need to refactor FirstTimePage to accept these props.
                */}
                <FirstTimePageContent
                  slug={selectedStore}
                  isEditing={!isPreviewMode}
                  config={config}
                  onUpdate={handleUpdate}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </StoreProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
