'use client';

import { SNSProfileConfig } from '@/lib/store/storeTopConfig';
import React from 'react';

interface SNSProfileProps {
  config?: SNSProfileConfig;
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  onImageUpload?: (file: File) => void;
}

const SNSProfile: React.FC<SNSProfileProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  if (!config || (!config.isVisible && !isEditing)) return null;

  const handleEdit = (key: string, currentValue: string) => {
    if (!isEditing || !onUpdate) return;
    const newValue = window.prompt(`編集: ${key}`, currentValue);
    if (newValue !== null) {
      onUpdate(key, newValue);
    }
  };

  const handleIconClick = () => {
    if (!isEditing || !onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageUpload(file);
    };
    input.click();
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-4">
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:p-8">
        {/* Logo/Icon */}
        <div
          className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50 transition-transform ${isEditing ? 'cursor-pointer ring-2 ring-rose-500 ring-offset-2 hover:scale-105' : ''}`}
          onClick={handleIconClick}
        >
          <img
            src={config.iconUrl || 'https://placehold.jp/150x150.png?text=SNS'}
            alt="Store Logo"
            className="h-full w-full object-contain p-2"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h3
              className={`text-xl font-bold text-slate-900 ${isEditing ? 'cursor-pointer rounded border border-dashed border-rose-300 bg-rose-50/50 px-2' : ''}`}
              onClick={() => handleEdit('title', config.title)}
            >
              {config.title}
            </h3>
          </div>

          <p
            className={`mb-6 text-sm leading-relaxed text-slate-600 ${isEditing ? 'cursor-pointer rounded border border-dashed border-rose-300 bg-rose-50/50 px-2' : ''}`}
            onClick={() => handleEdit('description', config.description)}
          >
            {config.description}
            <span className="ml-2 cursor-pointer text-slate-400 hover:text-slate-600">
              もっとみる
            </span>
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-5">
            {[
              {
                id: 'xUrl',
                icon: (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.25h-6.657l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
              {
                id: 'instagramUrl',
                icon: (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                ),
              },
              {
                id: 'facebookUrl',
                icon: (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-8.74h-2.94v-3.411h2.94v-2.511c0-2.915 1.782-4.502 4.379-4.502 1.244 0 2.316.092 2.627.134v3.047l-1.802.001c-1.414 0-1.687.672-1.687 1.654v2.17h3.374l-.439 3.411h-2.935v8.74h6.138c.732 0 1.325-.593 1.325-1.324v-21.351c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                ),
              },
              {
                id: 'youtubeUrl',
                icon: (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.612 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                ),
              },
            ].map((platform) => (
              <a
                key={platform.id}
                href={isEditing ? '#' : (config as any)[platform.id]}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    handleEdit(platform.id, (config as any)[platform.id] || '');
                  }
                }}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-400 transition-colors hover:text-slate-600 ${isEditing ? 'rounded bg-rose-50 p-1 ring-1 ring-rose-300' : ''}`}
              >
                {platform.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNSProfile;
