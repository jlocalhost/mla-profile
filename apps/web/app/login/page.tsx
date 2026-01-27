"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent } from "@repo/ui/card";
import { Loader2 } from "lucide-react";
import { AuthService } from "../../lib/auth.service";

gsap.registerPlugin(Flip);

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const titleWrapperRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const taglineRef = useRef<HTMLHeadingElement>(null);

    // Ref for the initial centered container
    const initialContainerRef = useRef<HTMLDivElement>(null);
    // Ref for the final destination container
    const finalContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Prevent FOUC
            gsap.set(containerRef.current, { visibility: "visible" });

            const tl = gsap.timeline();

            const titleText = titleTextRef.current;
            const subtitle = subtitleRef.current;
            const tagline = taglineRef.current;
            const initialContainer = initialContainerRef.current;
            const finalContainer = finalContainerRef.current;
            const form = formRef.current;

            if (!titleText || !subtitle || !tagline || !initialContainer || !finalContainer || !form) return;

            // Move both texts to initial container for the centered effect
            initialContainer.appendChild(titleText);
            initialContainer.appendChild(subtitle);

            // Reset styles for the 'big' typing version
            // Title Style (Intro)
            gsap.set(titleText, {
                display: "block",
                fontSize: "6rem",
                position: "relative",
                margin: 0,
                paddingBottom: "10px", // Prevent accent clipping
                width: "0%",
                overflow: "hidden",
                whiteSpace: "nowrap",
                borderRight: "4px solid #FA8112",
                lineHeight: "1.25", // Match final leading-tight
            });

            // Subtitle Style (Intro) - HIDDEN entirely to prevent cursor ghost
            gsap.set(subtitle, {
                display: "none",
                width: "0%",
                overflow: "hidden", // Still needed for typing
                whiteSpace: "nowrap",
                borderRight: "4px solid #64748B",
                fontSize: "3rem",
                margin: 0,
                paddingTop: "5px",
                lineHeight: "1.25"
            });

            // Tagline - hidden initially
            gsap.set(tagline, { opacity: 0, y: 10 });

            // Animation Sequence
            tl
                // 1. Type Title
                .to(titleText, {
                    width: "auto",
                    duration: 1.1,
                    ease: "steps(20)",
                })
                .to(titleText, {
                    borderRightColor: "transparent",
                    duration: 0.1,
                })
                // 2. Enable Subtitle (Reveal + Cursor)
                .set(subtitle, {
                    display: "block", // Reveal as BLOCK to match Flex behavior perfectly
                    borderRightColor: "#64748B"
                })
                // 3. Type Subtitle
                .to(subtitle, {
                    width: "auto",
                    duration: 0.8,
                    ease: "steps(15)",
                })
                .to(subtitle, {
                    borderRightColor: "transparent",
                    duration: 0.1,
                })
                // 4. FLIP Transition
                .add(() => {
                    // Capture State: We must include everything that changes
                    // Capture State including padding
                    const state = Flip.getState([titleText, subtitle], { props: "fontSize,lineHeight,color,marginTop,paddingBottom,paddingTop" });

                    // Move to final container
                    finalContainer.appendChild(titleText);
                    finalContainer.appendChild(subtitle);

                    // Clear 'big' styles so they take their CSS class styles
                    // We must clear ALL inline styles we set for the intro
                    gsap.set([titleText, subtitle], {
                        fontSize: "",
                        borderRight: "none",
                        width: "",
                        overflow: "",
                        whiteSpace: "",
                        marginTop: "",
                        position: "",
                        lineHeight: "",
                        display: "", // Clear display: inline-block/none
                        paddingBottom: "",
                        paddingTop: ""
                    });

                    Flip.from(state, {
                        duration: 0.9,
                        ease: "power3.inOut",
                        absolute: true,
                        onComplete: () => {
                            gsap.set([titleText, subtitle], { clearProps: "all" });
                        }
                    });
                })
                // 5. Reveal Form & Tagline
                .to([form, tagline], {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    delay: 0.3
                });

            // Background fade in parallel
            gsap.fromTo(
                ".bg-pattern",
                { opacity: 0, scale: 1.1 },
                { opacity: 0.1, scale: 1, duration: 1.5, ease: "power2.out" }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const form = e.target as HTMLFormElement;
            const emailInput = form.elements.namedItem("email") as HTMLInputElement;
            const passwordInput = form.elements.namedItem("password") as HTMLInputElement;

            const email = emailInput.value;
            const password = passwordInput.value;

            const data = await AuthService.login(email, password);

            if (data.user.role === 'admin') {
                router.push("/admin/dashboard");
            } else {
                router.push("/user_dashboard");
            }
        } catch (err: any) {
            console.error("Login Failed", err);
            setError(err.message || "Invalid credentials. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden invisible"
        >
            {/* Initial Centered Container - Absolute Overlay */}
            <div
                ref={initialContainerRef}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 text-center gap-1"
            >
                {/* Title starts here */}
            </div>

            {/* Subtle Texture Pattern - REMOVED for clean look or kept minimal */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-soft-light" />

            {/* Very subtle ambient glow, less intrusive than before */}
            <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-orange-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />

            {/* Global Page Watermark - Left Side (Half Visible) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] opacity-[0.04] pointer-events-none grayscale sepia z-0 hidden md:block">
                <Image
                    src="/bjp_logo copy.png"
                    alt="Background Watermark"
                    fill
                    className="object-contain"
                />
            </div>

            <div className="w-full max-w-[400px] relative z-10 mx-auto">
                {/* Header Section */}
                <div className="text-center mb-5 space-y-3 flex flex-col items-center">
                    {/* Final Position Container */}
                    <div ref={finalContainerRef} className="min-h-[80px] flex flex-col justify-end items-center gap-1">
                        {/* Title & Subtitle move here */}
                        <h1
                            ref={titleTextRef}
                            className="text-5xl font-[800] text-[#FF6C0C] tracking-tight inline-block"
                        >
                            भारतीय जनता पार्टी
                        </h1>
                        <h2
                            ref={subtitleRef}
                            className="text-2xl font-bold text-slate-700 tracking-wide"
                        >
                            राजस्थान प्रदेश
                        </h2>
                    </div>

                    {/* Restored Tagline */}
                    <h3
                        ref={taglineRef}
                        className="text-xl font-semibold text-slate-400 uppercase"
                    >
                        विधायक प्रोफ़ाइल डैशबोर्ड
                    </h3>
                </div>

                {/* Login Card */}
                <Card
                    ref={formRef}
                    className="bg-white/70 backdrop-blur-2xl border-slate-200/60 shadow-2xl opacity-0 translate-y-8 relative overflow-hidden"
                >
                    {/* Background Watermark */}
                    <div className="absolute pointer-events-none grayscale sepia ring-0 rounded-none object-contain -right-10 -bottom-10 h-48 w-48 opacity-[0.05] z-0">
                        <Image
                            src="/bjp_logo copy.png"
                            alt="watermark"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <CardContent className="p-8 pt-8 relative z-10">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="h-11 bg-slate-50 border-slate-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50 transition-all"
                                />
                            </div>

                            <div className="pt-2">
                                {error && (
                                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-center animate-in slide-in-from-top-1 fade-in">
                                        {error}
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base font-bold bg-gradient-to-br from-[#E67E22] to-[#D35400] hover:from-[#d35400] hover:to-[#a04000] text-white shadow-lg shadow-orange-500/25 border border-orange-600/10 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Access Dashboard</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </div>
                                    )}
                                </Button>
                            </div>

                            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                                Authorized Personnel Only • Secure System
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
