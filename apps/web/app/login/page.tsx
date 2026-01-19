"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Flip } from "gsap/all";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Card, CardContent } from "@repo/ui/card";
import { Loader2 } from "lucide-react";

gsap.registerPlugin(Flip);

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const titleWrapperRef = useRef<HTMLDivElement>(null);
    const titleTextRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);

    // Ref for the initial centered container
    const initialContainerRef = useRef<HTMLDivElement>(null);
    // Ref for the final destination container
    const finalContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Prevent FOUC
            gsap.set(containerRef.current, { visibility: "visible" });

            const tl = gsap.timeline();

            // 1. Initial State: Text is large, centered (we do this by layout, but let's ensure it starts invisible or set up)
            // Actually, we will render it in the 'final' DOM structure but absolute position it initially?
            // Or better: Use Flip to reparent it?
            // Let's stick to the prompt's "typing animation" first.

            // Setup: "Rajasthan" text starts with width 0 (typing effect)
            // We'll simulate typing by animating width of a wrapper or clip-path

            const titleText = titleTextRef.current;
            const initialContainer = initialContainerRef.current;
            const finalContainer = finalContainerRef.current;
            const form = formRef.current;
            const subtitle = subtitleRef.current;

            if (!titleText || !initialContainer || !finalContainer || !form || !subtitle) return;

            // Move text to initial container for the centered effect
            initialContainer.appendChild(titleText);

            // Reset styles for the 'big' version
            gsap.set(titleText, {
                fontSize: "8rem", // Bigger size as requested
                position: "relative",
                margin: 0,
                width: "0%", // Start hidden for typing
                overflow: "hidden",
                whiteSpace: "nowrap",
                borderRight: "4px solid #FA8112", // Cursor
                lineHeight: "1", // Give space for descenders (j)
                paddingBottom: "0rem" // Extra safety for overlap
            });

            // Animation Sequence
            tl.to(titleText, {
                width: "auto",
                duration: 1.2,
                ease: "steps(12)", // Typing step effect
            })
                .to(titleText, {
                    borderRightColor: "transparent",
                    duration: 0.5,
                    repeat: 1,
                    yoyo: true
                })
                .add(() => {
                    // FLIP Animation: Capture state, move to final, animate
                    const state = Flip.getState(titleText);

                    // Move to final container
                    finalContainer.appendChild(titleText);

                    // Remove 'big' styles so it takes the class styles (text-5xl)
                    gsap.set(titleText, {
                        fontSize: "",
                        borderRight: "none",
                        width: "",
                        overflow: "",
                        whiteSpace: ""
                    });

                    Flip.from(state, {
                        duration: 1.2,
                        ease: "power4.inOut",
                        absolute: true, // Crucial for smooth Reparenting FLIP
                        scale: true,
                        onComplete: () => {
                            // Ensure styles are clean after flip
                            gsap.set(titleText, { clearProps: "all" });
                        }
                    });
                })
                .to([subtitle, form], {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    delay: 0.4 // Wait a bit after the flip starts
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full flex items-center justify-center bg-[#F9F6F0] relative overflow-hidden invisible"
        >
            {/* Initial Centered Container - Absolute Overlay */}
            <div
                ref={initialContainerRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
                {/* Title starts here */}
            </div>

            {/* Subtle Texture Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-soft-light" />

            {/* Very subtle ambient glow, less intrusive than before */}
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#E86C24]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#E86C24]/5 rounded-full blur-[100px]" />

            <div className="w-full max-w-[400px] relative z-10 mx-auto">
                {/* Header Section */}
                <div className="text-center mb-7 space-y-2 flex flex-col items-center">
                    {/* Final Position Container */}
                    <div ref={finalContainerRef} className="min-h-[60px] flex justify-center items-end">
                        {/* Title moves here */}
                        {/* We render it primarily here so SSR works, but useEffect moves it to initialContainer */}
                        <h1
                            ref={titleTextRef}
                            className="text-5xl font-[650] text-primary tracking-tight inline-block"
                        >
                            Rajasthan
                        </h1>
                    </div>

                    <h2
                        ref={subtitleRef}
                        className="text-xl font-medium text-secondary uppercase tracking-widest opacity-0 translate-y-4"
                    >
                        MLA Profile Dashboard
                    </h2>
                </div>

                {/* Login Card */}
                <Card
                    ref={formRef}
                    className="bg-white/80 backdrop-blur-xl border-border/10 opacity-0 translate-y-8"
                >
                    <CardContent className="p-8 pt-8">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@rajasthan.gov.in"
                                    defaultValue="admin@rajasthan.gov.in"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    defaultValue="password"
                                />
                            </div>

                            <div className="pt-5">
                                <Button
                                    type="submit"
                                    className="w-full py-4 text-base font-bold bg-gradient-to-br from-primary to-[#FB9E45] hover:from-primary hover:to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/40 border border-primary/20 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98]"
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

                            <p className="text-center text-xs text-secondary/60 mt-4">
                                Authorized Personnel Only • Secure System
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
