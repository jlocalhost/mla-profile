
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const party = searchParams.get("party");
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const sentiment = searchParams.get("sentiment"); // "good", "average", "critical"
        const acId = searchParams.get("acId");

        const where: any = {};

        if (party) {
            // Case-insensitive party matching
            if (party.toLowerCase() === "others") {
                where.NOT = {
                    partyName: {
                        in: ["BJP", "INC", "IND", "BJP (Bharatiya Janata Party)", "Indian National Congress", "Independent"]
                    }
                };
            } else if (party.toLowerCase() === "ind") {
                where.partyName = { in: ["IND", "Independent", "निर्वाचन क्षेत्र", "निर्दलीय"] };
            } else if (party.toLowerCase() === "bjp") {
                where.partyName = { contains: "BJP", mode: 'insensitive' };
            } else if (party.toLowerCase() === "inc") {
                where.partyName = { contains: "INC", mode: 'insensitive' };
            } else {
                where.partyName = { contains: party, mode: 'insensitive' };
            }
        }

        if (category) {
            where.category = { contains: category, mode: 'insensitive' };
        }

        if (search) {
            const searchConditions: any[] = [
                { name: { contains: search, mode: 'insensitive' } },
                { adName: { contains: search, mode: 'insensitive' } },
                { partyName: { contains: search, mode: 'insensitive' } },
                { caste: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { qualification: { contains: search, mode: 'insensitive' } },
                { occupation: { contains: search, mode: 'insensitive' } },
                { acGrade: { contains: search, mode: "insensitive" } },
                { assemblyConstituency: { name: { contains: search, mode: 'insensitive' } } }
            ];

            // Add numeric check for age if search is a valid number
            const searchNum = parseInt(search);
            if (!isNaN(searchNum)) {
                searchConditions.push({ age: searchNum });
            }

            where.OR = searchConditions;
        }

        if (acId) {
            where.assemblyConstituencyId = parseInt(acId);
        }

        // Mock sentiment filtering using acGrade for now if real sentiment isn't in MlaInformation
        if (sentiment) {
            if (sentiment === "good") where.acGrade = { in: ["A", "A+"] };
            if (sentiment === "average") where.acGrade = { in: ["B", "B+"] };
            if (sentiment === "critical") where.acGrade = { in: ["C", "D"] };
        }

        const mlas = await prisma.mlaInformation.findMany({
            where,
            include: {
                assemblyConstituency: {
                    select: {
                        name: true,
                        number: true,
                    },
                },
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({
            count: mlas.length,
            mlas: mlas.map((mla) => ({
                id: mla.id,
                name: mla.name,
                age: mla.age,
                category: mla.category,
                caste: mla.caste,
                qualification: mla.qualification,
                occupation: mla.occupation,
                party: mla.partyName,
                acName: mla.assemblyConstituency?.name,
                acNumber: mla.assemblyConstituency?.number,
                adName: mla.adName,
                image: "/single_person.png", // Default placeholder
                grade: mla.acGrade
            }))
        });
    } catch (error) {
        console.error("Error searching MLAs:", error);
        return NextResponse.json(
            { error: "Failed to search MLAs" },
            { status: 500 }
        );
    }
}
