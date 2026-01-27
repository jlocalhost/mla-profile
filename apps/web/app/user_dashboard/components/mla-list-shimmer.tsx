
export function MLAListShimmer() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-[#F8FAFC] border border-slate-200/60 rounded-[22px] p-4 pr-6 flex items-center gap-8 animate-pulse">
                    {/* Image Shimmer */}
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-100 flex-shrink-0" />

                    {/* Content Shimmer */}
                    <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 w-full">
                        {/* Pillar 1: Identity */}
                        <div className="flex flex-col gap-2 min-w-[180px]">
                            <div className="h-6 bg-slate-100 rounded-lg w-3/4" />
                            <div className="flex gap-2">
                                <div className="h-4 bg-slate-50 rounded-full w-16" />
                                <div className="h-4 bg-slate-50 rounded-full w-20" />
                            </div>
                        </div>

                        {/* Pillar 2: Location */}
                        <div className="flex flex-col gap-3 min-w-[160px]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                                </div>
                            </div>
                        </div>

                        {/* Pillar 3: Bio */}
                        <div className="flex flex-col gap-3 min-w-[150px]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-20" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-20" />
                                </div>
                            </div>
                        </div>

                        {/* Pillar 4: Pro (XL only) */}
                        <div className="hidden xl:flex flex-col gap-3 min-w-[160px]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-50" />
                                <div className="space-y-1.5">
                                    <div className="h-2 bg-slate-50 rounded w-10" />
                                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Button Shimmer */}
                    <div className="h-14 w-40 bg-slate-50 rounded-2xl flex-shrink-0" />
                </div>
            ))}
        </div>
    );
}
