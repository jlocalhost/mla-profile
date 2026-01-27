-- CreateTable
CREATE TABLE "country_states" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "state_code" VARCHAR,
    "is_deleted" BOOLEAN DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "zoom" DOUBLE PRECISION,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "capital" VARCHAR,
    "svg_path" VARCHAR,
    "outer_svg_path" VARCHAR,
    "office_address" VARCHAR,
    "level_wise_deletion" JSONB DEFAULT '{}',
    "emblem" VARCHAR,
    "is_dummy" BOOLEAN DEFAULT false,

    CONSTRAINT "country_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assembly_constituencies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR,
    "country_state_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "number" INTEGER,
    "parliamentary_constituency_id" INTEGER,
    "is_deleted" BOOLEAN DEFAULT false,
    "category_type" VARCHAR,
    "metadata" JSONB,
    "total_population" INTEGER,
    "total_voters" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "mappings" JSONB NOT NULL DEFAULT '{}',
    "mapping_updated_at" TIMESTAMP(3),
    "is_dummy" BOOLEAN DEFAULT false,

    CONSTRAINT "assembly_constituencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assembly_constituencies_country_state_id_idx" ON "assembly_constituencies"("country_state_id");

-- CreateIndex
CREATE INDEX "assembly_constituencies_deleted_at_idx" ON "assembly_constituencies"("deleted_at");

-- CreateIndex
CREATE INDEX "assembly_constituencies_parliamentary_constituency_id_idx" ON "assembly_constituencies"("parliamentary_constituency_id");

-- AddForeignKey
ALTER TABLE "assembly_constituencies" ADD CONSTRAINT "assembly_constituencies_country_state_id_fkey" FOREIGN KEY ("country_state_id") REFERENCES "country_states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
