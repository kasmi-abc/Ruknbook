import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
const patchSchema = z
    .object({
    bookId: z.string().min(1),
    stock: z.number().int().min(0).max(100000).optional(),
    price: z.number().min(0).max(1000000).optional(),
})
    .refine((d) => d.stock !== undefined || d.price !== undefined, {
    message: "stock or price is required",
});
export async function PATCH(request: Request) {
    const admin = await requireAdmin();
    if (!admin)
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
    try {
        const parsed = patchSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
        }
        const { bookId, stock, price } = parsed.data;
        const data: { stock?: number; price?: number } = {};
        if (stock !== undefined)
            data.stock = stock;
        if (price !== undefined)
            data.price = price;
        const book = await prisma.book.update({ where: { id: bookId }, data });
        return NextResponse.json({
            ok: true,
            book: { id: book.id, stock: book.stock, price: Number(book.price) },
        });
    }
    catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
