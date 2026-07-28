'use client';

import React from 'react';

export type StrawberrySectionDividerProps = {
  /** 次のセクションの背景色 (SVG塗り色) */
  color?: string;
  /** 配置位置: left | center | right (初期値: center) */
  position?: 'left' | 'center' | 'right';
  /** サイズバリエーション: small | medium | large | xlarge (初期値: xlarge) */
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  /** イチゴの傾き角度 (度数, 初期値: -45) */
  rotation?: number;
  /** 追加クラス名 */
  className?: string;
};

/**
 * 🍓 StrawberrySectionDivider (ピンクのミルク水面に浸かったダイナミック巨大イチゴディバイダー)
 * - イチゴが45度斜めに浸かり、大きめのシルエットが広がるシネマティック演出
 * - ボタンの下に潜り込めるよう z-index 階層コントロール対応 (z-0 / z-5)
 * - aria-hidden="true"
 */
export default function StrawberrySectionDivider({
  color = '#FFF9FA',
  position = 'center',
  size = 'xlarge',
  rotation = -45,
  className = '',
}: StrawberrySectionDividerProps) {
  // めっちゃ巨大でインパクトのあるサイズ指定 (水に浸かっているかのようなスケール)
  const sizeClasses = {
    small: 'w-[140px] sm:w-[180px] h-[90px] sm:h-[120px]',
    medium: 'w-[200px] sm:w-[280px] md:w-[340px] h-[130px] sm:h-[180px] md:h-[220px]',
    large: 'w-[260px] sm:w-[380px] md:w-[480px] h-[170px] sm:h-[240px] md:h-[290px]',
    xlarge: 'w-[min(95vw,340px)] sm:w-[480px] md:w-[620px] h-[210px] sm:h-[290px] md:h-[360px]',
  }[size];

  // 水平配置
  const positionClasses = {
    left: 'justify-center sm:justify-start sm:ml-8 md:ml-16',
    center: 'justify-center',
    right: 'justify-center sm:justify-end sm:mr-8 md:mr-16',
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`relative w-full flex pointer-events-none z-0 overflow-hidden ${positionClasses} ${className}`}
      style={{ marginTop: '-7.5rem', marginBottom: '-0.5rem' }}
    >
      <div
        className={`relative flex items-end justify-center ${sizeClasses}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: '60% 85%',
        }}
      >
        {/* めっちゃ巨大で斜め45度に傾いたイチゴのベタ塗りシルエット (浸水表現) */}
        <svg
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block opacity-95"
          focusable="false"
          aria-hidden="true"
        >
          {/* 縦長大迫力イチゴ本体 */}
          <path
            d="
              M 80 40
              C 102 10, 148 20, 156 62
              C 166 108, 124 165, 86 197
              C 83 200, 77 200, 74 197
              C 36 165, -6 108, 4 62
              C 12 20, 58 10, 80 40
              Z
            "
            fill={color}
          />

          {/* イチゴのヘタ（斜めに広がって見えるストロベリーリーフ） */}
          <path
            d="
              M 80 38
              C 86 20, 96 8, 110 2
              C 102 14, 92 26, 84 36
              Z
              M 80 38
              C 74 20, 64 8, 50 2
              C 58 14, 68 26, 76 36
              Z
              M 80 40
              C 102 32, 128 30, 148 36
              C 126 42, 104 44, 86 42
              Z
              M 80 40
              C 58 32, 32 30, 12 36
              C 34 42, 56 44, 74 42
              Z
              M 80 28
              C 83 14, 87 6, 92 -2
              C 85 4, 80 13, 78 25
              Z
            "
            fill={color}
          />
        </svg>
      </div>
    </div>
  );
}
