
import { prisma } from "./packages/db/index";
import * as fs from "fs";

const FAKE_NAMES = ["Ramesh Kumar", "Suresh Sharma", "Priya Verma", "Sunita Devi", "Mohan Lal"];
const FAKE_CASTES = ["General", "OBC", "SC", "ST"];
const FAKE_CATEGORIES = ["GEN", "OBC", "SC", "ST"];
const FAKE_PARTIES = ["BJP", "INC", "AAP", "Independent", "BSP"];
const FAKE_OCCUPATIONS = ["Politician", "Businessman", "Lawyer", "Teacher", "Farmer"];
const FAKE_QUALIFICATIONS = ["Graduate", "Post Graduate", "10th Pass", "12th Pass", "PhD"];
const FAKE_GRADES = ["A", "B", "C", "D"];

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateFakeCSV() {
    console.log("Fetching constituencies...");

    const state = await prisma.countryState.findFirst({
        where: { name: "Rajasthan" }
    });

    if (!state) {
        console.log("State not found");
        return;
    }

    const constituencies = await prisma.assemblyConstituency.findMany({
        where: { countryStateId: state.id },
        select: { id: true, number: true, name: true },
        orderBy: { number: 'asc' }
    });

    console.log(`Found ${constituencies.length} constituencies`);

    // CSV Headers
    const headers = "ac_id,ac_number,ac_name,name,caste,category,ad_name,party_name,age,qualification,occupation,political_background,political_journey,ac_grade,total_voters,male_voters,female_voters,last_ae_turnout";

    const rows = [headers];

    for (const ac of constituencies) {
        const totalVoters = randomInt(100000, 300000);
        const maleVoters = Math.floor(totalVoters * 0.52);
        const femaleVoters = totalVoters - maleVoters;

        const row = [
            ac.id,
            ac.number,
            `"${ac.name}"`,
            `"${randomFrom(FAKE_NAMES)}"`,
            randomFrom(FAKE_CASTES),
            randomFrom(FAKE_CATEGORIES),
            `"AD-${ac.number}"`,
            randomFrom(FAKE_PARTIES),
            randomInt(35, 70),
            randomFrom(FAKE_QUALIFICATIONS),
            randomFrom(FAKE_OCCUPATIONS),
            `"Won from ${ac.name} in 2018"`,
            `"Active since ${randomInt(1990, 2010)}"`,
            randomFrom(FAKE_GRADES),
            totalVoters,
            maleVoters,
            femaleVoters,
            (Math.random() * 30 + 50).toFixed(2)
        ].join(",");

        rows.push(row);
    }

    const csvContent = rows.join("\n");
    const outputPath = "./test_mla_info.csv";

    fs.writeFileSync(outputPath, csvContent);
    console.log(`Generated CSV with ${constituencies.length} rows at ${outputPath}`);
}

generateFakeCSV()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
