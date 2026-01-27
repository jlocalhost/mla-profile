"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// Helper functions - Module Scope
const getPartyColor = (partyName: string | null): string => {
    if (!partyName) return "#FFFFFF"; // total/neutral
    const party = partyName.toUpperCase();
    if (party.includes("BJP")) return "#FFF7ED"; // bg-orange-50/60
    if (party.includes("INC") || party.includes("CONGRESS")) return "#EFF6FF"; // bg-blue-50/60
    if (party.includes("INDEPENDENT")) return "#F0FDFA"; // bg-teal-50/60
    return "#FAF5FF"; // bg-purple-50/60
};

const getPartyStroke = (partyName: string | null): string => {
    if (!partyName) return "#374151"; // text-gray-800
    const party = partyName.toUpperCase();
    if (party.includes("BJP")) return "#E67E22"; // orange-600
    if (party.includes("INC") || party.includes("CONGRESS")) return "#3B82F6"; // blue-600
    if (party.includes("INDEPENDENT")) return "#14B8A6"; // teal-600
    return "#9333EA"; // purple-600
};

interface ConstituencyMapProps {
    active?: boolean;
    onSelectConstituency?: (data: any) => void;
}

export default function ConstituencyMap({ active = true, onSelectConstituency }: ConstituencyMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const gRef = useRef<SVGGElement | null>(null);
    const tooltipRef = useRef<d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null>(null);
    const [geoData, setGeoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showLabels, setShowLabels] = useState(false);

    const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const currentZoomRef = useRef(1); // Track current zoom level for hover stroke scaling

    // Refs for interaction stability
    const activeRef = useRef(active);
    const callbackRef = useRef(onSelectConstituency);

    useEffect(() => {
        activeRef.current = active;
    }, [active]);

    useEffect(() => {
        callbackRef.current = onSelectConstituency;
    }, [onSelectConstituency]);

    // Fetch Data
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/user_dashboard/map");
                const data = await response.json();
                setGeoData(data);
            } catch (error) {
                console.error("Failed to load map data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Zoom controls
    const handleZoomIn = useCallback(() => {
        if (svgRef.current && zoomBehaviorRef.current) {
            d3.select(svgRef.current).transition().duration(300).call(
                zoomBehaviorRef.current.scaleBy, 1.5
            );
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        if (svgRef.current && zoomBehaviorRef.current) {
            d3.select(svgRef.current).transition().duration(300).call(
                zoomBehaviorRef.current.scaleBy, 0.67
            );
        }
    }, []);

    const handleZoomReset = useCallback(() => {
        if (svgRef.current && zoomBehaviorRef.current) {
            d3.select(svgRef.current).transition().duration(300).call(
                zoomBehaviorRef.current.transform, d3.zoomIdentity
            );
        }
    }, []);

    // Handle Active State Reset
    useEffect(() => {
        if (containerRef.current && !active) {
            // Force hide tooltip
            if (tooltipRef.current) {
                tooltipRef.current.style("opacity", 0).style("visibility", "hidden");
            }

            // Reset all paths to default state immediately
            const paths = d3.select(containerRef.current).selectAll("path");
            paths.interrupt(); // Stop any ongoing transitions
            paths
                .attr("fill", (d: any) => getPartyColor(d.properties.partyName))
                .attr("stroke", (d: any) => getPartyStroke(d.properties.partyName))
                .attr("stroke-width", 0.75 / currentZoomRef.current)
                .style("opacity", 1)
                .style("filter", "none");
        }
    }, [active]);

    // D3 Rendering Logic
    useEffect(() => {
        if (!geoData || !containerRef.current) return;

        const container = containerRef.current;

        // Create Tooltip - SINGLE INSTANCE per component mount
        const tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "d3-tooltip d3-tooltip-map") // Specific class
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-opacity", "0")
            .style("background-color", "rgba(255, 255, 255, 0.98)")
            .style("color", "#1e293b")
            .style("padding", "10px 14px")
            .style("border-radius", "12px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .style("box-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.1)")
            .style("border", "1px solid rgba(226, 232, 240, 0.9)")
            .style("backdrop-filter", "blur(8px)");

        tooltipRef.current = tooltip;

        const renderMap = () => {
            // Clear previous SVG
            d3.select(container).select("svg").remove();

            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width === 0 || height === 0) return;

            const svg = d3
                .select(container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .style("overflow", "hidden");

            svgRef.current = svg.node();

            // Create a group for zoom transforms
            const g = svg.append("g");
            gRef.current = g.node();

            // Create sub-groups for layering: Paths bottom, Labels top
            const pathsGroup = g.append("g").attr("class", "paths-layer");
            const labelsGroup = g.append("g").attr("class", "labels-layer");

            // Projection
            const projection = d3.geoMercator();
            projection.fitSize([width, height], geoData);
            const pathGenerator = d3.geoPath().projection(projection);

            // Render Paths into pathsGroup
            const paths = pathsGroup
                .selectAll("path")
                .data(geoData.features)
                .enter()
                .append("path")
                .attr("d", pathGenerator as any)
                .attr("fill", (d: any) => getPartyColor(d.properties.partyName))
                .attr("stroke", (d: any) => getPartyStroke(d.properties.partyName))
                .attr("stroke-width", 0.75) // Consistent initial stroke width
                .attr("stroke-linejoin", "round")
                .style("transition", "fill 0.4s ease, opacity 0.4s ease")
                .style("cursor", "pointer")
                .attr("class", "constituency-path");

            // Add labels into labelsGroup
            const labels = labelsGroup
                .selectAll("text.ac-label")
                .data(geoData.features)
                .enter()
                .append("text")
                .attr("class", "ac-label")
                .attr("x", (d: any) => {
                    const centroid = pathGenerator.centroid(d);
                    return isNaN(centroid[0]) ? 0 : centroid[0];
                })
                .attr("y", (d: any) => {
                    const centroid = pathGenerator.centroid(d);
                    return isNaN(centroid[1]) ? 0 : centroid[1];
                })
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "9px")
                .attr("font-weight", "800")
                .attr("fill", "#07111eff") // muted-foreground
                .attr("pointer-events", "none")
                .style("text-shadow", "0 0 2px white")
                .style("display", (d: any) => {
                    const centroid = pathGenerator.centroid(d);
                    return isNaN(centroid[0]) || isNaN(centroid[1]) ? "none" : "block";
                })
                .style("opacity", showLabels ? 0.6 : 0)
                .text((d: any) => d.properties.number || d.properties.original_ac_no || "");

            // Hover handlers
            paths.on("mouseenter", function (event, d: any) {
                // If not active, ignore interactions!
                if (!activeRef.current) return;

                const hoveredPath = this as SVGPathElement;
                const zoomLevel = currentZoomRef.current || 1;

                paths.transition().duration(200).style("opacity", 0.4);

                d3.select(hoveredPath)
                    .interrupt()
                    .raise()
                    .transition()
                    .duration(300)
                    .attr("fill", getPartyStroke(d.properties.partyName))
                    .attr("stroke", "#1F2937") // Dark slate for contrast
                    .attr("stroke-width", 2 / zoomLevel)
                    .style("opacity", 1);

                tooltip
                    .style("visibility", "visible")
                    .style("opacity", 0)
                    .transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.html(`
                    <div class="flex flex-col gap-0.5">
                        <div class="text-[14px] font-semibold text-slate-800 leading-tight">
                            ${d.properties.name} (${d.properties.number || '00'})
                        </div>
                        <div class="text-[12px] font-medium text-slate-500">
                            ${d.properties.mlaName || 'Not Assigned'}
                        </div>
                        <div class="text-[11px] font-bold uppercase tracking-wider mt-0.5" style="color: ${getPartyStroke(d.properties.partyName)}">
                            ${d.properties.partyName || 'Independent'}
                        </div>
                    </div>
                `);
            });

            paths.on("mousemove", function (event) {
                if (!activeRef.current) return;
                tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 24 + "px");
            });

            paths.on("click", function (event, d: any) {
                if (!activeRef.current) return;
                if (callbackRef.current) {
                    callbackRef.current(d.properties);
                }
            });

            paths.on("mouseleave", function () {
                if (!activeRef.current) return; // Also ignore mouseleave if not active

                const zoomLevel = currentZoomRef.current || 1;

                paths.transition()
                    .duration(400)
                    .attr("fill", (d: any) => getPartyColor(d.properties.partyName))
                    .attr("stroke", (d: any) => getPartyStroke(d.properties.partyName))
                    .attr("stroke-width", 0.75 / zoomLevel)
                    .style("opacity", 1)
                    .style("filter", "none");

                tooltip.transition()
                    .duration(300)
                    .style("opacity", 0)
                    .on("end", function () {
                        // Use explicit visibility hidden to ensure it doesn't block clicks
                        d3.select(this).style("visibility", "hidden");
                    });
            });

            // Zoom behavior
            const zoom = d3.zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 8])
                .filter((event) => {
                    if (event.type === 'wheel') {
                        const target = event.target as Element;
                        return target.tagName === 'path' || target.closest('path') !== null;
                    }
                    return true;
                })
                .on("zoom", (event) => {
                    g.attr("transform", event.transform);
                    currentZoomRef.current = event.transform.k;
                    labels.attr("font-size", `${9 / event.transform.k}px`);
                    // Ensure stroke width scales inversely to zoom to maintain consistent visual thickness
                    paths.attr("stroke-width", 0.75 / event.transform.k);
                });

            svg.call(zoom);
            zoomBehaviorRef.current = zoom;
        };

        renderMap();

        const resizeObserver = new ResizeObserver(() => {
            renderMap();
        });
        // Add safety check before observing
        if (container) {
            resizeObserver.observe(container);
        }

        // CLEANUP FUNCTION
        return () => {
            // Remove tooltip from BODY when component unmounts
            tooltip.remove();
            resizeObserver.disconnect();
        };
    }, [geoData, showLabels]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-transparent text-slate-400 animate-pulse">
                Loading Map...
            </div>
        );
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-transparent">
            {/* Zoom Controls - Top Left - Minimal pill design */}
            {/* Zoom Controls - Top Left - Vertical Stack */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-3">
                {/* Zoom Group */}
                <div className="flex flex-col items-center gap-px bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200/60 overflow-hidden">
                    <button
                        onClick={handleZoomIn}
                        className="p-2.5 hover:bg-orange-50 active:bg-orange-100 transition-colors group"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5 text-slate-600 group-hover:text-orange-600" />
                    </button>
                    <div className="h-px w-full bg-slate-100" />
                    <button
                        onClick={handleZoomOut}
                        className="p-2.5 hover:bg-orange-50 active:bg-orange-100 transition-colors group"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5 text-slate-600 group-hover:text-orange-600" />
                    </button>
                    <div className="h-px w-full bg-slate-100" />
                    <button
                        onClick={handleZoomReset}
                        className="p-2.5 hover:bg-orange-50 active:bg-orange-100 transition-colors group"
                        title="Reset View"
                    >
                        <RotateCcw className="w-4 h-4 text-slate-600 group-hover:text-orange-600" />
                    </button>
                </div>

                {/* Label Toggle */}
                <button
                    onClick={() => setShowLabels(!showLabels)}
                    className={`flex items-center justify-center p-2.5 rounded-lg shadow-lg border transition-all duration-200 backdrop-blur-md ${showLabels
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white/90 border-slate-200/60 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                        }`}
                    title="Toggle Labels"
                >
                    <span className="text-[10px] font-bold uppercase tracking-wider writing-mode-vertical">
                        {showLabels ? "Hide" : "Txt"}
                    </span>
                </button>
            </div>

            {/* Map Container */}
            <div ref={containerRef} className="w-full h-full pointer-events-auto" />
        </div>
    );
}
