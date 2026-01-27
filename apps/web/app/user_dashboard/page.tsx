"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "./components/navbar";
import { StatsGrid } from "./components/stats-grid";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Share2, Map as MapIcon, Activity, X, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";
import { Flip } from "gsap/Flip";
import Link from "next/link";
import { MLAInfoCard } from "./components/mla-info-card";

gsap.registerPlugin(Flip);

const ConstituencyMap = dynamic(
    () => import("../../components/maps/constituency-map"),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full w-full text-white/50 animate-pulse">
                Loading Map...
            </div>
        ),
    }
);

// Mock Data: Distribution of 200 total MLAs across sentiment buckets
const socialMediaData = [
    { platform: "FACEBOOK", good: 124, average: 54, critical: 22, logo: "/facebook.png" },
    { platform: "INSTAGRAM", good: 142, average: 38, critical: 20, logo: "/Instagram_logo_2022.svg" },
    { platform: "X(TWITTER)", good: 58, average: 92, critical: 50, logo: "/x-new.png" },
];

export default function UserDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [selectedMLA, setSelectedMLA] = useState<any>(null);
    const infoCardRef = useRef<{ handleClose: () => void } | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                delay: 0.3, // Faster start
                onComplete: () => {
                    const cards = containerRef.current?.querySelectorAll(".bento-card, .map-card");
                    cards?.forEach((card) => card.classList.remove("opacity-0"));
                    gsap.set(cards || [], { clearProps: "all" });
                }
            });

            // Map Card FIRST
            tl.fromTo(".map-card",
                { y: 30, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
            );

            // Social Card SECOND (Faster Sequence)
            tl.fromTo(".card-social",
                { y: 30, opacity: 0, scale: 0.98 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" },
                "-=0.2" // Overlap for speed
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const toggleExpand = (cardId: string) => {
        const state = Flip.getState(`.card-${cardId}, .overlay-content`);

        if (expandedCard === cardId) {
            setExpandedCard(null);
        } else {
            setExpandedCard(cardId);
        }

        // Wait for state update to render, then Flip
        requestAnimationFrame(() => {
            Flip.from(state, {
                duration: 0.6,
                ease: "power3.inOut",
                absolute: true,
                onComplete: () => {
                    // Force clear GSAP inline styles and ensure visibility
                    const card = document.querySelector(`.card-${cardId}`);
                    if (card) {
                        gsap.set(card, { clearProps: "all" });
                        // Explicitly reset critical properties
                        (card as HTMLElement).style.opacity = "1";
                        (card as HTMLElement).style.visibility = "visible";
                    }
                }
            });
        });
    };

    return (
        <div className="min-h-screen bg-[#FBFCFE] overflow-x-hidden relative" ref={containerRef}>
            <Navbar />

            {/* Header Section */}
            <div className="container mx-auto px-6 py-4 pb-0 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 w-full">
                    <div>
                        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-800 leading-none">
                            विधायक प्रोफाइल <span className="text-orange-600">अवलोकन</span>
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium text-sm">
                            16वीं विधानसभा का संचयी विवरण और निर्वाचन क्षेत्रवार विश्लेषण।
                        </p>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-2 pt-0 relative">
                <StatsGrid />

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(180px,auto)] mt-4">
                    <div className="md:col-span-4 md:row-span-2 relative h-full">
                        {/* Map Card */}
                        <Card
                            id="card-map"
                            data-flip-id="map"
                            className={`map-card card-map opacity-0 w-full h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-[#FFFFFF] border-0 border-t-4 border-[#E8EAEB] rounded-xl overflow-hidden relative group ${expandedCard === 'map' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <CardHeader className="pb-4 pt-6 px-6 relative z-20 pointer-events-none border-b border-gray-50/50">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                    <MapIcon className="h-4 w-4 text-gray-700" />
                                    <span>निर्वाचन क्षेत्रवार पार्टी स्थिति</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[420px] flex items-center justify-center relative p-0 overflow-hidden bg-[#FFFFFF]">
                                <ConstituencyMap
                                    active={expandedCard !== 'map'}
                                    onSelectConstituency={(data) => {
                                        // Toggle logic: If same MLA is clicked, close it via ref animation
                                        const isSame = selectedMLA && (selectedMLA.name === data.name);
                                        if (isSame && infoCardRef.current) {
                                            infoCardRef.current.handleClose();
                                        } else {
                                            setSelectedMLA(data);
                                        }
                                    }}
                                />
                                {/* Expand button hidden for now
                                <div
                                    className="absolute top-4 right-6 z-30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand('map');
                                    }}
                                >
                                    <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-100 flex items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-colors">
                                        <Maximize2 className="w-3.5 h-3.5 text-gray-600" />
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Expand</span>
                                    </div>
                                </div>
                                */}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Social Sentiment Card */}
                    <Card
                        id="card-social"
                        className={`bento-card card-social opacity-0 md:col-span-2 md:row-span-2 bg-[#FFFFFF] border-0 border-t-4 border-[#8b8c8d] rounded-xl relative overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                    >
                        <CardHeader className="pb-4 pt-6 px-6 relative z-20 border-b border-gray-50/50">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gray-700" />
                                <span>सोशल मीडिया मात्रात्मक विश्लेषण</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 h-[420px] relative z-10 overflow-hidden bg-[#FFFFFF]">
                            <div className="flex flex-col h-full">
                                {socialMediaData.map((row, i) => (
                                    <div
                                        key={i}
                                        className="group/item px-5 py-2.5 border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-all duration-500 relative"
                                    >
                                        <div className="flex items-end justify-between mb-5">
                                            <div className="flex items-end gap-3">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-2 ml-0.5">{row.platform}</span>
                                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-gray-100 group-hover/item:scale-105 transition-transform duration-500 overflow-hidden relative p-2.5">
                                                        <Image src={row.logo} alt={row.platform} fill className="object-contain p-1" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/mlas?sentiment=good&platform=${row.platform.toLowerCase()}`} className="flex flex-col bg-green-500/10 rounded-xl px-4 h-14 items-center justify-center min-w-[76px] border border-green-500/5 hover:bg-green-500/20 transition-all cursor-pointer">
                                                    <span className="text-2xl font-[800] text-green-600 leading-none mb-1">{row.good}</span>
                                                    <span className="text-[9px] font-black text-green-600/70 uppercase tracking-widest leading-none">अच्छा</span>
                                                </Link>
                                                <Link href={`/mlas?sentiment=average&platform=${row.platform.toLowerCase()}`} className="flex flex-col bg-yellow-500/10 rounded-xl px-4 h-14 items-center justify-center min-w-[76px] border border-yellow-500/5 hover:bg-yellow-500/20 transition-all cursor-pointer">
                                                    <span className="text-2xl font-[800] text-yellow-600 leading-none mb-1">{row.average}</span>
                                                    <span className="text-[9px] font-black text-yellow-600/70 uppercase tracking-widest leading-none">औसत</span>
                                                </Link>
                                                <Link href={`/mlas?sentiment=critical&platform=${row.platform.toLowerCase()}`} className="flex flex-col bg-red-500/10 rounded-xl px-4 h-14 items-center justify-center min-w-[76px] border border-red-500/5 hover:bg-red-500/20 transition-all cursor-pointer">
                                                    <span className="text-2xl font-[800] text-red-600 leading-none mb-1">{row.critical}</span>
                                                    <span className="text-[9px] font-black text-red-600/70 uppercase tracking-widest leading-none">ख़राब</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="flex h-3 w-full rounded-full overflow-hidden p-[1.5px]">
                                                <div className="h-full bg-green-500/30 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(34,197,94,0.3)]" style={{ width: `${(row.good / 200) * 100}%` }} />
                                                <div className="h-full bg-yellow-400/30 rounded-full mx-0.5" style={{ width: `${(row.average / 200) * 100}%` }} />
                                                <div className="h-full bg-red-500/30 rounded-full" style={{ width: `${(row.critical / 200) * 100}%` }} />
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* MLA Info Slide-in Card Overlay */}
                {selectedMLA && (
                    <div className="absolute top-[0px] right-0 z-50 h-[640px] w-full md:w-[425px] p-0 pr-6 pointer-events-none">
                        <div className="h-full w-full pointer-events-auto">
                            <MLAInfoCard
                                ref={infoCardRef}
                                mla={selectedMLA}
                                onClose={() => setSelectedMLA(null)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* GSAP FLIP Expanded Overlay - Commented out for now
            {expandedCard && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                    <div
                        className="fixed inset-0 bg-slate-200/20 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => toggleExpand(expandedCard)}
                    />
                    <div data-flip-id={expandedCard} className={`overlay-content w-full h-full max-w-7xl relative bg-white rounded-[32px] shadow-2xl overflow-hidden shadow-slate-200/50 card-${expandedCard}`}>
                        <button
                            onClick={() => toggleExpand(expandedCard)}
                            className="absolute top-8 right-8 z-50 p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-orange-600 hover:border-orange-200 transition-all shadow-xl group active:scale-90"
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="h-full w-full p-4 md:p-8 flex flex-col">
                            <div className="mb-6 px-4">
                                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                    <MapIcon className="h-4 w-4 text-gray-700" />
                                    <span>निर्वाचन क्षेत्रवार पार्टी स्थिति</span>
                                </div>
                                <div className="h-px w-full bg-slate-100 mt-4" />
                            </div>

                            <div className="flex-1 rounded-[32px] overflow-hidden py-8 px-8 flex items-center justify-center">
                                <ConstituencyMap />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            */}
        </div>
    );
}
