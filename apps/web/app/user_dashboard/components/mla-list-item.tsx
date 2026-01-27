
import Image from "next/image";
import { Button } from "@repo/ui/button";
import { ChevronRight, MapPin, Calendar, Tag, Building2, GraduationCap, Briefcase, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MLAListItemProps {
    mla: {
        id: number;
        name: string;
        age: number | null;
        category: string | null;
        caste?: string | null;
        qualification?: string | null;
        occupation?: string | null;
        party: string | null;
        acName: string | null;
        acNumber: number | null;
        adName: string | null;
        image: string;
        grade?: string | null;
    };
}

export function MLAListItem({ mla }: MLAListItemProps) {
    const isBJP = mla.party?.toUpperCase().includes("BJP");
    const isINC = mla.party?.toUpperCase().includes("INC");
    const isIND = mla.party?.toUpperCase().includes("IND") || mla.party === "निर्दलीय";

    const partyColor = isBJP ? "text-orange-600 border-orange-200 bg-orange-50" :
        isINC ? "text-blue-600 border-blue-200 bg-blue-50" :
            isIND ? "text-teal-600 border-teal-200 bg-teal-50" :
                "text-slate-600 border-slate-200 bg-slate-50";

    const partyLogo = isBJP ? "/bjp_logo copy.png" :
        isINC ? "/inc_logo.png" :
            isIND ? "/single_person.png" :
                "/others_logo.webp";

    const router = useRouter();

    return (
        <div className="group bg-[#F8FAFC] border border-slate-200/60 rounded-[22px] p-4 pr-6 flex items-center gap-8 transition-all duration-300 hover:shadow-2xl hover:border-orange-200/40 relative overflow-hidden">
            {/* Watermark Logo - Positioned behind the View Profile button */}
            <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.04] grayscale sepia pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500 z-0">
                <Image
                    src={partyLogo}
                    alt="watermark"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Left: Image Section */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 shadow-sm z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                    src={mla.image}
                    alt={mla.name || "MLA"}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Middle: Rich Content Layout */}
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 z-10">
                {/* Column 1: Identity */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                    <h3 className="text-xl font-semibold text-slate-900 leading-tight uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                        {mla.name || "Unknown MLA"}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[12px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-widest ${partyColor}`}>
                            {mla.party?.toUpperCase().includes("IND") || mla.party === "निर्दलीय" ? "IND" : (mla.party || "Others")}
                        </span>
                        {mla.age && (
                            <div className="flex items-center gap-1 text-slate-400 bg-slate-50/50 px-2 py-0.5 rounded-lg border border-slate-100/30">
                                <Calendar className="w-2.5 h-2.5" />
                                <span className="text-[12px] font-medium uppercase tracking-wider">{mla.age} Years</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Constituency & Admin */}
                <div className="flex flex-col gap-3 min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50/50 flex items-center justify-center border border-orange-100/30">
                            <MapPin className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none">विधानसभा</span>
                                {mla.grade && (
                                    <span className="text-[12px] font-medium px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-600 leading-none">ग्रेड: {mla.grade}</span>
                                )}
                            </div>
                            <span className="text-[14px] font-semibold text-slate-600 mt-1">
                                {mla.acName} <span className="text-slate-400 font-medium ml-0.5 text-[11px]">#{mla.acNumber}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center border border-blue-100/30">
                            <Building2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none mb-1">प्रशासनिक जिला</span>
                            <span className="text-[14px] font-semibold text-slate-600 truncate max-w-[140px]">{mla.adName || "District HQ"}</span>
                        </div>
                    </div>
                </div>

                {/* Column 3: Category & Caste */}
                <div className="flex flex-col gap-3 min-w-[150px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-50/50 flex items-center justify-center border border-teal-100/30">
                            <Tag className="w-4 h-4 text-teal-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none mb-1">कैटगरी</span>
                            <span className="text-[14px] font-semibold text-slate-600">{mla.category || "General"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50/50 flex items-center justify-center border border-purple-100/30">
                            <UserCircle className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none mb-1">जाति</span>
                            <span className="text-[14px] font-semibold text-slate-600 truncate max-w-[130px]">{mla.caste || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* Column 4: Professional Details */}
                <div className="hidden xl:flex flex-col gap-3 min-w-[160px]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50/50 flex items-center justify-center border border-indigo-100/30">
                            <GraduationCap className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none mb-1">शैक्षिक योग्यता</span>
                            <span className="text-[14px] font-semibold text-slate-600 truncate max-w-[150px]">{mla.qualification || "N/A"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50/50 flex items-center justify-center border border-rose-100/30">
                            <Briefcase className="w-4 h-4 text-rose-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[12px] uppercase font-medium text-slate-400 tracking-widest leading-none mb-1">पेशा</span>
                            <span className="text-[14px] font-semibold text-slate-600 truncate max-w-[150px]">{mla.occupation || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Action Section */}
            <div className="flex-shrink-0 z-10 pl-6 border-l border-slate-100 relative">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/mla_detailed_report?id=${mla.id}&name=${mla.name}`)}
                    className="rounded-2xl py-6 px-10 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-all flex items-center justify-center gap-2 group/btn bg-white/80 backdrop-blur-sm shadow-sm"
                >
                    <span className="font-bold text-[11px]">विस्तारित प्रोफाइल देखें</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
            </div>
        </div>
    );
}
