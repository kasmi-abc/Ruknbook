import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        const { name, email, password } = parsed.data;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, passwordHash, role: "CUSTOMER" },
        });
        return NextResponse.json({ ok: true });
    }
    catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
