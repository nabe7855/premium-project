import React, { useState, useMemo, useEffect } from 'react';
import Card from '@/components/admin/ui/Card';
import { GeneratedIntroPage, ContentBlock } from '@/types/dashboard';
import { mockStores, mockCasts } from '@/data/admin-mockData';
import StoreSelector from '@/components/admin/ui/StoreSelector';
import { XMarkIcon, ArrowUpIcon, ArrowDownIcon } from '../admin-assets/Icons';

// Modal for displaying and editing introduction page details
const IntroDetailModal: React.FC<{
  page: GeneratedIntroPage;
  onClose: () => void;
  onSave: (updatedPage: GeneratedIntroPage) => void;
  onDelete: (id: string) => void;
}> = ({ page, onClose, onSave, onDelete }) => {
  const [editablePage, setEditablePage] = useState<GeneratedIntroPage>(page);

  useEffect(() => {
    setEditablePage(page);
  }, [page]);

  const handleBlockChange = (id: string, newContent: string) => {
    setEditablePage(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map(block => block.id === id ? { ...block, content: newContent } : block)
    }));
  };

  const handleAddBlock = (type: 'heading' | 'paragraph' | 'image') => {
    const newBlock: ContentBlock = { id: `block-${Date.now()}`, type, content: type === 'image' ? '' : '新しいブロック' };
    if (type === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newBlock.content = reader.result as string;
            setEditablePage(prev => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock] }));
          };
          reader.readAsDataURL(target.files[0]);
        }
      };
      input.click();
    } else {
      setEditablePage(prev => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock] }));
    }
  };

  const handleRemoveBlock = (id: string) => {
    setEditablePage(prev => ({...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== id)}));
  };
  
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...editablePage.contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setEditablePage(prev => ({ ...prev, contentBlocks: newBlocks }));
  };

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    const commonControls = (
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={() => handleMoveBlock(index, 'up')} disabled={index === 0} className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded disabled:opacity-50"><ArrowUpIcon /></button>
        <button onClick={() => handleMoveBlock(index, 'down')} disabled={index === editablePage.contentBlocks.length - 1} className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded disabled:opacity-50"><ArrowDownIcon /></button>
        <button onClick={() => handleRemoveBlock(block.id)} className="p-1 bg-red-500/50 hover:bg-red-500 rounded"><XMarkIcon /></button>
      </div>
    );
     switch (block.type) {
        case 'title':
            return <div key={block.id} className="relative group"><input type="text" value={block.content} onChange={e => handleBlockChange(block.id, e.target.value)} className="w-full bg-brand-primary text-2xl font-bold p-2 border-l-4 border-brand-accent focus:outline-none focus:bg-brand-secondary"/>{commonControls}</div>;
        case 'heading':
            return <div key={block.id} className="relative group"><input type="text" value={block.content} onChange={e => handleBlockChange(block.id, e.target.value)} className="w-full bg-brand-primary text-xl font-semibold p-2 mt-4 border-l-2 border-brand-accent/70 focus:outline-none focus:bg-brand-secondary"/>{commonControls}</div>;
        case 'paragraph':
            return <div key={block.id} className="relative group"><textarea value={block.content} onChange={e => handleBlockChange(block.id, e.target.value)} className="w-full bg-brand-primary p-2 focus:outline-none focus:bg-brand-secondary min-h-[80px]" rows={3}/>{commonControls}</div>;
        case 'image':
            return <div key={block.id} className="relative group p-2"><img src={block.content} alt="Content" className="rounded-md max-w-full h-auto mx-auto"/>{commonControls}</div>;
        case 'cast':
            const cast = mockCasts.find(c => c.id === block.castId);
            if (!cast) return null;
            return <div key={block.id} className="relative group bg-brand-primary/50 p-4 rounded-lg my-2"><div className="flex items-start gap-4"><img src={cast.photoUrl} alt={cast.name} className="w-16 h-16 rounded-full object-cover"/><div className="flex-1"><h4 className="font-bold text-lg">{cast.name}</h4><textarea value={block.content} onChange={e => handleBlockChange(block.id, e.target.value)} className="w-full bg-brand-primary p-1 mt-1 focus:outline-none focus:bg-brand-secondary min-h-[100px]" rows={4}/></div></div>{commonControls}</div>;
        default: return null;
    }
  };


  const handleSave = () => {
    onSave(editablePage);
    onClose();
  };

  const handleDeleteConfirm = () => {
      if (window.confirm('この紹介ページを本当に削除しますか？')) {
          onDelete(page.id);
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-brand-secondary rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-6 flex-shrink-0 border-b border-gray-700">
             <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-white z-10"><XMarkIcon /></button>
             <h2 className="text-2xl font-bold text-white">紹介ページの編集</h2>
        </div>
        <div className="p-6 overflow-y-auto space-y-2">
            {editablePage.contentBlocks.map((block, index) => renderBlockEditor(block, index))}
            <div className="flex justify-center gap-2 pt-4 border-t border-gray-700/50">
              <button onClick={() => handleAddBlock('heading')} className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2">＋ 見出し</button>
              <button onClick={() => handleAddBlock('paragraph')} className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2">＋ 文章</button>
              <button onClick={() => handleAddBlock('image')} className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2">＋ 画像</button>
            </div>
        </div>
        <div className="p-4 flex-shrink-0 border-t border-gray-700 bg-brand-secondary/80 backdrop-blur-sm">
            <div className="flex justify-between items-center">
                <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white font-semibold text-sm">削除</button>
                <div className="flex space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold text-sm">キャンセル</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-brand-accent hover:bg-blue-500 rounded-md text-white font-semibold text-sm">保存</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

interface IntroListProps {
  introPages: GeneratedIntroPage[];
  setIntroPages: React.Dispatch<React.SetStateAction<GeneratedIntroPage[]>>;
}

export default function IntroList({ introPages, setIntroPages }: IntroListProps) {
  const [selectedStoreId, setSelectedStoreId] = useState('all');
  const [selectedPage, setSelectedPage] = useState<GeneratedIntroPage | null>(null);

  const filteredPages = useMemo(() => {
    const sortedPages = [...introPages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (selectedStoreId === 'all') {
      return sortedPages;
    }
    return sortedPages.filter(page => page.storeId === selectedStoreId);
  }, [introPages, selectedStoreId]);

  const handleDelete = (id: string) => {
    setIntroPages(prev => prev.filter(page => page.id !== id));
  };

  const handleSave = (updatedPage: GeneratedIntroPage) => {
    setIntroPages(prev => prev.map(p => (p.id === updatedPage.id ? updatedPage : p)));
  };

  return (
    <div className="space-y-6">
      <StoreSelector selectedStore={selectedStoreId} onStoreChange={setSelectedStoreId} />
      
      <Card title={`投稿済み紹介ページ (${filteredPages.length}件)`}>
        {filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map(page => {
              const store = mockStores.find(s => s.id === page.storeId);
              const casts = mockCasts.filter(c => page.castIds.includes(c.id));
              const titleBlock = page.contentBlocks.find(b => b.type === 'title');
              const imageBlock = page.contentBlocks.find(b => b.type === 'image');
              
              return (
                <button 
                  key={page.id} 
                  onClick={() => setSelectedPage(page)}
                  className="bg-brand-secondary rounded-xl shadow-lg border border-gray-700/50 flex flex-col text-left hover:border-brand-accent transition-colors duration-200"
                >
                  {imageBlock ? (
                    <img src={imageBlock.content} alt={titleBlock?.content || '紹介ページ'} className="w-full h-32 object-cover rounded-t-xl" />
                  ) : (
                    <div className="w-full h-32 bg-brand-primary rounded-t-xl flex items-center justify-center text-brand-text-secondary">画像なし</div>
                  )}
                  <div className="p-4 flex-grow">
                    <h3 className="text-lg font-bold text-white truncate mb-1">{titleBlock?.content || '無題のページ'}</h3>
                    <p className="text-sm text-brand-text-secondary">{store?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(page.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-4 bg-brand-primary/30 rounded-b-xl border-t border-gray-700/50 flex items-center justify-between">
                    <div className="flex -space-x-3 overflow-hidden">
                      {casts.slice(0, 5).map(cast => (
                        <img key={cast.id} className="inline-block h-9 w-9 rounded-full ring-2 ring-brand-secondary" src={cast.photoUrl} alt={cast.name} title={cast.name} />
                      ))}
                      {casts.length > 5 && (
                          <div className="flex items-center justify-center h-9 w-9 rounded-full ring-2 ring-brand-secondary bg-gray-600 text-xs font-semibold">
                              +{casts.length - 5}
                          </div>
                      )}
                    </div>
                     <span className="text-xs font-semibold bg-brand-accent/20 text-brand-accent px-2 py-1 rounded-full">
                        詳細・編集
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-brand-text-secondary py-16">
            <p>該当する紹介ページはありません。</p>
            {selectedStoreId === 'all' && (
               <p className="text-sm mt-1">「AI新人紹介生成」ページから新しいページを作成・投稿してください。</p>
            )}
          </div>
        )}
      </Card>
      
      {selectedPage && (
        <IntroDetailModal
            page={selectedPage}
            onClose={() => setSelectedPage(null)}
            onSave={handleSave}
            onDelete={handleDelete}
        />
      )}
    </div>
  );
}