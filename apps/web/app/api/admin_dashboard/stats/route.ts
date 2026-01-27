import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
    try {
        const totalUsers = await prisma.user.count({
            where: { isActive: true }
        });

        // Add other stats fetch here parallelly if needed
        return NextResponse.json({ totalUsers });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats", details: String(error) }, { status: 500 });
    }
}
