
import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET() {
    try {
        const constituencies = await prisma.assemblyConstituency.findMany({
            where: {
                countryState: {
                    name: "Rajasthan",
                },
                metadata: {
                    not: {},
                },
            },
            select: {
                id: true,
                name: true,
                number: true,
                metadata: true,
                mlaInformation: {
                    select: {
                        partyName: true,
                        name: true,
                        age: true,
                        category: true,
                        caste: true,
                        adName: true,
                        qualification: true,
                        occupation: true,
                        acGrade: true,
                    },
                    take: 1, // Get the first (most recent) entry
                },
            },
        });

        const features = constituencies
            .filter((c) => {
                const m = c.metadata as any;
                // Check if metadata has a geometry field, as per user's structure: { geometry: [], AC_NO: ..., AC_NAME: ... }
                return m && m.geometry && typeof m.geometry === "object";
            })
            .map((c: any) => {
                const m = c.metadata;
                const mlaInfo = c.mlaInformation?.[0];

                // Parse geometry: Array of strings -> Array of Array of [number, number]
                // Each string is a ring: "lng,lat lng,lat ..."
                let coordinates: number[][][] = [];

                if (Array.isArray(m.geometry)) {
                    coordinates = m.geometry.map((ringStr: string) => {
                        return ringStr.trim().split(" ").map((coordPair: string) => {
                            const [lng, lat] = coordPair.split(",").map(Number);
                            return [lng, lat];
                        });
                    });
                }

                return {
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: coordinates
                    },
                    properties: {
                        id: c.id,
                        name: c.name,
                        number: c.number,
                        acId: c.id,
                        original_ac_no: m.AC_NO,
                        original_ac_name: m.AC_NAME,
                        partyName: mlaInfo?.partyName || null,
                        mlaName: mlaInfo?.name || null,
                        age: mlaInfo?.age || null,
                        category: mlaInfo?.category || null,
                        caste: mlaInfo?.caste || null,
                        adName: mlaInfo?.adName || null,
                        qualification: mlaInfo?.qualification || null,
                        occupation: mlaInfo?.occupation || null,
                        grade: mlaInfo?.acGrade || null,
                        image: "/single_person.png"
                    },
                };
            });

        const geoJSON = {
            type: "FeatureCollection",
            features: features,
        };

        return NextResponse.json(geoJSON);
    } catch (error) {
        console.error("Error fetching Rajasthan GeoJSON:", error);
        return NextResponse.json(
            { error: "Failed to fetch map data" },
            { status: 500 }
        );
    }
}
