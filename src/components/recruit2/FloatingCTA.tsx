import React from 'react';

interface FloatingCTAProps {
  onOpenChat: () => void;
  onOpenForm: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onOpenChat, onOpenForm }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-4 md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center rounded-xl bg-green-600 px-1 py-2 text-white shadow-md transition-all active:scale-[0.98] active:bg-green-700"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            LINE
          </span>
          <span className="text-[11px] font-bold">チャット</span>
        </button>
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center rounded-xl bg-amber-600 px-1 py-2 text-white shadow-md transition-all active:scale-[0.98] active:bg-amber-700"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            Quick
          </span>
          <span className="text-[11px] font-bold">カンタン応募</span>
        </button>
        <button
          onClick={onOpenForm}
          className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-1 py-2 text-white shadow-md transition-all active:scale-[0.98] active:bg-slate-800"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            Form
          </span>
          <span className="text-[11px] font-bold">フォーム応募</span>
        </button>
      </div>
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
};

export default FloatingCTA;
