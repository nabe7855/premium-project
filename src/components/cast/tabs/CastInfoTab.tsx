import React from "react";
import { CastSummary } from "@/types/cast";

interface Props {
  cast: CastSummary;
}

const CastInfoTab: React.FC<Props> = ({ cast }) => {
  return (
    <div className="space-y-8">
      {/* PROFILE 表 */}
      <div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
        <h3 className="text-red-600 font-bold text-lg mb-3">◆ PROFILE</h3>
        <table className="w-full text-sm text-left border-collapse">
          <tbody>
            <tr className="border-t border-pink-200">
              <th className="bg-pink-100 px-3 py-2 w-32">名前</th>
              <td className="bg-pink-50 px-3 py-2">トワ（心地良い距離感）</td>
            </tr>
            <tr className="border-t border-pink-200">
              <th className="bg-pink-100 px-3 py-2">身長・体重</th>
              <td className="bg-pink-50 px-3 py-2">179cm・68kg</td>
            </tr>
            <tr className="border-t border-pink-200">
              <th className="bg-pink-100 px-3 py-2">年齢</th>
              <td className="bg-pink-50 px-3 py-2">33歳</td>
            </tr>
            <tr className="border-t border-pink-200">
              <th className="bg-pink-100 px-3 py-2">血液型</th>
              <td className="bg-pink-50 px-3 py-2">ひみつ</td>
            </tr>
            <tr className="border-t border-pink-200">
              <th className="bg-pink-100 px-3 py-2">タイプ</th>
              <td className="bg-pink-50 px-3 py-2">メンズモデル系</td>
            </tr>
            <tr className="border-t border-b border-pink-200">
              <th className="bg-pink-100 px-3 py-2">Twitter</th>
              <td className="bg-pink-50 px-3 py-2">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-700 underline hover:text-pink-900"
                >
                  トワ（心地良い距離感）さんのTwitterはこちら
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* 見た目特徴セクション */}
<div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
  <h3 className="text-red-600 font-bold text-lg mb-2">◆ APPEARANCE</h3>
  <table className="w-full text-sm border border-pink-200">
    <thead>
      <tr className="bg-pink-100 text-left">
        <th className="px-3 py-2 w-1/3">項目</th>
        <th className="px-3 py-2 w-2/3">特徴</th>
      </tr>
    </thead>
    <tbody className="bg-pink-50">
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">ヒゲ</td>
        <td className="px-3 py-2">×</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">メガネ</td>
        <td className="px-3 py-2">×</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">高身長</td>
        <td className="px-3 py-2">◎</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">スーツ</td>
        <td className="px-3 py-2">△（事前に連絡いただければ可能です）</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">筋肉質</td>
        <td className="px-3 py-2">〇</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">美肌</td>
        <td className="px-3 py-2">◎</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">低ボイス</td>
        <td className="px-3 py-2">〇</td>
      </tr>
      <tr className="border-t border-pink-200">
        <td className="px-3 py-2">巨根</td>
        <td className="px-3 py-2">〇（通常、もしくは通常よりも大きめとは言われます）</td>
      </tr>
      <tr className="border-t border-b border-pink-200">
        <td className="px-3 py-2">陰毛処理済み</td>
        <td className="px-3 py-2">×（全体的に体毛は薄め）</td>
      </tr>
    </tbody>
  </table>
</div>

<div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm mt-8">
  <h3 className="text-red-600 font-bold text-lg mb-2">◆ プレイ内容</h3>
  <p className="text-sm text-gray-600 mb-4">
    ◎自信あり　〇対応可能　△自信はないが対応可能　×対応不可
  </p>

  <table className="w-full text-sm border-separate border-spacing-y-1">
    <tbody>
      {[
        ["アイラインタッチなし", "◎"],
        ["ドMコース", "◎"],
        ["洗体コース", "◎"],
        ["デート", "〇"],
        ["お泊り", "◎"],
        ["添い寝", "◎"],
        ["3P", "〇"],
        ["キス", "◎"],
        ["クンニ", "◎"],
        ["フェラ", "◎"],
        ["手コキ", "◎"],
        ["モノ鑑賞", "◎"],
        ["全身リップ", "〇"],
        ["乳首舐め", "◎"],
        ["アナル舐め", "△"],
        ["指入れ", "◎"],
        ["Gスポット", "◎"],
        ["ポルチオ", "◎"],
        ["パウダー性感", "〇"],
        ["ソフトSM", "◎"],
        ["おもちゃプレイ", "◎"],
        ["指圧マッサージ", "◎"],
        ["オイルマッサージ", "◎"],
      ].map(([label, level], idx) => (
        <tr key={idx} className="bg-pink-100 rounded">
          <td className="px-3 py-1 w-2/3">{label}</td>
          <td className="px-3 py-1 w-1/3 text-right font-semibold">{level}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>





    </div>
  );
};

export default CastInfoTab;
