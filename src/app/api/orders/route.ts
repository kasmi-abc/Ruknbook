import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { SITE, GIFT_CARD_FEE, WILAYAS } from "@/lib/constants";
import { auth } from "@/lib/auth";
const itemSchema = z.object({
    bookId: z.string(),
    quantity: z.number().int().min(1).max(20),
    format: z.string().default("paperback"),
});
const algerianPhone = /^0[567]\d{8}$/;
const orderSchema = z.object({
    customerName: z
        .string()
        .trim()
        .min(2, "name too short")
        .regex(/^[\p{L}][\p{L}\s'â€™.-]{1,59}$/u, "name must be letters only"),
    phone: z
        .string()
        .trim()
        .transform((v) => v.replace(/[\s.\-()]/g, "").replace(/^(00213|\+213)/, "0"))
        .refine((v) => algerianPhone.test(v), "invalid Algerian phone"),
    street: z
        .string()
        .trim()
        .min(3, "street too short")
        .regex(/^[\p{L}\d][\p{L}\d\s'â€™,./-]{2,79}$/u, "invalid street"),
    city: z
        .string()
        .trim()
        .min(2, "city too short")
        .regex(/^[\p{L}][\p{L}\s'â€™.]{1,59}$/u, "city must be letters only"),
    state: z
        .string()
        .trim()
        .regex(/^\d{2}$/, "state must be a wilaya code")
        .refine((v) => WILAYAS.some((w) => w.code === v), "unknown wilaya")
        .optional()
        .or(z.literal("")),
    zip: z
        .string()
        .trim()
        .regex(/^\d{5}$/, "postal code must be 5 digits")
        .optional()
        .or(z.literal("")),
    note: z.string().trim().max(500).optional().or(z.literal("")),
    giftCard: z.boolean().optional().default(false),
    giftMessage: z.string().trim().max(200).optional().or(z.literal("")),
    items: z.array(itemSchema).min(1),
});
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = orderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
        }
        const data = parsed.data;
        const hasGiftCard = Boolean(data.giftCard);
        if (hasGiftCard && !data.giftMessage) {
            return NextResponse.json({ error: "A gift message is required when a gift card is selected" }, { status: 400 });
        }
        const bookIds = data.items.map((i) => i.bookId);
        const books = await prisma.book.findMany({ where: { id: { in: bookIds } } });
        const bookMap = new Map(books.map((b) => [b.id, b]));
        let subtotal = 0;
        const orderItems = data.items.map((i) => {
            const book = bookMap.get(i.bookId);
            if (!book)
                throw new Error(`Book not found: ${i.bookId}`);
            const unit = Number(book.price);
            subtotal += unit * i.quantity;
            return {
                bookId: i.bookId,
                quantity: i.quantity,
                format: i.format,
                price: unit,
            };
        });
        const shipping = subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
        const giftCardFee = hasGiftCard ? GIFT_CARD_FEE : 0;
        const total = subtotal + shipping + giftCardFee;
        const session = await auth().catch(() => null);
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                status: "PENDING",
                subtotal,
                shippingFee: shipping,
                total,
                currency: "DZD",
                paymentMethod: "COD",
                note: data.note || null,
                customerName: data.customerName,
                email: null,
                phone: data.phone,
                street: data.street,
                city: data.city,
                state: data.state || null,
                zip: data.zip || null,
                giftCard: hasGiftCard,
                giftCardFee,
                giftMessage: hasGiftCard ? data.giftMessage : null,
                userId: session?.user?.id ?? null,
                items: { create: orderItems },
            },
            include: { items: { include: { book: true } } },
        });
        return NextResponse.json({
            ok: true,
            orderNumber: order.orderNumber,
            total: Number(order.total),
        });
    }
    catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
export async function GET(request: NextRequest) {
    const orderNumber = request.nextUrl.searchParams.get("orderNumber");
    const phone = request.nextUrl.searchParams.get("phone");
    if (!orderNumber) {
        return NextResponse.json({ error: "orderNumber required" }, { status: 400 });
    }
    try {
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: { items: { include: { book: true } } },
        });
        if (!order)
            return NextResponse.json({ error: "not_found" }, { status: 404 });
        if (phone) {
            const clean = phone.replace(/[\s.\-()]/g, "").replace(/^(00213|\+213)/, "0");
            if (order.phone.replace(/[\s.\-()]/g, "") !== clean) {
                return NextResponse.json({ error: "not_found" }, { status: 404 });
            }
        }
        return NextResponse.json({ order });
    }
    catch {
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
