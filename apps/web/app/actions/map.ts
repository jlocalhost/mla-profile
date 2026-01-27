"use server";

import { prisma } from "@repo/db";

export async function getRajasthanGeoJSON() {
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
            },
        });

        const features = constituencies
            .filter((c) => {
                const m = c.metadata as any;
                // Strict check: must be object, not null, and have a 'type' property (e.g. Polygon, MultiPolygon)
                return m && typeof m === "object" && typeof m.type === "string";
            })
            .map((c: any) => {
                return {
                    type: "Feature",
                    geometry: c.metadata,
                    properties: {
                        id: c.id,
                        name: c.name,
                        number: c.number,
                        acId: c.id,
                    },
                };
            });

        const geoJSON = {
            type: "FeatureCollection",
            features: features,
        };

        return { success: true, data: geoJSON };
    } catch (error) {
        console.error("Error fetching Rajasthan GeoJSON:", error);
        return { success: false, error: "Failed to fetch map data" };
    }
}
