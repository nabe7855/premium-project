'use client';
import React from 'react';
import { Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-b from-pink-50 to-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 text-center">
          <h1 className="mb-4 font-sans text-3xl font-bold text-gray-800 md:text-4xl">
            口コミ一覧
          </h1>
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-pink-200 bg-pink-100 p-6">
            <p className="font-serif text-lg leading-relaxed text-gray-700">
              あのひととの、甘くて少し秘密のような時間。
              <br />
              その余韻が、誰かの"最初の一歩"になりますように。
            </p>
          </div>
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 shadow-sm">
            <Heart className="h-5 w-5 fill-current text-pink-500" />
            <span className="text-sm text-gray-600">
              口コミは個人の主観によるものであり、体験は人によって異なります🍓
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
