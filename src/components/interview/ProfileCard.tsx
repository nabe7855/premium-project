'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// キャストプロフィールカードコンポーネント
// solo_interview では1枚、roundtable では複数並列表示される
// ---------------------------------------------------------------------------

export interface CastProfileData {
  name: string;
  name_romaji?: string;
  age?: number;
  height?: number;
  icon_url?: string;
  area?: string;
  catch_copy?: string;
  attributes?: { label: string; value: string }[];
  profile_url?: string; // キャストプロフィールページへのリンク
}

interface ProfileCardProps {
  cast: CastProfileData;
  variant?: 'default' | 'compact';
}

export default function ProfileCard({ cast, variant = 'default' }: ProfileCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-sm"
      style={{
        borderColor: '#F9D1DA',
        background: '#FFFBFC',
      }}
    >
      {/* ヘッダー部分 */}
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{ background: '#FFF0F3' }}
      >
        {cast.icon_url ? (
          <img
            src={cast.icon_url}
            alt={cast.name}
            className="rounded-full border-2 object-cover"
            style={{
              width: isCompact ? 52 : 68,
              height: isCompact ? 52 : 68,
              borderColor: '#E8567A',
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full text-lg font-bold text-white"
            style={{
              width: isCompact ? 52 : 68,
              height: isCompact ? 52 : 68,
              background: 'linear-gradient(135deg, #E8567A, #f4a0b5)',
            }}
          >
            {cast.name.charAt(0)}
          </div>
        )}

        <div>
          <p className="text-[11px] font-medium tracking-widest" style={{ color: '#E8567A' }}>
            CAST PROFILE
          </p>
          <h3
            className="font-serif text-xl font-bold"
            style={{ color: '#1a1a1a', letterSpacing: '-0.3px' }}
          >
            {cast.name}
          </h3>
          {cast.name_romaji && (
            <p className="text-xs tracking-widest" style={{ color: '#9ca3af' }}>
              {cast.name_romaji.toUpperCase()}
            </p>
          )}
        </div>
      </div>

      {/* 属性リスト */}
      {!isCompact && (
        <div className="px-5 py-4">
          <dl className="space-y-2.5">
            {cast.area && (
              <div className="flex items-baseline gap-3">
                <dt className="w-20 flex-shrink-0 text-[11px] font-bold tracking-wider" style={{ color: '#9ca3af' }}>
                  エリア
                </dt>
                <dd className="text-sm" style={{ color: '#1a1a1a' }}>{cast.area}</dd>
              </div>
            )}
            {cast.age && (
              <div className="flex items-baseline gap-3">
                <dt className="w-20 flex-shrink-0 text-[11px] font-bold tracking-wider" style={{ color: '#9ca3af' }}>
                  年齢
                </dt>
                <dd className="text-sm" style={{ color: '#1a1a1a' }}>{cast.age}歳</dd>
              </div>
            )}
            {cast.height && (
              <div className="flex items-baseline gap-3">
                <dt className="w-20 flex-shrink-0 text-[11px] font-bold tracking-wider" style={{ color: '#9ca3af' }}>
                  身長
                </dt>
                <dd className="text-sm" style={{ color: '#1a1a1a' }}>{cast.height}cm</dd>
              </div>
            )}
            {cast.attributes?.map((attr) => (
              <div key={attr.label} className="flex items-baseline gap-3">
                <dt className="w-20 flex-shrink-0 text-[11px] font-bold tracking-wider" style={{ color: '#9ca3af' }}>
                  {attr.label}
                </dt>
                <dd className="text-sm" style={{ color: '#1a1a1a' }}>{attr.value}</dd>
              </div>
            ))}
          </dl>

          {cast.catch_copy && (
            <p
              className="mt-4 border-l-4 pl-3 text-sm italic leading-relaxed"
              style={{ borderColor: '#E8567A', color: '#555' }}
            >
              「{cast.catch_copy}」
            </p>
          )}
        </div>
      )}

      {/* プロフィールページへのリンク */}
      {cast.profile_url && (
        <div className="px-5 pb-4">
          <a
            href={cast.profile_url}
            className="block w-full rounded-full py-2.5 text-center text-xs font-bold tracking-widest text-white transition-opacity hover:opacity-80"
            style={{ background: '#E8567A' }}
          >
            プロフィールを見る →
          </a>
        </div>
      )}
    </div>
  );
}
