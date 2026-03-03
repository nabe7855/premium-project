'use client';

import Cookies from 'js-cookie';
import { ShieldAlertIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AgeVerificationModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 既に同意済みかCookieを確認
    const cookieConsent = Cookies.get('career_age_verified');
    if (!cookieConsent) {
      // 少しタイミングを遅らせて表示 (UIのチラツキ防止)
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // 同意した場合、Cookieに30日間保存する
    Cookies.set('career_age_verified', 'true', { expires: 30 });
    setShowModal(false);
  };

  const handleDecline = () => {
    // 同意しない場合はYahooなどにリダイレクト（あるいは前ページに戻す）
    window.location.href = 'https://www.yahoo.co.jp/';
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl duration-300 animate-in fade-in zoom-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShieldAlertIcon size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-black text-gray-900">年齢確認</h2>
          <p className="text-sm font-medium leading-relaxed text-gray-600">
            当メディア「THERAPIST
            CAREER」は、女性用風俗や性感サービスに関する求人・業界情報を扱っています。
            法令の要請により、18歳未満（高校生含む）の方の閲覧は固くお断りいたします。
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500">
          <ul className="list-disc space-y-2 pl-4">
            <li>あなたは18歳以上ですか？</li>
            <li>このサイトが成人向けのキャリア・求人情報を扱っていることに同意しますか？</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleAccept}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-center font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
          >
            はい、18歳以上です（同意する）
          </button>
          <button
            onClick={handleDecline}
            className="w-full rounded-xl bg-gray-100 py-3.5 text-center font-bold text-gray-500 transition-colors hover:bg-gray-200"
          >
            いいえ、18歳未満です（退室する）
          </button>
        </div>
      </div>
    </div>
  );
}
