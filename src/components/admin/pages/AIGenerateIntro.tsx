import React, { useState, useMemo, useEffect } from 'react';
import Card from '@/components/admin/ui/Card';
import { mockStores, mockCasts } from '@/data/admin-mockData';
import {

  GeneratedIntroContent,
  GeneratedIntroPage,
  ContentBlock,
} from '@/types/dashboard';
// import { GoogleGenAI, Type } from '@google/genai'; // 👈 後でAI導入する時に戻す
import { ArrowUpIcon, ArrowDownIcon, XMarkIcon } from '../admin-assets/Icons';

interface AIGenerateIntroProps {
  setIntroPages: React.Dispatch<React.SetStateAction<GeneratedIntroPage[]>>;
}

export default function AIGenerateIntro({ setIntroPages }: AIGenerateIntroProps) {
  const [selectedStoreId, setSelectedStoreId] = useState(mockStores[0].id);
  const [selectedCastIds, setSelectedCastIds] = useState<string[]>([]);
  const [keywords, setKeywords] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedIntroContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投稿フォーム用のブロック
  const [postContentBlocks, setPostContentBlocks] = useState<ContentBlock[]>([]);

  // 今はAIは使わないので null 固定
  //const ai = null;

  const availableCasts = useMemo(() => {
    return mockCasts.filter(
      (cast) =>
        cast.storeIds.includes(selectedStoreId) &&
        cast.storeStatus === '新人' &&
        cast.status === '在籍中'
    );
  }, [selectedStoreId]);

  useEffect(() => {
    setSelectedCastIds([]);
    setGeneratedContent(null);
  }, [selectedStoreId]);

  const handleCastSelection = (castId: string) => {
    setSelectedCastIds((prev) =>
      prev.includes(castId) ? prev.filter((id) => id !== castId) : [...prev, castId]
    );
  };

  const handleGenerate = async () => {
    if (isLoading || selectedCastIds.length === 0) return;
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // ✅ ダミーデータを返す
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dummyResponse: GeneratedIntroContent = {
        contentBlocks: [
          {
            id: `block-${Date.now()}`,
            type: 'title',
            content: '新人紹介ページへようこそ！',
          },
          {
            id: `block-${Date.now() + 1}`,
            type: 'paragraph',
            content: '今月も期待の新人キャストをご紹介します。華やかな雰囲気と共にお楽しみください。',
          },
          ...selectedCastIds.map((castId, i) => ({
            id: `block-${Date.now() + i + 2}`,
            type: 'cast' as const,
            castId,
            content: `新人キャスト ${castId} の紹介文がここに入ります。`,
          })),
        ],
      };

      setGeneratedContent(dummyResponse);
    } catch (e) {
      console.error(e);
      setError('コンテンツの生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContent = () => {
    if (!generatedContent) return;
    const filteredBlocks = generatedContent.contentBlocks.filter(
      (block) => block.type !== 'cast' || selectedCastIds.includes(block.castId || '')
    );
    setPostContentBlocks(filteredBlocks);
  };

  const handlePost = () => {
    if (
      postContentBlocks.length === 0 ||
      postContentBlocks.some((b) => b.type !== 'image' && !b.content.trim())
    ) {
      alert('すべてのテキストフィールドを入力してください。');
      return;
    }

    const newPost: GeneratedIntroPage = {
      id: `intro-${Date.now()}`,
      storeId: selectedStoreId,
      castIds: selectedCastIds,
      createdAt: new Date().toISOString(),
      contentBlocks: postContentBlocks,
    };

    setIntroPages((prev) => [newPost, ...prev]);

    setSelectedCastIds([]);
    setKeywords('');
    setGeneratedContent(null);
    setPostContentBlocks([]);
    alert('紹介ページを投稿しました！「投稿済み紹介」ページで確認できます。');
  };

  // --- Block Editor ---
  const addBlock = (type: 'heading' | 'paragraph' | 'image') => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'image' ? '' : '新しいブロック',
    };
    if (type === 'image') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            newBlock.content = reader.result as string;
            setPostContentBlocks((prev) => [...prev, newBlock]);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      setPostContentBlocks((prev) => [...prev, newBlock]);
    }
  };

  const updateBlock = (id: string, newContent: string) => {
    setPostContentBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content: newContent } : block))
    );
  };

  const removeBlock = (id: string) => {
    setPostContentBlocks((prev) => prev.filter((block) => block.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...postContentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setPostContentBlocks(newBlocks);
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    const commonControls = (
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => moveBlock(index, 'up')}
          disabled={index === 0}
          className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          <ArrowUpIcon />
        </button>
        <button
          onClick={() => moveBlock(index, 'down')}
          disabled={index === postContentBlocks.length - 1}
          className="p-1 bg-gray-700/50 hover:bg-gray-600 rounded disabled:opacity-50"
        >
          <ArrowDownIcon />
        </button>
        <button
          onClick={() => removeBlock(block.id)}
          className="p-1 bg-red-500/50 hover:bg-red-500 rounded"
        >
          <XMarkIcon />
        </button>
      </div>
    );

    switch (block.type) {
      case 'title':
        return (
          <div key={block.id} className="relative group">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="w-full bg-transparent text-2xl font-bold p-2 border-l-4 border-brand-accent focus:outline-none focus:bg-brand-primary"
            />
            {commonControls}
          </div>
        );
      case 'heading':
        return (
          <div key={block.id} className="relative group">
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="w-full bg-transparent text-xl font-semibold p-2 mt-4 border-l-2 border-brand-accent/70 focus:outline-none focus:bg-brand-primary"
            />
            {commonControls}
          </div>
        );
      case 'paragraph':
        return (
          <div key={block.id} className="relative group">
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
              className="w-full bg-transparent p-2 focus:outline-none focus:bg-brand-primary min-h-[80px]"
              rows={3}
            />
            {commonControls}
          </div>
        );
      case 'image':
        return (
          <div key={block.id} className="relative group p-2">
            <img
              src={block.content}
              alt="Content"
              className="rounded-md max-w-full h-auto mx-auto"
            />
            {commonControls}
          </div>
        );
      case 'cast':
        const cast = mockCasts.find((c) => c.id === block.castId);
        if (!cast) return null;
        return (
          <div key={block.id} className="relative group bg-brand-primary/50 p-4 rounded-lg my-2">
            <div className="flex items-start gap-4">
              <img
                src={cast.photoUrl}
                alt={cast.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{cast.name}</h4>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  className="w-full bg-transparent p-1 mt-1 focus:outline-none focus:bg-brand-secondary min-h-[100px]"
                  rows={4}
                />
              </div>
            </div>
            {commonControls}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <div className="space-y-6">
        <Card title="AI新人紹介ページ生成（ダミー動作中）">
          <div className="space-y-6">
            <div>
              <label className="text-sm text-brand-text-secondary">対象店舗</label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
              >
                {mockStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-brand-text-secondary">紹介する新人キャストを選択</label>
              <div className="mt-2 p-3 bg-brand-primary rounded-md border border-gray-700 max-h-48 overflow-y-auto">
                {availableCasts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableCasts.map((cast) => (
                      <label
                        key={cast.id}
                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-brand-secondary cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCastIds.includes(cast.id)}
                          onChange={() => handleCastSelection(cast.id)}
                          className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-accent focus:ring-brand-accent focus:ring-2"
                        />
                        <img
                          src={cast.photoUrl}
                          alt={cast.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm">{cast.name}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-brand-text-secondary text-center py-4">
                    この店舗に紹介可能な新人キャストがいません。
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-brand-text-secondary">キーワード・参考テキスト</label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="キャストの個性やイベント情報などを入力..."
                className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
                rows={3}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || selectedCastIds.length === 0}
              className="w-full bg-brand-accent hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '生成中...' : '紹介コンテンツを生成'}
            </button>
          </div>
        </Card>

        <Card title="生成結果">
          <div className="min-h-[200px] flex flex-col">
            {isLoading && (
              <div className="flex items-center justify-center flex-grow">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
              </div>
            )}
            {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-md">{error}</div>}
            {generatedContent && !isLoading && (
              <div className="space-y-4">
                <div className="p-3 bg-brand-primary rounded-md max-h-60 overflow-y-auto">
                  {generatedContent.contentBlocks.map((block) => {
                    if (block.type === 'title')
                      return (
                        <h4 key={block.id} className="font-bold text-lg mb-2">
                          {block.content}
                        </h4>
                      );
                    if (block.type === 'paragraph')
                      return (
                        <p key={block.id} className="text-sm text-brand-text-secondary mb-2">
                          {block.content}
                        </p>
                      );
                    if (block.type === 'cast') {
                      const cast = mockCasts.find((c) => c.id === block.castId);
                      return (
                        <p key={block.id} className="text-sm border-t border-gray-700 pt-2 mt-2">
                          <b>{cast?.name || 'キャスト'}:</b> {block.content.substring(0, 50)}...
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={handleUseContent}
                  className="w-full bg-brand-accent/80 hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-md"
                >
                  この内容を投稿フォームにセット
                </button>
              </div>
            )}
            {!generatedContent && !isLoading && !error && (
              <div className="text-center text-brand-text-secondary flex-grow flex items-center justify-center">
                <p>条件を指定して生成を開始してください。</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="投稿フォーム（ブロックエディタ）">
        <div className="space-y-2 bg-brand-primary p-4 rounded-md border border-gray-700 min-h-[400px]">
          {postContentBlocks.length > 0 ? (
            postContentBlocks.map((block, index) => renderBlock(block, index))
          ) : (
            <div className="text-center text-brand-text-secondary py-16">
              <p>下のボタンからコンテンツを追加するか、AIで生成した内容をセットしてください。</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => addBlock('heading')}
            className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2"
          >
            ＋ 見出しを追加
          </button>
          <button
            onClick={() => addBlock('paragraph')}
            className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2"
          >
            ＋ 文章を追加
          </button>
          <button
            onClick={() => addBlock('image')}
            className="text-sm bg-gray-600 hover:bg-gray-500 rounded-md px-3 py-2"
          >
            ＋ 画像を追加
          </button>
        </div>
        <button
          onClick={handlePost}
          disabled={postContentBlocks.length === 0}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-md mt-6 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          投稿する
        </button>
      </Card>
    </div>
  );
}
