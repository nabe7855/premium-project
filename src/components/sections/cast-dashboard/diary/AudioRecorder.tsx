'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Wand2, Loader2, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
  onGenerated: (content: string) => void;
  onCancel: () => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onGenerated, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tone, setTone] = useState<'standard' | 'cute' | 'professional' | 'casual'>('standard');
  const [error, setError] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<'idle' | 'playing' | 'paused'>('idle');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_RECORDING_TIME = 120; // 2 minutes

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      setError('マイクの使用が許可されていない、またはマイクが見つかりません。');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
    setError(null);
  };

  const generateDiary = async () => {
    if (audioChunksRef.current.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'record.wav');

      // Step 1: Transcribe
      const transcribeRes = await fetch('/api/ai/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeRes.ok) throw new Error('文字起こしに失敗しました');
      const { text } = await transcribeRes.json();

      // Step 2: Generate Diary
      const generateRes = await fetch('/api/ai/diary-from-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, tone }),
      });

      if (!generateRes.ok) throw new Error('日記の生成に失敗しました');
      const { content } = await generateRes.json();

      onGenerated(content);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (playbackState === 'playing') {
      audioRef.current.pause();
      setPlaybackState('paused');
    } else {
      audioRef.current.play();
      setPlaybackState('playing');
    }
  };

  return (
    <div className="rounded-2xl border-2 border-dashed border-pink-100 bg-pink-50/20 p-8 text-center">
      {!audioUrl && !isRecording && (
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-200 transition-transform hover:scale-110 active:scale-95 cursor-pointer" onClick={startRecording}>
            <Mic size={32} />
          </div>
          <div>
            <p className="text-lg font-black text-gray-800">喋って日記を作成</p>
            <p className="text-xs font-bold text-gray-400">マイクに向かって今日のエピソードを喋ってください（最大2分）</p>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="space-y-6">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-pink-400/20" />
            <div className="absolute inset-2 animate-pulse rounded-full bg-pink-400/40" />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg cursor-pointer" onClick={stopRecording}>
              <Square size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black tabular-nums text-rose-500">{formatTime(recordingTime)}</p>
            <p className="text-xs font-bold text-rose-300 animate-pulse">録音中...</p>
          </div>
        </div>
      )}

      {audioUrl && !isProcessing && (
        <div className="space-y-6">
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors hover:bg-pink-200"
            >
              {playbackState === 'playing' ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200"
            >
              <Trash2 size={24} />
            </button>
          </div>
          
          <audio 
            ref={audioRef} 
            src={audioUrl} 
            onEnded={() => setPlaybackState('idle')}
            className="hidden" 
          />

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">文章のトーン（雰囲気）を選択</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: 'standard', label: '標準', icon: '✨' },
                  { id: 'cute', label: '可愛い', icon: '🌸' },
                  { id: 'professional', label: 'プロ', icon: '🌟' },
                  { id: 'casual', label: 'ラフ', icon: '🍺' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id as any)}
                    className={`flex flex-col items-center gap-1 rounded-xl border py-2 transition-all ${
                      tone === t.id 
                        ? 'border-pink-500 bg-pink-500 text-white shadow-md' 
                        : 'border-pink-100 bg-white text-gray-600 hover:border-pink-300'
                    }`}
                  >
                    <span className="text-sm">{t.icon}</span>
                    <span className="text-[10px] font-bold">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={generateDiary}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 py-4 font-black tracking-widest text-white shadow-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wand2 size={20} />
              AIで文章を生成する
            </button>
            <p className="text-[10px] font-bold text-gray-400">※選択した雰囲気でAIが日記を構成します</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-6 py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-500">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-black text-gray-800">AIが執筆中...</p>
            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-pink-100">
              <div className="h-full w-1/2 animate-[loading_2s_ease-in-out_infinite] rounded-full bg-pink-500" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-500">
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default AudioRecorder;
