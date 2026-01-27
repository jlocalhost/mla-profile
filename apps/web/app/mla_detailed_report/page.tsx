"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, User, FileText, Share2, Download } from "lucide-react";
import { Navbar } from "../user_dashboard/components/navbar";
import { Button } from "@repo/ui/button";

function ReportContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");
    const name = searchParams.get("name");

    return (
        <div className="min-h-screen bg-[#FBFCFE]">
            <Navbar />

            <main className="container mx-auto px-6 py-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.push('/user_dashboard')}
                        className="flex items-center gap-1 text-slate-600 font-medium hover:opacity-80 transition-opacity text-sm px-3 py-1 rounded-md"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {"Back to Dashboard"}
                    </button>

                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl flex items-center gap-2 border-slate-200">
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                        <Button className="rounded-xl flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800">
                            <Download className="w-4 h-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Report Area Placeholder */}
                <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
                        {/* Ambient Background Pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                                <User className="w-12 h-12 text-white/40" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="px-3 py-1 bg-orange-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Detailed Report</div>
                                    <div className="text-white/50 text-sm font-medium">ID: {id || "N/A"}</div>
                                </div>
                                <h1 className="text-4xl font-black uppercase tracking-tight italic">
                                    {name || "MLA Profile Report"}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
                            <FileText className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Detailed Report Under Construction</h2>
                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                            We are currently synthesizing the data points for <span className="font-bold text-slate-900">"{name || "this MLA"}"</span>. The full intelligence report including sentiment analysis, constituency metrics, and legislative performance will be available shortly.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function MLADetailedReportPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FBFCFE] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        }>
            <ReportContent />
        </Suspense>
    );
}
