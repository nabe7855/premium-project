'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { CastProfile } from '@/types/cast';

interface VoiceSectionProps {
  cast: CastProfile;
  setCastState: React.Dispatch<React.SetStateAction<CastProfile>>;
  activeTab: string;
}

export default function VoiceSection({ cast, setCastState, activeTab }: VoiceSectionProps) {
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(cast.voiceUrl ?? null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  // 🎯 DBから保存済みの voice_url を取得
  const fetchVoiceUrl = async () => {
    const { data, error } = await supabase
      .from('casts')
      .select('voice_url')
      .eq('id', cast.id)
      .single();

    if (!error && data?.voice_url) {
      setVoiceUrl(data.voice_url);
      setCastState((prev) => ({ ...prev, voiceUrl: data.voice_url }));
    }
  };

  useEffect(() => {
    if (activeTab === 'voice') fetchVoiceUrl();
  }, [activeTab]);

  // 🎤 アップロード処理
  const handleUploadVoice = async () => {
    if (!voiceFile) return;
    setUploading(true);

    const filePath = `voice-${cast.id}.webm`;
    await supabase.storage.from('cast-voices').remove([filePath]);

    const { error: uploadError } = await supabase.storage
      .from('cast-voices')
      .upload(filePath, voiceFile, { cacheControl: '0', upsert: true });

    if (uploadError) {
      console.error(uploadError);
      alert('アップロード失敗');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('cast-voices').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    await supabase.from('casts').update({ voice_url: publicUrl }).eq('id', cast.id);

    setVoiceUrl(publicUrl);
    setCastState((prev) => ({ ...prev, voiceUrl: publicUrl }));
    setVoiceFile(null);
    setUploading(false);
    alert('音声を更新しました');
  };

  // 🎤 録音開始
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setVoiceFile(new File([blob], `voice-${cast.id}.webm`, { type: 'audio/webm' }));
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // 🎤 録音停止
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 rounded-lg shadow bg-white border space-y-4">
      <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
        <Mic className="h-5 w-5 text-pink-500" />
        音声データ管理
      </h2>

      {/* 現在の音声データ */}
      {voiceUrl ? (
        <div className="space-y-2">
          <p className="text-green-600 font-medium">✅ 現在の音声データがあります</p>
          <audio key={voiceUrl} controls src={voiceUrl} className="w-full" />
        </div>
      ) : (
        <p className="text-gray-500">❌ まだ音声データは保存されていません</p>
      )}

      {/* アップロード */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">ファイルをアップロード</label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setVoiceFile(e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />
        <button
          onClick={handleUploadVoice}
          disabled={uploading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          <Upload className="inline h-4 w-4 mr-1" />
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </div>

      {/* 録音 */}
      <div className="space-y-4 flex flex-col items-center">
        <p className="text-sm font-medium">その場で録音</p>

        {/* 🎯 大きな丸ボタン */}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-20 h-20 flex items-center justify-center rounded-full shadow-lg ${
            recording ? 'bg-red-500 animate-pulse' : 'bg-green-500'
          }`}
        >
          <Mic className="h-10 w-10 text-white" />
        </button>
        <p className="text-sm text-gray-600">
          {recording ? '録音中…もう一度押して停止' : 'タップして録音開始'}
        </p>

        {recordedUrl && (
          <div className="space-y-2 w-full">
            <audio controls src={recordedUrl} className="w-full" />
            <button
              onClick={handleUploadVoice}
              className="w-full py-2 px-4 bg-purple-500 text-white rounded-md shadow hover:bg-purple-600"
            >
              録音を保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
