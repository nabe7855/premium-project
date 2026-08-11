import { Camera, MessageCircle, Send, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    civilStatus: '',
    livingStyle: '',
    occupation: '',
    holiday: '',
    location: '',
    station: '',
    commuteStyle: '',
    carUsage: '',
    industryUnderstanding: '',
    kikkake: '',
    customerExperience: '',
    therapistCareer: '',
    workLocation: '',
    interpersonalSkills: '',
    interestReason: '',
    selfImprovement: '',
    vision: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      'エントリーをお預かりしました。1次選考を通過した方にのみ、担当者からご連絡差し上げます。',
    );
  };

  return (
    <div className="container relative z-10 mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-sm font-bold uppercase italic tracking-widest text-amber-500">
            Exclusive Entry
          </h2>
          <p className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-5xl">
            選考エントリー
          </p>
          <div className="mx-auto mb-8 h-1 w-20 bg-amber-500"></div>
          <p className="text-sm leading-relaxed text-slate-500 md:text-base">
            私たちのビジョンに共感いただける方のエントリーをお待ちしています。
            <br />
            1次選考（書類・写真審査）通過の方にのみ、面談のご案内をメールにて差し上げます。
          </p>
        </div>

        <div className="rounded-[50px] border border-slate-50 bg-white p-8 shadow-2xl md:p-14">
          <div className="mb-14 flex flex-col gap-4 md:flex-row">
            <a
              href="https://line.me"
              className="flex flex-1 items-center justify-center rounded-2xl bg-[#06C755] p-5 font-bold text-white transition-all hover:shadow-lg active:scale-95"
            >
              <MessageCircle className="mr-3" /> LINEでクイック選考
            </a>
            <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center text-sm font-medium italic text-slate-400">
              電話での受付は行っておりません
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <FormSection title="Personal Information">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <Input
                  label="氏名（フルネーム）"
                  value={formData.name}
                  onChange={(v) => setFormData({ ...formData, name: v })}
                  required
                />
                <Input
                  label="メールアドレス (Gmail/Yahoo推奨)"
                  value={formData.email}
                  onChange={(v) => setFormData({ ...formData, email: v })}
                  required
                />
                <Input
                  label="携帯電話番号"
                  value={formData.phone}
                  onChange={(v) => setFormData({ ...formData, phone: v })}
                  required
                />
                <Input
                  label="年齢"
                  type="number"
                  value={formData.age}
                  onChange={(v) => setFormData({ ...formData, age: v })}
                  required
                />
                <Input
                  label="身長 / 体重"
                  placeholder="例: 175cm / 68kg"
                  value={`${formData.height} / ${formData.weight}`}
                  onChange={(v) => {
                    const parts = v.split('/');
                    setFormData({
                      ...formData,
                      height: parts[0]?.trim(),
                      weight: parts[1]?.trim(),
                    });
                  }}
                />
                <Input
                  label="既婚 / 未婚 / その他"
                  value={formData.civilStatus}
                  onChange={(v) => setFormData({ ...formData, civilStatus: v })}
                />
              </div>
            </FormSection>

            <FormSection title="Lifestyle & Career">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <Input
                  label="居住エリア"
                  placeholder="例: 福岡市中央区"
                  value={formData.location}
                  onChange={(v) => setFormData({ ...formData, location: v })}
                />
                <Input
                  label="最寄駅 / 路線"
                  value={formData.station}
                  onChange={(v) => setFormData({ ...formData, station: v })}
                />
                <Input
                  label="現職の業種"
                  value={formData.occupation}
                  onChange={(v) => setFormData({ ...formData, occupation: v })}
                />
                <Input
                  label="稼働可能な曜日・時間帯"
                  value={formData.holiday}
                  onChange={(v) => setFormData({ ...formData, holiday: v })}
                />
                <Input
                  label="通勤・移動手段 (車/電車など)"
                  value={formData.commuteStyle}
                  onChange={(v) => setFormData({ ...formData, commuteStyle: v })}
                />
                <Input
                  label="自家用車の業務使用可否"
                  value={formData.carUsage}
                  onChange={(v) => setFormData({ ...formData, carUsage: v })}
                />
              </div>
            </FormSection>

            <FormSection title="Qualifications & Vision">
              <div className="space-y-6">
                <Textarea
                  label="「女性用風俗」という業界に対し、どのような認識・理解をお持ちですか？"
                  value={formData.industryUnderstanding}
                  onChange={(v) => setFormData({ ...formData, industryUnderstanding: v })}
                />
                <Textarea
                  label="過去、女性向けの接客業（ホスト・バー・リラク等）のご経験はありますか？"
                  value={formData.customerExperience}
                  onChange={(val) => setFormData({ ...formData, customerExperience: val })}
                />
                <Textarea
                  label="セラピストとしてのキャリアがあれば、詳細（店名・期間等）を教えてください。"
                  value={formData.therapistCareer}
                  onChange={(val) => setFormData({ ...formData, therapistCareer: val })}
                />
                <Textarea
                  label="異性とのコミュニケーションにおいて、自身が最も評価されているポイントは何ですか？"
                  value={formData.interpersonalSkills}
                  onChange={(val) => setFormData({ ...formData, interpersonalSkills: val })}
                />
                <Textarea
                  label="日頃、魅力的な自分であるために取り組んでいること（外見・内面・健康）はありますか？"
                  value={formData.selfImprovement}
                  onChange={(val) => setFormData({ ...formData, selfImprovement: val })}
                />
                <Textarea
                  label="エントリーの動機と、当店でどのようなセラピストを目指したいか詳しくお聞かせください。"
                  value={formData.vision}
                  onChange={(val) => setFormData({ ...formData, vision: val })}
                  rows={6}
                />
              </div>
            </FormSection>

            <FormSection title="Verification Materials">
              <div className="grid grid-cols-1 gap-8 rounded-3xl border border-slate-100 bg-slate-50 p-8 md:grid-cols-2">
                <PhotoUpload
                  label="Face Profile"
                  desc="胸より上の、現在の表情が鮮明にわかるもの。"
                  subDesc="※加工、マスク、過去の写真は選考対象外となります。"
                />
                <PhotoUpload
                  label="Full Body"
                  desc="全体のシルエットや雰囲気が確認できるもの。"
                  subDesc="※スタイルの良さやファッションセンスも評価対象です。"
                />
              </div>
              {/* Fixed: Changed </Section> to </FormSection> */}
            </FormSection>

            <div className="rounded-3xl border border-white/5 bg-slate-900 p-8 text-[11px] leading-relaxed text-slate-400 shadow-inner">
              <div className="mb-3 flex items-center text-amber-500">
                <ShieldCheck size={16} className="mr-2" />
                <span className="font-bold uppercase tracking-widest">Notice to Candidates</span>
              </div>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  キャリアメール（キャリア固有ドメイン）は、システム上受信できない場合がございます。Gmail/Yahooメールをご利用ください。
                </li>
                <li>
                  エントリー内容は細部まで拝見いたします。空白が目立つ場合は審査対象外となる場合がございます。
                </li>
                <li>
                  面談の際は、当店のコンセプトを深く理解された上でお越しください。ミスマッチと判断した場合はその場で終了させていただく場合があります。
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="group flex w-full items-center justify-center rounded-2xl bg-amber-500 py-6 text-xl font-bold text-white shadow-xl shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-95"
            >
              エントリー内容を確認する
              <Send size={24} className="ml-3 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <h4 className="shrink-0 text-sm font-bold uppercase tracking-widest text-slate-900">
        {title}
      </h4>
      <div className="h-px flex-grow bg-slate-100"></div>
    </div>
    {children}
  </div>
);

const Input: React.FC<{
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, type = 'text', placeholder, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">
      {label}
    </label>
    <input
      type={type}
      className="w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-amber-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Textarea: React.FC<{
  label: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, placeholder, rows = 3, value, onChange }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold uppercase leading-relaxed tracking-widest text-slate-500">
      {label}
    </label>
    <textarea
      rows={rows}
      className="w-full resize-none rounded-xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-amber-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  </div>
);

const PhotoUpload: React.FC<{ label: string; desc: string; subDesc: string }> = ({
  label,
  desc,
  subDesc,
}) => (
  <div className="space-y-4">
    <label className="block text-sm font-bold uppercase tracking-widest text-slate-800">
      {label}
    </label>
    <div className="space-y-1">
      <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
      <p className="text-[10px] italic text-slate-400">{subDesc}</p>
    </div>
    <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 p-8 transition-all hover:border-amber-400 hover:bg-white">
      <Camera
        className="mb-3 text-slate-300 transition-colors group-hover:text-amber-500"
        size={36}
      />
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Select Image
      </span>
    </div>
  </div>
);

export default ApplicationForm;
