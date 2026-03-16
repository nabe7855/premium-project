import { deleteStorageFile } from '@/actions/storage';
import Card from '@/components/admin/ui/Card';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { saveStoreTopConfig } from '@/lib/store/saveStoreTopConfig';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { supabase } from '@/lib/supabaseClient';
import { Store } from '@/types/dashboard';
import {
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Phone,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Component for displaying an existing store's card
const StoreCard: React.FC<{
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (id: string, current: boolean) => void;
  isUpdating?: boolean;
}> = ({ store, onEdit, onDelete, onToggleActive, isUpdating }) => (
  <Card title={store.name}>
    <div
      className={`relative mb-4 transition-all duration-300 ${!store.isActive ? 'opacity-50 grayscale-[0.5]' : ''}`}
    >
      <img
        src={store.photoUrl || 'https://picsum.photos/400/200'}
        alt={store.name}
        className="h-32 w-full rounded-md border border-gray-700 object-cover"
      />

      {/* Visibility Status Badge */}
      <div className="absolute left-2 top-2">
        {store.useExternalUrl ? (
          <div className="flex items-center gap-1.5 rounded-full bg-blue-500/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-md">
            <ExternalLink size={10} />
            外部誘導中
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-lg backdrop-blur-md ${
              store.isActive ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
            }`}
          >
            {store.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
            {store.isActive ? '表示中' : '非表示（サイトから隠されています）'}
          </div>
        )}
      </div>
    </div>

    <p className="mb-1 line-clamp-1 text-sm font-semibold text-brand-text-secondary">
      {store.catchphrase}
    </p>
    <p className="mb-4 line-clamp-2 h-10 overflow-hidden text-xs text-gray-400">{store.overview}</p>

    <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-1 rounded-lg bg-gray-900/40 p-2 font-mono text-[10px]">
      <div className="flex items-center gap-1 text-gray-500">
        <Edit2 size={10} />
        <span>住所:</span>
      </div>
      <div className="truncate text-gray-300">{store.address || '未設定'}</div>
      <div className="flex items-center gap-1 text-gray-500">
        <Loader2 size={10} />
        <span>営業:</span>
      </div>
      <div className="truncate text-gray-300">{store.businessHours || '未設定'}</div>
    </div>

    <div className="space-y-3">
      {/* Primary Action */}
      <button
        onClick={() => onEdit(store)}
        className="flex w-full items-center justify-center gap-2 rounded border border-brand-accent/50 bg-brand-accent/20 px-4 py-2.5 text-sm font-bold text-brand-accent transition-colors hover:bg-brand-accent/40"
      >
        <Edit2 size={16} />
        詳細・編集
      </button>

      {/* Horizontal Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onToggleActive(store.id, store.isActive)}
          disabled={isUpdating}
          className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-bold transition-all ${
            store.isActive
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {isUpdating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : store.isActive ? (
            <EyeOff size={14} />
          ) : (
            <Eye size={14} />
          )}
          {store.isActive ? '非表示にする' : '表示する'}
        </button>

        <button
          onClick={() => onDelete(store.id, store.name)}
          className="flex items-center justify-center gap-2 rounded bg-red-900/30 text-red-500 transition-all hover:bg-red-600 hover:text-white"
        >
          <Trash2 size={14} />
          <span className="text-xs font-bold">店舗削除</span>
        </button>
      </div>
    </div>
  </Card>
);

// Main page for creating and managing stores
export default function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const [newStore, setNewStore] = useState<Omit<Store, 'id' | 'photoUrl' | 'isActive'>>({
    name: '',
    slug: '',
    catchphrase: '',
    overview: '',
    address: '',
    phone: '',
    businessHours: '',
    externalUrl: '',
    useExternalUrl: false,
  });
  const [updatingStoreId, setUpdatingStoreId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch Stores
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData: Store[] = (data || []).map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug || '',
        catchphrase: s.catch_copy || '',
        overview: s.description || '', // Map description to overview
        address: s.address || '',
        phone: s.phone || '',
        photoUrl: s.image_url || '',
        lineId: s.line_id || '',
        lineUrl: s.line_url || '',
        contactEmail: s.contact_email || '',
        notificationEmail: s.notification_email || '',
        businessHours: s.business_hours || '',
        externalUrl: s.external_url || '',
        useExternalUrl: s.use_external_url ?? false,
        isActive: s.is_active ?? true,
      }));

      setStores(mappedData);
    } catch (err) {
      console.error('Error fetching stores:', err);
      alert('店舗データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleInputChange = <K extends keyof typeof newStore>(
    key: K,
    value: (typeof newStore)[K],
  ) => {
    setNewStore((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    // ファイル名のサニタイズ（日本語などのマルチバイト文字を排除）
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${Date.now()}.${fileExt}`;

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from('store-images')
        .upload(fileName, file);

      if (uploadError) {
        // エラー内容に応じた日本語メッセージ
        let message = '画像のアップロードに失敗しました。';
        if (uploadError.message.includes('row-level security')) {
          message =
            '画像のアップロード権限がありません（RLSポリシーエラー）。管理者に問い合わせてください。';
        } else if (uploadError.message.includes('bucket not found')) {
          message = '保存先のバケットが見つかりません。';
        }
        throw new Error(message);
      }

      const { data } = supabase.storage.from('store-images').getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err: any) {
      console.error('Upload error details:', err);
      // ダイアログを表示して通知
      alert(err.message || 'アップロード中に予期せぬエラーが発生しました。');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = async (store: Store) => {
    setEditingStore(store);
    setIsLoadingConfig(true);
    try {
      const result = await getStoreTopConfig(store.slug);
      const config = result.success && result.config ? result.config : DEFAULT_STORE_TOP_CONFIG;

      setEditingStore({
        ...store,
        receptionHours: config.header.receptionHours || '',
        businessHours: config.header.businessHours || '',
        lineUrl: config.header.specialBanner?.link || store.lineUrl || '',
        lineId: config.lineId || store.lineId || '',
        contactEmail: store.contactEmail || '',
        notificationEmail: config.notificationEmail || store.notificationEmail || '',
      });
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const slug =
        newStore.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || `store-${Date.now()}`;

      const { data, error } = await supabase
        .from('stores')
        .insert([
          {
            name: newStore.name,
            slug: slug,
            catch_copy: newStore.catchphrase,
            description: newStore.overview,
            address: newStore.address,
            phone: newStore.phone,
            business_hours: (newStore as any).businessHours,
            image_url: imageUrl,
            external_url: newStore.externalUrl,
            use_external_url: newStore.useExternalUrl,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const created = data[0];
        const mapped: Store = {
          id: created.id,
          name: created.name,
          slug: created.slug || '',
          catchphrase: created.catch_copy || '',
          overview: created.description || '',
          address: created.address || '',
          phone: created.phone || '',
          photoUrl: created.image_url || '',
          externalUrl: created.external_url || '',
          useExternalUrl: created.use_external_url ?? false,
          isActive: created.is_active ?? true,
        };
        setStores((prev) => [mapped, ...prev]);
        setNewStore({
          name: '',
          slug: '',
          catchphrase: '',
          overview: '',
          address: '',
          phone: '',
          businessHours: '',
          externalUrl: '',
          useExternalUrl: false,
        });
        setSelectedFile(null);
        alert('店舗を作成しました');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      alert('店舗情報の更新に失敗しました: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingStoreId(id);
    try {
      const { error } = await supabase
        .from('stores')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setStores((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s)));
    } catch (err) {
      console.error('Toggle active error:', err);
      alert('表示切替に失敗しました');
    } finally {
      setUpdatingStoreId(null);
    }
  };

  const handleDeleteStore = async (id: string, name: string) => {
    // Stage 1: Basic confirmation
    if (!confirm(`店舗「${name}」を本当に削除しますか？`)) return;

    // Stage 2: CRITICAL data loss warning
    const warning = `【重要：最終確認】\nこの店舗を削除すると、キャスト出勤情報、求人ページ設定、料金設定などの関連データが「すべて」永久に失われ、元に戻せません。画像を完全に削除するため復旧も不可能です。\n\n本当によろしいですか？`;
    if (!confirm(warning)) return;

    try {
      // 1. Get the image URL and other linked data if necessary
      const storeToDelete = stores.find((s) => s.id === id);
      const imageUrl = storeToDelete?.photoUrl;

      // Note: Relation-linked data will be handled by Prisma onDelete Cascade (if properly set in DB)
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) throw error;

      // 2. Delete main image from storage if exists
      if (imageUrl && imageUrl.startsWith('http')) {
        await deleteStorageFile(imageUrl);
      }

      setStores((prev) => prev.filter((s) => s.id !== id));
      alert('店舗および関連する全データを完全に消去しました。');
    } catch (err: any) {
      console.error('Delete error:', err);
      alert('店舗の削除に失敗しました: ' + (err.message || '予期せぬエラー'));
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    setIsSubmitting(true);
    try {
      let imageUrl = editingStore.photoUrl;
      if (selectedFile) {
        // Old image cleanup
        if (imageUrl && imageUrl.startsWith('http')) {
          await deleteStorageFile(imageUrl);
        }
        imageUrl = await handleFileUpload(selectedFile);
      }

      // 1. Update stores table
      const { error: storeError } = await supabase
        .from('stores')
        .update({
          name: editingStore.name,
          catch_copy: editingStore.catchphrase,
          description: editingStore.overview,
          address: editingStore.address,
          phone: editingStore.phone,
          image_url: imageUrl,
          business_hours: editingStore.businessHours || null,
          reception_hours: editingStore.receptionHours || null,
          line_id: editingStore.lineId || null,
          line_url: editingStore.lineUrl || null,
          contact_email: editingStore.contactEmail || null,
          notification_email: editingStore.notificationEmail || null,
          external_url: editingStore.externalUrl || null,
          use_external_url: editingStore.useExternalUrl ?? false,
        })
        .eq('id', editingStore.id);

      if (storeError) throw storeError;

      // 2. Update store top config (General Settings)
      const result = await getStoreTopConfig(editingStore.slug);
      const config: StoreTopPageConfig =
        result.success && result.config ? result.config : DEFAULT_STORE_TOP_CONFIG;

      const updatedConfig: StoreTopPageConfig = {
        ...config,
        header: {
          ...(config.header || {}),
          phoneNumber: editingStore.phone, // Sync phone with config
          receptionHours: editingStore.receptionHours || '',
          businessHours: editingStore.businessHours || '',
          specialBanner: {
            ...(config.header?.specialBanner || {}),
            link: editingStore.lineUrl || '',
          },
        },
        footer: {
          ...(config.footer || {}),
          shopInfo: {
            ...(config.footer?.shopInfo || {}),
            name: editingStore.name,
            address: editingStore.address,
            phone: editingStore.phone,
            businessHours: editingStore.businessHours || '',
            receptionHours: editingStore.receptionHours || '',
          },
        },
        notificationEmail: editingStore.notificationEmail || '',
        lineId: editingStore.lineId || '',
      } as StoreTopPageConfig;

      await saveStoreTopConfig(editingStore.slug, updatedConfig);

      setStores((prev) =>
        prev.map((s) => (s.id === editingStore.id ? { ...editingStore, photoUrl: imageUrl } : s)),
      );
      setEditingStore(null);
      setSelectedFile(null);
      alert('店舗情報を更新しました');
    } catch (err: any) {
      console.error('Update error:', err);
      alert('更新に失敗しました: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Form for creating a new store */}
      <div className="lg:col-span-1">
        <Card title="新規店舗作成">
          <form onSubmit={handleCreateStore} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                店舗名
              </label>
              <input
                type="text"
                value={newStore.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                placeholder="例: ストロベリーボーイズ新宿"
                className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                キャッチコピー
              </label>
              <input
                type="text"
                value={newStore.catchphrase}
                onChange={(e) => handleInputChange('catchphrase', e.target.value)}
                required
                placeholder="例: 最高級の癒やしをあなたに"
                className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                店舗概要
              </label>
              <textarea
                value={newStore.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                required
                rows={3}
                placeholder="店舗の紹介文を詳しく入力..."
                className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  住所
                </label>
                <input
                  type="text"
                  value={newStore.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
                  placeholder="福岡県福岡市..."
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={newStore.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  placeholder="090-0000-0000"
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  営業時間
                </label>
                <input
                  type="text"
                  value={(newStore as any).businessHours}
                  onChange={(e) => handleInputChange('businessHours' as any, e.target.value)}
                  placeholder="24時間営業"
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
                />
              </div>
              <div className="flex items-end pb-1.5">
                <label className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-800/50 px-3 py-2 transition-colors hover:bg-gray-800">
                  <input
                    type="checkbox"
                    checked={newStore.useExternalUrl}
                    onChange={(e) => handleInputChange('useExternalUrl', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-brand-primary accent-brand-accent"
                  />
                  <span className="text-[10px] font-bold text-gray-300">外部リダイレクト</span>
                </label>
              </div>
            </div>

            {newStore.useExternalUrl && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                  誘導先URL
                </label>
                <input
                  type="text"
                  value={newStore.externalUrl}
                  onChange={(e) => handleInputChange('externalUrl', e.target.value)}
                  required
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-md border border-brand-accent/50 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                店舗写真
              </label>
              <div className="mt-1 flex w-full items-center justify-center">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-brand-primary transition-colors hover:bg-gray-800">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <Upload className="mb-2 h-8 w-8 text-gray-500" />
                    <p className="mb-2 text-xs text-gray-500">
                      <span className="font-semibold">クリックしてアップロード</span>
                    </p>
                    {selectedFile && (
                      <p className="text-[10px] text-brand-accent">{selectedFile.name}</p>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-accent px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : '店舗を作成'}
            </button>
          </form>
        </Card>
      </div>

      {/* List of existing stores */}
      <div className="lg:col-span-2">
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <Loader2 className="mb-4 animate-spin" size={48} />
            <p>読み込み中...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-brand-primary/50 font-mono text-gray-500">
            <p>登録されている店舗がありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onEdit={handleEditClick}
                onDelete={handleDeleteStore}
                onToggleActive={handleToggleActive}
                isUpdating={updatingStoreId === store.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-700 bg-brand-primary shadow-2xl duration-200 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900/50 p-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Edit2 size={20} className="text-brand-accent" />
                店舗情報の編集
              </h2>
              <button
                onClick={() => setEditingStore(null)}
                className="p-2 text-gray-400 transition-colors hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {isLoadingConfig ? (
              <div className="flex items-center justify-center p-20">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-accent"></div>
                <p className="ml-4 text-gray-400">設定を読み込み中...</p>
              </div>
            ) : (
              <form
                onSubmit={handleUpdateStore}
                className="max-h-[80vh] space-y-6 overflow-y-auto p-6"
              >
                <div className="mb-6 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-4">
                  <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                    誘導モード設定
                  </label>
                  <div className="flex gap-2 rounded-lg bg-black/40 p-1">
                    <button
                      type="button"
                      onClick={() => setEditingStore({ ...editingStore, useExternalUrl: false })}
                      className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                        !editingStore.useExternalUrl
                          ? 'bg-brand-accent text-white shadow-lg'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      内部誘導 (店舗ページを表示)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStore({ ...editingStore, useExternalUrl: true })}
                      className={`flex-1 rounded-md py-2 text-xs font-bold transition-all ${
                        editingStore.useExternalUrl
                          ? 'bg-brand-accent text-white shadow-lg'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      外部誘導 (URLリダイレクト)
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] italic text-gray-500">
                    {editingStore.useExternalUrl
                      ? '※外部誘導モードでは、ユーザーを入店ボタンから直接指定URLへ移動させます。'
                      : '※内部誘導モードでは、システムの店舗個別ページを表示します。'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-4 rounded-xl border border-gray-700/30 bg-gray-900/40 p-4">
                      <div className="flex items-center gap-2 border-b border-gray-700/50 pb-2">
                        <Edit2 size={16} className="text-brand-accent" />
                        <h3 className="text-sm font-bold text-white">基本情報</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                            店舗名
                          </label>
                          <input
                            type="text"
                            value={editingStore.name}
                            onChange={(e) =>
                              setEditingStore({
                                ...editingStore,
                                name: e.target.value,
                              })
                            }
                            required
                            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                          />
                        </div>
                        {editingStore.useExternalUrl && (
                          <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-accent">
                              🔗 リダイレクト先URL
                            </label>
                            <input
                              type="text"
                              value={editingStore.externalUrl || ''}
                              onChange={(e) =>
                                setEditingStore({
                                  ...editingStore,
                                  externalUrl: e.target.value,
                                })
                              }
                              placeholder="https://example.com/shop"
                              required
                              className="mt-1 w-full rounded-md border border-brand-accent/50 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                            />
                          </div>
                        )}
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                            キャッチコピー
                          </label>
                          <input
                            type="text"
                            value={editingStore.catchphrase}
                            onChange={(e) =>
                              setEditingStore({
                                ...editingStore,
                                catchphrase: e.target.value,
                              })
                            }
                            required
                            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                            店舗概要
                          </label>
                          <textarea
                            value={editingStore.overview}
                            onChange={(e) =>
                              setEditingStore({
                                ...editingStore,
                                overview: e.target.value,
                              })
                            }
                            required
                            rows={3}
                            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                          ></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                              現在の写真
                            </label>
                            <div className="group relative mt-1">
                              <img
                                src={editingStore.photoUrl || 'https://picsum.photos/400/200'}
                                className="h-24 w-full rounded-lg border border-gray-700 object-cover"
                                alt="Current"
                              />
                              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <Upload className="text-white" size={16} />
                                <span className="ml-2 text-[10px] text-white">変更</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>
                            {selectedFile && (
                              <p className="mt-1 text-[10px] text-brand-accent">
                                選択済み: {selectedFile.name}
                              </p>
                            )}
                          </div>
                          {!editingStore.useExternalUrl && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                  住所
                                </label>
                                <input
                                  type="text"
                                  value={editingStore.address}
                                  onChange={(e) =>
                                    setEditingStore({
                                      ...editingStore,
                                      address: e.target.value,
                                    })
                                  }
                                  required
                                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                                />
                              </div>

                              <div className="space-y-4 rounded-xl border border-[#06C755]/20 bg-[#06C755]/5 p-4">
                                <div className="flex items-center gap-2 border-b border-[#06C755]/30 pb-2">
                                  <ExternalLink size={16} className="text-[#06C755]" />
                                  <h3 className="text-sm font-bold text-white">公式LINE設定</h3>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                      LINE URL
                                    </label>
                                    <input
                                      type="text"
                                      value={editingStore.lineUrl ?? ''}
                                      onChange={(e) =>
                                        setEditingStore({
                                          ...editingStore,
                                          lineUrl: e.target.value,
                                        })
                                      }
                                      placeholder="https://line.me/R/ti/p/@example"
                                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                      LINE ID（参考用）
                                    </label>
                                    <input
                                      type="text"
                                      value={editingStore.lineId ?? ''}
                                      onChange={(e) =>
                                        setEditingStore({
                                          ...editingStore,
                                          lineId: e.target.value,
                                        })
                                      }
                                      placeholder="@example"
                                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {!editingStore.useExternalUrl && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                          <div className="flex items-center gap-2 border-b border-blue-500/30 pb-2">
                            <Phone size={16} className="text-blue-400" />
                            <h3 className="text-sm font-bold text-white">電話番号設定</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                電話番号
                              </label>
                              <input
                                type="tel"
                                value={editingStore.phone}
                                onChange={(e) =>
                                  setEditingStore({
                                    ...editingStore,
                                    phone: e.target.value,
                                  })
                                }
                                required
                                className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                  受付時間
                                </label>
                                <input
                                  type="text"
                                  value={editingStore.receptionHours}
                                  onChange={(e) =>
                                    setEditingStore({
                                      ...editingStore,
                                      receptionHours: e.target.value,
                                    })
                                  }
                                  placeholder="12:00〜23:00"
                                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                                  営業時間
                                </label>
                                <input
                                  type="text"
                                  value={editingStore.businessHours}
                                  onChange={(e) =>
                                    setEditingStore({
                                      ...editingStore,
                                      businessHours: e.target.value,
                                    })
                                  }
                                  className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                          <div className="flex items-center gap-2 border-b border-yellow-500/30 pb-2">
                            <Mail size={16} className="text-yellow-400" />
                            <h3 className="text-sm font-bold text-white">通知用メールアドレス</h3>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                              通知用メールアドレス (複数はカンマ区切り)
                            </label>
                            <input
                              type="text"
                              value={editingStore.notificationEmail ?? ''}
                              onChange={(e) =>
                                setEditingStore({
                                  ...editingStore,
                                  notificationEmail: e.target.value,
                                })
                              }
                              placeholder="shop1@example.com, shop2@example.com"
                              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                          <div className="flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                            <Mail size={16} className="text-emerald-400" />
                            <h3 className="text-sm font-bold text-white">
                              お問い合わせ用メールアドレス
                            </h3>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                              お問い合わせ用 (サイト表示用)
                            </label>
                            <input
                              type="email"
                              value={editingStore.contactEmail ?? ''}
                              onChange={(e) =>
                                setEditingStore({
                                  ...editingStore,
                                  contactEmail: e.target.value,
                                })
                              }
                              className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 border-t border-gray-700 pt-4 font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStore(null);
                      setSelectedFile(null);
                    }}
                    className="flex-1 rounded-md border border-gray-600 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 transition-all hover:bg-gray-800"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || uploading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand-accent py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : '更新を適用'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
