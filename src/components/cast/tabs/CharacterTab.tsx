import React from 'react';

type CastSummary = {
  // 実際の型に合わせて修正可能（仮の定義）
  [key: string]: any;
};

interface Props {
  cast: CastSummary;
}

const CharacterTab: React.FC<Props> = ({ cast: _cast }) => {
  return (
    <div className="space-y-8">
      {/* 店長コメント */}
      <div className="rounded-md border border-pink-200 bg-pink-50 p-4 shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-red-600">◆ 店長コメント</h3>
        <p className="text-sm leading-relaxed text-gray-700">
          来ました、来ましたよ・・
          <br />
          高身長、スラっとしたルックス、そして優しい気遣いが自然とできるエスコート・・
          <br />
          トワさんはそんなセラピストさんです☆
          <br />
          施術についても高評価を頂いており、店長斎藤一押しセラピストの1人です！
        </p>
      </div>

      {/* 特徴紹介セクション */}
      <div className="rounded-md border border-pink-200 bg-pink-50 p-4 shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-red-600">◆ FEATURES</h3>
        <div className="space-y-4 text-sm leading-relaxed text-gray-800">
          <p>
            <strong>1. 長所</strong>
            <br />
            プラス思考で、空気を読むのは得意な方だと思います。
          </p>
          <p>
            <strong>2. 短所</strong>
            <br />
            色々な事に興味を持つ為、あれこれ手を出してしまい中途半端に終わってしまう事もあります。
          </p>
          <p>
            <strong>3. 性格</strong>
            <br />
            優しい、温和、感情の波が激しくない。と言って頂けます。
          </p>
          <p>
            <strong>4. 飲酒</strong>
            <br />
            好きです！皆様にはよく飲むと言われます。
          </p>
          <p>
            <strong>5. 喫煙</strong>
            <br />
            アイコスを吸います（気にされる方や短い時間の予約の方の前では吸いません）。
          </p>
          <p>
            <strong>6. 好きな言葉</strong>
            <br />
            高くジャンプするには一度深くしゃがまなければならない。
          </p>
          <p>
            <strong>7. 好きなブランド</strong>
            <br />
            ルイヴィトン、Diorなど。
          </p>
          <p>
            <strong>8. 好きな音楽</strong>
            <br />
            あまり聞かないが、たまにJPOPを聞きます。
          </p>
          <p>
            <strong>9. 好きな本</strong>
            <br />
            山田悠介さんの本やジャンプコミックスなど。
          </p>
          <p>
            <strong>10. 好きな映画</strong>
            <br />
            スターウォーズ、バックトゥザフューチャー、グランドイリュージョンなど。
          </p>
          <p>
            <strong>11. 好きな食べ物</strong>
            <br />
            カレー、ハンバーグ、焼肉、寿司など。
          </p>
          <p>
            <strong>12. 出勤スケジュール</strong>
            <br />
            朝〜夜まで。事前連絡で夜中対応も可（LINE・X・店頭にて相談可）。
          </p>
          <p>
            <strong>13. S or M</strong>
            <br />
            ソフトS（普段とギャップがあるらしいです）。
          </p>
          <p>
            <strong>14. 自己PR</strong>
            <br />
            セラピスト歴6年目。緊張や悩みに寄り添い、非日常をお届けします。ご相談だけでも歓迎。
          </p>
        </div>
      </div>

      {/* LINE風Q&A（質問左・回答右） */}
      <div className="mt-8 space-y-4 rounded-md border border-pink-200 bg-pink-50 p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-red-600">◆ セラピストQ&A（ロングver.）</h3>
        {[
          {
            question: 'この業界に入ったきっかけは？',
            answer:
              '元々、自分は奉仕型のSで、\n女性が気持ち良くなってくれてるのが好きだったので\n『自分って好きだけど上手いのかな？まだまだなのかな？』\nと思ったのはきっかけでもあります。',
          },
          {
            question: 'なぜストロベリーボーイズを選んだのですか？',
            answer:
              '他のお店にも面接の応募を出していたのですが、\n応募した時のうちのお店の対応が段違いに良かったのと、\n面接時のオーナーの親身になってくれる姿、人柄で決めました。\n（トワという名前は面接時にオーナーが一緒に考えてくれました）',
          },
          {
            question: '新規のお客様に気を付けている事はありますか？',
            answer:
              '利用しようと思った理由は人それぞれ違いますし、\n吐きそうなくらい緊張したという方もいらっしゃいます。\nなので、お客様の利用目的や緊張度、\nお会いした際のテンションなど\nなるべく歩幅を合わせて、お話やカウンセリングをしよう。\nまずは慣れてもらおう。安心して貰おう。\nと心がけています。',
          },
          {
            question: '店長をどう思いますか？',
            answer:
              '夜中12時過ぎに\n「トワー！忙しくて斎藤死にそうだよー」\n「2秒だけ電話できる？」\nと電話かけて来るので若干萌えますが、\nたまに『彼女かっ！』と思いますw',
          },
        ].map((qa, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* 質問：左吹き出し */}
            <div className="max-w-[80%] self-start whitespace-pre-line rounded-xl rounded-bl-sm border border-pink-300 bg-white px-4 py-2 text-sm text-gray-800 shadow">
              <strong>Q.</strong> {qa.question}
            </div>
            {/* 回答：右吹き出し */}
            <div className="max-w-[80%] self-end whitespace-pre-line rounded-xl rounded-br-sm bg-pink-100 px-4 py-2 text-sm text-gray-800 shadow">
              {qa.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterTab;
