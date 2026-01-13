import Card from '@/components/admin/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { Store } from '@/types/dashboard';
import { Edit2, Loader2, Trash2, Upload, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Component for displaying an existing store's card
const StoreCard: React.FC<{
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (id: string) => void;
}> = ({ store, onEdit, onDelete }) => (
  <Card title={store.name}>
    <div className="group relative">
      <img
        src={store.photoUrl || 'https://picsum.photos/400/200'}
        alt={store.name}
        className="mb-4 h-32 w-full rounded-md border border-gray-700 object-cover"
      />
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(store)}
          className="rounded-full bg-blue-600/90 p-1.5 text-white shadow-lg hover:bg-blue-600"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => onDelete(store.id)}
          className="rounded-full bg-red-600/90 p-1.5 text-white shadow-lg hover:bg-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
    <p className="mb-2 line-clamp-1 text-sm font-semibold text-brand-text-secondary">
      {store.catchphrase}
    </p>
    <p className="mb-2 line-clamp-2 h-10 overflow-hidden text-xs text-gray-400">{store.overview}</p>
    <div className="space-y-1">
      <p className="line-clamp-1 text-[10px] text-gray-500">📍 {store.address}</p>
      <p className="text-[10px] text-gray-500">📞 {store.phone}</p>
    </div>
    <button
      onClick={() => onEdit(store)}
      className="mt-4 w-full rounded border border-brand-accent/50 bg-brand-accent/20 px-4 py-2 text-center text-sm font-bold text-brand-accent transition-colors hover:bg-brand-accent/40"
    >
      詳細・編集
    </button>
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

  const [newStore, setNewStore] = useState<Omit<Store, 'id' | 'photoUrl'>>({
    name: '',
    catchphrase: '',
    overview: '',
    address: '',
    phone: '',
  });
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
        catchphrase: s.catch_copy || '',
        overview: s.description || '', // Map description to overview
        address: s.address || '',
        phone: s.phone || '',
        photoUrl: s.image_url || '',
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
            image_url: imageUrl,
          },
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const created = data[0];
        const mapped: Store = {
          id: created.id,
          name: created.name,
          catchphrase: created.catch_copy || '',
          overview: created.description || '',
          address: created.address || '',
          phone: created.phone || '',
          photoUrl: created.image_url || '',
        };
        setStores((prev) => [mapped, ...prev]);
        setNewStore({ name: '', catchphrase: '', overview: '', address: '', phone: '' });
        setSelectedFile(null);
        alert('店舗を作成しました');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      alert('店舗の作成に失敗しました: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('本当に削除しますか？この操作は取り消せません。')) return;

    try {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) throw error;
      setStores((prev) => prev.filter((s) => s.id !== id));
      alert('店舗を削除しました');
    } catch (err) {
      console.error('Delete error:', err);
      alert('店舗の削除に失敗しました');
    }
  };

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    setIsSubmitting(true);
    try {
      let imageUrl = editingStore.photoUrl;
      if (selectedFile) {
        imageUrl = await handleFileUpload(selectedFile);
      }

      const { error } = await supabase
        .from('stores')
        .update({
          name: editingStore.name,
          catch_copy: editingStore.catchphrase,
          description: editingStore.overview,
          address: editingStore.address,
          phone: editingStore.phone,
          image_url: imageUrl,
        })
        .eq('id', editingStore.id);

      if (error) throw error;

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
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                  住所
                </label>
                <input
                  type="text"
                  value={newStore.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  required
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
                  className="mt-1 w-full rounded-md border border-gray-700 bg-brand-primary p-2 text-white outline-none transition-all focus:ring-1 focus:ring-brand-accent"
                />
              </div>
            </div>
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
                onEdit={setEditingStore}
                onDelete={handleDeleteStore}
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

            <form
              onSubmit={handleUpdateStore}
              className="max-h-[80vh] space-y-6 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      店舗名
                    </label>
                    <input
                      type="text"
                      value={editingStore.name}
                      onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                      required
                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      キャッチコピー
                    </label>
                    <input
                      type="text"
                      value={editingStore.catchphrase}
                      onChange={(e) =>
                        setEditingStore({ ...editingStore, catchphrase: e.target.value })
                      }
                      required
                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      住所
                    </label>
                    <input
                      type="text"
                      value={editingStore.address}
                      onChange={(e) =>
                        setEditingStore({ ...editingStore, address: e.target.value })
                      }
                      required
                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      電話番号
                    </label>
                    <input
                      type="tel"
                      value={editingStore.phone}
                      onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                      required
                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      店舗概要
                    </label>
                    <textarea
                      value={editingStore.overview}
                      onChange={(e) =>
                        setEditingStore({ ...editingStore, overview: e.target.value })
                      }
                      required
                      rows={5}
                      className="mt-1 w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white outline-none focus:ring-1 focus:ring-brand-accent"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
                      現在の写真
                    </label>
                    <div className="group relative mt-1">
                      <img
                        src={editingStore.photoUrl || 'https://picsum.photos/400/200'}
                        className="h-32 w-full rounded-lg border border-gray-700 object-cover"
                        alt="Current"
                      />
                      <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Upload className="text-white" />
                        <span className="ml-2 text-xs text-white">変更する</span>
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
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-700 pt-4 font-mono">
                <button
                  type="button"
                  onClick={() => setEditingStore(null)}
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
          </div>
        </div>
      )}
    </div>
  );
}
