import React from 'react';

const AdditionalInfoSection: React.FC = () => {
  return (
    <div className="mt-16 space-y-12 duration-1000 animate-in fade-in slide-in-from-bottom-4">
      {/* Cancellation Policy */}
      <section>
        <div className="mb-8 text-center">
          <h3 className="font-rounded text-2xl font-bold text-rose-900">
            ご変更、キャンセルについて
          </h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-300">
            Cancellation Policy
          </p>
        </div>
        <div className="space-y-6 rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-bold text-rose-800">
              <span className="text-rose-400">📍</span>
              東京23区内の場合
            </h4>
            <div className="space-y-2 pl-6 text-sm leading-relaxed text-rose-600">
              <p>
                下記の場合はキャンセル料金が発生します。ご変更やキャンセルは分かり次第、必ずお電話にてご連絡してください。
              </p>
              <ul className="space-y-1">
                <li className="flex justify-between border-b border-rose-50 pb-1">
                  <span>ご予約後 〜 当日5時間前まで</span>
                  <span className="font-bold text-emerald-500">無料</span>
                </li>
                <li className="flex justify-between border-b border-rose-50 pb-1">
                  <span>5時間前 〜 指定時刻まで</span>
                  <span className="font-bold text-rose-500">施術料の半額</span>
                </li>
                <li className="flex justify-between border-b border-rose-50 pb-1">
                  <span>連絡なしのキャンセル</span>
                  <span className="font-bold text-rose-600">施術料の全額</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 font-bold text-rose-800">
              <span className="text-rose-400">🗺️</span>
              東京23区外の場合
            </h4>
            <div className="pl-6 text-sm leading-relaxed text-rose-600">
              <p>
                上記の規定と異なりますのでご注意ください。遠方になるほど、キャンセル料の発生時刻が繰り上がります。ご予約時に確認をお願い致します。
              </p>
              <p className="mt-2 text-xs italic text-rose-400">
                ※ご利用日を変更（延期）される場合は、当日指定時刻の3時間前までにお電話いただければキャンセル料はかかりません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prohibited Matters */}
      <section>
        <div className="mb-8 text-center">
          <h3 className="font-rounded text-2xl font-bold text-rose-900">禁止事項</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-300">
            Prohibited Matters
          </p>
        </div>
        <div className="rounded-[2rem] border-2 border-rose-100 bg-white p-8 shadow-lg shadow-rose-100/50">
          <p className="mb-6 text-center text-sm font-bold text-rose-900">
            下記に該当、もしくは疑わしい方のご利用をお断りさせていただきます。
          </p>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 text-xs text-rose-600 md:grid-cols-2">
            {[
              '過去に何度もキャンセルや変更をされた方',
              '本違法薬物を使用されている方（疑いを含む）',
              '無断での取材、撮影・盗撮・録音行為',
              'プライバシー侵害、ストーカー行為',
              '18歳未満の方',
              '性病、感染性皮膚病のある方',
              '生理中の方、妊娠されている方',
              '男性の方（当店は女性専用です）',
              '暴力団及び暴力団関係者の方',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 text-rose-300">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-rose-50 pt-8">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-rose-800">
              <span>📱</span> 直接連絡システムについて
            </h4>
            <p className="text-xs leading-relaxed text-rose-500">
              SNS等での直接連絡はあくまで「ご予約」のツールです。精神的な相談、行き過ぎた長文、日常的な過度な連絡はセラピストの負担となるため禁止とさせて頂きます。事務局の判断により、無期限の利用禁止措置をとる場合もございます。
            </p>
            <p className="mt-4 rounded-xl bg-rose-50/50 p-3 text-[10px] text-rose-400">
              ※サービス中に該当行為が発覚した場合、即座に中断させていただきます。その際、料金の返金には応じかねますのでご了承ください。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdditionalInfoSection;
