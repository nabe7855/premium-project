import React from 'react';

interface FooterProps {
  isVisible?: boolean;
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  storeName?: string;
  description?: string;
  linksHeading?: string;
  links?: { label: string; url: string }[];
  contactHeading?: string;
  phone?: string;
  receptionHours?: string;
  address?: string;
  privacyLabel?: string;
  privacyUrl?: string;
  termsLabel?: string;
  termsUrl?: string;
  copyright?: string;
}

const Footer: React.FC<FooterProps> = ({
  isVisible = true,
  isEditing = false,
  onUpdate,
  storeName = 'LIFE CHANGE FUKUOKA',
  description = '私たちは、福岡で「新しい自分」を見つけたいと願う全ての男性を応援します。\n創業8年の実績と、一人ひとりに寄り添う教育体制。',
  linksHeading = 'Links',
  links = [
    { label: '私たちの実績', url: '#achievements' },
    { label: '安心のサポート', url: '#benefits' },
    { label: '報酬シミュレーション', url: '#income' },
    { label: 'よくあるご質問', url: '#faq' },
  ],
  contactHeading = 'Contact',
  phone = '05054913991',
  receptionHours = '8:00〜23:00',
  address = '福岡',
  privacyLabel = 'Privacy Policy',
  privacyUrl = '#',
  termsLabel = 'Terms of Service',
  termsUrl = '#',
  copyright = '© 2024 LIFE CHANGE RECRUIT 福岡. ALL RIGHTS RESERVED.',
}) => {
  if (!isVisible && !isEditing) return null;

  return (
    <footer className="bg-slate-950 px-4 py-20 text-slate-400">
      <div className="container mx-auto">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                <span className="font-bold text-white">L</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white">
                LIFE CHANGE{' '}
                <span className="text-amber-500">
                  {storeName.replace('ストロベリーボーイズ', '')}
                </span>
              </span>
            </div>
            {isEditing ? (
              <p
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate?.('description', e.currentTarget.innerText)}
                className="max-w-md cursor-text whitespace-pre-line rounded leading-relaxed outline-none hover:bg-white/5"
              >
                {description}
              </p>
            ) : (
              <p className="max-w-md whitespace-pre-line leading-relaxed">{description}</p>
            )}
          </div>

          <div>
            {isEditing ? (
              <h5
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate?.('linksHeading', e.currentTarget.innerText)}
                className="mb-6 cursor-text rounded font-bold text-white outline-none hover:bg-white/5"
              >
                {linksHeading}
              </h5>
            ) : (
              <h5 className="mb-6 font-bold text-white">{linksHeading}</h5>
            )}
            <ul className="space-y-4 text-sm">
              {links.map((link, i) => (
                <li key={i} className="flex flex-col gap-1">
                  {isEditing ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newLinks = [...links];
                            newLinks[i] = { ...newLinks[i], label: e.currentTarget.innerText };
                            onUpdate?.('links', newLinks);
                          }}
                          className="cursor-text rounded text-slate-300 outline-none hover:bg-white/10"
                        >
                          {link.label}
                        </span>
                        <button
                          onClick={() => {
                            const newLinks = links.filter((_, idx) => idx !== i);
                            onUpdate?.('links', newLinks);
                          }}
                          className="text-red-500 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...links];
                          newLinks[i] = { ...newLinks[i], url: e.target.value };
                          onUpdate?.('links', newLinks);
                        }}
                        placeholder="URL (e.g. #trust)"
                        className="w-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-500 outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </>
                  ) : (
                    <a href={link.url} className="transition-colors hover:text-amber-500">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              {isEditing && (
                <button
                  onClick={() => {
                    onUpdate?.('links', [...links, { label: '新しいリンク', url: '#' }]);
                  }}
                  className="mt-2 text-xs text-amber-500 hover:text-amber-400"
                >
                  + リンクを追加
                </button>
              )}
            </ul>
          </div>

          <div>
            {isEditing ? (
              <h5
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onUpdate?.('contactHeading', e.currentTarget.innerText)}
                className="mb-6 cursor-text rounded font-bold text-white outline-none hover:bg-white/5"
              >
                {contactHeading}
              </h5>
            ) : (
              <h5 className="mb-6 font-bold text-white">{contactHeading}</h5>
            )}
            <ul className="space-y-4 text-sm">
              <li>
                採用担当直通：
                {isEditing ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate?.('phone', e.currentTarget.innerText)}
                    className="cursor-text rounded outline-none hover:bg-white/5"
                  >
                    {phone}
                  </span>
                ) : (
                  phone
                )}
              </li>
              <li>
                受付時間：
                {isEditing ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate?.('receptionHours', e.currentTarget.innerText)}
                    className="cursor-text rounded outline-none hover:bg-white/5"
                  >
                    {receptionHours}
                  </span>
                ) : (
                  receptionHours
                )}
              </li>
              <li>
                {isEditing ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => onUpdate?.('address', e.currentTarget.innerText)}
                    className="cursor-text rounded outline-none hover:bg-white/5"
                  >
                    {address}
                  </span>
                ) : (
                  address
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-900 pt-8 md:flex-row">
          {isEditing ? (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdate?.('copyright', e.currentTarget.innerText)}
              className="cursor-text rounded text-xs uppercase tracking-widest opacity-50 outline-none hover:bg-white/5"
            >
              {copyright}
            </div>
          ) : (
            <div className="text-xs uppercase tracking-widest opacity-50">{copyright}</div>
          )}
          <div className="flex space-x-6">
            <div className="flex flex-col items-end gap-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={privacyLabel}
                    onChange={(e) => onUpdate?.('privacyLabel', e.target.value)}
                    className="bg-transparent text-right text-xs outline-none hover:text-white"
                  />
                  <input
                    type="text"
                    value={privacyUrl}
                    onChange={(e) => onUpdate?.('privacyUrl', e.target.value)}
                    className="bg-slate-900 px-1 text-[10px] text-slate-500 outline-none"
                  />
                </>
              ) : (
                <a href={privacyUrl} className="transition-colors hover:text-white">
                  {privacyLabel}
                </a>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={termsLabel}
                    onChange={(e) => onUpdate?.('termsLabel', e.target.value)}
                    className="bg-transparent text-right text-xs outline-none hover:text-white"
                  />
                  <input
                    type="text"
                    value={termsUrl}
                    onChange={(e) => onUpdate?.('termsUrl', e.target.value)}
                    className="bg-slate-900 px-1 text-[10px] text-slate-500 outline-none"
                  />
                </>
              ) : (
                <a href={termsUrl} className="transition-colors hover:text-white">
                  {termsLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
