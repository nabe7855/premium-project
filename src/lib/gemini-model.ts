/**
 * 使用する Gemini モデルを実行時に解決する。
 *
 * 背景:
 *   モデル名をコードに直書きすると、提供終了のたびに 404 で機能が停止する。
 *   実際 gemini-1.5-flash 終了時は4箇所中3箇所が更新漏れとなり、
 *   その後 gemini-2.5-flash に揃えても本番キーでは下記が返った。
 *
 *     [404] This model models/gemini-2.5-flash is no longer available to new users.
 *
 *   利用可能なモデルは API キー（プロジェクト）ごとに異なるため、
 *   どの名前を直書きしても環境によって動かない可能性が残る。
 *
 * 方針:
 *   ListModels で「そのキーで実際に generateContent が使えるモデル」を取得し、
 *   優先順に最初に見つかったものを採用する。結果はプロセス内にキャッシュするため
 *   追加のリクエストはコールドスタート時の1回のみ。
 */

/** 優先順。先頭の gemini-flash-latest は常に現行 flash を指すエイリアス */
const PREFERRED_MODELS = [
  'gemini-flash-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

/** ListModels に失敗した場合に使う最終フォールバック */
const FALLBACK_MODEL = 'gemini-flash-latest';

let cachedModel: string | null = null;

export async function resolveGeminiModel(apiKey: string): Promise<string> {
  if (cachedModel) return cachedModel;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=200`,
    );

    if (res.ok) {
      const json: any = await res.json();
      const available = new Set<string>(
        (json?.models ?? [])
          .filter((m: any) => m?.supportedGenerationMethods?.includes('generateContent'))
          .map((m: any) => String(m.name).replace(/^models\//, '')),
      );

      const picked = PREFERRED_MODELS.find((name) => available.has(name));
      if (picked) {
        cachedModel = picked;
        console.log(`[Gemini] 使用モデル: ${picked}`);
        return picked;
      }

      console.error(
        '[Gemini] 優先モデルがどれも利用できません。利用可能:',
        [...available].slice(0, 20).join(', '),
      );
    } else {
      console.error(`[Gemini] ListModels 失敗: HTTP ${res.status}`);
    }
  } catch (error) {
    console.error('[Gemini] ListModels でエラー:', error);
  }

  return FALLBACK_MODEL;
}
