
import React from 'react';

interface FloatingCTAProps {
  onOpenChat: () => void;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ onOpenChat }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        <button 
          onClick={onOpenChat}
          className="bg-green-600 text-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center shadow-md active:bg-green-700 active:scale-[0.98] transition-all"
        >
          <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter mb-0.5">Line Consultation</span>
          <span className="text-sm font-bold">チャット相談</span>
        </button>
        <button 
          onClick={onOpenChat}
          className="bg-amber-600 text-white rounded-2xl py-3 px-2 flex flex-col items-center justify-center shadow-md active:bg-amber-700 active:scale-[0.98] transition-all"
        >
          <span className="text-[9px] font-bold opacity-80 uppercase tracking-tighter mb-0.5">Apply in 30s</span>
          <span className="text-sm font-bold">カンタン応募</span>
        </button>
      </div>
      <div className="h-safe-area-inset-bottom"></div>
    </div>
  );
};

export default FloatingCTA;
