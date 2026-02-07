'use client';

import { ChevronLeft, ExternalLink, Phone, Save } from 'lucide-react';
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

import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { getAllStores } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';

interface StoreContactInfo {
  storeId: string;
  storeName: string;
  phoneNumber: string;
  receptionHours: string;
  businessHours: string;
  lineUrl: string;
  lineId: string;
}

export default function GeneralSettingsPage() {
  const [selectedStore, setSelectedStore] = useState('fukuoka');
  const [contactInfo, setContactInfo] = useState<StoreContactInfo>({
    storeId: 'fukuoka',
    storeName: '福岡店',
    phoneNumber: '',
    receptionHours: '',
    businessHours: '',
    lineUrl: '',
    lineId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const stores = getAllStores();

  // 店舗設定の取得
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const result = await getStoreTopConfig(selectedStore);
        const config = result.success && result.config ? result.config : DEFAULT_STORE_TOP_CONFIG;
        const store = stores.find((s) => s.slug === selectedStore);

        setContactInfo({
          storeId: selectedStore,
          storeName: store?.name || selectedStore,
          phoneNumber: config.header.phoneNumber || '',
          receptionHours: config.header.receptionHours || '',
          businessHours: config.header.businessHours || '',
          lineUrl: config.header.specialBanner?.link || '',
          lineId: '', // LINEIDは別途管理が必要な場合は追加
        });
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
      const result = await getStoreTopConfig(selectedStore);
      const config: StoreTopPageConfig =
        result.success && result.config ? result.config : DEFAULT_STORE_TOP_CONFIG;

      const updatedConfig: StoreTopPageConfig = {
        ...config,
        header: {
          ...config.header,
          phoneNumber: contactInfo.phoneNumber,
          receptionHours: contactInfo.receptionHours,
          businessHours: contactInfo.businessHours,
          specialBanner: {
            ...config.header.specialBanner,
            link: contactInfo.lineUrl,
          },
        },
      };

      const saveResult = await saveStoreTopConfig(selectedStore, updatedConfig);
      if (saveResult.success) {
        toast.success('設定を保存しました');
      } else {
        toast.error(`保存に失敗しました: ${saveResult.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('エラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-lg font-bold text-white">一般設定</h1>
            <p className="text-[10px] text-brand-text-secondary">
              店舗ごとの電話番号・LINE情報を管理できます
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-9 w-[160px] border-gray-700 bg-brand-primary text-xs text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.slug} value={store.slug}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-9 bg-brand-accent font-bold hover:bg-brand-accent/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? '保存中...' : '設定を保存'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto rounded-2xl border border-gray-700/50 bg-brand-secondary p-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {/* 電話番号設定 */}
            <div className="space-y-4 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-6">
              <div className="flex items-center gap-3 border-b border-gray-700/30 pb-3">
                <Phone className="h-5 w-5 text-brand-accent" />
                <h2 className="text-lg font-bold text-white">電話番号設定</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">電話番号</label>
                  <input
                    type="text"
                    value={contactInfo.phoneNumber}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phoneNumber: e.target.value })
                    }
                    placeholder="03-6356-3860"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    電話受付時間
                  </label>
                  <input
                    type="text"
                    value={contactInfo.receptionHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, receptionHours: e.target.value })
                    }
                    placeholder="12:00〜23:00"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">営業時間</label>
                  <input
                    type="text"
                    value={contactInfo.businessHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, businessHours: e.target.value })
                    }
                    placeholder="12:00〜翌朝4時"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent"
                  />
                </div>
              </div>
            </div>

            {/* LINE設定 */}
            <div className="space-y-4 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-6">
              <div className="flex items-center gap-3 border-b border-gray-700/30 pb-3">
                <ExternalLink className="h-5 w-5 text-[#06C755]" />
                <h2 className="text-lg font-bold text-white">公式LINE設定</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">LINE URL</label>
                  <input
                    type="text"
                    value={contactInfo.lineUrl}
                    onChange={(e) => setContactInfo({ ...contactInfo, lineUrl: e.target.value })}
                    placeholder="https://line.me/R/ti/p/@example"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    LINE公式アカウントのURLを入力してください
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    LINE ID（参考用）
                  </label>
                  <input
                    type="text"
                    value={contactInfo.lineId}
                    onChange={(e) => setContactInfo({ ...contactInfo, lineId: e.target.value })}
                    placeholder="@example"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    表示用のIDです（現在は保存されません）
                  </p>
                </div>
              </div>
            </div>

            {/* プレビュー */}
            <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
              <h3 className="text-sm font-bold text-blue-300">📱 プレビュー</h3>
              <div className="space-y-3 rounded-lg bg-white p-4">
                <div className="flex items-center gap-3 text-[#D43D6F]">
                  <Phone size={20} />
                  <span className="text-2xl font-black">{contactInfo.phoneNumber || '未設定'}</span>
                </div>
                <p className="text-xs text-gray-600">
                  電話受付: {contactInfo.receptionHours || '未設定'}
                </p>
                <p className="text-xs text-gray-600">
                  営業時間: {contactInfo.businessHours || '未設定'}
                </p>
                {contactInfo.lineUrl && (
                  <a
                    href={contactInfo.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#06C755] px-4 py-2 text-sm font-bold text-white"
                  >
                    <ExternalLink size={16} />
                    LINEで問い合わせる
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
