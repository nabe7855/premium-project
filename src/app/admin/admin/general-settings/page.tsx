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
  notificationEmail: string;
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
    notificationEmail: '',
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
          notificationEmail: config.notificationEmail || '',
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
        notificationEmail: contactInfo.notificationEmail,
      } as StoreTopPageConfig;

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
      <div className="flex flex-shrink-0 flex-col gap-4 rounded-xl border border-gray-700/50 bg-brand-secondary p-4 md:flex-row md:items-center md:justify-between md:rounded-2xl md:px-6 md:py-3">
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
            <h1 className="text-base font-bold text-white md:text-lg">一般設定</h1>
            <p className="text-[10px] text-brand-text-secondary">店舗ごとの各種連絡先情報を管理</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end md:gap-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="h-9 w-full min-w-[140px] border-gray-700 bg-brand-primary text-xs text-white md:w-[160px]">
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
            className="h-9 min-w-[100px] bg-brand-accent font-bold hover:bg-brand-accent/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto rounded-xl border border-gray-700/50 bg-brand-secondary p-4 md:rounded-2xl md:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
            {/* 電話番号設定 */}
            <div className="space-y-4 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-4 md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-700/30 pb-3">
                <Phone className="h-5 w-5 text-brand-accent" />
                <h2 className="text-base font-bold text-white md:text-lg">電話番号設定</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    電話番号
                  </label>
                  <input
                    type="text"
                    value={contactInfo.phoneNumber}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phoneNumber: e.target.value })
                    }
                    placeholder="03-6356-3860"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    電話受付時間
                  </label>
                  <input
                    type="text"
                    value={contactInfo.receptionHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, receptionHours: e.target.value })
                    }
                    placeholder="12:00〜23:00"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    営業時間
                  </label>
                  <input
                    type="text"
                    value={contactInfo.businessHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, businessHours: e.target.value })
                    }
                    placeholder="12:00〜翌朝4時"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* LINE設定 */}
            <div className="space-y-4 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-4 md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-700/30 pb-3">
                <ExternalLink className="h-5 w-5 text-[#06C755]" />
                <h2 className="text-base font-bold text-white md:text-lg">公式LINE設定</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    LINE URL
                  </label>
                  <input
                    type="text"
                    value={contactInfo.lineUrl}
                    onChange={(e) => setContactInfo({ ...contactInfo, lineUrl: e.target.value })}
                    placeholder="https://line.me/R/ti/p/@example"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                  <p className="mt-1 text-[10px] text-gray-500 md:text-xs">
                    LINE公式アカウントのURLを入力してください
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    LINE ID（参考用）
                  </label>
                  <input
                    type="text"
                    value={contactInfo.lineId}
                    onChange={(e) => setContactInfo({ ...contactInfo, lineId: e.target.value })}
                    placeholder="@example"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                  <p className="mt-1 text-[10px] text-gray-500 md:text-xs">
                    表示用のIDです（現在は保存されません）
                  </p>
                </div>
              </div>
            </div>

            {/* 通知メールアドレス設定 */}
            <div className="space-y-4 rounded-xl border border-gray-700/30 bg-brand-primary/20 p-4 md:p-6">
              <div className="flex items-center gap-3 border-b border-gray-700/30 pb-3">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-base font-bold text-white md:text-lg">
                  通知メールアドレス設定
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-300 md:text-sm">
                    通知先メールアドレス
                  </label>
                  <input
                    type="email"
                    value={contactInfo.notificationEmail}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, notificationEmail: e.target.value })
                    }
                    placeholder="notifications@example.com"
                    className="w-full rounded-lg border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-brand-accent md:px-4 md:py-2.5"
                  />
                  <p className="mt-1 text-[10px] text-gray-500 md:text-xs">
                    採用応募や予約が入った際の通知を受け取るメールアドレス
                  </p>
                </div>

                {/* メール送信の仕組みについての説明 */}
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-xs font-bold text-yellow-300 md:text-sm">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    メール送信の設定について
                  </h4>
                  <div className="space-y-2 text-[10px] text-yellow-200/80 md:text-xs">
                    <p>
                      <strong>現在の状態:</strong>{' '}
                      このメールアドレスは設定として保存されますが、実際のメール送信機能はまだ実装されていません。
                    </p>
                    <p>
                      <strong>実装方法:</strong>
                    </p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>
                        <strong>Supabase Edge Functions:</strong>{' '}
                        Supabaseのデータベーストリガーと組み合わせて、新規レコード挿入時に自動でメールを送信
                      </li>
                      <li>
                        <strong>Resend / SendGrid:</strong> Next.jsのAPI
                        Routeから呼び出してメール送信（採用応募や予約作成時にサーバーサイドで実行）
                      </li>
                      <li>
                        <strong>推奨:</strong> Resend + SupabaseのDatabase
                        Webhooksを使用すると、アプリケーションコードを変更せずにメール通知を実装可能
                      </li>
                    </ul>
                    <p className="mt-2 text-yellow-300">
                      💡
                      ここで設定したメールアドレスは、将来的にメール送信機能を実装する際に使用されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* プレビュー */}
            <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 md:p-6">
              <h3 className="text-xs font-bold text-blue-300 md:text-sm">📱 プレビュー</h3>
              <div className="space-y-3 rounded-lg bg-white p-4">
                <div className="flex items-center gap-3 text-[#D43D6F]">
                  <Phone size={20} />
                  <span className="text-xl font-black md:text-2xl">
                    {contactInfo.phoneNumber || '未設定'}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 md:text-xs">
                  電話受付: {contactInfo.receptionHours || '未設定'}
                </p>
                <p className="text-[10px] text-gray-600 md:text-xs">
                  営業時間: {contactInfo.businessHours || '未設定'}
                </p>
                {contactInfo.lineUrl && (
                  <a
                    href={contactInfo.lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#06C755] px-4 py-2 text-xs font-bold text-white md:text-sm"
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
