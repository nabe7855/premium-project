'use client';

import { submitRecruitApplication } from '@/actions/recruit';
import { resizeImage } from '@/lib/image-utils';
import { getAttributionData } from '@/lib/attribution';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
  photos?: string[];
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
}

type Step =
  | 'name'
  | 'phone'
  | 'email'
  | 'age'
  | 'height'
  | 'weight'
  | 'job'
  | 'homeArea'
  | 'workArea'
  | 'motivation'
  | 'freeText'
  | 'photos'
  | 'source'
  | 'datingApp'
  | 'tattoo'
  | 'appearance'
  | 'review'
  | 'done';

const AGE_OPTIONS = Array.from({ length: 46 }, (_, i) => `${i + 20}`);
const HEIGHT_OPTIONS = Array.from({ length: 71 }, (_, i) => `${i + 140}`);

const STEP_OPTIONS_FUKUOKA: Partial<Record<Step, string[]>> = {
  weight: ['60kg以下', '61-70kg', '71-80kg', '81kg以上'],
  job: ['会社員', '自業者', '学生', 'フリーター', 'その他'],
  homeArea: ['福岡市中央区', '福岡市博多区', '福岡市他区', '北九州・筑豊', '筑後', '佐賀・熊本', 'その他'],
  workArea: ['天神・大名', '博多・中洲', '福岡市内他', '特にこだわらない'],
  motivation: ['高収入を得たい', '自分を変えたい', '副業として働きたい', '自由な時間が欲しい'],
  source: ['Instagram / X', 'ネット検索', '求人サイト', '知人の紹介', 'その他'],
  datingApp: ['あり', '無し'],
  tattoo: ['あり', '無し'],
};

const STEP_OPTIONS_YOKOHAMA: Partial<Record<Step, string[]>> = {
  weight: ['60kg以下', '61-70kg', '71-80kg', '81kg以上'],
  job: ['会社員', '自営業', '学生', 'フリーター', 'その他'],
  homeArea: ['横浜市中区・西区', '横浜市青葉区・都筑区', '川崎市', '東京都内', '神奈川県その他', 'その他'],
  workArea: ['横浜・関内', '横浜・みなとみらい', '神奈川県内他', '特にこだわらない'],
  motivation: ['高収入を得たい', '自分を変えたい', '副業として働きたい', '自由な時間が欲しい'],
  source: ['Instagram / X', 'ネット検索', '求人サイト', '知人の紹介', 'その他'],
  datingApp: ['あり', '無し'],
  tattoo: ['あり', '無し'],
};

const getStepOptions = (storeName?: string): Partial<Record<Step, string[]>> => {
  if (storeName && storeName.includes('横浜')) return STEP_OPTIONS_YOKOHAMA;
  return STEP_OPTIONS_FUKUOKA;
};

