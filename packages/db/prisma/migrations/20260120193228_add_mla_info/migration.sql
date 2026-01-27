-- CreateTable
CREATE TABLE "mla_information" (
    "id" SERIAL NOT NULL,
    "ac_id" INTEGER,
    "name" VARCHAR,
    "caste" VARCHAR,
    "category" VARCHAR,
    "age" INTEGER,
    "qualification" VARCHAR,
    "occupation" VARCHAR,
    "political_background" TEXT,
    "family_members" JSONB,
    "political_journey" TEXT,
    "ac_grade" VARCHAR,
    "total_voters" INTEGER,
    "male_voters" INTEGER,
    "female_voters" INTEGER,
    "last_ae_turnout" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mla_information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mla_information_ac_id_idx" ON "mla_information"("ac_id");

-- AddForeignKey
ALTER TABLE "mla_information" ADD CONSTRAINT "mla_information_ac_id_fkey" FOREIGN KEY ("ac_id") REFERENCES "assembly_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
