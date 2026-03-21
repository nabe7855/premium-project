import React from 'react';

interface RichTextContentProps {
  content: string;
  className?: string;
  linkClassName?: string;
}

export const RichTextContent: React.FC<RichTextContentProps> = ({ 
  content, 
  className,
  linkClassName = "text-rose-500 underline decoration-rose-500/30 underline-offset-4 hover:text-rose-600 hover:decoration-rose-600 transition-all font-bold"
}) => {
  if (!content) return null;
  
  // [テキスト](URL) 形式のリンクを抽出する正規表現
  const parts = content.split(/(\[.*?\]\(.*?\))/g);
  
  return (
    <div className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, i) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, text, url] = match;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
              onClick={(e) => e.stopPropagation()}
            >
              {text}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};
