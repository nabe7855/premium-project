/**
 * 応募経路（アトリビューション）を追跡するためのユーティリティ
 */

export interface AttributionData {
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string; // Google Click ID
  landing_page?: string;
  first_visit_at?: string;
  device?: string;
}

const STORAGE_KEY = 'sb_recruit_attribution';

/**
 * 初回アクセス時の流入情報を sessionStorage に保存する
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;

  // すでに保存されている場合は上書きしない（初回接点を重視する場合）
  // もし「最新の接点」を重視したい場合はここをコメントアウトする
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  const urlParams = new URLSearchParams(window.location.search);
  const data: AttributionData = {
    referrer: document.referrer || undefined,
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    gclid: urlParams.get('gclid') || undefined,
    landing_page: window.location.pathname,
    first_visit_at: new Date().toISOString(),
    device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
  };

  // 有意義な情報がある場合のみ保存
  if (data.referrer || data.utm_source || data.gclid) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * 保存されている流入情報を取得する
 */
export function getAttributionData(): AttributionData | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}
