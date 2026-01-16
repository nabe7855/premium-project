-- Create RecruitPage table
CREATE TABLE "RecruitPage" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "section_key" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitPage_pkey" PRIMARY KEY ("id")
);

-- Create Index for unique constraint on store_id + section_key
CREATE UNIQUE INDEX "RecruitPage_store_id_section_key_key" ON "RecruitPage"("store_id", "section_key");

-- Add ForeignKey
ALTER TABLE "RecruitPage" ADD CONSTRAINT "RecruitPage_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
