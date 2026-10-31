import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
const schema = z.object({
    bookId: z.string(),
    rating: z.number().int().min(1).max(5),
    title: z.string().min(2).max(120),
    content: z.string().min(5).max(2000),
});
export async function POST(request: Request) {
    const session = await auth().catch(() => null);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await request.json();
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        const { bookId, rating, title, content } = parsed.data;
        await prisma.review.upsert({
            where: { userId_bookId: { userId: session.user.id, bookId } },
            update: { rating, title, content },
            create: { userId: session.user.id, bookId, rating, title, content },
        });
        const agg = await prisma.review.aggregate({
            where: { bookId },
            _avg: { rating: true },
            _count: true,
        });
        await prisma.book.update({
            where: { id: bookId },
            data: { rating: agg._avg.rating ?? 0, reviewsCount: agg._count },
        });
        return NextResponse.json({ ok: true });
    }
    catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
