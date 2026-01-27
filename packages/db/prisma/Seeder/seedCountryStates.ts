import fs from "fs";
import { prisma } from "../../index";

type CountryStateSeed = {
    id: number;
    name?: string;
    created_at: string;
    updated_at: string;
    state_code?: string;
    is_deleted?: boolean;
    latitude?: number;
    longitude?: number;
    zoom?: number;
    preferences?: any;
    deleted_at?: string | null;
    capital?: string;
    svg_path?: string;
    outer_svg_path?: string;
    office_address?: string;
    level_wise_deletion?: any;
    emblem?: string;
    is_dummy?: boolean;
};

async function seed() {
    const filePath = "packages/db/prisma/Seeder/country_states.json";
    const raw = fs.readFileSync(filePath, "utf-8");
    const data: CountryStateSeed[] = JSON.parse(raw);

    for (const row of data) {
        await prisma.countryState.upsert({
            where: { id: row.id },
            update: {
                name: row.name,
                stateCode: row.state_code,
                isDeleted: row.is_deleted,
                latitude: row.latitude,
                longitude: row.longitude,
                zoom: row.zoom,
                preferences: row.preferences || {},
                deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
                capital: row.capital,
                svgPath: row.svg_path,
                outerSvgPath: row.outer_svg_path,
                officeAddress: row.office_address,
                levelWiseDeletion: row.level_wise_deletion || {},
                emblem: row.emblem,
                isDummy: row.is_dummy,
                updatedAt: new Date(row.updated_at),
            },
            create: {
                id: row.id,
                name: row.name,
                stateCode: row.state_code,
                isDeleted: row.is_deleted ?? false,
                latitude: row.latitude,
                longitude: row.longitude,
                zoom: row.zoom,
                preferences: row.preferences || {},
                deletedAt: row.deleted_at ? new Date(row.deleted_at) : null,
                capital: row.capital,
                svgPath: row.svg_path,
                outerSvgPath: row.outer_svg_path,
                officeAddress: row.office_address,
                levelWiseDeletion: row.level_wise_deletion || {},
                emblem: row.emblem,
                isDummy: row.is_dummy ?? false,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
            }
        });
    }

    console.log("CountryState seeding completed successfully.");
    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
