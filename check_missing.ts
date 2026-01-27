
import { prisma } from "./packages/db/index";

async function checkMissingConstituencies() {
    console.log("Checking Missing AC Data...");

    const targetNumbers = [46, 68, 130, 153, 163];

    const state = await prisma.countryState.findFirst({
        where: { name: "Rajasthan" }
    });

    if (!state) {
        console.log("State not found");
        return;
    }

    const constituencies = await prisma.assemblyConstituency.findMany({
        where: {
            countryStateId: state.id,
            number: { in: targetNumbers }
        },
        select: {
            id: true,
            name: true,
            number: true,
            metadata: true
        }
    });

    console.log(`Found ${constituencies.length} out of ${targetNumbers.length} requested constituencies.`);

    constituencies.forEach(c => {
        console.log(`\n----- AC #${c.number} (${c.name}) -----`);
        const meta = c.metadata as any;

        if (!meta) {
            console.log("Metadata: NULL");
            return;
        }

        console.log("Metadata Keys:", Object.keys(meta));

        if (meta.geometry) {
            if (Array.isArray(meta.geometry)) {
                console.log(`Geometry: Array of ${meta.geometry.length} strings`);
                console.log(`First String Length: ${meta.geometry[0]?.length}`);
                console.log(`Sample: ${meta.geometry[0]?.substring(0, 50)}...`);
            } else {
                console.log("Geometry: Present but not array", typeof meta.geometry);
            }
        } else {
            console.log("Geometry: MISSING in metadata");
        }

        console.log("AC_NO match:", meta.AC_NO === c.number);
    });
}

checkMissingConstituencies()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
