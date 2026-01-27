
import { prisma } from "./packages/db/index";

async function checkData() {
    console.log("Checking DB Data...");

    const state = await prisma.countryState.findFirst({
        where: { name: "Rajasthan" }
    });
    console.log("State:", state);

    if (!state) {
        console.log("Rajasthan State not found!");
        return;
    }

    const count = await prisma.assemblyConstituency.count({
        where: { countryStateId: state.id }
    });
    console.log("Total Constituencies linked to state:", count);

    const metaCount = await prisma.assemblyConstituency.count({
        where: {
            countryStateId: state.id,
            metadata: { not: {} }
        }
    });
    console.log("Constituencies with non-empty metadata:", metaCount);

    if (metaCount > 0) {
        const sample = await prisma.assemblyConstituency.findFirst({
            where: {
                countryStateId: state.id,
                metadata: { not: {} }
            },
            select: { metadata: true }
        });
        console.log("Sample Metadata Type:", typeof sample?.metadata);
        console.log("Sample Metadata Is Object:", typeof sample?.metadata === 'object');
        console.log("Sample Metadata Has Type:", (sample?.metadata as any)?.type);
    }
}

checkData()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
