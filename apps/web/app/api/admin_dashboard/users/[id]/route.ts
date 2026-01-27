import { NextResponse } from "next/server";
import { prisma } from "@repo/db";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("GET User Error:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        await prisma.user.update({
            where: { id: params.id },
            data: { isActive: false },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE User Error:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}

import bcrypt from "bcrypt";

// ... existing imports

export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const body = await request.json();
        const { name, role, password } = body;

        const updateData: any = { name, role };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
        });

        // Don't return the password
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error("PUT User Error:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
