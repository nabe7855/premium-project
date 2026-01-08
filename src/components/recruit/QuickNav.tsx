
import React from 'react';
import { FileText, Wallet, Award, MapPin, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

const QuickNav: React.FC = () => {
  const navItems = [
    { label: '仕事内容', icon: <FileText size={18}/>, id: 'manga' },
    { label: '給料', icon: <Wallet size={18}/>, id: 'salary' },
    { label: '研修', icon: <Award size={18}/>, id: 'training' },
    { label: '環境', icon: <MapPin size={18}/>, id: 'env' },
    { label: 'Q&A', icon: <HelpCircle size={18}/>, id: 'qa' },
    { label: '応募', icon: <CheckCircle2 size={18}/>, id: 'entry-form' },
  ];

  return (
    <section className="bg-stone-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {navItems.map((nav) => (
            <a key={nav.label} href={`#${nav.id}`} className="bg-stone-800 hover:bg-stone-700 p-3 rounded-lg flex flex-col items-center gap-1 transition-colors border border-stone-700">
              <span className="text-gold">{nav.icon}</span>
              <span className="text-[10px] md:text-xs text-stone-300 font-bold">{nav.label}</span>
            </a>
          ))}
        </div>
        <a href="#qa" className="mt-4 w-full bg-white/5 border border-white/20 text-white text-xs py-2 rounded-full flex items-center justify-center gap-2 hover:bg-white/10">
          まず不安を解消したい方はQ&Aへ <ChevronRight size={14} />
        </a>
      </div>
    </section>
  );
};

export default QuickNav;
