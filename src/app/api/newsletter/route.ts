import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const schema = z.object({ email: z.string().email() });
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }
        await prisma.newsletter.upsert({
            where: { email: parsed.data.email },
            update: {},
            create: { email: parsed.data.email },
        });
        return NextResponse.json({ ok: true });
    }
    catch {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
