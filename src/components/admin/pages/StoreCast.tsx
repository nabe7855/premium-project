import Card from '@/components/admin/ui/Card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { Cast, Store } from '@/types/dashboard';
import { Tag as TagIcon, Trash2, Star, GripVertical, Save, Loader2 } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { PlusIcon } from '../admin-assets/Icons';

interface UnifiedTag {
  id: string;
  name: string;
  type: 'status' | 'feature';
  color?: string;
  textColor?: string;
}

// Component for displaying a single tag
const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#6b7280', // Gray
];

// Component for displaying a single tag
const Tag: React.FC<{ tag: UnifiedTag; onRemove: () => void }> = ({ tag, onRemove }) => (
  <span
    className="mr-2 flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm duration-200 animate-in fade-in zoom-in"
    style={{
      backgroundColor:
        tag.color ||
        (tag.type === 'status' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(107, 114, 128, 0.2)'),
      color: tag.textColor || (tag.type === 'status' ? '#22d3ee' : '#e5e7eb'),
      border: `1px solid ${tag.color || 'transparent'}`,
    }}
  >
    {tag.name}
    <button onClick={onRemove} className="ml-1.5 hover:opacity-70">
      &times;
    </button>
  </span>
);

// Card for managing a cast member within a specific store
const StoreCastCard: React.FC<{
  cast: Cast;
  availableTags: UnifiedTag[];
  currentStoreId: string;
  onAddTag: (castId: string, tag: UnifiedTag) => void;
  onRemoveTag: (castId: string, tag: UnifiedTag) => void;
  onPriorityChange: (cast_id: string, priority: number) => void;
  onIsShopAccountChange: (cast_id: string, isShopAccount: boolean) => void;
  onIchioshiChange: (cast_id: string, value: boolean, point?: string, rank?: number) => void;
  isDragging?: boolean;
  error?: string;
}> = ({
  cast,
  availableTags,
  currentStoreId,
  onAddTag,
  onRemoveTag,
  onPriorityChange,
  onIsShopAccountChange,
  onIchioshiChange,
  isDragging,
  error,
}) => {
  const currentTagNames = [...(cast.tags || []), ...(cast.storeStatuses || [])];

  const statusTags = availableTags.filter((t) => t.type === 'status');
  const featureTags = availableTags.filter((t) => t.type === 'feature');

  const displayTags: UnifiedTag[] = availableTags.filter((t) => currentTagNames.includes(t.name));

  return (
    <Card
      title=""
      className={`relative border bg-brand-secondary/40 transition-all duration-300 ${
        isDragging ? 'border-brand-accent shadow-2xl z-50 ring-2 ring-brand-accent/20' : 'border-gray-800'
      }`}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
        {/* 左側: ドラッグハンドル + 写真 + 基本情報 */}
        <div className="flex items-center gap-4 min-w-[300px]">
          <div className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-brand-accent p-2 transition-colors">
            <GripVertical size={20} />
          </div>
          <img
            src={cast.photoUrl || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'}
            alt={cast.name}
            className="h-16 w-16 rounded-full border-2 border-brand-accent/20 object-cover shadow-lg flex-shrink-0"
          />
          <div className="overflow-hidden">
            <p className="truncate text-lg font-bold text-white">{cast.name}</p>
            <p className="truncate text-[10px] italic text-brand-text-secondary opacity-70">
              {cast.catchphrase}
            </p>
            <div className="mt-1 flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-bold uppercase text-brand-text-secondary">順位:</span>
                <input
                  type="number"
                  min="1"
                  value={cast.storePriorities?.[currentStoreId] || ''}
                  onChange={(e) => onPriorityChange(cast.id, parseInt(e.target.value) || 0)}
                  className="w-12 rounded border border-gray-700 bg-brand-primary p-0.5 text-center text-xs font-bold text-brand-accent"
                />
              </div>
              <div className="flex items-center space-x-1">
                <Checkbox
                  id={`shop-account-${cast.id}`}
                  checked={cast.storeIsShopAccount?.[currentStoreId] || false}
                  onCheckedChange={(checked) => onIsShopAccountChange(cast.id, checked === true)}
                  className="h-3.5 w-3.5"
                />
                <Label htmlFor={`shop-account-${cast.id}`} className="text-[10px] font-bold text-brand-text-secondary cursor-pointer">
                  店舗垢
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* 中央: イチ押し設定 */}
        <div className="flex-1 w-full lg:w-auto">
          <div className={`rounded-lg p-3 border transition-colors ${cast.storeIchioshi?.[currentStoreId] ? 'bg-amber-400/5 border-amber-400/30' : 'bg-black/20 border-white/5'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`ichioshi-${cast.id}`}
                  checked={cast.storeIchioshi?.[currentStoreId] || false}
                  onCheckedChange={(checked) =>
                    onIchioshiChange(cast.id, checked === true, cast.storeIchioshiPoint?.[currentStoreId], cast.storeIchioshiRank?.[currentStoreId])
                  }
                  className="h-4 w-4 border-amber-400 data-[state=checked]:bg-amber-400"
                />
                <Label htmlFor={`ichioshi-${cast.id}`} className="flex items-center gap-1 cursor-pointer text-xs font-black text-amber-400">
                  <Star className="h-3 w-3 fill-current" /> 店長一押し
                </Label>
              </div>

              {cast.storeIchioshi?.[currentStoreId] && (
                <>
                  <select
                    value={cast.storeIchioshiRank?.[currentStoreId] || 1}
                    onChange={(e) => onIchioshiChange(cast.id, true, cast.storeIchioshiPoint?.[currentStoreId], parseInt(e.target.value))}
                    className="bg-brand-primary border border-gray-700 rounded px-2 py-1 text-[10px] text-amber-400 font-bold outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>Rank {r}</option>)}
                  </select>
                  <input
                    type="text"
                    value={cast.storeIchioshiPoint?.[currentStoreId] || ''}
                    onChange={(e) => onIchioshiChange(cast.id, true, e.target.value, cast.storeIchioshiRank?.[currentStoreId])}
                    placeholder="イチ押しコメントを入力..."
                    className="flex-1 min-w-[200px] bg-brand-primary border border-gray-700 rounded px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:border-amber-400/50 outline-none transition-all"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右側: タグ + 編集ボタン */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto min-w-[200px]">
          <div className="flex flex-wrap gap-1 flex-1">
            {displayTags.length > 0 ? (
              displayTags.slice(0, 3).map((tag) => (
                <span key={tag.id} className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ backgroundColor: tag.color + '33', color: tag.color }}>
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] italic text-brand-text-secondary opacity-40">タグ未設定</span>
            )}
            {displayTags.length > 3 && <span className="text-[9px] text-brand-text-secondary">+{displayTags.length - 3}</span>}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border border-gray-700 bg-brand-primary px-4 py-2 text-[10px] font-bold uppercase text-gray-300 hover:bg-gray-700 transition-all">
                <TagIcon size={12} />
                <span>タグ編集</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 border-gray-700 bg-brand-secondary p-0 shadow-2xl" align="end">
              <div className="flex h-[350px] flex-col">
                <div className="border-b border-gray-700 bg-brand-primary/50 p-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">タグ設定</h4>
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-6 p-3">
                    {/* Status Section */}
                    <div>
                      <h5 className="mb-2 text-[9px] font-bold text-brand-accent uppercase">ステータス</h5>
                      <div className="space-y-1">
                        {statusTags.map((tag) => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${cast.id}-${tag.id}`}
                              checked={cast.storeStatuses?.includes(tag.name)}
                              onCheckedChange={(checked) => checked ? onAddTag(cast.id, tag) : onRemoveTag(cast.id, tag)}
                              className="h-3.5 w-3.5"
                            />
                            <Label htmlFor={`${cast.id}-${tag.id}`} className="text-xs text-gray-300 cursor-pointer">{tag.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Feature Section */}
                    <div>
                      <h5 className="mb-2 text-[9px] font-bold text-brand-accent uppercase">一般タグ</h5>
                      <div className="space-y-1">
                        {featureTags.map((tag) => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${cast.id}-${tag.id}`}
                              checked={cast.tags?.includes(tag.name)}
                              onCheckedChange={(checked) => checked ? onAddTag(cast.id, tag) : onRemoveTag(cast.id, tag)}
                              className="h-3.5 w-3.5"
                            />
                            <Label htmlFor={`${cast.id}-${tag.id}`} className="text-xs text-gray-300 cursor-pointer">{tag.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};

// Tag Management UI
const TagManagement: React.FC<{
  tags: UnifiedTag[];
  onAdd: (name: string, type: 'status' | 'feature', color: string) => void;
  onDelete: (id: string, type: 'status' | 'feature') => void;
}> = ({ tags, onAdd, onDelete }) => {
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'status' | 'feature'>('status');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[4]); // Default to Cyan

  return (
    <Card title="タグ・ステータス管理" className="mb-8">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-800 bg-brand-primary/50 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-brand-text-secondary">新規タグ名</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例: 新人, セクシー系"
              className="w-full rounded border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white transition-all focus:ring-2 focus:ring-brand-accent"
            />
          </div>
          <div className="w-full md:w-40">
            <label className="mb-1 block text-xs text-brand-text-secondary">種類</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as 'status' | 'feature')}
              className="w-full rounded border border-gray-700 bg-brand-primary px-3 py-2 text-sm text-white focus:ring-2 focus:ring-brand-accent"
            >
              <option value="status">ステータス (強調)</option>
              <option value="feature">一般タグ</option>
            </select>
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="mb-2 block text-xs text-brand-text-secondary">タグの色を選択</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  selectedColor === color ? 'scale-110 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => {
              if (newName.trim()) {
                onAdd(newName, newType, selectedColor);
                setNewName('');
              }
            }}
            className="flex items-center gap-2 rounded bg-brand-accent px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-500"
          >
            <PlusIcon /> 追加
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="group flex items-center rounded-lg border border-gray-700 bg-brand-secondary px-3 py-1.5 transition-all hover:border-brand-accent/50"
          >
            <span
              className="mr-2 inline-block h-2.5 w-2.5 rounded-full shadow-sm"
              style={{
                backgroundColor: tag.color || (tag.type === 'status' ? '#06b6d4' : '#6b7280'),
              }}
            ></span>
            <span className="mr-3 text-sm font-medium">{tag.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tag.id, tag.type);
              }}
              className="ml-1 rounded p-1 text-gray-500 transition-all hover:bg-gray-800 hover:text-red-400 group-hover:opacity-100"
              aria-label={`Delete ${tag.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Main page for managing cast within a specific store
export default function StoreCast() {
  const [selectedStore, setSelectedStore] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [availableTags, setAvailableTags] = useState<UnifiedTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [priorityErrors, setPriorityErrors] = useState<Record<string, string>>({});

  // 🆕 並び順をDBに一括保存
  const savePriorityOrder = async (currentCasts: Cast[]) => {
    if (!selectedStore || currentCasts.length === 0) return;
    setIsSaving(true);
    console.log('💾 並び順の保存を開始します...', currentCasts.length, '件');
    try {
      // 全キャストに対して新しいインデックスをpriorityとして保存
      // Promise.all で並列実行するが、件数が多い場合は直列またはチャンク分けを検討
      const updates = currentCasts.map((cast, index) => {
        const priority = index + 1;
        return supabase
          .from('cast_store_memberships')
          .update({ priority })
          .eq('cast_id', cast.id)
          .eq('store_id', selectedStore);
      });

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) {
        console.error('❌ 一部の保存に失敗しました:', errors);
      } else {
        console.log('✅ 全ての並び順を保存しました');
      }
    } catch (err) {
      console.error('❌ 保存エラー:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 🆕 ドラッグによる並び替え
  const handleReorder = useCallback((newCasts: Cast[]) => {
    const updatedCasts = newCasts.map((c, index) => ({
      ...c,
      storePriorities: { ...c.storePriorities, [selectedStore]: index + 1 }
    }));
    setCasts(updatedCasts);
    setHasUnsavedChanges(true);
  }, [selectedStore]);

  // 🆕 変更があった場合のみ数秒後に自動保存
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    if (!hasUnsavedChanges || isLoading || casts.length === 0) return;

    const timer = setTimeout(() => {
      savePriorityOrder(casts);
      setHasUnsavedChanges(false);
    }, 1000); // 1秒間操作がなければ保存

    return () => clearTimeout(timer);
  }, [casts, hasUnsavedChanges, isLoading]);

  const handlePriorityChange = async (castId: string, value: number) => {
    // UI-side duplicate check
    const isDuplicate = casts.some(
      (c) => c.id !== castId && c.storePriorities[selectedStore] === value,
    );

    const newErrors = { ...priorityErrors };
    if (isDuplicate && value > 0) {
      newErrors[castId] = '重複する順位です';
    } else {
      delete newErrors[castId];
    }
    setPriorityErrors(newErrors);

    // Update local state and sort
    setCasts((prev) => {
      const updated = prev.map((c) =>
        c.id === castId
          ? { ...c, storePriorities: { ...c.storePriorities, [selectedStore]: value } }
          : c,
      );
      // Sort by the new priority
      return [...updated].sort((a, b) => {
        const pA = a.storePriorities[selectedStore] || 999;
        const pB = b.storePriorities[selectedStore] || 999;
        return pA - pB;
      });
    });

    // Only save to DB if it's not a duplicate (to avoid 409) or if user wants to force it
    // But usually we should try to save if the user really wants to, DB will handle constraint.
    // For now, let's just update DB.
    try {
      const { error } = await supabase
        .from('cast_store_memberships')
        .update({ priority: value })
        .eq('cast_id', castId)
        .eq('store_id', selectedStore);

      if (error) {
        console.error('Update priority error:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIsShopAccountChange = async (castId: string, value: boolean) => {
    // Update local state
    setCasts((prev) =>
      prev.map((c) =>
        c.id === castId
          ? {
              ...c,
              storeIsShopAccount: { ...c.storeIsShopAccount, [selectedStore]: value },
            }
          : c,
      ),
    );

    try {
      const { error } = await supabase
        .from('cast_store_memberships')
        .update({ is_shop_account: value })
        .eq('cast_id', castId)
        .eq('store_id', selectedStore);

      if (error) {
        console.error('Update is_shop_account error:', error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIchioshiChange = async (castId: string, value: boolean, point?: string, rank?: number) => {
    // 1. Update local state
    setCasts((prev) =>
      prev.map((c) =>
        c.id === castId
          ? {
              ...c,
              storeIchioshi: { ...c.storeIchioshi, [selectedStore]: value },
              storeIchioshiPoint: { ...c.storeIchioshiPoint, [selectedStore]: point ?? c.storeIchioshiPoint?.[selectedStore] ?? '' },
              storeIchioshiRank: { ...c.storeIchioshiRank, [selectedStore]: rank ?? c.storeIchioshiRank?.[selectedStore] ?? 1 },
            }
          : c,
      ),
    );

    try {
      // 2. Update DB (Membership table for flag)
      await supabase
        .from('cast_store_memberships')
        .update({ is_ichioshi: value })
        .eq('cast_id', castId)
        .eq('store_id', selectedStore);

      // 3. Update StoreTopConfig (JSON for point/rank details)
      const { data: configData } = await supabase
        .from('store_top_configs')
        .select('config')
        .eq('store_id', selectedStore)
        .single();

      let config = (configData?.config as any) || { cast: { items: [] } };
      if (!config.cast) config.cast = { items: [] };
      if (!config.cast.items) config.cast.items = [];

      const castIdx = config.cast.items.findIndex((item: any) => item.id === castId);
      
      const foundCast = casts.find(c => c.id === castId);
      const newPoint = point ?? foundCast?.storeIchioshiPoint?.[selectedStore] ?? '';
      const newRank = rank ?? foundCast?.storeIchioshiRank?.[selectedStore] ?? 1;

      if (castIdx !== -1) {
        // Update existing entry
        config.cast.items[castIdx].isIchioshi = value;
        config.cast.items[castIdx].ichioshiPoint = newPoint;
        config.cast.items[castIdx].ichioshiRank = newRank;
      } else {
        // Add new entry
        config.cast.items.push({
          id: castId,
          isIchioshi: value,
          ichioshiPoint: newPoint,
          ichioshiRank: newRank
        });
      }
      
      const { error: updateError } = await supabase
        .from('store_top_configs')
        .update({ config })
        .eq('store_id', selectedStore);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Update ichioshi error:', err);
    }
  };

  // Initial Load: Stores and Masters
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load Stores
        const { data: storeData } = await supabase
          .from('stores')
          .select('id, name, slug')
          .order('name');
        if (storeData) {
          const mappedStores: Store[] = storeData.map((s) => ({
            id: s.id,
            name: s.name,
            slug: s.slug || '',
            catchphrase: '',
            overview: '',
            address: '',
            phone: '',
            photoUrl: '',
            isActive: true,
          }));
          setStores(mappedStores);
          if (mappedStores.length > 0) setSelectedStore(mappedStores[0].id);
        }

        // Load Masters (Statuses and Features)
        const [statusRes, featureRes] = await Promise.all([
          supabase.from('status_master').select('id, name, label_color, text_color'),
          supabase.from('feature_master').select('id, name, category'),
        ]);

        const statusTags: UnifiedTag[] = (statusRes.data || []).map((s) => ({
          id: s.id,
          name: s.name,
          type: 'status',
          color: s.label_color,
          textColor: s.text_color,
        }));

        const featureTags: UnifiedTag[] = (featureRes.data || [])
          .filter((f) => ['personality', 'appearance'].includes(f.category))
          .map((f) => ({
            id: f.id,
            name: f.name,
            type: 'feature',
          }));

        setAvailableTags([...statusTags, ...featureTags]);
      } catch (err) {
        console.error('Initial load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Load Casts for selected store
  useEffect(() => {
    if (!selectedStore) return;
    setHasUnsavedChanges(false); // 店舗切り替え時は変更フラグをリセット

    const loadCasts = async () => {
      try {
        // 1. Fetch memberships and cast details
        const { data: memberData, error: memberError } = await supabase
          .from('cast_store_memberships')
          .select(
            `
            priority,
            is_ichioshi,
            is_shop_account,
            cast:casts (
              id, name, main_image_url, catch_copy, is_active
            )
          `,
          )
          .eq('store_id', selectedStore)
          .order('priority', { ascending: true });

        if (memberError) throw memberError;
        if (!memberData || memberData.length === 0) {
          setCasts([]);
          return;
        }

        const castIds = memberData
          .map((m: any) => {
            const cast = Array.isArray(m.cast) ? m.cast[0] : m.cast;
            return cast?.id;
          })
          .filter(Boolean);

        // 2. Fetch all statuses and features for these casts separately to avoid join ambiguity
        const [statusRes, featureRes] = await Promise.all([
          supabase
            .from('cast_statuses')
            .select(
              `
              cast_id,
              status_master (id, name)
            `,
            )
            .in('cast_id', castIds),
          supabase
            .from('cast_features')
            .select(
              `
              cast_id,
              feature_master (id, name, category)
            `,
            )
            .in('cast_id', castIds),
        ]);

        // 3. Fetch StoreTopConfig to get ichioshi point/rank
        const { data: configData } = await supabase
          .from('store_top_configs')
          .select('config')
          .eq('store_id', selectedStore)
          .single();
        
        const topConfig = (configData?.config as any)?.cast?.items || [];

        // 4. Map and Merge
        const mappedCasts: Cast[] = memberData
          .map((item: any) => {
            const cast = Array.isArray(item.cast) ? item.cast[0] : item.cast;
            if (!cast) return null;
            return {
              ...cast,
              priority: item.priority,
              is_ichioshi: item.is_ichioshi,
              is_shop_account: item.is_shop_account,
            };
          })
          .filter((c: any): c is any => c !== null && c.is_active)
          .map((c: any) => {
            // Find statuses for this cast
            const cStatuses = statusRes.data?.filter((s) => s.cast_id === c.id) || [];
            // Find features for this cast
            const cFeatures = featureRes.data?.filter((f) => f.cast_id === c.id) || [];
            // Find config details
            const configItem = topConfig.find((item: any) => item.id === c.id);

            return {
              id: c.id,
              name: c.name,
              storeIds: [selectedStore],
              storePriorities: { [selectedStore]: c.priority || 0 },
              status: '在籍中',
              storeStatuses: cStatuses
                .map((s: any) => (s.status_master as any)?.name)
                .filter(Boolean),
              tags: cFeatures
                .filter((f: any) =>
                  ['personality', 'appearance'].includes(f.feature_master?.category),
                )
                .map((f: any) => (f.feature_master as any)?.name)
                .filter(Boolean),
              photoUrl: c.main_image_url || '',
              managerComment: '',
              catchphrase: c.catch_copy || '',
              storeIchioshi: { [selectedStore]: c.is_ichioshi || false },
              storeIchioshiPoint: { [selectedStore]: configItem?.ichioshiPoint || '' },
              storeIchioshiRank: { [selectedStore]: configItem?.ichioshiRank || 1 },
              storeIsShopAccount: { [selectedStore]: c.is_shop_account || false },
              stats: {
                designations: 0,
                repeatRate: 0,
                breakdown: { new: 0, repeat: 0, free: 0 },
                monthlyPerformance: [],
              },
            };
          });

        setCasts(mappedCasts.sort((a, b) => {
          // 1. 店舗アカウントを一番下に
          if (a.storeIsShopAccount?.[selectedStore] && !b.storeIsShopAccount?.[selectedStore]) return 1;
          if (!a.storeIsShopAccount?.[selectedStore] && b.storeIsShopAccount?.[selectedStore]) return -1;

          // 2. イチ押しを最優先（ランク順：小さい順）
          const isIchioshiA = a.storeIchioshi?.[selectedStore];
          const isIchioshiB = b.storeIchioshi?.[selectedStore];
          if (isIchioshiA && !isIchioshiB) return -1;
          if (!isIchioshiA && isIchioshiB) return 1;
          if (isIchioshiA && isIchioshiB) {
            const rankA = a.storeIchioshiRank?.[selectedStore] ?? 999;
            const rankB = b.storeIchioshiRank?.[selectedStore] ?? 999;
            if (rankA !== rankB) return rankA - rankB;
          }

          // 3. それ以外は優先度（昇順：小さい順）
          const pA = a.storePriorities?.[selectedStore] ?? 999;
          const pB = b.storePriorities?.[selectedStore] ?? 999;
          return pA - pB;
        }));
      } catch (err) {
        console.error('Load casts error:', err);
      }
    };
    loadCasts();
  }, [selectedStore]);

  // Master Management Actions
  const handleAddMasterTag = async (name: string, type: 'status' | 'feature', color: string) => {
    console.log('Adding tag:', { name, type, color });
    try {
      if (type === 'status') {
        const { data, error } = await supabase
          .from('status_master')
          .insert([{ name, label_color: color, text_color: '#ffffff' }])
          .select()
          .single();
        if (error) {
          console.error('Status insert error:', error);
          throw error;
        }
        setAvailableTags((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            type: 'status',
            color: data.label_color,
            textColor: data.text_color,
          },
        ]);
        alert('ステータスを追加しました');
      } else {
        const { data, error } = await supabase
          .from('feature_master')
          .insert([{ name, category: 'personality' }])
          .select()
          .single();
        if (error) {
          console.error('Feature insert error:', error);
          throw error;
        }
        // Local update with selected color (persistence depends on feature_master capabilities, usually features don't store color in older schema)
        // If we want features to have colors, we'd need to migrate DB. For now, we update local state so it appears colored in this session.
        setAvailableTags((prev) => [
          ...prev,
          { id: data.id, name: data.name, type: 'feature', color: color },
        ]);
        alert('タグを追加しました');
      }
    } catch (err: any) {
      console.error('Add tag error details:', err);
      alert(`タグの追加に失敗しました: ${err.message || '不明なエラー'}`);
    }
  };

  const handleDeleteMasterTag = async (id: string, type: 'status' | 'feature') => {
    if (!confirm('本当にこのタグを削除しますか？')) return;
    try {
      const table = type === 'status' ? 'status_master' : 'feature_master';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setAvailableTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Delete tag error:', err);
      alert('タグの削除に失敗しました。');
    }
  };

  // Cast-specific Tag Actions
  const handleAddTagToCast = async (castId: string, tag: UnifiedTag) => {
    try {
      if (tag.type === 'status') {
        await supabase.from('cast_statuses').insert([{ cast_id: castId, status_id: tag.id }]);
      } else {
        await supabase.from('cast_features').insert([{ cast_id: castId, feature_id: tag.id }]);
      }

      // Local update
      setCasts((prev) =>
        prev.map((c) => {
          if (c.id === castId) {
            if (tag.type === 'status')
              return { ...c, storeStatuses: [...(c.storeStatuses || []), tag.name] };
            return { ...c, tags: [...c.tags, tag.name] };
          }
          return c;
        }),
      );
    } catch (err) {
      console.error('Assign tag error:', err);
    }
  };

  const handleRemoveTagFromCast = async (castId: string, tag: UnifiedTag) => {
    try {
      if (tag.type === 'status') {
        await supabase.from('cast_statuses').delete().eq('cast_id', castId).eq('status_id', tag.id);
      } else {
        await supabase
          .from('cast_features')
          .delete()
          .eq('cast_id', castId)
          .eq('feature_id', tag.id);
      }

      // Local update
      setCasts((prev) =>
        prev.map((c) => {
          if (c.id === castId) {
            if (tag.type === 'status')
              return { ...c, storeStatuses: (c.storeStatuses || []).filter((s) => s !== tag.name) };
            return { ...c, tags: c.tags.filter((t) => t !== tag.name) };
          }
          return c;
        }),
      );
    } catch (err) {
      console.error('Unassign tag error:', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <TagManagement
        tags={availableTags}
        onAdd={handleAddMasterTag}
        onDelete={handleDeleteMasterTag}
      />

      <Card title="店舗を選択 & 操作" className="bg-brand-secondary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="w-full appearance-none rounded-md border border-gray-700 bg-brand-primary bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22%23A0AEC0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[position:right_12px_center] bg-no-repeat p-3 text-white focus:ring-2 focus:ring-brand-accent md:w-1/3"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                savePriorityOrder(casts);
                setHasUnsavedChanges(false);
              }}
              disabled={isSaving || casts.length === 0}
              className="flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-500 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>現在の順序を保存</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="w-full">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
            <p className="font-medium text-brand-text-secondary">データを読み込み中...</p>
          </div>
        ) : casts.length > 0 ? (
          <Reorder.Group
            values={casts}
            onReorder={handleReorder}
            className="flex flex-col gap-3 col-span-full"
            axis="y"
          >
            {casts.map((cast) => (
              <Reorder.Item
                key={cast.id}
                value={cast}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                <StoreCastCard
                  cast={cast}
                  availableTags={availableTags}
                  currentStoreId={selectedStore}
                  onAddTag={handleAddTagToCast}
                  onRemoveTag={handleRemoveTagFromCast}
                  onPriorityChange={handlePriorityChange}
                  onIsShopAccountChange={handleIsShopAccountChange}
                  onIchioshiChange={handleIchioshiChange}
                  error={priorityErrors[cast.id]}
                />
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-gray-700 bg-brand-secondary/30 py-16 text-center">
            <p className="text-brand-text-secondary">この店舗に在籍中のキャストはいません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
