import React from "react";
// import { CastSummary } from "@/types/cast";

type CastSummary = {
  // 型定義を仮で記述。実際の型に合わせて修正してください。
  [key: string]: any;
};

interface Props {
  cast: CastSummary;
}

const CharacterTab: React.FC<Props> = ({ cast }) => {
  return (
    <div className="space-y-8">
      {/* 店長コメント */}
      <div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
        <h3 className="text-red-600 font-bold text-lg mb-2">◆ 店長コメント</h3>
        <p className="text-sm leading-relaxed text-gray-700">
          来ました、来ましたよ・・<br />
          高身長、スラっとしたルックス、そして優しい気遣いが自然とできるエスコート・・<br />
          トワさんはそんなセラピストさんです☆<br />
          施術についても高評価を頂いており、店長斎藤一押しセラピストの1人です！
        </p>
      </div>

      {/* Q&A セクション */}
      <div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
        <h3 className="text-red-600 font-bold text-lg mb-2">◆ セラピストQ&A</h3>
        <dl className="space-y-4 text-sm text-gray-700">
          <div>
            <dt className="font-semibold text-pink-700">Q. この業界に入ったきっかけは？</dt>
            <dd>奉仕型のSで、女性を気持ちよくさせることが好きだったから。</dd>
          </div>
          <div>
            <dt className="font-semibold text-pink-700">Q. ストロベリーボーイズを選んだ理由は？</dt>
            <dd>対応が良く、面接時のオーナーの人柄で決めました。</dd>
          </div>
          <div>
            <dt className="font-semibold text-pink-700">Q. 初めてのお客様への心がけは？</dt>
            <dd>目的や緊張度に寄り添い、安心してもらえるよう心がけてます。</dd>
          </div>
          <div>
            <dt className="font-semibold text-pink-700">Q. 店長をどう思いますか？</dt>
            <dd>夜中に電話してくるので「彼女かっ！」と思うことがあります（笑）</dd>
          </div>
          {/* 必要に応じてさらに追加 */}
        </dl>
      </div>
    </div>
  );
};

export default CharacterTab;

