import fs from "fs";
import { prisma } from "../../index";

type AssemblyConstituencySeed = {
    id: number;
    name?: string;
    country_state_id?: number;
    created_at: string;
    updated_at: string;
    number?: number;
    parliamentary_constituency_id?: number;
    is_deleted?: boolean;
    category_type?: string;
    metadata?: any;
    total_population?: number;
    total_voters?: number;
    deleted_at?: string | null;
    mappings?: any;
    mapping_updated_at?: string | null;
    is_dummy?: boolean;
};

async function seed() {
    const filePath = "packages/db/prisma/Seeder/assembly_constituencies.json";
    const raw = fs.readFileSync(filePath, "utf-8");
    const data: AssemblyConstituencySeed[] = JSON.parse(raw);

    for (const row of data) {
        await prisma.assemblyConstituency.upsert({
            where: { id: row.id },
            update: {
                name: row.name,
                countryStateId: row.country_state_id,
                number: row.number,
                parliamentaryConstituencyId: row.parliamentary_constituency_id,
                isDeleted: row.is_deleted ?? false,
                categoryType: row.category_type,
                metadata: row.metadata,
                totalPopulation: row.total_population,
                totalVoters: row.total_voters,
                deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
                mappings: row.mappings || {},
                mappingUpdatedAt: row.mapping_updated_at
                    ? new Date(row.mapping_updated_at)
                    : null,
                isDummy: row.is_dummy ?? false,
                updatedAt: new Date(row.updated_at),
            },
            create: {
                id: row.id,
                name: row.name,
                countryStateId: row.country_state_id,
                number: row.number,
                parliamentaryConstituencyId: row.parliamentary_constituency_id,
                isDeleted: row.is_deleted ?? false,
                categoryType: row.category_type,
                metadata: row.metadata,
                totalPopulation: row.total_population,
                totalVoters: row.total_voters,
                deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
                mappings: row.mappings || {},
                mappingUpdatedAt: row.mapping_updated_at
                    ? new Date(row.mapping_updated_at)
                    : null,
                isDummy: row.is_dummy ?? false,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
            },
        });
    }

    console.log("AssemblyConstituency seeding completed successfully.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("AssemblyConstituency seeding failed:", err);
    process.exit(1);
});
