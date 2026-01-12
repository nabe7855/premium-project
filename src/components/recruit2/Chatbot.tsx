
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
  photos?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 
  | 'name' | 'phone' | 'email' | 'birthday' 
  | 'height' | 'weight' | 'job' | 'homeArea' 
  | 'workArea' | 'motivation' | 'freeText' | 'photos' | 'source' | 'review' | 'done';

// Birthday options
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 66 }, (_, i) => `${currentYear - 18 - i}`); // 18 years ago back to ~1940
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

// Height options
const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => `${i + 140}`); // 140cm to 210cm

const STEP_OPTIONS: Partial<Record<Step, string[]>> = {
  weight: ['60kg以下', '61-70kg', '71-80kg', '81kg以上'],
  job: ['会社員', '自営業', '学生', 'フリーター', 'その他'],
  homeArea: ['福岡市中央区', '福岡市博多区', '福岡市他区', '北九州・筑豊', '筑後', '佐賀・熊本', 'その他'],
  workArea: ['天神・大名', '博多・中洲', '福岡市内他', '特にこだわらない'],
  motivation: ['高収入を得たい', '自分を変えたい', '副業として働きたい', '自由な時間が欲しい'],
  source: ['Instagram / X', 'ネット検索', '求人サイト', '知人の紹介', 'その他'],
};

