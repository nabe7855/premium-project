'use client';

import {
  ChevronLeft,
  Eye,
  History,
  Layout,
  Save,
  ExternalLink,
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
import { Switch } from '@/components/ui/switch';

import LinksPage from '@/components/templates/store/fukuoka/page-templates/LinksPage';
import { getAllStoresFromDb } from '@/lib/actions/store-actions';
import { getActivePartnerLinks } from '@/lib/actions/partnerLinks';
import { getStoreLinksConfig } from '@/lib/store/getStoreLinksConfig';
import { 
  saveStoreLinksConfig,
  getHeaderHistory,
  deleteHeaderHistory
} from '@/lib/store/saveStoreLinksConfig';
import { DEFAULT_STORE_LINKS_CONFIG, StoreLinksConfig } from '@/lib/store/storeLinksConfig';
import { uploadStoreTopImage } from '@/lib/store/uploadStoreTopImage';
import HistoryManager from '@/components/admin/HistoryManager';

export default function StoreLinksManagement() {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [config, setConfig] = useState<StoreLinksConfig>(DEFAULT_STORE_LINKS_CONFIG);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [dbStores, setDbStores] = useState<any[]>([]);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // 履歴一覧の取得
  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const result = await getHeaderHistory(selectedStore);
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const storesResult = await getAllStoresFromDb();
      if (storesResult.success) {
        setDbStores(storesResult.stores || []);
        const current = storesResult.stores?.find((s: any) => s.slug === selectedStore);
        setCurrentStoreData(current || null);
      }

      const configResult = await getStoreLinksConfig(selectedStore);
      if (configResult.success && configResult.config) {
        setConfig(configResult.config as StoreLinksConfig);
      } else {
        setConfig(DEFAULT_STORE_LINKS_CONFIG);
      }

      const linksResult = await getActivePartnerLinks(selectedStore);
      setLinks(linksResult.links || []);
    } catch (error) {
      console.error('Error fetching links management data:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStore]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveStoreLinksConfig(selectedStore, config);
      if (result.success) {
        toast.success('設定を保存しました');
        fetchHistory(); // 履歴更新
      } else {
        toast.error('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving links config:', error);
      toast.error('エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyHistory = (historyConfig: any) => {
    const merged = { ...DEFAULT_STORE_LINKS_CONFIG, ...historyConfig };
    setConfig(merged);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `links_config_${selectedStore}_${new Date().toISOString().split('T')[0]}.json`;
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
        const merged = { ...DEFAULT_STORE_LINKS_CONFIG, ...importedConfig };
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
    if (section === 'hero') {
      setConfig((prev) => ({
        ...prev,
        hero: { ...prev.hero, [key]: value },
      }));
    } else if (section === 'categories') {
      setConfig((prev) => ({
        ...prev,
        categories: value,
      }));
    }
  };

  const handleImageUpload = async (section: string, file: File, index?: number, key?: string) => {
    const toastId = toast.loading('画像をアップロード中...');
    try {
      const publicUrl = await uploadStoreTopImage(selectedStore, section, file, { maxWidth: 1200, quality: 0.8 });
      if (!publicUrl) {
         toast.error('アップロードに失敗しました', { id: toastId });
         return;
      }
      if (section === 'hero' && key === 'imageUrl') {
        handleUpdate('hero', 'imageUrl', publicUrl);
      }
      toast.success('アップロードしました', { id: toastId });
      fetchHistory(); // 履歴更新
    } catch (err) {
      toast.error('エラーが発生しました', { id: toastId });
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
      <div className="flex flex-shrink-0 flex-col items-stretch justify-between gap-2 rounded-2xl border border-gray-700/50 bg-brand-secondary px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-gray-400"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">リンク集ページ管理</h1>
            <p className="text-[10px] text-brand-text-secondary">プレビュー上で直接テキストを編集できます</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HistoryManager
            title="リンク集"
            history={history}
            isLoading={isHistoryLoading}
            onApply={handleApplyHistory}
            onDelete={deleteHeaderHistory}
            onRefresh={fetchHistory}
          />

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

          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-9 min-w-[200px] border-pink-500/50 bg-pink-500/10 text-sm font-bold text-pink-500">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 bg-white text-black shadow-xl">
              {dbStores
                .filter(
                  (store) =>
                    store.slug &&
                    store.slug.trim() !== '' &&
                    store.is_active &&
                    !store.use_external_url
                )
                .map((store) => (
                  <SelectItem key={store.slug} value={store.slug} className="font-bold">
                    {store.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            variant={isPreviewMode ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={isPreviewMode ? 'bg-white/10 hidden sm:flex' : 'border-gray-700 text-gray-300 hidden sm:flex'}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? '編集モードへ' : 'プレビュー'}
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="bg-brand-accent font-bold hover:bg-brand-accent/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? '保存中...' : '公開'}
          </Button>
        </div>
      </div>

      <div className="flex flex-grow gap-4 overflow-hidden">
        <div className="hidden w-64 flex-shrink-0 space-y-4 overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-4 lg:block">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Layout className="h-3 w-3" />
            表示カテゴリ
          </h2>
          <div className="space-y-2">
            {config.categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between rounded-lg border border-gray-700/30 bg-brand-primary/30 p-3">
                <span className="text-sm font-medium text-gray-200">{cat.label}</span>
                <Switch
                  checked={cat.isVisible}
                  onCheckedChange={(checked) => {
                    const newCats = config.categories.map(c => c.id === cat.id ? { ...c, isVisible: checked } : c);
                    handleUpdate('categories', 'items', newCats);
                  }}
                  className="scale-75"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-[10px] leading-relaxed text-blue-300 font-bold">
              💡 編集のヒント
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-blue-300 opacity-80">
              右側のプレビュー画面でテキスト（タイトルや説明文）を直接クリックして書き換えることができます。
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-700 mt-4 text-xs"
            onClick={() => router.push(`/store/${selectedStore}/links`)}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            実際のページを確認
          </Button>
        </div>

        <div className="relative flex-grow overflow-hidden rounded-2xl border border-gray-700/50 bg-white shadow-inner">
          <div className="absolute inset-0 overflow-y-auto">
            <LinksPage
              slug={selectedStore}
              storeName={currentStoreData?.name || ''}
              links={links}
              config={config}
              isEditing={!isPreviewMode}
              onUpdate={handleUpdate}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
