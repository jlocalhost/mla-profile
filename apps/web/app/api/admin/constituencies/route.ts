
import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
    try {
        const constituencies = await prisma.assemblyConstituency.findMany({
            where: {
                countryState: {
                    name: "Rajasthan",
                }
            },
            select: {
                id: true,
                number: true,
                name: true,
            },
            orderBy: {
                number: 'asc'
            }
        });

        return NextResponse.json(constituencies);
    } catch (error) {
        console.error("Error fetching constituencies for template:", error);
        return NextResponse.json(
            { error: "Failed to fetch constituency list" },
            { status: 500 }
        );
    }
}
