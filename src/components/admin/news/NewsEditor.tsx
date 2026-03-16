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
  const [activeTab, setActiveTab] = React.useState<'layers' | 'preview' | 'inspector'>('preview');

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
        buttonText: type === 'hero' ? '' : '詳しく見る',
        items: initialItems,
        ...initialStyle,
      },
    };

    updateActivePage({ sections: [...activePage.sections, newSection] });
    setActiveSectionId(newSection.id);
    setActiveTab('preview'); // Switch to preview after adding
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
    <div className="relative flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-slate-50 md:flex-row">
      <div className={`${activeTab === 'layers' ? 'flex' : 'hidden'} w-full min-h-0 flex-1 md:flex md:w-80 md:flex-none`}>
        <Sidebar
          sections={activePage?.sections || []}
          activeSectionId={activeSectionId}
          onAddSection={addSection}
          onSelectSection={(id) => {
            setActiveSectionId(id);
            if (window.innerWidth < 768) setActiveTab('preview');
          }}
          onReorderSections={reorderSections}
        />
      </div>

      <div
        className={`${activeTab === 'preview' ? 'flex' : 'hidden'} flex-1 flex-col overflow-hidden md:flex`}
      >
        <div className="z-20 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:px-8">
          <div className="flex items-center gap-2 md:gap-6">
            <button
              onClick={() => setView('dashboard')}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-2 text-slate-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-500 md:p-2.5"
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
              <span className="max-w-[120px] truncate text-xs font-black tracking-tight text-slate-900 md:max-w-none md:text-sm">
                {activePage?.title}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1 w-1 rounded-full md:h-1.5 md:w-1.5 ${activePage?.status === 'published' ? 'bg-green-500' : 'bg-slate-300'}`}
                />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 md:text-[9px]">
                  {activePage?.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-inner md:flex">
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

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setView('dashboard')}
              className="transform rounded-xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-rose-600 active:scale-95 md:rounded-2xl md:px-8 md:py-3 md:text-[11px]"
            >
              完了
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center overflow-y-auto scroll-smooth bg-slate-100 p-4 md:p-12">
          <div
            className={`${viewport === 'mobile' ? 'w-[375px] rounded-[2.5rem] shadow-[0_100px_100px_-50px_rgba(0,0,0,0.3)] ring-[8px] ring-slate-900 md:rounded-[3.5rem] md:ring-[12px]' : 'w-full max-w-[1000px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]'} h-fit min-h-[667px] origin-top overflow-y-auto bg-white transition-all duration-700`}
          >
            {activePage?.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => {
                  setActiveSectionId(section.id);
                  if (window.innerWidth < 768) setActiveTab('inspector');
                }}
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

      <div
        className={`${activeTab === 'inspector' ? 'flex' : 'hidden'} w-full min-h-0 flex-1 md:flex md:w-80 md:flex-none`}
      >
        <Inspector
          section={activeSection}
          page={activePage}
          onUpdateSection={updateSection}
          onUpdatePage={updateActivePage}
          onDeleteSection={deleteSection}
        />
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex h-16 shrink-0 items-center justify-around border-t border-slate-200 bg-white/80 backdrop-blur-md md:hidden">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'layers' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 012-2M5 11V9a2 2 0 01-2-2m0 0V5a2 2 0 012-2h14a2 2 0 012 2v2M5 7h14"
            />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Layers</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'preview' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'inspector' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default NewsEditor;
