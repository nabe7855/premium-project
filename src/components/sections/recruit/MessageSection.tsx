import React from 'react';
import { Heart, Shield, Users } from 'lucide-react';

const MessageSection: React.FC = () => {
  return (
    <section id="message" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800 md:text-4xl">
            A Message for You
          </h2>
          <p className="font-serif text-xl text-gray-600">私たちがあなたをお迎えする理由</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 p-8">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="w-full md:w-1/2">
                <h3 className="mb-4 font-rounded text-2xl font-bold text-gray-800">店長より</h3>
                <p className="mb-4 leading-relaxed text-gray-600">
                  こんにちは。私たちストロベリーボーイズは、セラピストが安心して働ける環境づくりを最優先に考えています。
                </p>
                <p className="leading-relaxed text-gray-600">
                  有名になりたい、最高の男性になりたいと思うあなたを徹底プロデュースします。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-pink-50 p-6 text-center">
              <Heart className="mx-auto mb-3 h-8 w-8 text-pink-500" />
              <h4 className="mb-2 text-lg font-semibold text-gray-800">企業理念</h4>
              <p className="text-sm text-gray-600">
                セラピストの自立と成長を支援し、女性にとろけるようないちご一会なサービスを提供します。
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-6 text-center">
              <Shield className="mx-auto mb-3 h-8 w-8 text-blue-500" />
              <h4 className="mb-2 text-lg font-semibold text-gray-800">プライバシー保護</h4>
              <p className="text-sm text-gray-600">
                徹底したプライバシー管理で安心を提供。（芸能、モデル関係のセラピスト在籍中）
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-6 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-purple-500" />
              <h4 className="mb-2 text-lg font-semibold text-gray-800">サポート体制</h4>
              <p className="text-sm text-gray-600">
                専任スタッフによる24時間体制のサポートシステム。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessageSection;
