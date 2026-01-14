import Card from '@/components/admin/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { Cast, Store } from '@/types/dashboard';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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
    className="mr-2 flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm"
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
// Card for managing a cast member within a specific store
const StoreCastCard: React.FC<{
  cast: Cast;
  availableTags: UnifiedTag[];
  currentStoreId: string;
  onAddTag: (castId: string, tag: UnifiedTag) => void;
  onRemoveTag: (castId: string, tag: UnifiedTag) => void;
  onPriorityChange: (castId: string, priority: number) => void;
  error?: string;
}> = ({ cast, availableTags, currentStoreId, onAddTag, onRemoveTag, onPriorityChange, error }) => {
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);

  // Filter available tags to only show ones the cast doesn't have
  const currentTagNames = [...(cast.tags || []), ...(cast.storeStatus ? [cast.storeStatus] : [])];

  const unpickedTags = (availableTags || []).filter((t) => !currentTagNames.includes(t.name));

  // Combine current tags for display
  const displayTags: UnifiedTag[] = (availableTags || []).filter((t) =>
    currentTagNames.includes(t.name),
  );

  return (
    <Card
      title={cast.name}
      className="flex h-full flex-col border border-gray-800 transition-all duration-300 hover:border-gray-700"
    >
      <div className="mb-4 flex items-center space-x-4">
        <img
          src={
            cast.photoUrl ||
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80'
          }
          alt={cast.name}
          className="h-16 w-16 rounded-full border-2 border-brand-accent/20 object-cover"
        />
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-lg font-bold text-white">{cast.name}</p>
          <p className="truncate text-sm text-brand-text-secondary">{cast.catchphrase}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-brand-text-secondary">表示順:</span>
            <input
              type="number"
              min="1"
              value={cast.storePriorities?.[currentStoreId] || ''}
              onChange={(e) => onPriorityChange(cast.id, parseInt(e.target.value) || 0)}
              className={`w-16 rounded border ${
                error ? 'border-red-500' : 'border-gray-700'
              } bg-brand-primary p-1 text-center text-sm text-white focus:ring-1 focus:ring-brand-accent`}
            />
          </div>
          {error && <p className="mt-1 text-[10px] text-red-500">{error}</p>}
        </div>
      </div>

      <div className="mb-4 flex min-h-[32px] flex-wrap items-center gap-2">
        {displayTags.map((tag) => (
          <Tag key={tag.id} tag={tag} onRemove={() => onRemoveTag(cast.id, tag)} />
        ))}
      </div>

      <div className="relative mt-auto">
        <button
          onClick={() => setIsTagSelectorOpen(!isTagSelectorOpen)}
          className="flex w-full items-center justify-center rounded-md border border-gray-700 bg-brand-primary p-2.5 text-sm transition-all duration-200 hover:bg-gray-700"
        >
          <PlusIcon />
          <span className="ml-2 font-medium">タグを追加</span>
        </button>

        {isTagSelectorOpen && (
          <div className="scrollbar-thin scrollbar-thumb-gray-600 absolute bottom-full left-0 z-20 mb-2 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-700 bg-brand-secondary shadow-2xl">
            {unpickedTags.length > 0 ? (
              unpickedTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => {
                    onAddTag(cast.id, tag);
                    setIsTagSelectorOpen(false);
                  }}
                  className="block w-full border-b border-gray-800 px-4 py-3 text-left text-sm text-brand-text-secondary last:border-0 hover:bg-brand-primary hover:text-white"
                >
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: tag.type === 'status' ? tag.color || '#06b6d4' : '#6b7280',
                    }}
                  ></span>
                  {tag.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm italic text-brand-text-secondary">
                追加できるタグがありません。
              </p>
            )}
          </div>
        )}
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
  const [priorityErrors, setPriorityErrors] = useState<Record<string, string>>({});

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

    // Update local state
    setCasts((prev) =>
      prev.map((c) =>
        c.id === castId
          ? { ...c, storePriorities: { ...c.storePriorities, [selectedStore]: value } }
          : c,
      ),
    );

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

  // Initial Load: Stores and Masters
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load Stores
        const { data: storeData } = await supabase.from('stores').select('id, name').order('name');
        if (storeData) {
          const mappedStores: Store[] = storeData.map((s) => ({
            id: s.id,
            name: s.name,
            catchphrase: '',
            overview: '',
            address: '',
            phone: '',
            photoUrl: '',
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

    const loadCasts = async () => {
      try {
        // 1. Fetch memberships and cast details
        const { data: memberData, error: memberError } = await supabase
          .from('cast_store_memberships')
          .select(
            `
            priority,
            cast:casts (
              id, name, main_image_url, catch_copy, is_active
            )
          `,
          )
          .eq('store_id', selectedStore);

        if (memberError) throw memberError;
        if (!memberData || memberData.length === 0) {
          setCasts([]);
          return;
        }

        const castIds = memberData.map((m: any) => m.cast?.id).filter(Boolean);

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

        // 3. Map and Merge
        const mappedCasts: Cast[] = memberData
          .map((item: any) => ({
            ...item.cast,
            priority: item.priority,
          }))
          .filter((c: any) => c && c.is_active)
          .map((c: any) => {
            // Find statuses for this cast
            const cStatuses = statusRes.data?.filter((s) => s.cast_id === c.id) || [];
            // Find features for this cast
            const cFeatures = featureRes.data?.filter((f) => f.cast_id === c.id) || [];

            return {
              id: c.id,
              name: c.name,
              storeIds: [selectedStore],
              storePriorities: { [selectedStore]: c.priority || 0 },
              status: '在籍中',
              storeStatus: (cStatuses[0]?.status_master as any)?.name || 'レギュラー',
              tags: cFeatures
                .filter((f: any) =>
                  ['personality', 'appearance'].includes(f.feature_master?.category),
                )
                .map((f: any) => (f.feature_master as any)?.name)
                .filter(Boolean),
              photoUrl: c.main_image_url || '',
              managerComment: '',
              catchphrase: c.catch_copy || '',
              stats: {
                designations: 0,
                repeatRate: 0,
                breakdown: { new: 0, repeat: 0, free: 0 },
                monthlyPerformance: [],
              },
            };
          });

        setCasts(mappedCasts);
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
            if (tag.type === 'status') return { ...c, storeStatus: tag.name as any };
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
            if (tag.type === 'status') return { ...c, storeStatus: 'レギュラー' };
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

      <Card title="店舗を選択" className="bg-brand-secondary">
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
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
            <p className="font-medium text-brand-text-secondary">データを読み込み中...</p>
          </div>
        ) : casts.length > 0 ? (
          casts.map((cast) => (
            <StoreCastCard
              key={cast.id}
              cast={cast}
              availableTags={availableTags}
              currentStoreId={selectedStore}
              onAddTag={handleAddTagToCast}
              onRemoveTag={handleRemoveTagFromCast}
              onPriorityChange={handlePriorityChange}
              error={priorityErrors[cast.id]}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-gray-700 bg-brand-secondary/30 py-16 text-center">
            <p className="text-brand-text-secondary">この店舗に在籍中のキャストはいません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
