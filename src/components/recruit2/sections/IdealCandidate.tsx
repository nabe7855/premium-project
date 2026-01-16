import { motion } from 'framer-motion';
import {
  BookOpen,
  Dumbbell,
  Handshake,
  HeartHandshake,
  Library,
  LucideIcon,
  Mail,
  Sparkles,
  ThumbsUp,
  UserCheck,
  Users,
} from 'lucide-react';
import React from 'react';

interface ProfileItem {
  id: string;
  title: string;
  Icon: LucideIcon;
}

const IdealCandidate: React.FC = () => {
  const profiles: ProfileItem[] = [
    { id: '01', title: '未経験者大歓迎', Icon: BookOpen },
    { id: '02', title: '20〜40歳', Icon: Users },
    { id: '03', title: '連絡の返信が早い方', Icon: Mail },
    { id: '04', title: '学ぼうとする意欲がある方', Icon: Library },
    { id: '05', title: '親しみやすい雰囲気の方', Icon: Handshake },
    { id: '06', title: 'メンタルが強い方', Icon: Dumbbell },
    { id: '07', title: '相手の気持ちを汲みとる事ができる方', Icon: HeartHandshake },
    { id: '08', title: '常に清潔感に配慮できる方', Icon: Sparkles },
    { id: '09', title: '自分のプライドを折れる方', Icon: UserCheck },
    { id: '10', title: '約束を守れる方', Icon: ThumbsUp },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0B1120] py-24 text-white">
      {/* Background Decor - Gold Glows */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-64 -mt-64 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[150px]"></div>
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-64 -ml-64 h-[600px] w-[600px] rounded-full bg-amber-600/10 blur-[150px]"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-20 text-center">
            <div className="mb-3 font-serif text-lg italic tracking-widest text-[#D4AF37]">
              Profile
            </div>
            <h3 className="font-serif text-4xl font-bold tracking-tighter text-white drop-shadow-lg md:text-5xl">
              求める<span className="text-[#D4AF37]">人物像</span>
            </h3>
          </div>

          {/* Grid Section */}
          <div className="mx-auto flex w-full max-w-[340px] flex-col gap-y-12 px-4 md:grid md:max-w-none md:grid-cols-5 md:gap-x-10 md:gap-y-16 md:p-0">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index % 2 === 0 ? 0 : 0.2 }}
                className={`group flex flex-col items-center md:mx-0 md:w-auto ${
                  index % 2 === 0 ? 'mr-auto' : 'ml-auto'
                }`}
              >
                <div className="relative mb-6">
                  {/* Number Label */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-center font-serif text-[#D4AF37]/80">
                    <div className="text-[10px] uppercase tracking-widest opacity-70">PROFILE</div>
                    <div className="text-2xl font-bold leading-none">{profile.id}</div>
                  </div>

                  {/* Icon Container with Gold Gradient for High Visibility */}
                  <div className="relative mt-2 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_rgba(251,191,36,0.5)] md:h-24 md:w-24">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-50"></div>

                    {/* Icon */}
                    <profile.Icon
                      className="relative z-10 h-10 w-10 text-slate-900 drop-shadow-sm transition-all duration-500 group-hover:scale-110 md:h-12 md:w-12"
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Text Description */}
                <div className="px-1 text-center">
                  <p className="flex min-h-[3em] items-center justify-center text-sm font-bold leading-relaxed text-slate-300 transition-colors duration-300 group-hover:text-white md:text-base">
                    {profile.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Message Box */}
          <div className="mt-24 text-center">
            <div className="relative inline-flex items-center gap-6 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-slate-900/80 to-slate-800/80 px-8 py-8 shadow-2xl backdrop-blur-sm md:px-12">
              <div className="absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-[#D4AF37]"></div>
              <div className="absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-[#D4AF37]"></div>

              <span className="text-3xl text-[#D4AF37]">✨</span>
              <p className="text-left text-sm font-medium leading-loose text-slate-300 md:text-base">
                <span className="font-bold text-white">「今の自分」</span>
                が完璧である必要はありません。
                <br className="hidden md:block" />
                誠実に自分と向き合い、約束を守れる方であれば、私たちが全力で育て上げます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdealCandidate;
