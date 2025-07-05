'use client';

import { Button } from '@/components/ui/button';
import { Brain, Sparkles, ArrowRight, Heart, Star, Zap } from 'lucide-react';

export default function AIMatchingSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 px-4 py-16 text-white">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-10 animate-pulse">
          <Sparkles className="h-6 w-6 text-purple-300 opacity-60" />
        </div>
        <div className="absolute right-20 top-20 animate-bounce delay-1000">
          <Heart className="h-8 w-8 text-pink-300 opacity-40" />
        </div>
        <div className="delay-2000 absolute bottom-20 left-20 animate-pulse">
          <Star className="h-10 w-10 text-yellow-300 opacity-50" />
        </div>
        <div className="delay-3000 absolute bottom-10 right-10 animate-bounce">
          <Zap className="h-7 w-7 text-blue-300 opacity-60" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">AI マッチング診断</h2>
          </div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200">
            最新のAI技術であなたにぴったりのキャストをマッチング。
            <br />
            たった3分の簡単診断で、運命の出会いが見つかります。
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 p-2">
                  <span className="text-sm font-bold text-white">1</span>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">簡単な質問に答える</h3>
                  <p className="text-gray-300">
                    あなたの好みや理想のタイプについて、簡単な質問にお答えください。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-2">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">AIが最適なマッチングを分析</h3>
                  <p className="text-gray-300">
                    高度なアルゴリズムがあなたの回答を分析し、相性の良いキャストを選出します。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full bg-gradient-to-r from-pink-400 to-red-400 p-2">
                  <span className="text-sm font-bold text-white">3</span>
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">運命の出会いをお届け</h3>
                  <p className="text-gray-300">
                    マッチング結果とおすすめキャストをご紹介。そのまま予約も可能です。
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="mb-1 text-2xl font-bold">98%</div>
                  <div className="text-sm text-gray-300">マッチング精度</div>
                </div>
                <div>
                  <div className="mb-1 text-2xl font-bold">3分</div>
                  <div className="text-sm text-gray-300">診断時間</div>
                </div>
                <div>
                  <div className="mb-1 text-2xl font-bold">95%</div>
                  <div className="text-sm text-gray-300">満足度</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400">
                  <Brain className="h-12 w-12 text-white" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">今すぐ診断を始める</h3>
                <p className="text-gray-300">完全無料・登録不要</p>
              </div>

              <Button
                size="lg"
                className="w-full transform rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
              >
                <Brain className="mr-2 h-5 w-5" />
                AI診断を始める
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="mt-4 text-xs text-gray-400">※診断結果は完全匿名で保存されます</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
