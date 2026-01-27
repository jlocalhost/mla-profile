"use client";

import { Search, User, LogOut, Settings } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { AuthService } from "../../../lib/auth.service";

function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const [placeholder, setPlaceholder] = useState("");

    const placeholders = [
        "विधायक, क्षेत्र, पार्टी या अन्य खोजें..."
    ];

    useEffect(() => {
        let currentPlaceholderIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentFullText = placeholders[currentPlaceholderIndex];

            if (isDeleting) {
                setPlaceholder(currentFullText.substring(0, currentCharIndex - 1));
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                setPlaceholder(currentFullText.substring(0, currentCharIndex + 1));
                currentCharIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && currentCharIndex === currentFullText.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
                typingSpeed = 500; // Pause before next word
            }

            setTimeout(type, typingSpeed);
        };

        const timeoutId = setTimeout(type, typingSpeed);
        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams.toString());
            if (searchValue) params.set("search", searchValue);
            else params.delete("search");

            router.push(`/mlas?${params.toString()}`);
        }
    };

    return (
        <div className="relative w-[320px] hidden md:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
                placeholder={placeholder}
                className="h-10 rounded-full border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm transition-all focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 placeholder:transition-opacity duration-300"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleSearch}
            />
        </div>
    );
}

export function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl px-6 py-3 supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-12 items-center justify-between relative">
                {/* Left Side: Icon & Title */}
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/user_dashboard')}>
                    <div className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm border border-orange-100 ring-2 ring-orange-50">
                        <Image
                            src="/bjp_logo_1.png"
                            alt="Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-orange-600">
                            राजस्थान प्रदेश
                        </h1>
                        <span className="text-xs font-medium text-slate-500 tracking-wide">
                            विधायक प्रोफ़ाइल डैशबोर्ड
                        </span>
                    </div>
                </div>

                {/* Right Side: Search & Profile */}
                <div className="flex items-center gap-4">
                    <Suspense fallback={<div className="w-[320px] h-10 bg-slate-50 rounded-full animate-pulse" />}>
                        <SearchInput />
                    </Suspense>

                    {/* Separator */}
                    <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

                    <div className="flex items-center gap-3 relative">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-bold text-slate-700">Admin Officer</span>
                            <span className="text-[10px] uppercase tracking-wider text-[#E67E22] font-bold bg-orange-50 px-1.5 py-0.5 rounded-sm">Super Admin</span>
                        </div>

                        <div
                            className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] p-[2px] cursor-pointer shadow-lg shadow-orange-500/20 active:scale-95 transition-transform hover:shadow-orange-500/30"
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
                                <div className="absolute top-14 right-0 z-50 w-56 rounded-xl border border-slate-100 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-2 py-2 mb-1 border-b border-dashed border-slate-100 md:hidden">
                                        <p className="text-sm font-bold text-slate-800">Admin Officer</p>
                                        <p className="text-[10px] text-[#E67E22] font-semibold">Super Admin</p>
                                    </div>
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-[#E67E22] transition-colors group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <User className="h-4 w-4 text-slate-400 group-hover:text-[#E67E22] transition-colors" />
                                        <span>My Profile</span>
                                    </button>
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-[#E67E22] transition-colors group"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <Settings className="h-4 w-4 text-slate-400 group-hover:text-[#E67E22] transition-colors" />
                                        <span>Settings</span>
                                    </button>
                                    <div className="my-1.5 h-[1px] bg-slate-100" />
                                    <button
                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        onClick={async () => {
                                            await AuthService.logout();
                                            router.push("/login"); // Force redirect logic
                                            router.refresh(); // Ensure state is cleared
                                        }}
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
