'use client';

import NewsDashboard from '@/components/admin/news/NewsDashboard';
import NewsEditor from '@/components/admin/news/NewsEditor';
import { PageData } from '@/components/admin/news/types';
import { createPage, deletePage, getAllPages, updatePage } from '@/lib/actions/news-pages';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NewsManagementPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [loading, setLoading] = useState(true);

  const activePage = pages.find((p) => p.id === activePageId) || null;

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await getAllPages();
      setPages(data);
    } catch (e) {
      console.error('fetchPages error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      const newPage = await createPage({
        title: '名称未設定のページ',
        status: 'private',
        sections: [
          {
            id: Math.random().toString(36).substr(2, 9),
            type: 'hero',
            content: {
              title: 'Welcome to Luxury',
              subtitle: 'Experience premium service',
              buttonText: '詳しく見る',
              imageUrl:
                'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1920&auto=format&fit=crop',
              titleStyle: { x: 50, y: 35, size: 72 },
              subtitleStyle: { x: 50, y: 50, size: 28 },
              buttonStyle: { x: 50, y: 72, size: 20 },
            },
          },
        ],
      });

      if (newPage) {
        setPages((prev) => [newPage, ...prev]);
        setActivePageId(newPage.id);
        setActiveSectionId(null);
        setView('editor');
        toast.success('ページを作成しました');
      }
    } catch (error) {
      toast.error('ページの作成に失敗しました');
    }
  };

  const handleEditPage = (id: string) => {
    setActivePageId(id);
    setActiveSectionId(null);
    setView('editor');
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const success = await deletePage(id);
      if (success) {
        setPages((prev) => prev.filter((p) => p.id !== id));
        toast.success('ページを削除しました');
      }
    } catch (error) {
      toast.error('削除に失敗しました');
    }
  };

  const handleToggleStatus = async (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;

    const newStatus = page.status === 'published' ? 'private' : 'published';
    try {
      const updated = await updatePage(id, { status: newStatus });
      if (updated) {
        setPages((prev) => prev.map((p) => (p.id === id ? updated : p)));
        toast.success(`ステータスを${newStatus === 'published' ? '公開' : '非公開'}にしました`);
      }
    } catch (error) {
      toast.error('ステータスの更新に失敗しました');
    }
  };

  const handleUpdatePage = async (id: string, data: Partial<PageData>) => {
    // Optimistic update
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p)),
    );

    // Debounce saving could be better, but for now direct save
    // In a real app, useDebounce or a manual save button for heavy edits
    // Here we just save silently
    await updatePage(id, data);
  };

  const updateActivePage = (data: Partial<PageData>) => {
    if (!activePageId) return;
    handleUpdatePage(activePageId, data);
  };

  if (view === 'dashboard') {
    return (
      <NewsDashboard
        pages={pages}
        onCreatePage={handleCreatePage}
        onEditPage={handleEditPage}
        onDeletePage={handleDeletePage}
        onToggleStatus={handleToggleStatus}
        onUpdatePage={handleUpdatePage}
      />
    );
  }

  return (
    <NewsEditor
      activePage={activePage}
      activeSectionId={activeSectionId}
      viewport={viewport}
      setActiveSectionId={setActiveSectionId}
      setViewport={setViewport}
      setView={setView}
      updateActivePage={updateActivePage}
    />
  );
}
