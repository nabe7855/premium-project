import React, { useState, useMemo } from 'react';
import { mockCasts, mockStores } from '@/data/admin-mockData';
import { Cast } from '@/types/dashboard';
import Card from '@/components/admin/ui/Card';
import { XMarkIcon } from '../admin-assets/Icons';
// FIX: Added CartesianGrid to the import from recharts to resolve the "Cannot find name 'CartesianGrid'" error.
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';


// Component to render a single cast member's card
const CastCard: React.FC<{ cast: Cast; onSelect: (cast: Cast) => void }> = ({ cast, onSelect }) => {
    const stores = mockStores.filter(s => cast.storeIds.includes(s.id));
    return (
        <button 
            onClick={() => onSelect(cast)} 
            className="bg-brand-secondary p-4 rounded-lg flex items-center space-x-4 w-full text-left hover:bg-gray-700/50 transition-colors duration-200"
        >
            <img src={cast.photoUrl} alt={cast.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-white truncate">{cast.name}</p>
                <p className="text-sm text-brand-text-secondary truncate">{stores.map(s => s.name).join(', ')}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${cast.status === '在籍中' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {cast.status}
                </span>
            </div>
        </button>
    );
};

// Modal for displaying and editing cast details
const CastDetailModal: React.FC<{ cast: Cast; onClose: () => void; onSave: (cast: Cast) => void; }> = ({ cast: initialCast, onClose, onSave }) => {
    const [cast, setCast] = useState<Cast>(initialCast);

    const handleStoreChange = (storeId: string, checked: boolean) => {
        const currentStoreIds = cast.storeIds;
        let newStoreIds: string[];
        if (checked) {
            newStoreIds = [...currentStoreIds, storeId];
        } else {
            // Keep at least one store selected
            if (currentStoreIds.length > 1) {
              newStoreIds = currentStoreIds.filter(id => id !== storeId);
            } else {
              // Prevent unchecking the last store
              return;
            }
        }
        setCast({ ...cast, storeIds: newStoreIds });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(cast);
    };

    const breakdownData = [
        { name: '新規', value: cast.stats.breakdown.new },
        { name: 'リピート', value: cast.stats.breakdown.repeat },
        { name: 'フリー', value: cast.stats.breakdown.free },
    ];
    const COLORS = ['#3E7BFA', '#10B981', '#F59E0B'];
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-brand-secondary rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-white">
                        <XMarkIcon />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-6">{cast.name} の詳細</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {/* Left Column: Photo & Stats */}
                        <div className="md:col-span-2 space-y-4">
                            <img src={cast.photoUrl} alt={cast.name} className="w-full aspect-square rounded-lg object-cover" />
                             <Card title="統計情報">
                                <div className="space-y-4">
                                    {/* Donut Chart for Breakdown */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-brand-text-secondary mb-2">指名内訳</h4>
                                        <div className="relative w-full h-48">
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8" paddingAngle={5}>
                                                        {breakdownData.map((_entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ backgroundColor: '#1E1E3F', borderColor: '#374151' }} itemStyle={{color: '#fff'}}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-3xl font-bold text-white">{cast.stats.designations}</span>
                                                <span className="text-sm text-brand-text-secondary">総指名</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center space-x-4 mt-2 text-xs">
                                            {breakdownData.map((item, index) => (
                                                <div key={item.name} className="flex items-center">
                                                    <span className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index] }}></span>
                                                    <span>{item.name}: {item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Bar Chart for Monthly Performance */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-brand-text-secondary mb-2">月次指名本数</h4>
                                        <div className="w-full h-40">
                                            <ResponsiveContainer>
                                                <BarChart data={cast.stats.monthlyPerformance} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} fontSize={12} />
                                                    <YAxis tick={{ fill: '#A0AEC0' }} fontSize={12} />
                                                    <Tooltip cursor={{fill: 'rgba(62, 123, 250, 0.1)'}} contentStyle={{ backgroundColor: '#1E1E3F', borderColor: '#374151' }} />
                                                    <Bar dataKey="value" name="指名本数" fill="#3E7BFA" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Details & Form */}
                        <div className="md:col-span-3 space-y-4">
                            <div>
                                <label className="text-sm text-brand-text-secondary">名前</label>
                                <input type="text" value={cast.name} onChange={(e) => setCast({...cast, name: e.target.value})} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-brand-text-secondary">キャッチコピー</label>
                                <input type="text" value={cast.catchphrase} onChange={(e) => setCast({...cast, catchphrase: e.target.value})} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" />
                            </div>
                            <div>
                                <label className="text-sm text-brand-text-secondary">ステータス</label>
                                <select value={cast.status} onChange={(e) => setCast({...cast, status: e.target.value as Cast['status']})} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1">
                                    <option>在籍中</option>
                                    <option>離籍</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-brand-text-secondary">所属店舗（複数選択可）</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 p-2 bg-brand-primary rounded-md border border-gray-700">
                                    {mockStores.map(store => (
                                        <label key={store.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={cast.storeIds.includes(store.id)}
                                                onChange={(e) => handleStoreChange(store.id, e.target.checked)}
                                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-accent focus:ring-brand-accent focus:ring-2"
                                            />
                                            <span>{store.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-sm text-brand-text-secondary">マネージャーコメント</label>
                                <textarea value={cast.managerComment} onChange={(e) => setCast({...cast, managerComment: e.target.value})} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1" rows={4}></textarea>
                            </div>
                            <div className="flex justify-end space-x-2 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold">キャンセル</button>
                                <button type="submit" className="px-4 py-2 bg-brand-accent hover:bg-blue-500 rounded-md text-white font-semibold">保存</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Main page for managing all cast members
export default function AllCast() {
  const [casts, setCasts] = useState<Cast[]>(mockCasts);
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('all');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');

  const handleSave = (updatedCast: Cast) => {
    setCasts(casts.map(c => c.id === updatedCast.id ? updatedCast : c));
    setSelectedCast(null);
  }

  const filteredCasts = useMemo(() => {
    const baseFiltered = casts.filter(cast => {
      const nameMatch = cast.name.toLowerCase().includes(searchTerm.toLowerCase());
      const storeMatch = selectedStore === 'all' || cast.storeIds.includes(selectedStore);
      const statusMatch = activeTab === 'active' ? cast.status === '在籍中' : cast.status === '離籍';
      return nameMatch && storeMatch && statusMatch;
    });

    return baseFiltered.sort((a, b) => a.name.localeCompare(b.name));
  }, [casts, searchTerm, selectedStore, activeTab]);

  return (
    <div className="space-y-6">
        <Card title="キャスト検索">
            <div className="border-b border-gray-700 mb-4">
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'active' 
                            ? 'border-b-2 border-brand-accent text-white' 
                            : 'text-brand-text-secondary hover:text-white'
                        }`}
                    >
                        在籍中
                    </button>
                    <button 
                        onClick={() => setActiveTab('inactive')}
                        className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                            activeTab === 'inactive' 
                            ? 'border-b-2 border-brand-accent text-white' 
                            : 'text-brand-text-secondary hover:text-white'
                        }`}
                    >
                        離籍
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input 
                    type="text" 
                    placeholder="名前で検索..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full" 
                 />
                 <select 
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full"
                 >
                    <option value="all">すべての店舗</option>
                    {mockStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                 </select>
            </div>
        </Card>
        
        <Card title={`${activeTab === 'active' ? '在籍中' : '離籍'}キャスト (${filteredCasts.length}名)`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCasts.length > 0 ? (
                    filteredCasts.map(cast => <CastCard key={cast.id} cast={cast} onSelect={setSelectedCast} />)
                ) : (
                    <p className="text-brand-text-secondary col-span-full text-center py-8">該当するキャストがいません。</p>
                )}
            </div>
        </Card>

        {selectedCast && (
            <CastDetailModal 
                cast={selectedCast}
                onClose={() => setSelectedCast(null)}
                onSave={handleSave}
            />
        )}
    </div>
  );
}