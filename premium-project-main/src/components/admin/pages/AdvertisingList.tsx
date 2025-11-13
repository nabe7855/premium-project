import React, { useState, useMemo, useEffect } from 'react';
import Card from '@/components/admin/ui/Card';
import { AdvertisementPost } from '@/types/dashboard';
import { mockStores } from '@/data/admin-mockData';
import StoreSelector from '@/components/admin/ui/StoreSelector';
import { XMarkIcon } from '../admin-assets/Icons';

// Modal for editing advertisement post
const AdPostModal: React.FC<{
  post: AdvertisementPost;
  onClose: () => void;
  onSave: (updatedPost: AdvertisementPost) => void;
  onDelete: (id: string) => void;
}> = ({ post, onClose, onSave, onDelete }) => {
  const [editablePost, setEditablePost] = useState<AdvertisementPost>(post);
  const [postImagePreview, setPostImagePreview] = useState<string | null>(post.imageUrl);

  useEffect(() => {
    setEditablePost(post);
    setPostImagePreview(post.imageUrl);
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPostImagePreview(result);
        setEditablePost(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editablePost);
    onClose();
  };

  const handleDeleteConfirm = () => {
      if (window.confirm('この広告投稿を本当に削除しますか？')) {
          onDelete(post.id);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-secondary rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-white z-10"><XMarkIcon /></button>
          <h2 className="text-xl font-bold text-white mb-6">広告の編集</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-brand-text-secondary mb-2 block">バナー画像</label>
               {postImagePreview && <img src={postImagePreview} alt="Preview" className="mb-2 rounded-md max-h-48 w-auto border border-gray-700"/>}
              <input type="file" accept="image/*" onChange={handleImageChange} className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-blue-600"/>
            </div>
            <div>
              <label className="text-sm text-brand-text-secondary">広告コピー</label>
              <textarea value={editablePost.copyText} onChange={e => setEditablePost({...editablePost, copyText: e.target.value})} className="mt-1 bg-brand-primary border border-gray-700 rounded-md p-2 w-full" rows={8}></textarea>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-semibold text-sm">削除</button>
                <div className="flex space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold text-sm">キャンセル</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-brand-accent hover:bg-blue-500 rounded-md text-white font-semibold text-sm">保存</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


interface AdvertisingListProps {
  advertisementPosts: AdvertisementPost[];
  setAdvertisementPosts: React.Dispatch<React.SetStateAction<AdvertisementPost[]>>;
}

export default function AdvertisingList({ advertisementPosts, setAdvertisementPosts }: AdvertisingListProps) {
  const [selectedStoreId, setSelectedStoreId] = useState('all');
  const [selectedPost, setSelectedPost] = useState<AdvertisementPost | null>(null);

  const filteredPosts = useMemo(() => {
    const sortedPosts = [...advertisementPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (selectedStoreId === 'all') {
      return sortedPosts;
    }
    return sortedPosts.filter(post => post.storeId === selectedStoreId);
  }, [advertisementPosts, selectedStoreId]);

  const handleDelete = (id: string) => {
    setAdvertisementPosts(prev => prev.filter(post => post.id !== id));
  };

  const handleSave = (updatedPost: AdvertisementPost) => {
    setAdvertisementPosts(prev => prev.map(p => (p.id === updatedPost.id ? updatedPost : p)));
  };

  return (
    <div className="space-y-6">
      <StoreSelector selectedStore={selectedStoreId} onStoreChange={setSelectedStoreId} />
      
      <Card title={`投稿済み広告 (${filteredPosts.length}件)`}>
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => {
              const store = post.storeId === 'all' ? { name: '全店舗共通' } : mockStores.find(s => s.id === post.storeId);
              return (
                <button key={post.id} onClick={() => setSelectedPost(post)} className="bg-brand-secondary rounded-xl shadow-lg border border-gray-700/50 flex flex-col text-left hover:border-brand-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent">
                  <img src={post.imageUrl} alt="Ad banner" className="w-full h-40 object-cover rounded-t-xl"/>
                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-sm text-white line-clamp-3 mb-2 flex-grow">{post.copyText}</p>
                    <div className="mt-auto">
                        <p className="text-sm font-semibold text-brand-text-secondary">{store?.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(post.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-brand-text-secondary py-16">
            <p>投稿済みの広告はありません。</p>
            <p className="text-sm mt-1">「AI広告コピー生成」ページから新しい広告を投稿してください。</p>
          </div>
        )}
      </Card>
      
      {selectedPost && (
        <AdPostModal post={selectedPost} onClose={() => setSelectedPost(null)} onSave={handleSave} onDelete={handleDelete} />
      )}
    </div>
  );
}
