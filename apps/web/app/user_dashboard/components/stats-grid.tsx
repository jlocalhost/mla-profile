"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Users, Handshake, User } from "lucide-react";

// Mock Data Type
interface MLAStat {
    id: string;
    label: string;
    count: number;
    icon?: React.ElementType;
    image?: string;
    color: string;
    bgGradient: string;
}

// Mock Data
const mlaStats: MLAStat[] = [
    {
        id: "total",
        label: "कुल विधायक",
        count: 200,
        //icon: Users,
        image: "/mla_count.webp",
        color: "text-gray-800",
        bgGradient: "bg-white",
    },
    {
        id: "bjp",
        label: "भाजपा विधायक",
        count: 115,
        image: "/bjp_logo copy.png",
        color: "text-orange-600",
        bgGradient: "bg-orange-50/60 border-orange-100",
    },
    {
        id: "inc",
        label: "कांग्रेस विधायक",
        count: 69,
        image: "/inc_logo.png",
        color: "text-blue-600",
        bgGradient: "bg-blue-50/60 border-blue-100",
    },
    {
        id: "others",
        label: "अन्य दल विधायक",
        count: 8,
        image: "/others_logo.webp",
        //#icon: Handshake,
        color: "text-purple-600",
        bgGradient: "bg-purple-50/60 border-purple-100",
    },
    {
        id: "ind",
        label: "निर्दलीय विधायक",
        count: 8,
        image: "/single_person.png",
        //icon: User,
        color: "text-teal-600",
        bgGradient: "bg-teal-50/60 border-teal-100",
    },
];

export function StatsGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(".stat-card",
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: "power2.out",
                    onComplete: () => {
                        const cards = containerRef.current?.querySelectorAll(".stat-card");
                        cards?.forEach((card: any) => card.classList.remove("opacity-0"));
                        gsap.set(cards || [], { clearProps: "all" });
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {mlaStats.map((stat) => (
                <Link
                    key={stat.id}
                    href={stat.id === "total" ? "/mlas" : `/mlas?party=${stat.id.toUpperCase()}`}
                    className="block"
                >
                    <Card
                        className={`stat-card opacity-0 cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${stat.bgGradient} border-t-4 h-32 flex flex-col`}
                        style={{ borderTopColor: stat.color.includes('orange') ? '#E67E22' : stat.color.includes('blue') ? '#3B82F6' : stat.color.includes('purple') ? '#9333EA' : stat.color.includes('teal') ? '#14B8A6' : '#E8EAEB' }}
                    >
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="!pt-1 !pb-4">
                            <div className="flex flex-col">
                                <span className={`text-5xl font-extrabold tracking-tight ${stat.color}`}>
                                    {stat.count}
                                </span>
                            </div>

                            {/* Background Watermark (Preserved) */}
                            {stat.icon ? (
                                <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color}`} />
                            ) : stat.image && (
                                <div className={`absolute pointer-events-none grayscale sepia ring-0 rounded-none object-contain -right-6 -bottom-6 h-28 w-28 opacity-[0.08]`}>
                                    <Image
                                        src={stat.image}
                                        alt="watermark"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
