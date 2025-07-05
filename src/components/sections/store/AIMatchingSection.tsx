'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, ArrowRight, Heart, Star, Zap } from 'lucide-react';

export default function AIMatchingSection() {
  const { store } = useStore();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-300 opacity-60" />
        </div>
        <div className="absolute top-20 right-20 animate-bounce delay-1000">
          <Heart className="w-8 h-8 text-pink-300 opacity-40" />
        </div>
        <div className="absolute bottom-20 left-20 animate-pulse delay-2000">
          <Star className="w-10 h-10 text-yellow-300 opacity-50" />
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce delay-3000">
          <Zap className="w-7 h-7 text-blue-300 opacity-60" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-3">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              AI マッチング診断
            </h2>
          </div>
          <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            最新のAI技術であなたにぴったりのキャストをマッチング。<br />
            たった3分の簡単診断で、運命の出会いが見つかります。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-2 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">簡単な質問に答える</h3>
                  <p className="text-gray-300">あなたの好みや理想のタイプについて、簡単な質問にお答えください。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-full p-2 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AIが最適なマッチングを分析</h3>
                  <p className="text-gray-300">高度なアルゴリズムがあなたの回答を分析し、相性の良いキャストを選出します。</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-pink-400 to-red-400 rounded-full p-2 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">運命の出会いをお届け</h3>
                  <p className="text-gray-300">マッチング結果とおすすめキャストをご紹介。そのまま予約も可能です。</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold mb-1">98%</div>
                  <div className="text-sm text-gray-300">マッチング精度</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">3分</div>
                  <div className="text-sm text-gray-300">診断時間</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">95%</div>
                  <div className="text-sm text-gray-300">満足度</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">今すぐ診断を始める</h3>
                <p className="text-gray-300">完全無料・登録不要</p>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg transform transition-all duration-300 hover:scale-105 w-full"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI診断を始める
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-gray-400 mt-4">
                ※診断結果は完全匿名で保存されます
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}