import { 
  getRecruitPageConfig, 
  saveRecruitPageConfig,
  getRecruitHistory,
  deleteRecruitHistory
} from '@/actions/recruit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { stores } from '@/data/stores';
import { uploadRecruitImage } from '@/lib/uploadRecruitImage';
import { Download, Upload, History } from 'lucide-react';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { STOCK_RECRUIT_CONFIG } from './constants';
import Footer from './Footer';
import LandingPage, { LandingPageConfig } from './LandingPage';
import HistoryManager from '@/components/admin/HistoryManager';

export default function RecruitEditor() {
  const [selectedStore, setSelectedStore] = React.useState('fukuoka');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [config, setConfig] = React.useState<LandingPageConfig>(STOCK_RECRUIT_CONFIG);
  const [isLoading, setIsLoading] = React.useState(false);
  const [history, setHistory] = React.useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false);

  // 履歴一覧の取得
  const fetchHistory = React.useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const result = await getRecruitHistory(selectedStore);
      if (result.success && result.history) {
        setHistory(result.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [selectedStore]);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Fetch config when store changes
  React.useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getRecruitPageConfig(selectedStore);
        if (result.success && result.config) {
          console.log('📡 Fetched recruit config:', result.config);
          setConfig((prev) => {
            const merged = JSON.parse(JSON.stringify(STOCK_RECRUIT_CONFIG)) as any;
            if (result.config) {
              Object.keys(result.config).forEach((section) => {
                const dbSectionValue = (result.config as any)[section];
                if (
                  dbSectionValue &&
                  typeof dbSectionValue === 'object' &&
                  !Array.isArray(dbSectionValue)
                ) {
                  merged[section] = {
                    ...(merged[section] || {}),
                    ...dbSectionValue,
                  };
                } else {
                  merged[section] = dbSectionValue;
                }
              });
            }
            return merged as LandingPageConfig;
          });
        } else {
          console.error('Failed to fetch config:', result.error);
        }
      } catch (e) {
        console.error('Error fetching config:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [selectedStore]);

  const handleUpdate = async (section: string, key: string, value: any) => {
    console.log(
      `[RecruitEditor] handleUpdate started: section=${section}, key=${key}`,
      value instanceof File ? 'File' : value,
    );

    const updateState = (path: string, val: any) => {
      setConfig((prev: any) => {
        const newConfig = { ...prev };
        if (!newConfig[section]) {
          newConfig[section] = {};
        } else {
          newConfig[section] = { ...newConfig[section] };
        }

        const keys = path.split('.');
        let current = newConfig[section];

        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          const nextK = keys[i + 1];
          const isNextArrayIndex = !isNaN(Number(nextK));

          if (!current[k]) {
            current[k] = isNextArrayIndex ? [] : {};
          } else {
            current[k] = Array.isArray(current[k]) ? [...current[k]] : { ...current[k] };
          }
          current = current[k];
        }

        const lastKey = keys[keys.length - 1];
        console.log(`[RecruitEditor] Setting value at [${section}].${path} = `, val);
        current[lastKey] = val;

        return newConfig;
      });
    };

    if (value instanceof File) {
      console.log('📂 File detected for upload:', value.name, value.size, value.type);
      setIsUploading(true);
      const toastId = toast.loading('画像をアップロード中...');
      try {
        const url = await uploadRecruitImage(selectedStore, section, value);
        if (url) {
          console.log('🔗 Uploaded URL success:', url);
          updateState(key, url);
          toast.success('画像をアップロードしました', { id: toastId });
          fetchHistory(); // 履歴更新
        } else {
          console.error('❌ Upload failed: No URL returned');
          toast.error('画像のアップロードに失敗しました', { id: toastId });
        }
      } catch (error) {
        console.error('❌ Upload exception:', error);
        toast.error('アップロード中にエラーが発生しました', { id: toastId });
      } finally {
        setIsUploading(false);
      }
    } else {
      updateState(key, value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveRecruitPageConfig(selectedStore, config);
      if (result.success) {
        toast.success('変更を保存しました');
        fetchHistory(); // 履歴更新
      } else {
        toast.error(`保存に失敗しました: ${result.error}`);
      }
    } catch (e) {
      toast.error('保存中にエラーが発生しました');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyHistory = (historyConfig: any) => {
    // Merge history config with stock defaults
    const merged = JSON.parse(JSON.stringify(STOCK_RECRUIT_CONFIG)) as any;
    if (historyConfig) {
      Object.keys(historyConfig).forEach((section) => {
        const histVal = (historyConfig as any)[section];
        if (histVal && typeof histVal === 'object' && !Array.isArray(histVal)) {
           merged[section] = { ...merged[section], ...histVal };
        } else {
           merged[section] = histVal;
        }
      });
    }
    setConfig(merged);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(config, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `recruit_config_${selectedStore}_${new Date().toISOString().split('T')[0]}.json`;
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
        const merged = { ...STOCK_RECRUIT_CONFIG, ...importedConfig };
        setConfig(merged);
        toast.success('設定ファイルを読み込みました。「変更を保存」ボタンを押すと本番に反映されます。');
      } catch (error) {
        console.error('Import failed:', error);
        toast.error('ファイルの読み込みに失敗しました。正しいJSON形式か確認してください。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const toastId = toast.loading('画像をアップロード中...');
      const url = await uploadRecruitImage(selectedStore, 'general', file);

      if (url) {
        toast.success('画像をアップロードしました', { id: toastId });
        fetchHistory(); // 履歴更新
        return url;
      } else {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
        return null;
      }
    } catch (e) {
      console.error(e);
      toast.error('アップロードエラー');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Store Selector Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/90 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-gray-800">採用ページ編集</h2>
          <div className="flex items-center gap-2 border-r pr-4">
            <Label htmlFor="store-name" className="shrink-0 text-xs font-bold text-gray-500">
              表示店舗名
            </Label>
            <Input
              id="store-name"
              value={config.general?.storeName || stores[selectedStore]?.displayName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleUpdate('general', 'storeName', e.target.value);
              }}
              className="h-8 w-[120px] bg-white text-sm"
              placeholder="例: 福岡店"
            />
          </div>
          <div className="flex items-center gap-2 border-r pr-4">
            <Label
              htmlFor="notification-emails"
              className="shrink-0 text-xs font-bold text-gray-500"
            >
              通知先メール (カンマ区切り)
            </Label>
            <Input
              id="notification-emails"
              value={config.general?.notificationEmails || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleUpdate('general', 'notificationEmails', e.target.value);
              }}
              className="h-8 w-[200px] bg-white text-sm"
              placeholder="example1@gmail.com, ..."
            />
          </div>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[250px] bg-white text-gray-900">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(stores).filter((store) => !!store.id).map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.emoji} {store.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border-l pl-4">
            <Label
              htmlFor="header-visible"
              className="shrink-0 text-[10px] font-bold text-gray-400"
            >
              共通ヘッダー表示
            </Label>
            <Switch
              id="header-visible"
              checked={config.header?.isVisible !== false}
              onCheckedChange={(checked) => handleUpdate('header', 'isVisible', checked)}
              className="scale-75 data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <HistoryManager
            title="採用ページ"
            history={history}
            isLoading={isHistoryLoading}
            onApply={handleApplyHistory}
            onDelete={deleteRecruitHistory}
            onRefresh={fetchHistory}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            title="バックアップをダウンロード"
            className="h-9 border-gray-200 px-3 text-gray-600 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline text-xs font-bold">書き出し</span>
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
              className="h-9 border-gray-200 px-3 text-gray-600 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline text-xs font-bold">読み込み</span>
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-primary text-white hover:bg-primary/90 font-bold h-9"
          >
            {isSaving ? '保存中...' : '変更を保存'}
          </Button>
        </div>
      </div>

      {/* Main Content Preview */}
      <div
        className={`relative min-h-screen overflow-hidden rounded-lg border bg-slate-50 shadow-lg ${isLoading || isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        {(isLoading || isUploading) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm font-medium text-gray-600">
                {isUploading ? '画像をアップロード中...' : '読み込み中...'}
              </p>
            </div>
          </div>
        )}
        <HashRouter>
          <LandingPage
            config={config}
            isEditing={true}
            onUpdate={(section: string, key: string, value: any) => {
              console.log(
                `📝 RecruitEditor update: [${section}] ${key}`,
                value instanceof File ? 'File' : value,
              );
              handleUpdate(section, key, value);
            }}
            onUpload={handleUpload}
            onOpenChat={() => {}}
            onOpenForm={() => {}}
          />
          <div className="relative">
            <div className="absolute right-2 top-2 z-50">
              <button
                onClick={() =>
                  handleUpdate('footer', 'isVisible', config?.footer?.isVisible === false)
                }
                className={`rounded px-3 py-1.5 text-xs font-semibold text-white shadow ${
                  config?.footer?.isVisible === false
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {config?.footer?.isVisible === false ? '表示する' : '非表示にする'}
              </button>
            </div>
            <Footer
              isEditing={true}
              onUpdate={(key: string, value: any) => handleUpdate('footer', key, value)}
              storeName={config.general?.storeName}
              {...config.footer}
            />
          </div>
        </HashRouter>
      </div>
    </div>
  );
}
