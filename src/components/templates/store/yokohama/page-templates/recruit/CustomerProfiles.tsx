import { Heart } from 'lucide-react';
import React from 'react';

const CustomerProfiles: React.FC = () => {
  const customerTypes = [
    {
      title: '新しい扉を開く、知的探究心ある方',
      desc: '未知の体験に対して慎重ながらも、質の高い癒やしを求めている方。誠実で知的なエスコートが求められます。',
    },
    {
      title: '日常の役割から解放されたい方',
      desc: '社会や家庭での責任を一時的に手放し、「自分自身」に戻る時間を求めている多忙な女性。深い受容の心が必要です。',
    },
    {
      title: '心身のトータルバランスを整えたい方',
      desc: '物理的な施術だけでなく、対話を通じた自己肯定感の向上や、感性の再発見を目的とする方が増えています。',
    },
    {
      title: '美意識と充足感を追求するプロフェッショナル',
      desc: '自身の幸福に妥協しない、自立した女性たち。高度な技術と、それに見合う人間性の深さが試されます。',
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-500">
            Our Mission
          </h2>
          <p className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-4xl">
            女性たちの<span className="text-amber-500">「真の充足」</span>に向き合う
          </p>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500 md:text-base">
            私たちが提供するのは、単なるサービスではありません。
            現代社会で多くの役割をこなす女性たちが、本来の自分を取り戻し、自信と輝きを再発見するための「聖域」です。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {customerTypes.map((type, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-amber-200"
            >
              <div className="mb-4 flex items-start">
                <div className="group mr-4 rounded-xl bg-slate-50 p-2">
                  <Heart className="h-6 w-6 text-amber-500 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-slate-800">{type.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{type.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[40px] border border-white/5 bg-slate-900 p-10 text-center shadow-2xl">
          <p className="mb-4 font-serif text-xl italic text-amber-500">
            “Recognition & Empowerment”
          </p>
          <p className="text-sm leading-relaxed text-slate-300 md:text-base">
            お客様が求めているのは、自身の存在を肯定される深い共感と、プロフェッショナルによる確かな技術です。
            <br className="hidden md:block" />
            このミッションに共鳴できる、品格あるセラピストを私たちは求めています。
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfiles;
