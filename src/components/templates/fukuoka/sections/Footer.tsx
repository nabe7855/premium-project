import { Instagram, MessageCircle } from 'lucide-react';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-50 bg-white py-16 pb-28 text-slate-400 md:pb-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 text-center md:grid-cols-4 md:text-left">
        <div className="md:col-span-2">
          <h2 className="mb-6 font-serif text-3xl font-bold italic tracking-[0.3em] text-slate-800">
            LUMIÈRE
          </h2>
          <p className="mb-8 max-w-sm text-[11px] leading-relaxed">
            福岡エリアで最も選ばれる、女性のためのリラクゼーションサービス。
            <br />
            安全性と心地よさを追求し、心身の調和をサポートします。
          </p>
          <div className="flex justify-center space-x-6 md:justify-start">
            <a href="#" className="hover:text-primary-400 text-slate-300 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-primary-400 text-slate-300 transition-colors">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div className="hidden md:block">
          <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-800">
            Navigation
          </h4>
          <ul className="space-y-4 text-[11px] tracking-wider">
            <li>
              <a href="#home" className="hover:text-primary-400">
                Home
              </a>
            </li>
            <li>
              <a href="#campaign" className="hover:text-primary-400">
                Campaign
              </a>
            </li>
            <li>
              <a href="#cast" className="hover:text-primary-400">
                Therapists
              </a>
            </li>
            <li>
              <a href="#price" className="hover:text-primary-400">
                Price List
              </a>
            </li>
          </ul>
        </div>
        <div className="hidden md:block">
          <h4 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-slate-800">
            Support
          </h4>
          <ul className="space-y-4 text-[11px] tracking-wider">
            <li>
              <a href="#" className="hover:text-primary-400">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-400">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between border-t border-neutral-50 px-8 pt-8 text-[9px] tracking-[0.1em] text-slate-300 md:flex-row">
        <p className="mb-6 flex items-center md:mb-0">
          <span className="mr-3 rounded bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-400">
            ADULT ONLY
          </span>
          当サービスは18歳未満の方の利用を固く禁じております。
        </p>
        <p>&copy; 2023-2024 LUMIÈRE Fukuoka. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
