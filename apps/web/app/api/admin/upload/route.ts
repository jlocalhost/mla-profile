
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

// Simple CSV parser
function parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, string> = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
        });
        rows.push(row);
    }

    return rows;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const table = formData.get("table") as string | null;

        if (!file || !table) {
            return NextResponse.json(
                { error: "Missing file or table type" },
                { status: 400 }
            );
        }

        const csvText = await file.text();
        const rows = parseCSV(csvText);

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "No data rows found in CSV" },
                { status: 400 }
            );
        }

        let processed = 0;
        let errors: string[] = [];

        if (table === "mla_info") {
            for (const row of rows) {
                const acId = parseInt(row.ac_id);
                if (isNaN(acId)) {
                    errors.push(`Invalid ac_id: ${row.ac_id}`);
                    continue;
                }

                try {
                    // Check if record exists for this AC
                    const existing = await prisma.mlaInformation.findFirst({
                        where: { assemblyConstituencyId: acId }
                    });

                    if (existing) {
                        // Update existing record
                        await prisma.mlaInformation.update({
                            where: { id: existing.id },
                            data: {
                                name: row.name || undefined,
                                caste: row.caste || undefined,
                                category: row.category || undefined,
                                adName: row.ad_name || undefined,
                                partyName: row.party_name || undefined,
                                age: row.age ? parseInt(row.age) : undefined,
                                qualification: row.qualification || undefined,
                                occupation: row.occupation || undefined,
                                politicalBackground: row.political_background || undefined,
                                politicalJourney: row.political_journey || undefined,
                                acGrade: row.ac_grade || undefined,
                                totalVoters: row.total_voters ? parseInt(row.total_voters) : undefined,
                                maleVoters: row.male_voters ? parseInt(row.male_voters) : undefined,
                                femaleVoters: row.female_voters ? parseInt(row.female_voters) : undefined,
                                lastAeTurnout: row.last_ae_turnout ? parseFloat(row.last_ae_turnout) : undefined,
                            }
                        });
                    } else {
                        // Create new record with proper relation syntax
                        await prisma.mlaInformation.create({
                            data: {
                                assemblyConstituency: { connect: { id: acId } },
                                name: row.name || null,
                                caste: row.caste || null,
                                category: row.category || null,
                                adName: row.ad_name || null,
                                partyName: row.party_name || null,
                                age: row.age ? parseInt(row.age) : null,
                                qualification: row.qualification || null,
                                occupation: row.occupation || null,
                                politicalBackground: row.political_background || null,
                                politicalJourney: row.political_journey || null,
                                acGrade: row.ac_grade || null,
                                totalVoters: row.total_voters ? parseInt(row.total_voters) : null,
                                maleVoters: row.male_voters ? parseInt(row.male_voters) : null,
                                femaleVoters: row.female_voters ? parseInt(row.female_voters) : null,
                                lastAeTurnout: row.last_ae_turnout ? parseFloat(row.last_ae_turnout) : null,
                            }
                        });
                    }
                    processed++;
                } catch (e: any) {
                    errors.push(`Row ac_id ${acId}: ${e.message}`);
                }
            }
        } else if (table === "mla_social") {
            for (const row of rows) {
                const acId = parseInt(row.ac_id);
                if (isNaN(acId)) {
                    errors.push(`Invalid ac_id: ${row.ac_id}`);
                    continue;
                }

                try {
                    await prisma.mlaSocialMedia.create({
                        data: {
                            assemblyConstituency: { connect: { id: acId } },
                            platform: row.platform || null,
                            profileLink: row.profile_link || null,
                            accountVerified: row.account_verified === 'true',
                            followers: row.followers || null,
                            posts: row.posts ? parseInt(row.posts) : null,
                            engagement: row.engagement || null,
                            overallRating: row.overall_rating ? parseFloat(row.overall_rating) : null,
                        }
                    });
                    processed++;
                } catch (e: any) {
                    errors.push(`Row ac_id ${acId}: ${e.message}`);
                }
            }
        } else if (table === "election_results") {
            for (const row of rows) {
                const acId = parseInt(row.ac_id);
                if (isNaN(acId)) {
                    errors.push(`Invalid ac_id: ${row.ac_id}`);
                    continue;
                }

                try {
                    await prisma.previousElectionResult.create({
                        data: {
                            assemblyConstituency: { connect: { id: acId } },
                            electionYear: row.election_year ? parseInt(row.election_year) : null,
                            electionType: row.election_type || null,
                            candidate: row.candidate || null,
                            candidateCaste: row.candidate_caste || null,
                            party: row.party || null,
                            votes: row.votes_get ? parseInt(row.votes_get) : null,
                        }
                    });
                    processed++;
                } catch (e: any) {
                    errors.push(`Row ac_id ${acId}: ${e.message}`);
                }
            }
        } else if (table === "ground_report") {
            return NextResponse.json(
                { error: "Ground Report upload not yet implemented" },
                { status: 501 }
            );
        } else {
            return NextResponse.json(
                { error: `Unknown table type: ${table}` },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            processed,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
