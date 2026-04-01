# Beauty Spot

百貨店・商業施設向けヘアアイロン設置サービスの法人導入窓口 + 施設別分析ダッシュボード

## Quick Start

```bash
# 全セットアップ（Docker必須）
make quickstart

# 開発サーバー起動
make dev
```

## セットアップ手順

### 1. 依存パッケージインストール

```bash
make install
```

### 2. 環境変数設定

```bash
make env-setup      # .env.example → .env にコピー
make generate-keys  # 暗号化キーを生成
```

`.env` を編集して各値を設定してください。

### 3. データベース起動

```bash
make docker-db      # Docker で PostgreSQL 起動
```

### 4. マイグレーション実行

```bash
make db-migrate
```

### 5. シードデータ投入

```bash
make db-seed
```

### 6. 開発サーバー起動

```bash
make dev
```

## テストアカウント

| 種別 | メール | パスワード |
|------|--------|-----------|
| 管理者 | admin@beautyspot.example | Password123! |
| 銀座店 | ginza@example.com | Password123! |
| 渋谷店 | shibuya@example.com | Password123! |
| 横浜店 | yokohama@example.com | Password123! |

## Makeコマンド一覧

```bash
make help  # ターミナルで全コマンドと説明を表示
```

### セットアップ

| コマンド | 役割 |
|---------|------|
| `make install` | npm依存パッケージを一括インストール |
| `make env-setup` | `.env.example` を `.env` にコピー（既存がある場合はスキップ） |
| `make setup` | `install` + `env-setup` + `prisma-generate` をまとめて実行する初期セットアップ |
| `make quickstart` | `setup` + Docker DB起動 + マイグレーション + seed を一括実行。初回はこれだけでOK |
| `make generate-keys` | `FIELD_ENCRYPTION_KEY` / `PHONE_HASH_SECRET` / `NEXTAUTH_SECRET` のランダム値を生成して表示 |

### 開発

| コマンド | 役割 |
|---------|------|
| `make dev` | Next.js開発サーバーをTurbopackで起動（http://localhost:3000） |
| `make build` | Next.jsのプロダクションビルドを実行 |
| `make start` | ビルド済みのプロダクションサーバーを起動 |
| `make lint` | ESLintによるコード静的解析を実行 |
| `make format` | Prettierで全ファイルのコードフォーマットを整形 |
| `make type-check` | TypeScriptの型チェックのみ実行（`tsc --noEmit`） |

### データベース - Docker

| コマンド | 役割 |
|---------|------|
| `make docker-db` | PostgreSQL 16をDockerコンテナで起動（ポート5432、データはボリュームに永続化） |
| `make docker-db-stop` | PostgreSQLコンテナを停止・削除（データボリュームは残る） |
| `make docker-db-clean` | コンテナ停止 + データボリュームも完全削除。DBを白紙に戻したいときに使用 |
| `make docker-db-logs` | PostgreSQLコンテナのログをリアルタイム表示（デバッグ用） |
| `make db-create` | `docker-db` のエイリアス。ローカルDB作成 |

### データベース - Prisma

| コマンド | 役割 |
|---------|------|
| `make prisma-generate` | Prisma Clientを生成。スキーマ変更後に実行 |
| `make prisma-format` | `schema.prisma` のフォーマットを整形 |
| `make db-migrate` | 開発用マイグレーション実行（`prisma migrate dev`）。スキーマ変更をSQLに変換してDBに適用 |
| `make db-migrate-deploy` | 本番用マイグレーション実行（`prisma migrate deploy`）。既存のマイグレーションファイルのみ適用 |
| `make db-push` | マイグレーションファイルを作らずスキーマを直接DBに反映。プロトタイピング時に便利 |
| `make db-seed` | シードデータ投入。テスト用の施設3件・アカウント4件・ダミー集計データを作成 |
| `make db-studio` | Prisma Studio（ブラウザGUI）を起動。テーブルの中身を直接確認・編集 |
| `make db-reset` | DB全テーブルを削除→マイグレーション再実行→seed投入。データを初期状態に戻す |
| `make db-fresh` | Dockerボリュームごと削除→DB再作成→マイグレーション→seed。完全にゼロからやり直す |

### 集計ジョブ

| コマンド | 役割 |
|---------|------|
| `make aggregate-daily` | 前日分の日次集計を実行。施設ごとの利用回数・ユニーク数・新規/リピート率を計算 |
| `make aggregate-monthly` | 前月分の月次ロールアップを実行。日次→月次の集計 + 年代・曜日・時間帯などのディメンション集計 |
| `make aggregate-yearly` | 当年分の年次ロールアップを実行。月次→年次の集計 + ディメンション集計 |
| `make aggregate-cumulative` | 全期間の累計ロールアップを実行。リピート頻度バケット・初回→2回目日数分布も算出 |
| `make aggregate-all` | 上記4つの集計ジョブを順番にすべて実行 |

### テスト

| コマンド | 役割 |
|---------|------|
| `make test` | Vitestでユニット/インテグレーションテストを一括実行 |
| `make test-watch` | Vitestをウォッチモードで起動。ファイル変更時に自動再実行 |
| `make test-e2e` | PlaywrightでE2Eテストを実行 |

### デプロイ

| コマンド | 役割 |
|---------|------|
| `make deploy-preview` | Vercelのプレビュー環境にデプロイ。PRレビュー用 |
| `make deploy-prod` | Vercelの本番環境にデプロイ |

### ユーティリティ

| コマンド | 役割 |
|---------|------|
| `make clean` | `node_modules` と `.next` を削除。依存関係やビルドキャッシュの問題解消に使用 |
| `make logs` | 開発サーバーのログをtail表示 |
| `make check-env` | 必須環境変数（`DATABASE_URL`, `NEXTAUTH_SECRET`, `FIELD_ENCRYPTION_KEY`, `PHONE_HASH_SECRET`）が設定されているか検証 |

## CSV取込手順

1. 管理者でログイン
2. `/admin/imports` にアクセス
3. 施設を選択
4. サンプルCSV形式に合わせたファイルをアップロード
5. 取込結果を確認

サンプルCSV: `public/samples/form-response-sample.csv`

## 集計ジョブ

```bash
make aggregate-daily       # 日次集計
make aggregate-monthly     # 月次ロールアップ
make aggregate-yearly      # 年次ロールアップ
make aggregate-cumulative  # 累計ロールアップ
make aggregate-all         # 全集計実行
```

Vercel Cron設定例:

| ジョブ | スケジュール |
|--------|------------|
| daily | `0 17 * * *` (JST 02:00) |
| monthly | `30 17 1 * *` (JST 02:30) |
| yearly | `0 18 1 1 *` (JST 03:00) |
| cumulative | `30 18 * * *` (JST 03:30) |

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Auth.js (NextAuth v5)
- Recharts
- Resend (Email)
