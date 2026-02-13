'use client';

import { AlertCircle, Calendar, Clock, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  target_site: 'kaikan' | 'kaikanwork';
  content_type: 'news' | 'blog';
  title: string;
  body: string;
  status: 'draft' | 'approved' | 'posted' | 'failed';
  genre?: string;
  images?: string[];
  scheduled_at: string | null;
  created_at: string;
}

interface PostListProps {
  type: 'scheduled' | 'history';
  onEdit?: (post: Post) => void;
}

export default function PostList({ type, onEdit }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/get-posts?status=${type}`);
      if (!response.ok) throw new Error('取得に失敗しました');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この予約を削除してよろしいですか？')) return;

    try {
      const response = await fetch(`/api/ai/get-posts?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      alert('削除に失敗しました');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [type]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-white/5 bg-white/5" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-brand-text-secondary opacity-50">
        <Calendar className="mb-4 h-12 w-12 stroke-[1]" />
        <p>{type === 'scheduled' ? '予約されている投稿はありません。' : '履歴はありません。'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group relative rounded-xl border border-white/5 bg-brand-primary/40 p-5 transition-all hover:border-brand-accent/30"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    post.target_site === 'kaikan'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {post.target_site}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    post.content_type === 'news'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {post.content_type === 'news' ? 'NEWS' : 'BLOG'}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                    post.status === 'approved'
                      ? 'bg-green-500/20 text-green-400'
                      : post.status === 'posted'
                        ? 'bg-brand-accent/20 text-brand-accent'
                        : post.status === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-white/10 text-brand-text-secondary'
                  }`}
                >
                  {post.status === 'approved'
                    ? '予約済み'
                    : post.status === 'posted'
                      ? '投稿完了'
                      : post.status === 'failed'
                        ? '投稿失敗'
                        : '下書き'}
                </span>
                {post.genre && post.genre !== 'なし' && (
                  <span className="rounded border border-white/10 px-2 py-0.5 text-[10px] text-brand-text-secondary">
                    {post.genre}
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                {post.images && post.images.length > 0 && (
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <h4 className="line-clamp-2 font-medium text-white">{post.title}</h4>
              </div>

              <div className="flex items-center gap-4 text-xs text-brand-text-secondary">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {post.scheduled_at
                    ? new Date(post.scheduled_at).toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '日時未設定'}
                </div>
                <div className="hidden items-center gap-1.5 italic md:flex">
                  作成: {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => onEdit?.(post)}
                className="rounded-lg p-2 text-brand-text-secondary transition-colors hover:bg-white/5 hover:text-white"
                title="プレビュー・編集"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {type === 'scheduled' && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="rounded-lg p-2 text-red-400/50 transition-colors hover:bg-red-400/10 hover:text-red-400"
                  title="削除"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
              {post.status === 'posted' && (
                <button className="rounded-lg p-2 text-brand-accent transition-colors hover:bg-brand-accent/10">
                  <ExternalLink className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* 失敗時のメッセージ */}
          {post.status === 'failed' && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-[10px] text-red-400">
              <AlertCircle className="h-3 w-3" />
              <span>投稿に失敗しました。認証エラーまたはサイトの仕様変更の可能性があります。</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
