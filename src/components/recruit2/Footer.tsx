import React from 'react';

interface FooterProps {
  storeName?: string;
  phone?: string;
  receptionHours?: string;
  address?: string;
}

const Footer: React.FC<FooterProps> = ({
  storeName = 'LIFE CHANGE FUKUOKA',
  phone = '090-XXXX-XXXX',
  receptionHours = '12:00〜翌3:00',
  address = '福岡市中央区天神エリア（詳細は面談時に）',
}) => {
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
            <p className="max-w-md leading-relaxed">
              私たちは、{storeName}で「新しい自分」を見つけたいと願う全ての男性を応援します。
              <br />
              創業8年の実績と、一人ひとりに寄り添う教育体制。
            </p>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-white">Links</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#trust" className="transition-colors hover:text-amber-500">
                  私たちの実績
                </a>
              </li>
              <li>
                <a href="#benefits" className="transition-colors hover:text-amber-500">
                  安心のサポート
                </a>
              </li>
              <li>
                <a href="#income" className="transition-colors hover:text-amber-500">
                  報酬シミュレーション
                </a>
              </li>
              <li>
                <a href="#qa" className="transition-colors hover:text-amber-500">
                  よくあるご質問
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-white">Contact</h5>
            <ul className="space-y-4 text-sm">
              <li>採用担当直通：{phone}</li>
              <li>受付時間：{receptionHours}</li>
              <li>{address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-900 pt-8 md:flex-row">
          <div className="text-xs uppercase tracking-widest opacity-50">
            © 2024 LIFE CHANGE RECRUIT {storeName.toUpperCase()}. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
