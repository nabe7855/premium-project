'use client';

import NewsDashboard from '@/components/admin/news/NewsDashboard';
import NewsEditor from '@/components/admin/news/NewsEditor';
import { PageData } from '@/components/admin/news/types';
import { useState } from 'react';

export default function NewsManagementPage() {
  const [pages, setPages] = useState<PageData[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');

  const activePage = pages.find((p) => p.id === activePageId) || null;

  const handleCreatePage = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newPage: PageData = {
      id: newId,
      title: '名称未設定のページ',
      status: 'private',
      updatedAt: Date.now(),
      sections: [
        {
          id: '1',
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
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newId);
    setActiveSectionId(null);
    setView('editor');
  };

  const handleEditPage = (id: string) => {
    setActivePageId(id);
    setActiveSectionId(null);
    setView('editor');
  };

  const handleDeletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === 'published' ? 'private' : 'published',
              updatedAt: Date.now(),
            }
          : p,
      ),
    );
  };

  const updateActivePage = (data: Partial<PageData>) => {
    if (!activePageId) return;
    setPages((prev) =>
      prev.map((p) => (p.id === activePageId ? { ...p, ...data, updatedAt: Date.now() } : p)),
    );
  };

  if (view === 'dashboard') {
    return (
      <NewsDashboard
        pages={pages}
        onCreatePage={handleCreatePage}
        onEditPage={handleEditPage}
        onDeletePage={handleDeletePage}
        onToggleStatus={handleToggleStatus}
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
