-- CreateTable
CREATE TABLE "mla_social_media" (
    "id" SERIAL NOT NULL,
    "ac_id" INTEGER,
    "platform" VARCHAR,
    "profile_link" VARCHAR,
    "account_verified" BOOLEAN DEFAULT false,
    "followers" VARCHAR,
    "posts" INTEGER,
    "engagement" VARCHAR,
    "overall_rating" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mla_social_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mla_social_media_ac_id_idx" ON "mla_social_media"("ac_id");

-- AddForeignKey
ALTER TABLE "mla_social_media" ADD CONSTRAINT "mla_social_media_ac_id_fkey" FOREIGN KEY ("ac_id") REFERENCES "assembly_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
