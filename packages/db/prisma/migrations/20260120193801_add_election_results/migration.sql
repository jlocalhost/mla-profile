-- CreateTable
CREATE TABLE "previous_election_results" (
    "id" SERIAL NOT NULL,
    "ac_id" INTEGER,
    "election_year" INTEGER,
    "election_type" VARCHAR,
    "candidate" VARCHAR,
    "candidate_caste" VARCHAR,
    "party" VARCHAR,
    "votes_get" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "previous_election_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "previous_election_results_ac_id_idx" ON "previous_election_results"("ac_id");

-- AddForeignKey
ALTER TABLE "previous_election_results" ADD CONSTRAINT "previous_election_results_ac_id_fkey" FOREIGN KEY ("ac_id") REFERENCES "assembly_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
