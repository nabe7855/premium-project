'use client';
import React from 'react';
import { Heart, Phone, Mail, MapPin, Shield, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" fill="currentColor" />
              <span className="font-rounded text-xl font-bold">ストロベリーボーイズ</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              女性が安心して働ける環境づくりを最優先に、上質なサービスを提供しています。
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">お問い合わせ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-pink-500" />
                <span>0120-XXX-XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-pink-500" />
                <span>recruit@strawberry-boys.jp</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-pink-500" />
                <span>東京都内各所</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-pink-500" />
                <span>24時間受付</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
                  よくある質問
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
                  特定商取引法
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">安心・安全</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>SSL暗号化通信</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>個人情報保護</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>24時間サポート</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>完全個室制</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">© 2024 Strawberry Boys. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">18歳未満の方はご応募いただけません。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
