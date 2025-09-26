import React, { useState, useMemo } from 'react';
import Card from '@/components/admin/ui/Card';
import { mockStores } from '@/data/admin-mockData';
import { Store, AdvertisementPost } from '@/types/dashboard';
// import { GoogleGenAI } from '@google/genai'; // 👈 後でAI導入する時に戻す

interface AICopywriterProps {
  setAdvertisementPosts: React.Dispatch<React.SetStateAction<AdvertisementPost[]>>;
}

export default function AICopywriter({ setAdvertisementPosts }: AICopywriterProps) {
  const [targetStore, setTargetStore] = useState<Store | 'all'>(mockStores[0]);
  const [adType, setAdType] = useState('social-media');
  const [keywords, setKeywords] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [postCopy, setPostCopy] = useState('');
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);

  // 今は AI を使わないので null 固定
  
  //const ai = null;

  const handleGenerateCopy = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setGeneratedCopy('');

    try {
      // ✅ ダミーデータを返す
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dummyCopies = `
【提案1】
見出し：華やかな夜を、あなたに
本文：特別な時間を彩る新人キャストが登場！今夜はぜひ当店へ。

【提案2】
見出し：非日常の扉を開く瞬間
本文：魅力あふれる新人が加わり、さらに華やかな空間に。贅沢な時間をお楽しみください。

【提案3】
見出し：新人キャスト、続々デビュー！
本文：今だけのフレッシュな魅力を体験できるチャンス。ご予約はお早めに！`;

      setGeneratedCopy(dummyCopies);
    } catch (e) {
      console.error(e);
      setError('広告コピーの生成に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreChange = (storeId: string) => {
    if (storeId === 'all') {
      setTargetStore('all');
    } else {
      const store = mockStores.find((s) => s.id === storeId);
      if (store) setTargetStore(store);
    }
  };

  const handleUseCopy = (copy: string) => {
    const headingMatch = copy.match(/見出し：(.*?)\n/);
    const bodyMatch = copy.match(/本文：([\s\S]*)/);
    const formattedCopy = `${headingMatch ? headingMatch[1].trim() : ''}\n\n${
      bodyMatch ? bodyMatch[1].trim() : ''
    }`;
    setPostCopy(formattedCopy);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!postCopy || !postImagePreview) {
      alert('コピーと画像の両方を設定してください。');
      return;
    }

    const newPost: AdvertisementPost = {
      id: `ad-${Date.now()}`,
      storeId: targetStore === 'all' ? 'all' : targetStore.id,
      copyText: postCopy,
      imageUrl: postImagePreview,
      createdAt: new Date().toISOString(),
    };

    setAdvertisementPosts((prev) => [newPost, ...prev]);

    setPostCopy('');
    setPostImagePreview(null);
    alert('広告を投稿しました！「投稿済み広告」ページで確認できます。');
  };

  const parsedCopies = useMemo(() => {
    if (!generatedCopy) return [];
    return generatedCopy.split('【提案').slice(1).map((s) => `【提案${s.trim()}`);
  }, [generatedCopy]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card title="AI広告コピー生成ツール（ダミー動作中）">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-brand-text-secondary">対象店舗</label>
            <select
              value={targetStore === 'all' ? 'all' : targetStore.id}
              onChange={(e) => handleStoreChange(e.target.value)}
              className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
            >
              <option value="all">全店舗共通</option>
              {mockStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-brand-text-secondary">広告の種類</label>
            <select
              value={adType}
              onChange={(e) => setAdType(e.target.value)}
              className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
            >
              <option value="social-media">SNS投稿</option>
              <option value="website-banner">ウェブサイトバナー</option>
              <option value="flyer">チラシ</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-brand-text-secondary">キーワード（カンマ区切り）</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例: 新人歓迎, イベント, 割引"
              className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
            />
          </div>
          <button
            onClick={handleGenerateCopy}
            disabled={isLoading}
            className="w-full bg-brand-accent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? '生成中...' : '広告コピーを生成'}
          </button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="生成結果">
          {isLoading && (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent"></div>
            </div>
          )}
          {error && (
            <div className="text-red-400 bg-red-500/10 p-4 rounded-md">{error}</div>
          )}
          {parsedCopies.length > 0 && !isLoading && (
            <div className="space-y-4">
              {parsedCopies.map((copy, index) => (
                <div key={index} className="bg-brand-primary p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                    {copy}
                  </pre>
                  <button
                    onClick={() => handleUseCopy(copy)}
                    className="mt-3 w-full text-center bg-brand-accent/80 hover:bg-brand-accent text-white font-bold py-2 px-4 rounded-md text-sm"
                  >
                    このコピーを投稿フォームにセット
                  </button>
                </div>
              ))}
            </div>
          )}
          {!generatedCopy && !isLoading && !error && (
            <div className="text-center text-brand-text-secondary min-h-[300px] flex items-center justify-center">
              <p>左のフォームで条件を指定して広告コピーを生成してください。</p>
            </div>
          )}
        </Card>

        <Card title="広告投稿フォーム">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-brand-text-secondary">広告コピー</label>
              <textarea
                value={postCopy}
                onChange={(e) => setPostCopy(e.target.value)}
                placeholder="ここに広告コピーを入力またはAI生成結果からセットしてください。"
                className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1"
                rows={6}
              />
            </div>
            <div>
              <label className="text-sm text-brand-text-secondary">バナー画像</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-brand-primary border border-gray-700 rounded-md p-2 w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-accent file:text-white hover:file:bg-blue-600"
              />
            </div>
            {postImagePreview && (
              <div>
                <p className="text-sm text-brand-text-secondary mb-2">プレビュー:</p>
                <img
                  src={postImagePreview}
                  alt="Banner preview"
                  className="rounded-md max-h-48 w-auto mx-auto border border-gray-700"
                />
              </div>
            )}
            <button
              onClick={handlePost}
              disabled={!postCopy || !postImagePreview}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              広告を投稿する
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
