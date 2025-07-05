import React from 'react';
import { Play, Heart, Shield, Users } from 'lucide-react';

const MessageSection: React.FC = () => {
  return (
    <section id="message" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-rounded">
            A Message for You
          </h2>
          <p className="text-xl text-gray-600 font-serif">
            私たちがあなたをお迎えする理由
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <div className="relative bg-gray-200 rounded-lg aspect-video flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                    <p className="text-gray-600">店長からのメッセージ</p>
                    <p className="text-sm text-gray-500">約60秒</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
                  女性店長より
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  こんにちは。私たちストロベリーボーイズは、女性が安心して働ける環境づくりを最優先に考えています。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  あなたの不安や疑問に寄り添い、一緒に成長していける場所を提供したいと思っています。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-pink-50 rounded-lg">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">企業理念</h4>
              <p className="text-gray-600 text-sm">
                女性の自立と成長を支援し、上質なサービスを提供します。
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">プライバシー保護</h4>
              <p className="text-gray-600 text-sm">
                完全個室制度と徹底したプライバシー管理で安心を提供。
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">サポート体制</h4>
              <p className="text-gray-600 text-sm">
                女性スタッフによる24時間体制のサポートシステム。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;