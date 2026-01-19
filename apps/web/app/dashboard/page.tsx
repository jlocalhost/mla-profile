"use client";

import { Navbar } from "./components/navbar";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#F9F6F0]">
            <Navbar />

            <main className="p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Overview</h2>
                    <p className="text-muted-foreground mt-1">Welcome back to the Rajasthan Vidhan Sabha Insights.</p>
                </div>

                {/* Placeholder for Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-2xl bg-white border border-border/5 shadow-sm animate-pulse" />
                    ))}
                </div>
            </main>
        </div>
    );
}
