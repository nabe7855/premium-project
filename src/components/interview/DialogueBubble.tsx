'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// 対話バブルコンポーネント
// インタビュアー（左）とキャスト（右）で吹き出しの向きと色を出し分ける
// ---------------------------------------------------------------------------

export type SpeakerType = 'interviewer' | 'cast';

interface DialogueBubbleProps {
  speaker: SpeakerType;
  speakerName?: string;
  iconUrl?: string;
  text: string;
}

export default function DialogueBubble({
  speaker,
  speakerName,
  iconUrl,
  text,
}: DialogueBubbleProps) {
  const isInterviewer = speaker === 'interviewer';

  return (
    <div
      className={`flex items-start gap-3 ${isInterviewer ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* アイコン */}
      <div className="flex-shrink-0">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={speakerName ?? speaker}
            className="h-11 w-11 rounded-full border-2 object-cover"
            style={{
              borderColor: isInterviewer ? '#d1d5db' : '#F9D1DA',
            }}
          />
        ) : (
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{
              background: isInterviewer ? '#9ca3af' : '#E8567A',
            }}
          >
            {speakerName ? speakerName.charAt(0) : (isInterviewer ? 'I' : 'C')}
          </div>
        )}
        {speakerName && (
          <p
            className="mt-1 text-center text-[10px] font-medium"
            style={{ color: isInterviewer ? '#9ca3af' : '#E8567A' }}
          >
            {speakerName}
          </p>
        )}
      </div>

      {/* 吹き出し */}
      <div
        className="relative max-w-[calc(100%-80px)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
        style={{
          background: isInterviewer ? '#f3f4f6' : '#FFF0F3',
          color: '#1a1a1a',
          borderRadius: isInterviewer
            ? '0px 18px 18px 18px'
            : '18px 0px 18px 18px',
        }}
      >
        <p style={{ lineHeight: '1.85' }}>{text}</p>
      </div>
    </div>
  );
}
