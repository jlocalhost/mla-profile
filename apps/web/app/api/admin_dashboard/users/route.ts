import { NextResponse } from "next/server";
import { prisma } from "@repo/db";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role as Role,
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error("Create User Error:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}
