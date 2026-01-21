import React, { useRef } from 'react';
import Inspector from './Inspector';
import {
  CampaignSection,
  CastSection,
  CTASection,
  GallerySection,
  HeroSection,
  PriceSection,
  RankingSection,
  SNSSection,
  TextSection,
} from './SectionComponents';
import Sidebar from './Sidebar';
import { PageData, SectionData, SectionType } from './types';

interface NewsEditorProps {
  activePage: PageData | null;
  activeSectionId: string | null;
  viewport: 'desktop' | 'mobile';
  setActiveSectionId: (id: string | null) => void;
  setViewport: (v: 'desktop' | 'mobile') => void;
  setView: (v: 'dashboard' | 'editor') => void;
  updateActivePage: (data: Partial<PageData>) => void;
}

const NewsEditor: React.FC<NewsEditorProps> = ({
  activePage,
  activeSectionId,
  viewport,
  setActiveSectionId,
  setViewport,
  setView,
  updateActivePage,
}) => {
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const addSection = (type: SectionType) => {
    if (!activePage) return;
    let initialItems: any[] = [];
    let initialStyle: any = {};

    if (type === 'gallery') {
      initialItems = Array(4).fill({
        imageUrl:
          'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
        w: 4,
        h: 4,
      });
    } else if (type === 'ranking') {
      initialItems = Array(3).fill({
        name: 'プレミアムプラン',
        text: '洗練されたおもてなしをお約束します。',
        imageUrl:
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      });
    } else if (type === 'hero') {
      initialStyle = {
        titleStyle: { x: 50, y: 35, size: 72 },
        subtitleStyle: { x: 50, y: 50, size: 28 },
        buttonStyle: { x: 50, y: 72, size: 20 },
      };
    }

    const newSection: SectionData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: {
        title: '',
        subtitle: '',
        description: '',
        buttonText: '詳しく見る',
        items: initialItems,
        ...initialStyle,
      },
    };

    updateActivePage({ sections: [...activePage.sections, newSection] });
    setActiveSectionId(newSection.id);
  };

  const updateSection = (data: SectionData) => {
    if (!activePage) return;
    updateActivePage({ sections: activePage.sections.map((s) => (s.id === data.id ? data : s)) });
  };

  const deleteSection = (id: string) => {
    if (!activePage) return;
    updateActivePage({ sections: activePage.sections.filter((s) => s.id !== id) });
    if (activeSectionId === id) setActiveSectionId(null);
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    if (!activePage) return;
    const result = [...activePage.sections];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    updateActivePage({ sections: result });
  };

  const activeSection = activePage?.sections.find((s) => s.id === activeSectionId) || null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
      <Sidebar
        sections={activePage?.sections || []}
        activeSectionId={activeSectionId}
        onAddSection={addSection}
        onSelectSection={setActiveSectionId}
        onReorderSections={reorderSections}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 py-3 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView('dashboard')}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-500"
              title="一覧に戻る"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-slate-900">
                {activePage?.title}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${activePage?.status === 'published' ? 'bg-green-500' : 'bg-slate-300'}`}
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {activePage?.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <button
              onClick={() => setViewport('desktop')}
              className={`rounded-xl p-2 transition-all ${viewport === 'desktop' ? 'bg-white text-rose-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`rounded-xl p-2 transition-all ${viewport === 'mobile' ? 'bg-white text-rose-500 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('dashboard')}
              className="transform rounded-2xl bg-slate-900 px-8 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-rose-600 active:scale-95"
            >
              保存して完了
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-y-auto scroll-smooth bg-slate-100 p-12">
          <div
            className={`${viewport === 'mobile' ? 'w-[375px] rounded-[3.5rem] shadow-[0_100px_100px_-50px_rgba(0,0,0,0.3)] ring-[12px] ring-slate-900' : 'w-full max-w-[1000px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]'} h-fit min-h-[667px] origin-top overflow-y-auto bg-white transition-all duration-700`}
          >
            {activePage?.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className="group/item relative cursor-pointer"
              >
                {(() => {
                  const commonProps = {
                    data: section,
                    active: activeSectionId === section.id,
                    innerRef: (el: any) => {
                      sectionRefs.current[section.id] = el;
                    },
                    onUpdate: updateSection,
                  };
                  switch (section.type) {
                    case 'hero':
                      return <HeroSection {...commonProps} />;
                    case 'campaign':
                      return <CampaignSection {...commonProps} />;
                    case 'cast_list':
                      return <CastSection {...commonProps} />;
                    case 'ranking':
                      return <RankingSection {...commonProps} />;
                    case 'gallery':
                      return <GallerySection {...commonProps} />;
                    case 'text_block':
                      return <TextSection {...commonProps} />;
                    case 'cta':
                      return <CTASection {...commonProps} />;
                    case 'sns_links':
                      return <SNSSection {...commonProps} />;
                    case 'price':
                      return <PriceSection {...commonProps} />;
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Inspector
        section={activeSection}
        page={activePage}
        onUpdateSection={updateSection}
        onUpdatePage={updateActivePage}
        onDeleteSection={deleteSection}
      />
    </div>
  );
};

export default NewsEditor;
