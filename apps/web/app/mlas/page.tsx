
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "../user_dashboard/components/navbar";
import { MLAListItem } from "../user_dashboard/components/mla-list-item";
import { MLAListShimmer } from "../user_dashboard/components/mla-list-shimmer";
import { Search, ArrowLeft, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@repo/ui/button";

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mlas, setMlas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const party = searchParams.get("party");
    const sentiment = searchParams.get("sentiment");
    const category = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    const platform = searchParams.get("platform");

    useEffect(() => {
        const fetchMLAs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams(searchParams.toString());
                const response = await fetch(`/api/mlas/search?${params.toString()}`);
                const data = await response.json();
                setMlas(data.mlas || []);
                setCount(data.count || 0);
            } catch (error) {
                console.error("Error fetching mlas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMLAs();
    }, [searchParams]);

    const getPartyData = () => {
        const partyMap: Record<string, { name: string; color: string }> = {
            "BJP": { name: "भाजपा", color: "text-orange-600" },
            "INC": { name: "कांग्रेस", color: "text-blue-600" },
            "IND": { name: "निर्दलीय", color: "text-teal-600" },
            "OTHERS": { name: "अन्य दल", color: "text-purple-600" }
        };
        return party ? partyMap[party.toUpperCase()] : null;
    };

    const partyData = getPartyData();
    const themeColor = partyData?.color || "text-orange-600";

    const getHeaderContent = () => {
        if (partyData) {
            return (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    <span className={partyData.color}>{partyData.name}</span> विधायक
                </h1>
            );
        }

        if (platform && sentiment) {
            const platformMap: Record<string, string> = {
                "facebook": "FACEBOOK",
                "instagram": "INSTAGRAM",
                "x(twitter)": "X(TWITTER)",
            };
            const sentimentMap: Record<string, string> = {
                "good": "अच्छी",
                "average": "औसत",
                "critical": "खराब"
            };

            const pName = platformMap[platform.toLowerCase()] || platform.toUpperCase();
            const sName = sentimentMap[sentiment.toLowerCase()] || sentiment;
            const sColor = sentiment === 'good' ? 'text-green-600' : sentiment === 'average' ? 'text-yellow-600' : 'text-red-600';

            return (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {pName} पर <span className={sColor}>{sName} रेटिंग</span> वाले विधायक
                </h1>
            );
        }

        if (category) {
            return (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    <span className="text-orange-600">{category}</span> श्रेणी के विधायक
                </h1>
            );
        }

        if (sentiment) {
            return (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    सकारात्मक विश्लेषण वाले विधायक
                </h1>
            );
        }

        if (searchQuery) {
            return (
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    "{searchQuery}" के परिणाम
                </h1>
            );
        }

        return (
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                सभी विधायक
            </h1>
        );
    };

    return (
        <div className="min-h-screen bg-[#FBFCFE]">
            <Navbar />

            <main className="container mx-auto px-6 py-8">
                {/* Breadcrumbs & Back */}
                <div className="mb-4 flex flex-col items-start gap-4">
                    <button
                        onClick={() => router.push('/user_dashboard')}
                        className="flex items-center gap-1 text-slate-600 font-medium hover:opacity-80 transition-opacity text-sm px-3 py-1 rounded-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {"Back to Dashboard"}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="px-4">
                            {getHeaderContent()}
                            <p className="text-slate-500 font-medium mt-1">
                                कुल <span className={`text-slate-800 font-bold`}>{count}</span> प्रोफाइल पाए गए
                            </p>
                        </div>
                    </div>
                </div>

                {/* List Container */}
                <div className="bg-white/40 backdrop-blur-sm rounded-[32px] p-6 border border-white shadow-xl shadow-slate-200/50">
                    {loading ? (
                        <MLAListShimmer />
                    ) : mlas.length > 0 ? (
                        <div className="space-y-4">
                            {mlas.map((mla) => (
                                <MLAListItem key={mla.id} mla={mla} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">कोई विधायक नहीं मिला</h3>
                            <p className="text-slate-500 mt-2 max-w-xs">खोजे गए मानदंडों के लिए कोई डेटा उपलब्ध नहीं है। कृपया फ़िल्टर बदलें।</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function MLASearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FBFCFE]">
                <Navbar />
                <main className="container mx-auto px-6 py-8">
                    <div className="h-20 w-1/3 bg-slate-100 rounded-2xl animate-pulse mb-8" />
                    <MLAListShimmer />
                </main>
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
