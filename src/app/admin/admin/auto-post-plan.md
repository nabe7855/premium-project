# AI自動投稿管理機能 UI開発計画書

## 1. 概要

`premium-project` の管理画面（`/admin/admin/`）に、AIを活用したポータルサイト（kaikan, kaikanwork）への自動投稿管理機能を追加する。

## 2. 開発場所 (Directries)

- **ページパス**: `src/app/admin/admin/auto-post/`
- **コンポーネント**: `src/components/admin/auto-post/`
- **API**: `src/app/api/ai/generate-post/` (既存)

## 3. 実現する機能 (UI)

1.  **AI記事生成ダッシュボード**:
    - テーマ入力フォーム
    - AI生成プレビュー（タイトル・本文）
    - 「承認して予約」ボタン
2.  **投稿スケジュール一覧**:
    - 予約済み記事のリスト（編集・削除可能）
    - 投稿ステータス（待機中、完了、失敗）の可視化
3.  **実行エンジン(Python) 監視ステータス**:
    - 最終稼働時刻の表示
    - 更新ボタン実行履歴の簡易表示
4.  **LINE通知設定確認**:
    - 通知が有効かどうかの確認UI

## 4. データベース構成 (再確認)

- `auto_posts`: 記事データ、予約時間、ステータス
- `auto_logs`: 投稿実行ログ
- `update_logs`: 更新ボタン実行履歴

## 5. ステップ別実装スケジュール

### Phase 1: 基礎構造作成 (完了)

- [x] `src/app/admin/admin/auto-post/page.tsx` の作成
- [x] メインレイアウト（タブ切り替え：作成 / 予約一覧 / 履歴）の実装
- [x] サイドバーへのメニュー追加、AdminLayoutへのタイトル追加

### Phase 2: AI記事生成機能 (完了)

- [x] `PostGenerator` コンポーネントの実装
- [x] AI生成APIとの接続
- [x] 生成記事のプレビューUI作成
- [x] 画像アップロード・プレビュー対応
- [x] 求人ニュース(kaikanwork news)対応

### Phase 3: 投稿管理・承認フロー (完了)

- [x] `PostList` コンポーネントの実装（保存済み記事の表示）
- [x] ステータス更新（承認 / 下書き）機能の実装
- [x] 予約削除機能の実装
- [x] 実行履歴の表示対応

### Phase 4: モニタリング・調整 (完了)

- [x] `StatusBoard` の実装（Python側の稼働状況をSQLから取得）
- [x] 更新ボタンの実行履歴表示
- [x] 投稿アクションログの表示
- [x] システム稼働状態の自動判定
- [x] 全体的なデザイン調整 (Tailwind CSS)

## 6. 技術スタック

- **Framework**: Next.js (App Router)
- **UI Components**: Lucide React (Icons), Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Database**: Supabase Client SDK
