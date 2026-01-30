import React from 'react';

export const SevenReasons: React.FC = () => {
  const reasons = [
    {
      title: '業界初！200件以上の受付口コミ！',
      desc: '透明性を重視し、お店の雰囲気を感じてもらうためHP内に受付口コミ欄をご用意。皆様の声が200件以上投稿されており、利用の参考にしていただけます。',
    },
    {
      title: '業界一の受付対応を目指しています！',
      desc: '予約だけでなく、悩み事やご相談など、ご予約に関係のないお問い合わせでも構いません。ハートフルで丁寧な対応をスタッフ一同一人一人に提供します。',
    },
    {
      title: '大手プロ出身セラピスト多数在籍！',
      desc: '各ジャンルの元プロダクション出身者や、社会経験が豊富な男性を厳選採用。教育においてもお客様の満足度を第一に考え、業界最高レベルの人選を徹底しています。',
    },
    {
      title: '業界熟練の講師による確かな人材育成！',
      desc: '風俗業界で10年以上の経験豊富な専属講師がマンツーマンで指導。一般的な素人男性のレベルを超えた、プロならではの高品質なサービスをお約束します。',
    },
    {
      title: '安心と安定、直営店での全国展開！',
      desc: 'フランチャイズとは違い、全国展開している店舗は全て営業歴6年以上の東京本店にて直接運営に携わったスタッフが管理。どの地域でも安定のおもてなしを提供します。',
    },
    {
      title: '定期的な性病検査の義務付け！',
      desc: '「さくら検査研究所」様とのパートナーシップ契約を結んでおり、全てのセラピストに定期的な性病検査を徹底しています。心ゆくまで安心してお楽しみください！',
    },
    {
      title: '7年以上の運営実績は信頼の証！',
      desc: '急速に成長する業界で、1年未満で姿を消す店舗も珍しくありません。当店は皆様の支持を受け、7年以上にわたり大勢の皆様の女風デビューをサポートし続けています。',
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <p className="mb-2 font-bold tracking-widest text-[#FF4B5C]">WHY CHOOSE US</p>
          <h2 className="text-2xl font-bold md:text-3xl">
            SBグループが初めての女風に選ばれる
            <br className="md:hidden" /> <span className="text-[#FF4B5C]">7つの理由</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-colors hover:border-[#FF4B5C]/30"
            >
              <div className="flex-shrink-0 text-xl">✅</div>
              <div>
                <h3 className="mb-2 font-bold leading-tight text-gray-800">{r.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
