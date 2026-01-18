-- store_top_configs テーブル作成用SQL

CREATE TABLE IF NOT EXISTS "store_top_configs" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_top_configs_pkey" PRIMARY KEY ("id")
);

-- store_id に対するユニークインデックス（1店舗につき1つの設定）
CREATE UNIQUE INDEX IF NOT EXISTS "store_top_configs_store_id_key" ON "store_top_configs"("store_id");

-- 外部キー制約（Storeテーブルが存在し、テーブル名が "Store" の場合）
-- テーブル名が異なる場合（例: "stores"）は適宜変更してください。
-- ALTER TABLE "store_top_configs" ADD CONSTRAINT "store_top_configs_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
