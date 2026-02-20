import { EditableImage } from '@/components/admin/EditableImage';
import React, { useState } from 'react';

interface RoutineSegment {
  start: number;
  end: number;
  label: string;
  color: string;
  type: 'work' | 'break' | 'sleep' | 'personal';
}

interface CastProfile {
  id: string;
  name: string;
  income: string;
  lifestyle: string;
  routine: RoutineSegment[];
}

interface IncomeProps {
  config?: {
    isVisible?: boolean;
    sectionHeader?: string;
    mainHeading?: string;
    description?: string;
    profileImage?: string;
    tipText?: string;
    profiles?: CastProfile[];
  };
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  onImageUpload?: (section: string, key: string, file: File) => void;
}

const Income: React.FC<IncomeProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const DEFAULT_PROFILES: CastProfile[] = [
    {
      id: 'side',
      name: '副業（週2会社員）',
      income: '月収 25万円〜',
      lifestyle: '平日の夜や休日を有効活用。本業の収入にプラスして、ゆとりのある生活を。',
      routine: [
        { start: 0, end: 8, label: '睡眠', color: '#1e293b', type: 'sleep' },
        { start: 8, end: 18, label: '本業勤務', color: '#334155', type: 'personal' },
        { start: 18, end: 19, label: '移動・準備', color: '#475569', type: 'break' },
        { start: 19, end: 23, label: '施術（2件）', color: '#d97706', type: 'work' },
        { start: 23, end: 24, label: '帰宅・リラックス', color: '#1e293b', type: 'personal' },
      ],
    },
    {
      id: 'novice',
      name: '未経験新人（専業）',
      income: '月収 45万円〜',
      lifestyle: 'まずは研修を兼ねて無理のないシフトから。3ヶ月で一生モノのスキルを習得。',
      routine: [
        { start: 0, end: 9, label: '睡眠', color: '#1e293b', type: 'sleep' },
        { start: 9, end: 11, label: '自己研鑽', color: '#475569', type: 'personal' },
        { start: 11, end: 12, label: '出勤準備', color: '#475569', type: 'break' },
        { start: 12, end: 18, label: '施術・講習', color: '#b45309', type: 'work' },
        { start: 18, end: 24, label: 'プライベート', color: '#1e293b', type: 'personal' },
      ],
    },
    {
      id: 'regular',
      name: '中堅セラピスト',
      income: '月収 85万円〜',
      lifestyle: 'リピーター様も増え、安定した高収入。趣味や自己投資にも時間を割ける。',
      routine: [
        { start: 0, end: 9, label: '睡眠', color: '#1e293b', type: 'sleep' },
        { start: 9, end: 12, label: '趣味・ジム', color: '#334155', type: 'personal' },
        { start: 12, end: 13, label: '出勤準備', color: '#475569', type: 'break' },
        { start: 13, end: 20, label: '施術（3~4件）', color: '#92400e', type: 'work' },
        { start: 20, end: 24, label: 'ゆとりの時間', color: '#1e293b', type: 'personal' },
      ],
    },
    {
      id: 'top',
      name: 'トップセラピスト',
      income: '月収 300万円超',
      lifestyle: 'プロとしての誇りを持ち、圧倒的な支持を獲得。人生を劇的に変えるステージ。',
      routine: [
        { start: 0, end: 6, label: '睡眠・泊まり', color: '#1e293b', type: 'sleep' },
        { start: 6, end: 10, label: '朝のルーティン', color: '#334155', type: 'personal' },
        { start: 10, end: 13, label: '1件目施術', color: '#d97706', type: 'work' },
        { start: 13, end: 14, label: '休憩・SNS更新', color: '#475569', type: 'break' },
        { start: 14, end: 17, label: '2件目施術', color: '#b45309', type: 'work' },
        { start: 17, end: 18, label: '休憩・ブログ', color: '#475569', type: 'break' },
        { start: 18, end: 21, label: '3件目施術', color: '#92400e', type: 'work' },
        { start: 21, end: 24, label: 'リラックス', color: '#1e293b', type: 'personal' },
      ],
    },
  ];

  const profiles = config?.profiles || DEFAULT_PROFILES;
  const [activeProfileId, setActiveProfileId] = useState<string>(profiles[0].id);
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const activeProfileIndex = profiles.findIndex((p) => p.id === activeProfileId);

  const describeArc = (startHour: number, endHour: number) => {
    const startAngle = (startHour / 24) * 360 - 90;
    const endAngle = (endHour / 24) * 360 - 90;

    const startRad = (Math.PI * startAngle) / 180;
    const endRad = (Math.PI * endAngle) / 180;

    const x1 = 150 + 100 * Math.cos(startRad);
    const y1 = 150 + 100 * Math.sin(startRad);
    const x2 = 150 + 100 * Math.cos(endRad);
    const y2 = 150 + 100 * Math.sin(endRad);

    const largeArcFlag = endHour - startHour <= 12 ? '0' : '1';

    return `M 150 150 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const handleUpdateProfile = (field: keyof CastProfile, value: string) => {
    if (!onUpdate) return;
    const newProfiles = [...profiles];
    newProfiles[activeProfileIndex] = { ...activeProfile, [field]: value };
    onUpdate('profiles', newProfiles);
  };

  const handleUpdateRoutine = (routineIndex: number, field: keyof RoutineSegment, value: any) => {
    if (!onUpdate) return;
    const newProfiles = [...profiles];
    const newRoutine = [...activeProfile.routine];
    newRoutine[routineIndex] = { ...newRoutine[routineIndex], [field]: value };
    newProfiles[activeProfileIndex] = { ...activeProfile, routine: newRoutine };
    onUpdate('profiles', newProfiles);
  };

  return (
    <section className="overflow-hidden bg-slate-950 py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2
            className="mb-4 text-sm font-bold uppercase tracking-widest text-amber-600 outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('sectionHeader', e.currentTarget.innerText)}
          >
            {config?.sectionHeader || 'Therapist Lifestyle'}
          </h2>
          <h3
            className="mb-6 font-serif text-3xl font-bold outline-none md:text-5xl"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('mainHeading', e.currentTarget.innerText)}
          >
            {config?.mainHeading || '「なりたい自分」を叶える1日'}
          </h3>
          <p
            className="mx-auto max-w-2xl text-lg text-slate-400 outline-none"
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('description', e.currentTarget.innerText)}
          >
            {config?.description ||
              '単なる仕事ではありません。理想のライフスタイルを実現するためのルーチン。 あなたのステージに合わせた、リアルなシミュレーションをご覧ください。'}
          </p>
        </div>

        <div className="mb-16 flex flex-wrap justify-center gap-3">
          {profiles.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProfileId(p.id)}
              className={`relative rounded-full border px-6 py-3 font-bold transition-all ${
                activeProfileId === p.id
                  ? 'border-amber-600 bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => {
                  const newProfiles = [...profiles];
                  newProfiles[idx].name = e.currentTarget.innerText;
                  onUpdate?.('profiles', newProfiles);
                }}
                className="outline-none"
              >
                {p.name}
              </span>
            </button>
          ))}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left Column: Image & Circular Visualizer */}
          <div className="space-y-12">
            <div className="relative aspect-square w-full overflow-hidden rounded-[3rem] shadow-2xl">
              <EditableImage
                isEditing={isEditing}
                src={
                  config?.profileImage ||
                  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop'
                }
                alt="Profile"
                onUpload={(file) => onImageUpload?.('income', 'profileImage', file)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h4 className="font-serif text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                  Salary
                </h4>
              </div>
            </div>

            <div className="group relative duration-700 animate-in fade-in zoom-in">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-amber-500/10 blur-[100px]"></div>
              <svg
                viewBox="0 0 300 300"
                className="mx-auto w-full max-w-[400px] brightness-110 drop-shadow-2xl filter"
              >
                <circle
                  cx="150"
                  cy="150"
                  r="110"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="1"
                />
                {activeProfile.routine.map((segment, idx) => (
                  <path
                    key={`${activeProfile.id}-${idx}`}
                    d={describeArc(segment.start, segment.end)}
                    fill={segment.color}
                    className="origin-center transition-all duration-1000 ease-in-out hover:scale-[1.02] hover:brightness-125"
                    stroke="#020617"
                    strokeWidth="0.5"
                  />
                ))}
                {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
                  const angle = (hour / 24) * 360 - 90;
                  const rad = (Math.PI * angle) / 180;
                  const tx = 150 + 125 * Math.cos(rad);
                  const ty = 150 + 125 * Math.sin(rad);
                  return (
                    <text
                      key={hour}
                      x={tx}
                      y={ty}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-mono"
                    >
                      {hour}
                    </text>
                  );
                })}
                <circle cx="150" cy="150" r="35" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
                <g transform="translate(132, 132) scale(1.5)">
                  <path
                    d="M12 2C10 2 8 3.5 8 5.5C8 6.1 8.2 6.6 8.5 7.1C6.2 8.3 4 10.9 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10.9 17.8 8.3 15.5 7.1C15.8 6.6 16 6.1 16 5.5C16 3.5 14 2 12 2Z"
                    fill="#d97706"
                    opacity="0.8"
                  />
                </g>
              </svg>
            </div>
          </div>

          {/* Right Column: Details Section */}
          <div className="space-y-8 duration-700 animate-in slide-in-from-right">
            <div className="relative overflow-hidden rounded-[3rem] border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
              <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl"></div>

              <div className="mb-6 inline-block rounded-full border border-amber-600/30 bg-amber-600/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-amber-500">
                Estimated Result
              </div>

              <div className="mb-8">
                <div className="mb-2 text-sm font-bold text-slate-400">想定報酬</div>
                <div
                  className="inline-block font-serif text-4xl font-bold tracking-tight text-amber-500 outline-none transition-all sm:text-6xl"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleUpdateProfile('income', e.currentTarget.innerText)}
                >
                  {activeProfile.income}
                </div>
              </div>

              <div className="mb-10">
                <div className="mb-3 text-sm font-bold text-slate-400">ライフスタイル</div>
                <div className="flex text-lg italic leading-relaxed text-slate-200">
                  <span>「</span>
                  <p
                    className="outline-none"
                    contentEditable={isEditing}
                    suppressContentEditableWarning={isEditing}
                    onBlur={(e) => handleUpdateProfile('lifestyle', e.currentTarget.innerText)}
                  >
                    {activeProfile.lifestyle}
                  </p>
                  <span>」</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Routine Breakdown
                </div>
                {activeProfile.routine.map((s, idx) => (
                  <div key={idx} className="group flex items-center gap-4">
                    <div className="w-16 font-mono text-xs text-slate-500">{s.start}:00</div>
                    <div className="flex-grow">
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={`text-sm font-bold outline-none ${s.type === 'work' ? 'text-amber-500' : 'text-slate-300'}`}
                          contentEditable={isEditing}
                          suppressContentEditableWarning={isEditing}
                          onBlur={(e) =>
                            handleUpdateRoutine(idx, 'label', e.currentTarget.innerText)
                          }
                        >
                          {s.label}
                        </span>
                        <span className="text-[10px] text-slate-500">{s.end - s.start}h</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full transition-all duration-1000 ease-out"
                          style={{
                            width: activeProfile.id ? `${((s.end - s.start) / 24) * 100}%` : '0%',
                            backgroundColor: s.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 rounded-3xl border border-slate-800 bg-slate-900/30 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-600/20 text-2xl">
                💡
              </div>
              <p
                className="text-sm leading-relaxed text-slate-400 outline-none"
                contentEditable={isEditing}
                suppressContentEditableWarning={isEditing}
                onBlur={(e) => onUpdate?.('tipText', e.currentTarget.innerText)}
              >
                {config?.tipText ||
                  '※これらは実際のキャストの実績に基づくモデルケースです。ご自身の体調やライフスタイルに合わせて、自由にシフトを調整いただけます。'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Income;
