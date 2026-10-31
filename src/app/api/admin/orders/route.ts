import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
const patchSchema = z.object({
    orderId: z.string().min(1),
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ]),
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
        const { orderId, status } = parsed.data;
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { items: { include: { book: true } } },
        });
        return NextResponse.json({ ok: true, order });
    }
    catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
