import React from 'react';

interface FloatingCTAProps {
  onOpenChat: () => void;
  onOpenForm: () => void;
  onOpenDiagnostic: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onOpenChat, onOpenForm, onOpenDiagnostic }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.1)] md:hidden">
      {/* Diagnostic Banner - First Row (Full Width) */}
      <div>
        <button
          onClick={onOpenDiagnostic}
          className="block w-full transition-transform active:scale-[0.98]"
        >
          <img
            src="/スピード適正診断.png"
            alt="30秒スピード適正診断する"
            className="block h-auto w-full"
          />
        </button>
      </div>

      {/* Action Buttons - Second Row */}
      <div className="grid grid-cols-3 gap-0">
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center border-r border-white/20 bg-green-600 px-1 py-4 text-white shadow-md transition-all active:scale-[0.98] active:bg-green-700"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            LINE
          </span>
          <span className="text-[11px] font-bold">チャット</span>
        </button>
        <button
          onClick={onOpenChat}
          className="flex flex-col items-center justify-center border-r border-yellow-600/20 bg-yellow-400 px-1 py-4 text-black shadow-md transition-all active:scale-[0.98] active:bg-yellow-500"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            Quick
          </span>
          <span className="text-[11px] font-bold">簡単相談</span>
        </button>
        <button
          onClick={onOpenForm}
          className="flex flex-col items-center justify-center bg-slate-900 px-1 py-4 text-white shadow-md transition-all active:scale-[0.98] active:bg-slate-800"
        >
          <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter opacity-80">
            Form
          </span>
          <span className="text-[11px] font-bold">フォーム応募</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingCTA;