const STEP_LABELS: Record<string, string> = {
  name: 'お名前',
  phone: '電話番号',
  email: 'メールアドレス',
  birthday: '生年月日',
  height: '身長',
  weight: '体重',
  job: '現在のご職業',
  homeArea: 'お住まい',
  workArea: '希望エリア',
  motivation: '応募動機',
  freeText: '自己PR・意気込み',
  source: '応募のきっかけ',
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'はじめまして。Life Change Recruit 福岡 採用担当アシスタントです。あなたの「人生を変える一歩」をサポートさせていただきます。\n\nまずは【お名前】を教えていただけますか？' }
  ]);
  const [input, setInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const yearPickerRef = useRef<HTMLDivElement>(null);
  const monthPickerRef = useRef<HTMLDivElement>(null);
  const dayPickerRef = useRef<HTMLDivElement>(null);
  const heightPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentStep === 'birthday') {
      if (yearPickerRef.current) yearPickerRef.current.scrollTo({ top: (currentYear - 1995 - 18) * 40 });
      if (monthPickerRef.current) monthPickerRef.current.scrollTo({ top: 0 });
      if (dayPickerRef.current) dayPickerRef.current.scrollTo({ top: 0 });
    }
    if (currentStep === 'height' && heightPickerRef.current) {
      // Default to 170cm (index 30)
      heightPickerRef.current.scrollTo({ top: 30 * 40 });
    }
  }, [currentStep]);

  const addModelMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'model', text }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (textOverride?: string) => {
    if (currentStep === 'photos' && !textOverride) {
      if (photos.length === 0) {
        addModelMessage('写真は必須となります。1枚以上選択してください。');
        return;
      }
      const userMsg: Message = { role: 'user', text: `${photos.length}枚の写真を送信しました`, photos: [...photos] };
      setMessages(prev => [...prev, userMsg]);
      setUserPhotos([...photos]);
      setPhotos([]);
      processStep('photos_sent');
      return;
    }

    const finalInput = textOverride || input;
    if (!finalInput.trim()) return;

    const userMsg: Message = { role: 'user', text: finalInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    processStep(finalInput);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processStep = (userInput: string) => {
    if (isEditing) {
      updateFormData(currentStep, userInput);
      setIsEditing(false);
      setCurrentStep('review');
      addModelMessage('内容を更新しました。他に修正したい項目はありますか？');
      return;
    }

    switch (currentStep) {
      case 'name':
        updateFormData('name', userInput);
        addModelMessage(`${userInput}様、ありがとうございます。次に【電話番号】を教えてください。`);
        setCurrentStep('phone');
        break;
      case 'phone':
        updateFormData('phone', userInput);
        addModelMessage('ありがとうございます。次に【メールアドレス】をお願いします。');
        setCurrentStep('email');
        break;
      case 'email':
        updateFormData('email', userInput);
        addModelMessage('ありがとうございます。次に【生年月日】をスクロールして選択してください。');
        setCurrentStep('birthday');
        break;
      case 'birthday':
        updateFormData('birthday', userInput);
        addModelMessage('ありがとうございます。次に正確な【身長】をスクロールして教えてください。\n※当店では、身長165cm以上の方を募集対象としております。');
        setCurrentStep('height');
        break;
      case 'height':
        updateFormData('height', userInput);
        const heightVal = parseInt(userInput.replace('cm', ''));
        if (heightVal < 165) {
          addModelMessage('大変恐縮ながら、当店では現在身長165cm以上の方を募集対象とさせていただいております。せっかくご応募いただいたところ、誠に申し訳ございませんが、今回は採用を見送らせていただきます。');
          setCurrentStep('done');
        } else {
          addModelMessage('ありがとうございます。次に【体重（kg）】を教えてください。');
          setCurrentStep('weight');
        }
        break;
      case 'weight':
        updateFormData('weight', userInput);
        addModelMessage('ありがとうございます。【現在のご職業】を教えてください。');
        setCurrentStep('job');
        break;
      case 'job':
        updateFormData('job', userInput);
        addModelMessage('ありがとうございます。【お住まいのエリア】を教えてください。');
        setCurrentStep('homeArea');
        break;
      case 'homeArea':
        updateFormData('homeArea', userInput);
        addModelMessage('ありがとうございます。【希望勤務エリア】があれば教えてください。');
        setCurrentStep('workArea');
        break;
      case 'workArea':
        updateFormData('workArea', userInput);
        addModelMessage('ありがとうございます。一番近い【応募動機】を選択してください。');
        setCurrentStep('motivation');
        break;
      case 'motivation':
        updateFormData('motivation', userInput);
        addModelMessage('ありがとうございます！追加で【自己PRや意気込み】など、自由にメッセージをいただけますか？');
        setCurrentStep('freeText');
        break;
      case 'freeText':
        updateFormData('freeText', userInput);
        addModelMessage('ありがとうございます。最後に【顔写真】を最大4枚送ってください。\n※帽子・マスク・過度な加工はNGです。');
        setCurrentStep('photos');
        break;
      case 'photos':
        addModelMessage('ありがとうございます。最後に、当店を【どちらで知りましたか？】');
        setCurrentStep('source');
        break;
      case 'source':
        updateFormData('source', userInput);
        setCurrentStep('review');
        addModelMessage('ありがとうございます！入力いただいた内容をご確認ください。修正したい項目があれば「修正」ボタンを押してください。');
        break;
      case 'review':
        if (userInput === '送信する') {
          addModelMessage('すべての情報の入力ありがとうございました！\n担当者より24時間以内に折り返しご連絡させていただきます。本日はありがとうございました。');
          setCurrentStep('done');
        }
        break;
      default:
        break;
    }
  };

  const handleEdit = (field: Step) => {
    setIsEditing(true);
    setCurrentStep(field);
    const label = STEP_LABELS[field] || field;
    addModelMessage(`【${label}】を再入力してください。`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBirthdayConfirm = () => {
    if (!yearPickerRef.current || !monthPickerRef.current || !dayPickerRef.current) return;
    const yIdx = Math.round(yearPickerRef.current.scrollTop / 40);
    const mIdx = Math.round(monthPickerRef.current.scrollTop / 40);
    const dIdx = Math.round(dayPickerRef.current.scrollTop / 40);
    
    const year = YEAR_OPTIONS[yIdx];
    const month = MONTH_OPTIONS[mIdx].padStart(2, '0');
    const day = DAY_OPTIONS[dIdx].padStart(2, '0');
    
    handleSend(`${year}年${month}月${day}日`);
  };

  const handleHeightConfirm = () => {
    if (!heightPickerRef.current) return;
    const hIdx = Math.round(heightPickerRef.current.scrollTop / 40);
    const height = HEIGHT_OPTIONS[hIdx];
    handleSend(`${height}cm`);
  };

  if (!isOpen) return null;

  const currentOptions = STEP_OPTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">L</div>
          <div>
            <div className="text-white font-bold text-sm">Life Change Assistant</div>
            <div className="text-green-500 text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online Support
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              m.role === 'user' 
                ? 'bg-amber-600 text-white rounded-tr-none shadow-lg shadow-amber-900/20' 
                : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
              {m.photos && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {m.photos.map((p, pi) => (
                    <img key={pi} src={p} alt="uploaded" className="rounded-lg w-full aspect-square object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {currentStep === 'review' && !isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom-4">
            <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700 p-4 max-w-[90%] shadow-xl">
              <div className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-4">Application Summary</div>
              <div className="space-y-3">
                {Object.entries(STEP_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-start justify-between gap-4 border-b border-slate-700/50 pb-2">
                    <div className="flex-grow">
                      <div className="text-[10px] text-slate-400 font-bold mb-0.5">{label}</div>
                      <div className="text-sm">{formData[key] || '---'}</div>
                    </div>
                    <button 
                      onClick={() => handleEdit(key as Step)}
                      className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors mt-2"
                    >
                      修正
                    </button>
                  </div>
                ))}
                {userPhotos.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] text-slate-400 font-bold mb-1">顔写真</div>
                    <div className="flex gap-1 overflow-x-auto pb-2">
                      {userPhotos.map((p, i) => (
                        <img key={i} src={p} className="w-10 h-10 object-cover rounded border border-slate-700" alt="summary" />
                      ))}
                    </div>
                    <button 
                      onClick={() => { setIsEditing(true); setCurrentStep('photos'); addModelMessage('写真を再送してください。'); }}
                      className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
                    >
                      修正
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {photos.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <div key={i} className="relative shrink-0">
                <img src={p} className="w-16 h-16 rounded-lg object-cover border border-slate-700" alt="preview" />
                <button 
                  onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Smart Birthday Picker */}
        {currentStep === 'birthday' && !isTyping && (
          <div className="mb-6 animate-in slide-in-from-bottom-2">
            <div className="relative h-40 w-full max-w-md mx-auto flex gap-2 items-center justify-center px-4">
              <div className="absolute top-1/2 -translate-y-1/2 w-[90%] h-10 bg-amber-500/20 border-y border-amber-500/40 pointer-events-none rounded-sm z-0"></div>
              
              <div className="flex-1 h-full flex flex-col items-center">
                <div className="text-[10px] text-amber-500 font-bold mb-1">YEAR</div>
                <div ref={yearPickerRef} className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="h-16"></div>
                  {YEAR_OPTIONS.map((y) => (
                    <div key={y} className="h-10 flex items-center justify-center snap-center text-lg font-bold text-white">{y}</div>
                  ))}
                  <div className="h-16"></div>
                </div>
              </div>

              <div className="flex-1 h-full flex flex-col items-center">
                <div className="text-[10px] text-amber-500 font-bold mb-1">MONTH</div>
                <div ref={monthPickerRef} className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="h-16"></div>
                  {MONTH_OPTIONS.map((m) => (
                    <div key={m} className="h-10 flex items-center justify-center snap-center text-lg font-bold text-white">{m}</div>
                  ))}
                  <div className="h-16"></div>
                </div>
              </div>

              <div className="flex-1 h-full flex flex-col items-center">
                <div className="text-[10px] text-amber-500 font-bold mb-1">DAY</div>
                <div ref={dayPickerRef} className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <div className="h-16"></div>
                  {DAY_OPTIONS.map((d) => (
                    <div key={d} className="h-10 flex items-center justify-center snap-center text-lg font-bold text-white">{d}</div>
                  ))}
                  <div className="h-16"></div>
                </div>
              </div>
            </div>
            <button onClick={handleBirthdayConfirm} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full font-bold shadow-lg transition-all active:scale-95">
              生年月日を決定する
            </button>
          </div>
        )}

        {/* Smart Height Picker */}
        {currentStep === 'height' && !isTyping && (
          <div className="mb-6 animate-in slide-in-from-bottom-2">
            <div className="relative h-40 w-full max-w-xs mx-auto flex flex-col items-center justify-center">
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-10 bg-amber-500/20 border-y border-amber-500/40 pointer-events-none rounded-sm"></div>
              <div 
                ref={heightPickerRef}
                className="w-full h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="h-16"></div>
                {HEIGHT_OPTIONS.map((h) => (
                  <div key={h} className="h-10 flex items-center justify-center snap-center text-xl font-bold text-white">
                    {h}<span className="text-xs ml-1 font-normal opacity-60">cm</span>
                  </div>
                ))}
                <div className="h-16"></div>
              </div>
            </div>
            <button onClick={handleHeightConfirm} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-full font-bold shadow-lg transition-all active:scale-95">
              身長を決定する
            </button>
          </div>
        )}

        {/* Option Buttons */}
        {currentOptions && !isTyping && (
          <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-bottom-2">
            {currentOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSend(opt)}
                className="bg-slate-800 hover:bg-amber-600 text-white text-xs sm:text-sm px-4 py-2 rounded-full border border-slate-700 transition-all active:scale-95 shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Review Action */}
        {currentStep === 'review' && !isTyping && (
          <div className="mb-4 animate-in slide-in-from-bottom-2">
            <button
              onClick={() => handleSend('送信する')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-amber-900/20 transition-all active:scale-95"
            >
              この内容で応募する
            </button>
          </div>
        )}
        
        {currentStep !== 'done' && currentStep !== 'review' && currentStep !== 'birthday' && currentStep !== 'height' ? (
          <div className="flex items-end gap-2 bg-slate-800 rounded-3xl p-2 pl-4 focus-within:ring-2 focus-within:ring-amber-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={currentStep === 'photos' ? "写真を選んで送信してください" : (currentStep === 'freeText' ? "あなたの想いを聞かせてください..." : "回答を入力...")}
              disabled={currentStep === 'photos'}
              rows={currentStep === 'freeText' ? 2 : 1}
              className="flex-grow bg-transparent border-none focus:ring-0 text-white text-sm py-2 max-h-32 overflow-y-auto disabled:opacity-50"
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/gif,image/jpeg,image/png" 
              multiple 
              onChange={handlePhotoUpload} 
            />
            {currentStep === 'photos' && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors"
              >
                📷
              </button>
            )}
            <button 
              onClick={() => handleSend()}
              disabled={(!input.trim() && photos.length === 0 && !currentOptions) || isTyping}
              className="w-10 h-10 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
            >
              {currentStep === 'photos' ? '⬆' : '✈'}
            </button>
          </div>
        ) : currentStep === 'done' && (
          <div className="text-center py-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-all active:scale-95"
            >
              閉じる
            </button>
          </div>
        )}
        
        <p className="text-[10px] text-slate-500 text-center mt-3">
          安心のプライバシー管理。お送りいただいた情報は厳重に保管されます。
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
