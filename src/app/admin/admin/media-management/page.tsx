'use client';

import { deleteMediaArticle, getMediaArticles } from '@/lib/actions/media';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MediaManagementPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAudience, setFilterAudience] = useState<'all' | 'user' | 'recruit'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const fetchArticles = async () => {
    setIsLoading(true);
    const result = await getMediaArticles();
    if (result.success && result.articles) {
      setArticles(result.articles);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`記事「${title}」を本当に削除しますか？`)) return;
    const result = await deleteMediaArticle(id);
    if (result.success) {
      alert('削除しました');
      fetchArticles(); // 一覧を再取得
    } else {
      alert('削除に失敗しました: ' + result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-brand-text">メディア記事管理</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value as any)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="all">すべての対象</option>
            <option value="user">お客様向け</option>
            <option value="recruit">求職者向け</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="all">すべての状態</option>
            <option value="published">公開中</option>
            <option value="draft">下書き</option>
          </select>
          <Link
            href="/admin/admin/media-management/new"
            className="ml-2 flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
          >
            <PlusIcon size={16} />
            新規執筆
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  公開対象
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  タグ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  作成日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    読み込み中...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    記事がまだありません。右上のボタンから新規作成してください。
                  </td>
                </tr>
              ) : (
                articles
                  .filter((a) => {
                    const audienceMatch =
                      filterAudience === 'all' || a.target_audience === filterAudience;
                    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
                    return audienceMatch && statusMatch;
                  })
                  .map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-bold text-gray-900">{article.title}</div>
                        <div className="text-xs text-gray-500">/{article.slug}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            article.target_audience === 'recruit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {article.target_audience === 'recruit' ? '求職者向け' : 'お客様向け'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            article.status === 'published'
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {article.status === 'published' ? '公開中' : '下書き'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex max-w-[200px] flex-wrap gap-1">
                          {article.tags?.map((t: any) => (
                            <span
                              key={t.tag.id}
                              className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {t.tag.name}
                            </span>
                          ))}
                          {(!article.tags || article.tags.length === 0) && (
                            <span className="text-[10px] text-gray-400">なし</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/admin/media-management/${article.id}`}
                            className="text-brand-accent hover:text-pink-700"
                          >
                            <PencilIcon size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
