# cast_knowledge/  — キャスト別ナレッジ蓄積ディレクトリ

## 構造

```
cast_knowledge/
├── README.md          ← このファイル
├── sai/               ← キャスト「サイ」
│   ├── 2026-04-28_interview_raw.txt   ← 初回インタビュー文字起こし
│   ├── profile_structured.json        ← 構造化プロフィール（生成後）
│   ├── article_draft_v1.md            ← 記事ドラフト
│   └── photos/                        ← 提供写真
├── {cast_name}/       ← 新規キャストごとにフォルダ追加
│   ├── YYYY-MM-DD_interview_raw.txt
│   ├── profile_structured.json
│   ├── article_draft_v1.md
│   └── photos/
```

## 命名規則

- フォルダ名：源氏名のローマ字小文字（例: `sai`, `ren`, `kai`）
- インタビュー：`YYYY-MM-DD_interview_raw.txt`
- 追加取材：`YYYY-MM-DD_followup_N.txt`
- ホテルレビュー素材：`hotels/` サブフォルダ

## 運用ルール

1. 新キャスト入店 → フォルダ作成 → インタビュー音声収録 → 文字起こしを格納
2. 構造化 JSON は自動パイプラインが生成（手動作成も可）
3. 記事ドラフトは LLM 生成 → 人間レビュー → 公開の流れ
4. 写真は本人確認済みのもののみ格納
