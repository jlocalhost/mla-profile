"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Users, Upload, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";
import * as React from "react";

export default function AdminDashboardPage() {
    const [stats, setStats] = React.useState({ totalUsers: 0 });

    React.useEffect(() => {
        fetch("/api/admin_dashboard/stats")
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-2">Manage users, upload data, and oversee system status.</p>
                </div>
                <Link href="/user_dashboard" target="_blank">
                    <Button variant="outline" className="gap-2 border-[#E67E22]/20 text-[#E67E22] hover:bg-[#E67E22]/5">
                        Go to Main Dashboard <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/10 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-[#E67E22]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active users in the system
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/10 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Data Records
                        </CardTitle>
                        <Activity className="h-4 w-4 text-[#E67E22]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,231</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +5% from last week
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-border/10 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Last Upload
                        </CardTitle>
                        <Upload className="h-4 w-4 text-[#E67E22]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2h ago</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            voter_data_2024.csv
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-border/10 shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Add new MLAT or administrative users to the system.</p>
                            <Link href="/admin/users">
                                <Button className="w-full bg-[#E67E22] hover:bg-[#D35400]">Manage Users</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/10 shadow-sm">
                    <CardHeader>
                        <CardTitle>Data Upload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">Upload bulk data for constituency processing.</p>
                            <Link href="/admin/upload">
                                <Button variant="outline" className="w-full">Upload New Data</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
