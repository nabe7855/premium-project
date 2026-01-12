
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-white font-serif font-bold text-xl tracking-wider">LIFE CHANGE <span className="text-amber-500">FUKUOKA</span></span>
            </div>
            <p className="max-w-md leading-relaxed">
              私たちは、福岡で「新しい自分」を見つけたいと願う全ての男性を応援します。<br/>
              創業8年の実績と、一人ひとりに寄り添う教育体制。
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Links</h5>
            <ul className="space-y-4 text-sm">
              <li><a href="#trust" className="hover:text-amber-500 transition-colors">私たちの実績</a></li>
              <li><a href="#benefits" className="hover:text-amber-500 transition-colors">安心のサポート</a></li>
              <li><a href="#income" className="hover:text-amber-500 transition-colors">報酬シミュレーション</a></li>
              <li><a href="#qa" className="hover:text-amber-500 transition-colors">よくあるご質問</a></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-6">Contact</h5>
            <ul className="space-y-4 text-sm">
              <li>採用担当直通：090-XXXX-XXXX</li>
              <li>受付時間：12:00〜翌3:00</li>
              <li>福岡市中央区天神エリア（詳細は面談時に）</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs uppercase tracking-widest opacity-50">© 2024 LIFE CHANGE RECRUIT FUKUOKA. ALL RIGHTS RESERVED.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
