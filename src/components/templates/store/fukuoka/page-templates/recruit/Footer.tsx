
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-800 pb-12">
          <div className="mb-8 md:mb-0">
            <span className="text-2xl font-bold font-serif mb-2 block tracking-wider">
              FUKUOKA <span className="text-amber-500">PREMIUM</span>
            </span>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              福岡エリアで最高クラスのホスピタリティを提供する、女性専用風俗セラピスト派遣グループ。あなたの新しい挑戦を全力でサポートします。
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8 md:gap-12 text-sm text-slate-400">
             <div className="space-y-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest">Navigation</h4>
                <div className="flex flex-col gap-2">
                   <a href="#features" className="hover:text-amber-500 transition-colors">特徴</a>
                   <a href="#details" className="hover:text-amber-500 transition-colors">募集要項</a>
                   <a href="#salary" className="hover:text-amber-500 transition-colors">給与</a>
                   <a href="#apply" className="hover:text-amber-500 transition-colors">応募フォーム</a>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="font-bold text-white text-xs uppercase tracking-widest">Support</h4>
                <div className="flex flex-col gap-2">
                   <a href="#faq" className="hover:text-amber-500 transition-colors">よくある質問</a>
                   <a href="#" className="hover:text-amber-500 transition-colors">プライバシーポリシー</a>
                   <a href="#" className="hover:text-amber-500 transition-colors">運営会社</a>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-slate-600 space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p>※当店は風俗営業法を遵守した健全な営業を行っております。20歳未満の方の利用・応募は固くお断りいたします。</p>
            <p>※本サイトで使用している画像はイメージです。実際の店舗環境とは異なる場合があります。</p>
          </div>
          <p className="font-medium tracking-widest">© 2024 FUKUOKA PREMIUM GROUP. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
