import { getRecruitPageConfig, saveRecruitPageConfig } from '@/actions/recruit';
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
import { stores } from '@/data/stores';
import { uploadRecruitImage } from '@/lib/uploadRecruitImage';
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { STOCK_RECRUIT_CONFIG } from './constants';
import Footer from './Footer';
import LandingPage, { LandingPageConfig } from './LandingPage';

export default function RecruitEditor() {
  const [selectedStore, setSelectedStore] = React.useState('fukuoka');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const [config, setConfig] = React.useState<LandingPageConfig>(STOCK_RECRUIT_CONFIG);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch config when store changes
  React.useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getRecruitPageConfig(selectedStore);
        if (result.success && result.config) {
          console.log('📡 Fetched recruit config:', result.config);
          // Merge with default config at the section level to ensure all sections and their defaults exist
          setConfig((prev) => {
            // Use JSON parse/stringify for a quick deep clone of the default config
            const merged = JSON.parse(JSON.stringify(STOCK_RECRUIT_CONFIG)) as any;
            // Merge each section from fetched config
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
          // Reset to default or handle error
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
        // Deep clone the section to ensure React detects changes
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
            // Shallow clone child to maintain immutability chain
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

    // If value is a File, upload it first
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

  const handleUpload = async (file: File): Promise<string | null> => {
    try {
      // Use a generic section name for general uploads if needed, or maybe pass section from child?
      // For now, let's assume 'comic' or generic 'uploads' since the child just wants a URL.
      // Actually, uploadRecruitImage takes (storeId, sectionKey, file).
      // Let's use 'comic' as default or generic 'images' if we want it reusable for everything?
      // The instruction says "Propagate... to ComicSlider". ComicSlider is "comic".
      // But LandingPage might use it for others.
      // Let's make the prop accept (file, section?) or just (file) and we imply section?
      // In the plan I said `onUpload?: (file: File) => Promise<string | null>`.
      // Let's infer section or use a generic one. 'common' or 'misc'?
      // Or better, let's keep it simple. The child knows what component it is, but maybe not the section key in the global config.
      // Actually, ComicSlider IS the comic section.

      // Let's just use 'uploads' for now as a generic bucket folder or pass a second optional arg?
      // Plan signature was `(file: File) => Promise<string | null>`.
      // Let's stick to that for simplicity, or update it to be cleaner.
      // I'll assume 'uploads' for the section key for these generic helper uploads, or 'comic' since that's the main user right now.
      // Actually, looking at uploadRecruitImage, it puts it in `recruit/${storeId}/${fileName}`.
      // `fileName` is `${sectionKey}_${timestamp}.${fileExt}`.
      // So if I pass 'general', files will be `general_123.jpg`. This is fine.

      setIsUploading(true);
      const toastId = toast.loading('画像をアップロード中...');
      const url = await uploadRecruitImage(selectedStore, 'general', file);

      if (url) {
        toast.success('画像をアップロードしました', { id: toastId });
        return url;
      } else {
        toast.error('画像のアップロードに失敗しました', { id: toastId });
        return null;
      }
    } catch (e) {
      console.error(e);
      toast.error('アップロードエラー', { id: toast.loading('Error') }); // toast.loading returns id, but here I just want to show error.
      // actually toast.error replaces if ID matches, but here I just want to show error.
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
              {Object.values(stores).map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.emoji} {store.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">※ 画像をクリックして変更できます</div>
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-primary text-white hover:bg-primary/90"
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
        {/* Pass disabled editing props */}
        {/* Wrap in HashRouter to provide context for child components using useNavigate */}
        <HashRouter>
          <LandingPage
            config={config}
            isEditing={true}
            onUpdate={(section, key, value) => {
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
