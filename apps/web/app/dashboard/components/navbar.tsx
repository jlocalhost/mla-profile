"use client";

import { Search, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

export function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-border/10 bg-white/80 backdrop-blur-xl px-6 py-3">
            <div className="flex h-12 items-center justify-between relative">
                {/* Left Side: Icon & Title */}
                <div className="flex items-center gap-4">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm border border-orange-100">
                        <Image
                            src="/bjp_logo.png"
                            alt="Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-[#E67E22]">
                            Rajasthan
                        </h1>
                        <span className="text-xs font-medium text-muted-foreground/80 tracking-wide">
                            MLA Profile Dashboard
                        </span>
                    </div>
                </div>

                {/* Right Side: Search & Profile */}
                <div className="flex items-center gap-4">
                    <div className="relative w-[320px] hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by MLA, Constituency, or Party..."
                            className="h-10 rounded-full border-border/10 bg-[#F0F2F5] pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-[#E67E22]/30"
                        />
                    </div>

                    {/* Separator */}
                    <div className="h-8 w-[1.5px] bg-gray-200 mx-1 hidden md:block"></div>

                    <div className="flex items-center gap-3 relative">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-bold text-gray-800">Admin Officer</span>
                            <span className="text-[10px] uppercase tracking-wider text-[#E67E22] font-semibold">Super Admin</span>
                        </div>

                        <div
                            className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] p-[2px] cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                                <User className="h-5 w-5 text-[#E67E22]" />
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
                            <>
                                {/* Backdrop to close on click outside */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsProfileOpen(false)}
                                />
                                <div className="absolute top-13 right-[-1] z-50 w-42 rounded-xl border border-border/10 bg-white p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-2 py-1.5 mb-1 border-b border-gray-100 md:hidden">
                                        <p className="text-sm font-bold text-gray-800">Admin Officer</p>
                                        <p className="text-[10px] text-[#E67E22]">Super Admin</p>
                                    </div>
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-[#FFF8F0] hover:text-[#E67E22] transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User className="h-4 w-4" />
                                        <span>My Profile</span>
                                    </button>
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-[#FFF8F0] hover:text-[#E67E22] transition-colors"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                    <div className="my-1 h-[1px] bg-gray-100" />
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={() => router.push("/login")}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
