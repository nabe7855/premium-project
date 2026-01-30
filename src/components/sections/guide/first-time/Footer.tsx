import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12 pb-24 text-center md:pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-4 text-xl font-bold text-[#FF4B5C]">STRAWBERRY BOYS</div>
        <p className="mx-auto mb-8 max-w-lg text-xs leading-relaxed text-gray-500">
          当サイトは女性向け風俗店「ストロベリーボーイズ」の公式サイトです。
          <br />
          18歳未満の方、及び高校生の方のご利用は固くお断りしております。
        </p>
        <div className="text-[10px] uppercase tracking-widest text-gray-400">
          © 2024 Strawberry Boys Group. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
