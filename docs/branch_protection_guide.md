# main ブランチ保護（Branch Protection）設定手順書

本手順書に従い、GitHub コンソール上で `main` ブランチの保護ルールを設定してください。
これにより、CI（`Security & Quality Audit` ジョブ）が成功しない限り `main` ブランチへの直接 push および未検証コードのマージがブロックされます。

---

## 設定手順

1. **GitHub リポジトリの Settings を開く**
   - GitHub 上のリポジトリページにアクセスし、上部メニューの **`Settings`** をクリックします。

2. **ブランチ保護ルールの追加**
   - 左側サイドバーの **`Code and automation`** セクション内にある **`Branches`** を選択します。
   - **`Add branch protection rule`** ボタンをクリックします（既存のルールがある場合は `Edit`）。

3. **ブランチパターンの指定**
   - **`Branch name pattern`** に `main` と入力します。

4. **保護ルールの適用**
   以下の項目にチェックを入れます：

   - [x] **`Require a pull request before merging`**
     - （PR経由のマージを必須化し、直接 `git push origin main` を防止します）
   - [x] **`Require status checks to pass before merging`**
     - チェックを入れると下に検索ボックスが表示されます。
     - 検索窓に **`Security & Quality Audit`** と入力し、対象のステータスチェックを選択して追加します。
     - **`Require branches to be up to date before merging`** にもチェックを入れます。

5. **保存**
   - 画面最下部の **`Create`**（または **`Save changes`**）をクリックして保存します。

---

## 運用時の流れ

1. 新機能や修正作業時は、ローカルで作業ブランチを作成（例: `git checkout -b feature/xxxx`）。
2. 作業完了後、`git push origin feature/xxxx` して Pull Request を作成。
3. GitHub Actions CI（`Security & Quality Audit`）が自動起動：
   - `gitleaks` (秘密情報スキャン)
   - `tsc --noEmit` (型チェック)
   - `eslint` (コード規範)
   - `vitest` (SEO・単体テスト)
   - `prisma validate` (DBスキーマ検証)
4. CIが緑（Pass）になり、Vercel プレビュービルドで実機確認できたら `main` にマージ。
