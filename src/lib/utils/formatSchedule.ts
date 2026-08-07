/**
 * 出勤スケジュール時間整形の共通ヘルパー
 * 全すべての環境(Node.js / Vercel SSR / ブラウザ)で実行環境に依存せず
 * 明示的に timeZone: 'Asia/Tokyo' (JST) を適用します。
 */

/**
 * ISO文字列またはDateからJSTの時刻文字列(HH:mm)を取得する
 */
export function formatTimeJST(datetime: string | Date | null | undefined): string {
  if (!datetime) return '??:??';
  try {
    const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
    if (isNaN(dateObj.getTime())) return '??:??';

    const formatter = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(dateObj);
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  } catch (err) {
    console.error('formatTimeJST error:', err);
    return '??:??';
  }
}

/**
 * JSTにおけるY-M-Dの日付文字列を取得する (日跨ぎ判定用)
 */
export function getDateJST(datetime: string | Date): string {
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(dateObj);
}

/**
 * 出勤スケジュールの開始〜終了時刻をJSTで一括整形する
 * 日跨ぎシフト(終了が翌日)の場合は 「12:00〜翌4:00」 のように 「翌」 を付与する
 * 
 * @param startDatetime 開始日時 (ISO文字列 / Date)
 * @param endDatetime 終了日時 (ISO文字列 / Date)
 * @param separator 区切り文字 (デフォルト: '〜')
 */
export function formatScheduleTime(
  startDatetime: string | Date | null | undefined,
  endDatetime: string | Date | null | undefined,
  separator: string = '〜'
): string {
  if (!startDatetime && !endDatetime) return '時間未定';
  if (!startDatetime) return `??:??${separator}${formatTimeJST(endDatetime)}`;
  if (!endDatetime) return `${formatTimeJST(startDatetime)}${separator}??:??`;

  const startTimeStr = formatTimeJST(startDatetime);
  let endTimeStr = formatTimeJST(endDatetime);

  try {
    const startDateObj = typeof startDatetime === 'string' ? new Date(startDatetime) : startDatetime;
    const endDateObj = typeof endDatetime === 'string' ? new Date(endDatetime) : endDatetime;

    if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
      const startJSTDay = getDateJST(startDateObj);
      const endJSTDay = getDateJST(endDateObj);

      // JST日付比較で終了日が開始日より後の場合、または終了時刻が開始時刻以下の場合は「翌」を付与
      if (endJSTDay > startJSTDay || (endJSTDay === startJSTDay && endDateObj.getTime() < startDateObj.getTime())) {
        endTimeStr = `翌${endTimeStr}`;
      } else if (endJSTDay === startJSTDay) {
        // 同日であっても、時刻文字列比較で数値が小さく日跨ぎとみなせる場合 (00:00含む)
        const [sH, sM] = startTimeStr.split(':').map(Number);
        const [eH, eM] = endTimeStr.split(':').map(Number);
        if (eH < sH || (eH === sH && eM < sM)) {
          endTimeStr = `翌${endTimeStr}`;
        }
      }
    }
  } catch (e) {
    console.error('formatScheduleTime day-crossing check error:', e);
  }

  return `${startTimeStr}${separator}${endTimeStr}`;
}
