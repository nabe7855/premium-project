/**
 * Gemini のモデル名を一箇所で管理する。
 *
 * 各ファイルに直書きすると、モデルの提供終了時に更新漏れが発生する。
 * 実際 gemini-1.5-flash の提供終了時、コード内4箇所のうち
 * geminiService.ts だけが更新され、残り3箇所が古いまま 404 を返していた。
 *
 *   [404 Not Found] models/gemini-1.5-flash is not found for API version v1beta
 *
 * モデルを切り替える際はこのファイルだけを変更すればよい。
 */

/** テキスト生成・画像入力・JSONモードのいずれにも対応する標準モデル */
export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
