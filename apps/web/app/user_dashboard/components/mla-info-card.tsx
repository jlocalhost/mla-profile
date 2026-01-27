"use client";

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { X, User, MapPin, Briefcase, GraduationCap, ChevronRight, Calendar, Tag, Building2, UserCircle } from "lucide-react";
import { Button } from "@repo/ui/button";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";

interface MLAInfoCardProps {
    mla: any;
    onClose: () => void;
}

export const MLAInfoCard = forwardRef<{ handleClose: () => void }, MLAInfoCardProps>(
    ({ mla, onClose }, ref) => {
        const cardRef = useRef<HTMLDivElement>(null);
        const router = useRouter();
        const isFirstMount = useRef(true);

        useImperativeHandle(ref, () => ({
            handleClose
        }));

        useEffect(() => {
            if (cardRef.current && isFirstMount.current) {
                gsap.fromTo(
                    cardRef.current,
                    { x: "100%", opacity: 0 },
                    { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
                );
                isFirstMount.current = false;
            }
        }, []);

        const handleClose = () => {
            if (!cardRef.current) {
                onClose();
                return;
            }
            gsap.to(cardRef.current, {
                x: "100%",
                opacity: 0,
                duration: 0.4,
                ease: "power3.in",
                onComplete: onClose
            });
        };

        const isBJP = mla.partyName?.toUpperCase().includes("BJP");
        const isINC = mla.partyName?.toUpperCase().includes("INC") || mla.partyName?.toUpperCase().includes("CONGRESS");
        const isIND = mla.partyName?.toUpperCase().includes("IND") || mla.partyName === "निर्दलीय";

        const partyConfig = isBJP ? {
            color: "text-orange-600",
            border: "border-orange-200",
            bg: "bg-orange-50/80",
            badgeBg: "bg-orange-100/80",
            topBorder: "#ffeed0",
            logo: "/bjp_logo copy.png"
        } : isINC ? {
            color: "text-blue-600",
            border: "border-blue-200",
            bg: "bg-blue-50/80",
            badgeBg: "bg-blue-100/80",
            topBorder: "#dfe3ec",
            logo: "/inc_logo.png"
        } : isIND ? {
            color: "text-teal-600",
            border: "border-teal-200",
            bg: "bg-teal-50/80",
            badgeBg: "bg-teal-100/80",
            topBorder: "#cbfbf2",
            logo: "/single_person.png"
        } : {
            color: "text-purple-600",
            border: "border-purple-200",
            bg: "bg-purple-50/80",
            badgeBg: "bg-purple-100/80",
            topBorder: "#f3e7ff",
            logo: "/others_logo.webp"
        };

        return (
            <div
                ref={cardRef}
                className={`w-full h-fit bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.15)] rounded-[15px] flex flex-col overflow-hidden relative border-[1.5px] border-slate-100 shadow-xl`}
                style={{ borderTop: `8px solid ${partyConfig.topBorder}` }}
            >
                {/* Ambient Watermark */}
                <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.03] grayscale pointer-events-none z-0">
                    <Image src={partyConfig.logo} alt="watermark" fill className="object-contain" />
                </div>

                <div className="p-5 pt-4 flex flex-col h-full relative z-10">
                    {/* Absolute Close Button to save vertical space */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all active:scale-95 z-30"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>

                    {/* Identity Section - More Prominent Hero Style */}
                    <div className="flex flex-col items-center text-center gap-4 mb-6 mt-4 group/id">
                        <div className="relative h-32 w-32 rounded-[32px] p-1 bg-gradient-to-tr from-slate-200 via-white to-slate-100 shadow-xl transition-transform duration-500 group-hover/id:scale-[1.05]">
                            <div className="h-full w-full rounded-[28px] bg-slate-50 overflow-hidden relative border-2 border-white">
                                {mla.image ? (
                                    <Image src={mla.image} alt={mla.mlaName || mla.name} fill className="object-cover" />
                                ) : (
                                    <User className="w-14 h-14 text-slate-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full items-center">
                            <h2 className="text-2xl font-bold text-slate-900 leading-tight uppercase tracking-tight line-clamp-2 px-4">
                                {mla.mlaName || mla.name || "Unknown"}
                            </h2>

                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-widest ${partyConfig.color} ${partyConfig.border} ${partyConfig.badgeBg}`}>
                                    {mla.partyName || "Independent"}
                                </span>
                                {mla.age && (
                                    <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50/80 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{mla.age} Years</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Data Tiles Grid Section - Compact & Fit content */}
                    <div className="grid grid-cols-1 gap-2.5 overflow-hidden pb-4">
                        {/* Location Tiles */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-[18px] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <div className="p-1 bg-orange-50 rounded-lg">
                                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                    </div>
                                    <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none">विधानसभा</span>
                                </div>
                                <p className="text-[14px] font-semibold text-slate-600 line-clamp-1">
                                    {mla.name.toUpperCase()} <span className="text-slate-400 font-medium text-[11px] ml-1">#{mla.number}</span>
                                </p>
                            </div>

                            <div className="p-3.5 rounded-[18px] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <div className="p-1 bg-blue-50 rounded-lg">
                                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none">जिला</span>
                                </div>
                                <p className="text-[14px] font-semibold text-slate-600 truncate">{mla.adName.toUpperCase() || "District HQ"}</p>
                            </div>
                        </div>

                        {/* Social/Bio Tiles */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-[18px] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <div className="p-1 bg-teal-50 rounded-lg">
                                        <Tag className="w-3.5 h-3.5 text-teal-600" />
                                    </div>
                                    <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none">कैटगरी</span>
                                </div>
                                <p className="text-[14px] font-semibold text-slate-600 line-clamp-1">{mla.category.toUpperCase() || "General"}</p>
                            </div>

                            <div className="p-3.5 rounded-[18px] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <div className="p-1 bg-purple-50 rounded-lg">
                                        <UserCircle className="w-3.5 h-3.5 text-purple-600" />
                                    </div>
                                    <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none">जाति</span>
                                </div>
                                <p className="text-[14px] font-semibold text-slate-600 truncate">{mla.caste || "N/A"}</p>
                            </div>
                        </div>

                        {/* Professional Section - Redesigned for better visibility (2-column grid) */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-100 flex flex-col gap-2.5 shadow-sm group/prof">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1 bg-white rounded-lg shadow-sm">
                                        <GraduationCap className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-widest leading-none">शिक्षा</span>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-600 leading-tight line-clamp-1">{mla.qualification || "Not Disclosed"}</p>
                            </div>

                            <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-100 flex flex-col gap-2.5 shadow-sm group/prof">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1 bg-white rounded-lg shadow-sm">
                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-[11px] uppercase font-bold text-slate-400 tracking-widest leading-none">पेशा</span>
                                </div>
                                <p className="text-[13px] font-semibold text-slate-600 leading-tight line-clamp-1">{mla.occupation || "Service"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Button */}
                    <div className="mt-auto pt-4 border-t border-slate-100/50">
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/mla_detailed_report?id=${mla.id}&name=${mla.mlaName || mla.name}`)}
                            className="w-full h-14 rounded-2xl border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all flex items-center justify-center gap-2 group/btn bg-white/80 backdrop-blur-sm shadow-sm"
                        >
                            <span className="font-bold text-[11px] uppercase tracking-widest">विस्तारित प्रोफाइल देखें</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
);
