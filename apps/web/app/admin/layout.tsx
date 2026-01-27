"use client";

import { LayoutDashboard, Users, Upload, LogOut, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "../../lib/auth.service";
import { Button } from "@repo/ui/button";

const sidebarItems = [
    {
        title: "Overview",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Data Upload",
        href: "/admin/upload",
        icon: Upload,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await AuthService.logout();
        router.push("/login");
    };

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border/10 bg-white shadow-xl shadow-orange-500/5 hidden md:flex flex-col">
                {/* Header */}
                <div className="flex h-16 items-center border-b border-border/10 px-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-[#E67E22] flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-800 tracking-tight">Admin Portal</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-[#FFF8F0] text-[#E67E22]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "text-[#E67E22]" : "text-gray-400"}`} />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="border-t border-border/10 p-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 rounded-xl px-4 py-6 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