const STEP_LABELS: Record<string, string> = {
  name: 'お名前',
  phone: '電話番号',
  email: 'メールアドレス',
  age: '年齢',
  height: '身長',
  weight: '体重',
  job: '現在のご職業',
  homeArea: 'お住まい',
  workArea: '希望エリア',
  motivation: '応募動機',
  freeText: '自己PR・意気込み',
  source: '応募のきっかけ',
  datingApp: '出会い系アプリ利用歴',
  tattoo: '刺青の有無',
  appearance: '容姿の懸念点',
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, storeName }) => {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `はじめまして。Life Change Recruit ${storeName || '福岡'} 採用担当アシスタントです。あなたの「人生を変える一歩」をサポートさせていただきます。\n\nまずは【お名前】を教えていただけますか？`,
    },
  ]);
  const [input, setInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const agePickerRef = useRef<HTMLDivElement>(null);
  const heightPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentStep === 'age' && agePickerRef.current) {
      agePickerRef.current.scrollTo({ top: 5 * 40 });
    }
    if (currentStep === 'height' && heightPickerRef.current) {
      heightPickerRef.current.scrollTo({ top: 30 * 40 });
    }
  }, [currentStep]);

  const addModelMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'model', text }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = (textOverride?: string) => {
    const finalInput = textOverride || input;
    if (currentStep === 'photos' && !textOverride) {
      if (photos.length === 0) {
        addModelMessage('写真は必須となります。1枚以上選択してください。');
        return;
      }
      const userMsg: Message = {
        role: 'user',
        text: `${photos.length}枚の写真を送信しました`,
        photos: [...photos],
      };
      setMessages((prev) => [...prev, userMsg]);
      setUserPhotos([...photos]);
      setPhotos([]);
      processStep('photos_sent');
      return;
    }

    if (!finalInput.trim()) return;
    const userMsg: Message = { role: 'user', text: finalInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    processStep(finalInput);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        addModelMessage('ありがとうございます。次に【年齢】をスクロールして選択してください。');
        setCurrentStep('age');
        break;
      case 'age':
        updateFormData('age', userInput);
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
        addModelMessage('ありがとうございます。【顔写真】を最大4枚送ってください。\n※帽子・マスク・過度な加工はNGです。');
        setCurrentStep('photos');
        break;
      case 'photos':
        addModelMessage('ありがとうございます。最後に当店を【どちらで知りましたか？】');
        setCurrentStep('source');
        break;
      case 'source':
        updateFormData('source', userInput);
        addModelMessage('ありがとうございます！出会い系アプリを利用したことがありますか？');
        setCurrentStep('datingApp');
        break;
      case 'datingApp':
        updateFormData('datingApp', userInput);
        addModelMessage('刺青はありますか？');
        setCurrentStep('tattoo');
        break;
      case 'tattoo':
        updateFormData('tattoo', userInput);
        addModelMessage('容姿に気になる事はありますか？（肌荒れ、体臭など）');
        setCurrentStep('appearance');
        break;
      case 'appearance':
        updateFormData('appearance', userInput);
        setCurrentStep('review');
        addModelMessage('ありがとうございます！入力いただいた内容をご確認ください。修正したい項目があれば「修正」ボタンを押してください。');
        break;
      case 'review':
        if (userInput === '送信する') {
          setIsTyping(true);
          const submitData = async () => {
            try {
              const dataToSubmit = new FormData();
              dataToSubmit.append('type', 'chatbot');
              dataToSubmit.append('name', formData.name || '');
              dataToSubmit.append('phone', formData.phone || '');
              dataToSubmit.append('email', formData.email || '');
              dataToSubmit.append('age', formData.age || '');
              dataToSubmit.append('height', (formData.height || '').replace(/cm/g, ''));
              dataToSubmit.append('weight', (formData.weight || '').replace(/kg/g, ''));
              dataToSubmit.append('address', formData.homeArea || '');
              dataToSubmit.append('employment', formData.job || '');
              dataToSubmit.append('source', formData.source || '');

              // アトリビューションデータの付与 (Stealth)
              const attribution = getAttributionData();
              if (attribution) {
                dataToSubmit.append('attribution', JSON.stringify(attribution));
              }
              
              const messageParts = [];
              if (formData.motivation) messageParts.push(`【応募動機】\n${formData.motivation}`);
              if (formData.workArea) messageParts.push(`【希望エリア】\n${formData.workArea}`);
              if (formData.datingApp) messageParts.push(`【出会い系アプリ利用歴】\n${formData.datingApp}`);
              if (formData.tattoo) messageParts.push(`【刺青】\n${formData.tattoo}`);
              if (formData.appearance) messageParts.push(`【容姿の懸念点】\n${formData.appearance}`);
              if (formData.freeText) messageParts.push(`【自己PR・意気込み】\n${formData.freeText}`);

              dataToSubmit.append('dating_app_exp', formData.datingApp || '');
              dataToSubmit.append('tattoo', formData.tattoo || '');
              dataToSubmit.append('appearance_concerns', formData.appearance || '');
              dataToSubmit.append('message', messageParts.join('\n\n'));
              dataToSubmit.append('store', storeName || '福岡店');

              for (let i = 0; i < userPhotos.length; i++) {
                try {
                  const blob = await resizeImage(userPhotos[i]);
                  dataToSubmit.append('photos', new File([blob], `photo_${i}.jpg`, { type: 'image/jpeg' }));
                } catch (e) {
                  const res = await fetch(userPhotos[i]);
                  const blob = await res.blob();
                  dataToSubmit.append('photos', new File([blob], `photo_${i}.jpg`, { type: 'image/jpeg' }));
                }
              }

              const result = await submitRecruitApplication(dataToSubmit);
              setIsTyping(false);
              if (result?.success) {
                addModelMessage('すべての情報の入力ありがとうございました！\n担当者より24時間以内に折り返しご連絡させていただきます。本日はありがとうございました。');
              } else {
                addModelMessage(`申し訳ありません。送信中にエラーが発生しました。\n[エラー内容: ${result?.error || '不明'}]\n再試行してください。`);
              }
            } catch (err) {
              setIsTyping(false);
              addModelMessage('通信エラーが発生しました。もう一度「送信する」ボタンを押してください。');
            }
          };
          submitData();
          setCurrentStep('done');
        }
        break;
    }
  };

  const handleEdit = (field: Step) => {
    setIsEditing(true);
    setCurrentStep(field);
    addModelMessage(`【${STEP_LABELS[field] || field}】を再入力してください。`);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAgeConfirm = () => {
    if (agePickerRef.current) {
      const idx = Math.round(agePickerRef.current.scrollTop / 40);
      handleSend(`${AGE_OPTIONS[idx]}歳`);
    }
  };

  const handleHeightConfirm = () => {
    if (heightPickerRef.current) {
      const idx = Math.round(heightPickerRef.current.scrollTop / 40);
      handleSend(`${HEIGHT_OPTIONS[idx]}cm`);
    }
  };

  const stepOptions = getStepOptions(storeName);
  const currentOptions = stepOptions[currentStep];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-slate-950/80 backdrop-blur-xl duration-300 animate-in fade-in"
      style={{ 
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)', 
        paddingBottom: 'env(safe-area-inset-bottom)' 
      }}
    >
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 font-bold text-white shrink-0">L</div>
          <div>
            <div className="text-sm font-bold text-white">Life Change Assistant</div>
            <div className="flex items-center gap-1 text-[10px] text-green-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>
              Online Support
            </div>
          </div>
        </div>
        <button onClick={onClose} className="flex h-10 w-10 items-center justify-center text-slate-400 hover:text-white">✕</button>
      </div>

      <div ref={scrollRef} className="flex-grow space-y-6 overflow-y-auto scroll-smooth p-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'rounded-tr-none bg-amber-600 text-white shadow-lg shadow-amber-900/20' : 'rounded-tl-none border border-slate-700 bg-slate-800 text-slate-100'}`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</div>
              {m.photos && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {m.photos.map((p, pi) => (
                    <img key={pi} src={p} alt="uploaded" className="aspect-square w-full rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {currentStep === 'review' && !isTyping && (
          <div className="flex justify-start animate-in slide-in-from-bottom-1">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-700 bg-slate-800 p-4 text-slate-100 shadow-xl">
              <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-amber-500">Application Summary</div>
              <div className="space-y-3">
                {Object.entries(STEP_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-start justify-between gap-4 border-b border-slate-700/50 pb-2">
                    <div className="flex-grow min-w-0">
                      <div className="text-[10px] font-bold text-slate-400">{label}</div>
                      <div className="text-sm truncate">{formData[key] || '---'}</div>
                    </div>
                    <button onClick={() => handleEdit(key as Step)} className="mt-1 rounded bg-slate-700 px-2 py-1 text-[10px] text-slate-300">修正</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-tl-none bg-slate-800 p-4">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0.2s]"></div>
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-900 p-4 shrink-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {photos.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <div key={i} className="relative shrink-0">
                <img src={p} className="h-16 w-16 rounded-lg border border-slate-700 object-cover" alt="preview" />
                <button onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))} className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">✕</button>
              </div>
            ))}
          </div>
        )}

        {currentStep === 'age' && !isTyping && (
          <div className="mb-4 animate-in slide-in-from-bottom-2">
            <div className="relative mx-auto flex h-40 w-full max-w-xs items-center justify-center">
              <div className="pointer-events-none absolute top-1/2 h-10 w-full -translate-y-1/2 rounded-sm border-y border-amber-500/40 bg-amber-500/20"></div>
              <div ref={agePickerRef} className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
                <div className="h-16"></div>
                {AGE_OPTIONS.map((a) => (
                  <div key={a} className="flex h-10 snap-center items-center justify-center text-xl font-bold text-white">{a}<span className="ml-1 text-xs font-normal opacity-60">歳</span></div>
                ))}
                <div className="h-16"></div>
              </div>
            </div>
            <button onClick={handleAgeConfirm} className="mt-4 w-full rounded-full bg-amber-600 py-3 font-bold text-white">年齢を決定する</button>
          </div>
        )}

        {currentStep === 'height' && !isTyping && (
          <div className="mb-4 animate-in slide-in-from-bottom-2">
            <div className="relative mx-auto flex h-40 w-full max-w-xs items-center justify-center">
              <div className="pointer-events-none absolute top-1/2 h-10 w-full -translate-y-1/2 rounded-sm border-y border-amber-500/40 bg-amber-500/20"></div>
              <div ref={heightPickerRef} className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
                <div className="h-16"></div>
                {HEIGHT_OPTIONS.map((h) => (
                  <div key={h} className="flex h-10 snap-center items-center justify-center text-xl font-bold text-white">{h}<span className="ml-1 text-xs font-normal opacity-60">cm</span></div>
                ))}
                <div className="h-16"></div>
              </div>
            </div>
            <button onClick={handleHeightConfirm} className="mt-4 w-full rounded-full bg-amber-600 py-3 font-bold text-white">身長を決定する</button>
          </div>
        )}

        {currentOptions && !isTyping && (
          <div className="mb-4 flex flex-wrap gap-2 animate-in slide-in-from-bottom-1">
            {currentOptions.map((opt) => (
              <button key={opt} onClick={() => handleSend(opt)} className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-white hover:bg-amber-600 active:scale-95">{opt}</button>
            ))}
          </div>
        )}

        {currentStep === 'review' && !isTyping && (
          <div className="mb-4">
            <button onClick={() => handleSend('送信する')} className="w-full rounded-2xl bg-amber-600 py-4 text-base font-bold text-white shadow-xl shadow-amber-900/20 active:scale-95">この内容で応募する</button>
          </div>
        )}

        {['done', 'review', 'age', 'height'].indexOf(currentStep) === -1 ? (
          <div className="flex items-end gap-2 rounded-2xl bg-slate-800 p-2 pl-4 transition-all focus-within:ring-2 focus-within:ring-amber-500/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={currentStep === 'photos' ? '写真を選んで送信してください' : '回答を入力...'}
              disabled={currentStep === 'photos'}
              rows={1}
              className="max-h-32 flex-grow overflow-y-auto border-none bg-transparent py-2 text-base text-white focus:ring-0 disabled:opacity-50"
            />
            {currentStep === 'photos' && <button onClick={() => fileInputRef.current?.click()} className="flex h-10 w-10 items-center justify-center text-slate-400">📷</button>}
            <button onClick={() => handleSend()} disabled={(!input.trim() && photos.length === 0 && !currentOptions) || isTyping} className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white shrink-0 active:scale-90 disabled:opacity-50">
              {currentStep === 'photos' ? '⬆' : '✈'}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handlePhotoUpload} />
          </div>
        ) : (
          currentStep === 'done' && (
            <div className="py-2 text-center">
              <button onClick={onClose} className="rounded-full bg-slate-800 px-8 py-3 font-bold text-white active:scale-95">閉じる</button>
            </div>
          )
        )}
        <p className="mt-3 text-center text-[10px] text-slate-500">安心のプライバシー管理。お送りいただいた情報は厳格に保管されます。</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Chatbot;
