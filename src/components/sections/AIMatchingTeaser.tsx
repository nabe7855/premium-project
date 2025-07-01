'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Brain, Heart, ArrowRight } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

export default function AIMatchingTeaser() {
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const handleAIDiagnosisClick = () => {
    requireAgeVerification(() => {
      // ここに実際のアクション（AI診断ページへの遷移など）を実装
      console.log('AI診断開始');
    });
  };

  return (
    <>
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, #dc2626 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Brain className="w-8 h-8 text-rose-600" />
              </div>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              AI診断で見つける
              <br />
              <span className="text-rose-600">あなただけの理想の出会い</span>
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              心理学に基づいたAIが、たった3つの質問であなたにぴったりの
              <br className="hidden sm:block" />
              "ストロベリー"を導き出します
            </p>
          </div>

          {/* AI Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3つの質問だけ</h3>
              <p className="text-gray-600 text-sm">
                簡単な質問に答えるだけで、あなたの好みを正確に分析します
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">心理学ベース</h3>
              <p className="text-gray-600 text-sm">
                専門的な心理学理論に基づいた高精度なマッチングシステム
              </p>
            </Card>

            <Card className="p-6 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">最高の出会い</h3>
              <p className="text-gray-600 text-sm">
                95%の方が「期待以上だった」と回答する高い満足度
              </p>
            </Card>
          </div>

          {/* CTA Section with Character */}
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl max-w-2xl mx-auto relative">
              {/* SB Character Guide */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-rose-600 rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  あなたにぴったりの方を
                  <br />
                  探しますね
                </h3>
                
                <p className="text-gray-600 mb-8">
                  今すぐ診断を始めて、運命の出会いを見つけましょう。
                  <br />
                  診断は完全無料、所要時間はわずか2分です。
                </p>

                <Button 
                  size="lg" 
                  onClick={handleAIDiagnosisClick}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI診断を始める
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  ※診断結果に基づいて、最適なキャストをご提案いたします
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}