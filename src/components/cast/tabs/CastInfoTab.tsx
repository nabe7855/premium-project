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

      {/* 店長コメント */}
      <div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
        <h3 className="text-red-600 font-bold text-lg mb-2">◆ COMMENT</h3>
        <h4 className="text-lg font-semibold border-b border-pink-300 pb-1 mb-3">店長メッセージ</h4>
        <div className="text-gray-700 space-y-3 text-sm leading-relaxed">
          <p>来ました、来ましたよ・・</p>
          <p>高身長、スラっとしたルックス、そして優しい気遣いが自然とできるエスコート・・</p>
          <p>貴女の非日常願望をきっと叶えてくれる・・</p>
          <p>トワさんはそんなセラピストさんです☆</p>
          <p>もちろん施術についても高評価を頂いており、店長斎藤一押しセラピストの1人です！</p>
          <p>人気急上昇中のため要予約ですよ☆</p>
        </div>
      </div>

      {/* 特徴紹介セクション */}
      <div className="bg-pink-50 border border-pink-200 rounded-md p-4 shadow-sm">
        <h3 className="text-red-600 font-bold text-lg mb-2">◆ FEATURES</h3>
        <div className="text-gray-800 text-sm space-y-4 leading-relaxed">
          <p><strong>1. 長所</strong><br />プラス思考で、空気を読むのは得意な方だと思います。</p>
          <p><strong>2. 短所</strong><br />色々な事に興味を持つ為、あれこれ手を出してしまい中途半端に終わってしまう事もあります。</p>
          <p><strong>3. 性格</strong><br />優しい、温和、感情の波が激しくない。と言って頂けます。</p>
          <p><strong>4. 飲酒</strong><br />好きです！皆様にはよく飲むと言われます。</p>
          <p><strong>5. 喫煙</strong><br />アイコスを吸います（気にされる方や短い時間の予約の方の前では吸いません）。</p>
          <p><strong>6. 好きな言葉</strong><br />高くジャンプするには一度深くしゃがまなければならない。</p>
          <p><strong>7. 好きなブランド</strong><br />ルイヴィトン、Diorなど。</p>
          <p><strong>8. 好きな音楽</strong><br />あまり聞かないが、たまにJPOPを聞きます。</p>
          <p><strong>9. 好きな本</strong><br />山田悠介さんの本やジャンプコミックスなど。</p>
          <p><strong>10. 好きな映画</strong><br />スターウォーズ、バックトゥザフューチャー、グランドイリュージョンなど。</p>
          <p><strong>11. 好きな食べ物</strong><br />カレー、ハンバーグ、焼肉、寿司など。</p>
          <p><strong>12. 出勤スケジュール</strong><br />朝〜夜まで。事前連絡で夜中対応も可（LINE・X・店頭にて相談可）。</p>
          <p><strong>13. S or M</strong><br />ソフトS（普段とギャップがあるらしいです）。</p>
          <p><strong>14. 自己PR</strong><br />セラピスト歴6年目。緊張や悩みに寄り添い、非日常をお届けします。ご相談だけでも歓迎。</p>
        </div>
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
        ["3P（女性二人〇、セラピスト2人×）", "〇 / ×"],
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


◆ この業界に入ったきっかけは？
元々、自分は奉仕型のSで、
女性が気持ち良くなってくれてるのが好きだったので
『自分って好きだけど上手いのかな？まだまだなのかな？』
と思ったのはきっかけでもあります。

◆ なぜストロベリーボーイズを選んだのですか？
他のお店にも面接の応募を出していたのですが、
応募した時のうちのお店の対応が段違いに良かったのと、
面接時のオーナーの親身になってくれる姿、人柄で決めました。
（トワという名前は面接時にオーナーが一緒に考えてくれました）

◆ 新規のお客様に気を付けている事はありますか？
利用しようと思った理由は人それぞれ違いますし、
吐きそうなくらい緊張したという方もいらっしゃいます。
なので、お客様の利用目的や緊張度、
お会いした際のテンションなど
なるべく歩幅を合わせて、お話やカウンセリングをしよう。
まずは慣れてもらおう。安心して貰おう。
と心がけています。

◆ 本指名の方に気を付けている事はありますか？
一度お会いしたお客様なら初めてよりは性格や身体の事も分かっているので、
【性感】の事なら1回目よりも2回目は気持ちよくレベルアップさせたいなと思いますし、
前回会った時よりも楽しく過ごしたい！仲良くなりたい！と思ってます。
ただ【親しき中にも礼儀あり】と言うように
失礼はないようにしたいなと思います。

◆ 女性の何処にドキッとする？
ギャップには弱いかもしれません。

◆ ストロベリーボーイズの店名を替えるなら何にしますか？
1年5組斎藤ボーイズ（店長名拝借）

◆ ライバルはいますか？その理由は？
この仕事においてライバルは作らないです。
やっぱり人と比べてしまう事もありますし、
凄いなと思う事はありますが、
自分は自分の仕事をしようと常に心がけてます。

◆ 斎藤店長をどう思いますか？
夜中12時過ぎに
「トワー！忙しくて斎藤死にそうだよー」
「2秒だけ電話できる？」
と電話かけて来るので若干萌えますが、
たまに『彼女かっ！』と思いますw

◆ カラオケの十八番は？
最近歌ってないから十八番と言えるか分からないのですが、
UVERworldのシャムロックはよく歌ってました。

◆ あなたの前世は何ですか？
本当に前世を占える人に占って貰ったことがあるのですが、
『来世は人と仲良くなれる性格になりたい！』
と強く願っていたドイツ人の女性だったらしいです。
性格を聞いたら自分と結構似ていてビックリしました。

◆ 生まれ変わったら何になりたいですか？
とりあえず人間でありたいですね。
猫のように気楽に…という方もいますが、
やっぱり全生物の中で人の人生が1番楽しいと思いませんか？

◆ 1億円自由に使えるとしたら何をしますか？
物欲がほぼほぼないので、
ちょっとした欲しいものがあれば買って、
あとは資産運用に回したいと思います。

◆ 人生最後の日に何をしますか？
もしも今日来るなら、普通に仕事をして美味しいものを食べるくらいだと思います。
歳をとってからの人生最後な日なら、
結婚しておばあちゃんになった人と穏やかに過ごしたいなぁ。
（結婚出来てればの話ですがw）


    </div>
  );
};

export default CastInfoTab;
