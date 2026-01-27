import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@repo/db";
import bcrypt from "bcrypt";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_me");

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        if (!user.isActive) {
            return NextResponse.json({ error: "Account is disabled. Please contact administrator." }, { status: 403 });
        }

        // Create JWT
        const token = await new SignJWT({
            id: user.id,
            role: user.role.toLowerCase(), // 'ADMIN' -> 'admin'
            email: user.email,
            name: user.name || "User"
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(SECRET_KEY);

        // Set Cookie and response
        const response = NextResponse.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role.toLowerCase(),
                email: user.email
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response;
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
