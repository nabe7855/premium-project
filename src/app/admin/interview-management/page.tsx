'use client';

import { getAdminInterviewArticles } from '@/lib/actions/interview';
import { deleteMediaArticle } from '@/lib/actions/media';
import { PencilIcon, PlusIcon, TrashIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function InterviewManagementPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<'all' | 'fukuoka' | 'yokohama'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const fetchArticles = async () => {
    setIsLoading(true);
    const result = await getAdminInterviewArticles();
    if (result.success && result.articles) {
      setArticles(result.articles);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`インタビュー記事「${title}」を本当に削除しますか？`)) return;
    const result = await deleteMediaArticle(id);
    if (result.success) {
      alert('削除しました');
      fetchArticles();
    } else {
      alert('削除に失敗しました: ' + result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-brand-text">インタビュー管理</h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value as any)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            <option value="all">すべてのエリア</option>
            <option value="fukuoka">福岡</option>
            <option value="yokohama">横浜</option>
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
            href="/admin/interview-management/new"
            className="ml-2 flex items-center gap-2 rounded-md bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
          >
            <PlusIcon size={16} />
            新規インタビュー
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
                  対象キャスト
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  エリア
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  ステータス
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
                    インタビュー記事がまだありません。右上のボタンから新規作成してください。
                  </td>
                </tr>
              ) : (
                articles
                  .filter((a) => {
                    const meta = a.interview_meta;
                    const areaMatch = filterArea === 'all' || meta?.area === filterArea;
                    const statusMatch = filterStatus === 'all' || a.status === filterStatus;
                    return areaMatch && statusMatch;
                  })
                  .map((article) => {
                    const meta = article.interview_meta;
                    const castLinks = meta?.cast_links || [];
                    return (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{article.title}</div>
                          <div className="text-xs text-gray-500">/{article.slug}</div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <UserIcon size={14} className="text-gray-400" />
                            {castLinks.length > 0 
                              ? castLinks.map((l: any) => l.cast_name).join(', ') 
                              : '未設定'}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-100 px-2 text-xs font-bold leading-5 text-blue-800">
                            {meta?.area === 'fukuoka' ? '福岡' : meta?.area === 'yokohama' ? '横浜' : (meta?.area || '不明')}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              article.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {article.status === 'published' ? '公開中' : '下書き'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/interview-management/${article.id}`}
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
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
