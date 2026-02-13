'use client';

import {
  Activity,
  AlertCircle,
  Calendar,
  Clock,
  ExternalLink,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
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
    <div className="space-y-3 duration-500 animate-in fade-in slide-in-from-bottom-2 md:space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group relative overflow-hidden rounded-xl border border-white/5 bg-brand-primary/40 p-3 transition-all hover:border-brand-accent/30 md:p-5"
        >
          <div className="flex gap-3 md:gap-5">
            {/* 画像サムネイル */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/5 md:h-20 md:w-20 md:rounded-xl">
              {post.images?.[0] ? (
                <img src={post.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand-text-secondary">
                  <Activity className="h-5 w-5 opacity-20 md:h-8 md:w-8" />
                </div>
              )}
            </div>

            {/* 記事情報 */}
            <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider md:px-2 md:text-[10px] ${
                      post.target_site === 'kaikan'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    {post.target_site}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider md:px-2 md:text-[10px] ${
                      post.content_type === 'news'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-green-500/10 text-green-400'
                    }`}
                  >
                    {post.content_type === 'news' ? 'NEWS' : 'BLOG'}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[8px] font-bold md:px-2 md:text-[10px] ${
                      post.status === 'approved'
                        ? 'bg-green-500/10 text-green-400'
                        : post.status === 'posted'
                          ? 'bg-brand-accent/10 text-brand-accent'
                          : post.status === 'failed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-white/5 text-brand-text-secondary'
                    }`}
                  >
                    {post.status === 'approved'
                      ? '予約済み'
                      : post.status === 'posted'
                        ? '投稿完了'
                        : post.status === 'failed'
                          ? '失敗'
                          : '下書き'}
                  </span>
                </div>
                <h4 className="truncate text-sm font-bold text-white transition-colors group-hover:text-brand-accent md:text-base">
                  {post.title}
                </h4>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-brand-text-secondary md:text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="font-mono">
                      {post.scheduled_at
                        ? new Date(post.scheduled_at).toLocaleDateString('ja-JP', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '日時未設定'}
                    </span>
                  </div>
                  {post.genre && post.genre !== 'なし' && (
                    <div className="hidden items-center gap-1 sm:flex">
                      <AlertCircle className="h-3 w-3" />
                      <span>{post.genre}</span>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1 md:gap-2">
                  <button
                    onClick={() => onEdit?.(post)}
                    className="rounded-lg p-1.5 text-brand-text-secondary transition-colors hover:bg-white/5 hover:text-white md:p-2"
                    title="プレビュー・編集"
                  >
                    <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                  {type === 'scheduled' && (
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-lg p-1.5 text-red-400/30 transition-colors hover:bg-red-400/10 hover:text-red-400 md:p-2"
                      title="削除"
                    >
                      <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  )}
                  {post.status === 'posted' && (
                    <button className="rounded-lg p-1.5 text-brand-accent/60 transition-colors hover:bg-brand-accent/10 hover:text-brand-accent md:p-2">
                      <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 失敗時のメッセージ */}
          {post.status === 'failed' && (
            <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-red-400/10 bg-red-400/5 p-2 text-[8px] text-red-400 md:text-[10px]">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">
                投稿に失敗しました。認証エラーまたはサイト仕様変更の可能性があります。
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
