'use client';

import Cookies from 'js-cookie';
import { ShieldAlertIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MagazineAgeModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 既に同意済みかCookieを確認
    const cookieConsent = Cookies.get('magazine_age_verified');
    if (!cookieConsent) {
      // 少しタイミングを遅らせて表示 (UIのチラツキ防止)
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('magazine_age_verified', 'true', { expires: 30 });
    setShowModal(false);
  };

  const handleDecline = () => {
    // 同意しない場合はYahooなどにリダイレクト（あるいは前ページに戻す）
    window.location.href = 'https://www.yahoo.co.jp/';
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-sm rounded-3xl border border-pink-50 bg-white/95 p-8 shadow-2xl backdrop-blur-none duration-300 animate-in fade-in zoom-in">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-pink-300">
            <ShieldAlertIcon size={40} strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 font-serif text-xl tracking-wide text-gray-800">18歳以上ご案内</h2>
          <p className="text-xs font-medium leading-loose text-gray-500">
            当サイトは、大人の女性の心とからだのケアに関するコンテンツ（一部性的な表現や成人向けサービスの情報を含む）を提供しています。
            法令に基づき、18歳未満の方の閲覧はご遠慮いただいております。
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleAccept}
            className="w-full rounded-full bg-pink-50 py-3.5 text-center text-sm font-bold text-pink-600 shadow-sm transition-all hover:bg-pink-100 hover:text-pink-700 active:scale-95"
          >
            はい、18歳以上です（同意する）
          </button>
          <button
            onClick={handleDecline}
            className="w-full rounded-full py-3.5 text-center text-xs font-medium text-gray-400 underline underline-offset-4 transition-colors hover:text-gray-600"
          >
            いいえ、18歳未満です（退室する）
          </button>
        </div>
      </div>
    </div>
  );
}
