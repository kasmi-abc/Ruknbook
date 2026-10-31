import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminClient, { type AdminOrder, type AdminProduct } from "@/components/admin/admin-client";
export const dynamic = "force-dynamic";
export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const admin = await requireAdmin();
    if (!admin)
        redirect(`/${locale}/login`);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const [orderCount, revenue, bookCount, customerCount, subscriberCount, statusGroups, wilayaGroups, weeklyOrders, stockSum, orders, books, customers, subscribers,] = await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.book.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.newsletter.count(),
        prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.order.groupBy({ by: ["state"], _count: { _all: true }, where: { NOT: { state: null } }, orderBy: { _count: { state: "desc" } }, take: 1 }),
        prisma.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { total: true, createdAt: true },
        }),
        prisma.book.aggregate({ _sum: { stock: true } }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 200,
            include: {
                items: {
                    select: {
                        id: true,
                        quantity: true,
                        price: true,
                        book: { select: { title: true } },
                    },
                },
            },
        }),
        prisma.book.findMany({
            orderBy: [{ salesCount: "desc" }, { title: "asc" }],
            take: 400,
            select: {
                id: true,
                slug: true,
                title: true,
                author: true,
                price: true,
                stock: true,
                salesCount: true,
                rating: true,
                coverUrl: true,
                discountPct: true,
                category: { select: { name: true } },
            },
        }),
        prisma.user.findMany({
            where: { role: "CUSTOMER" },
            orderBy: { createdAt: "desc" },
            take: 300,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                _count: { select: { orders: true } },
            },
        }),
        prisma.newsletter.findMany({ orderBy: { createdAt: "desc" }, take: 300 }),
    ]);
    const series: { revenue: number; orders: number }[] = [];
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
        const from = new Date(dayStart);
        from.setDate(from.getDate() - i);
        const to = new Date(from);
        to.setDate(to.getDate() + 1);
        const dayOrders = weeklyOrders.filter((o) => o.createdAt >= from && o.createdAt < to);
        series.push({
            revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0),
            orders: dayOrders.length,
        });
    }
    const statusCounts: Record<string, number> = {};
    for (const g of statusGroups)
        statusCounts[g.status] = g._count._all;
    const topWilayaGroup = wilayaGroups[0];
    const lowStockBooks = books
        .filter((b) => b.stock < 5)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 8)
        .map((b) => ({ id: b.id, title: b.title, stock: b.stock }));
    const data = {
        stats: {
            revenue: Number(revenue._sum.total ?? 0),
            orderCount,
            bookCount,
            customerCount,
            subscriberCount,
            stockUnits: Number(stockSum._sum.stock ?? 0),
            topWilaya: topWilayaGroup
                ? {
                    state: topWilayaGroup.state ?? "",
                    count: topWilayaGroup._count._all,
                }
                : null,
            bestSeller: books[0]
                ? { title: books[0].title, author: books[0].author, salesCount: books[0].salesCount }
                : null,
        },
        statusCounts,
        lowStockCount: books.filter((b) => b.stock < 5).length,
        series,
        lowStockBooks,
        orders: orders.map((o) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customerName,
            phone: o.phone,
            status: o.status,
            total: Number(o.total),
            subtotal: Number(o.subtotal),
            shippingFee: Number(o.shippingFee),
            giftCardFee: Number(o.giftCardFee),
            giftCard: o.giftCard,
            giftMessage: o.giftMessage,
            street: o.street,
            city: o.city,
            state: o.state,
            zip: o.zip,
            note: o.note,
            createdAt: o.createdAt.toISOString(),
            items: o.items.map((i) => ({
                id: i.id,
                quantity: i.quantity,
                title: i.book.title,
                price: Number(i.price),
            })),
        })),
        books: books.map((b) => ({
            id: b.id,
            slug: b.slug,
            title: b.title,
            author: b.author,
            price: Number(b.price),
            stock: b.stock,
            salesCount: b.salesCount,
            rating: b.rating,
            category: b.category?.name ?? "â€”",
        })),
        customers: customers.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            role: c.role,
            createdAt: c.createdAt.toISOString(),
            orders: c._count.orders,
        })),
        subscribers: subscribers.map((s) => ({ id: s.id, email: s.email, createdAt: s.createdAt.toISOString() })),
    };
    const adminOrders: AdminOrder[] = orders.map((o) => ({
        id: o.id,
        reference: o.orderNumber,
        fullName: o.customerName,
        phone: o.phone,
        wilaya: o.state ?? "",
        city: o.city ?? "",
        address: o.street ?? "",
        notes: o.note,
        gift: o.giftCard,
        giftMessage: o.giftMessage,
        items: o.items.map((i) => ({ id: i.id, qty: i.quantity, price: Number(i.price) })),
        subtotal: Number(o.subtotal),
        deliveryFee: Number(o.shippingFee),
        total: Number(o.total),
        status: (o.status ?? "PENDING").toLowerCase() as AdminOrder["status"],
        createdAt: o.createdAt,
    }));
    const adminProducts: AdminProduct[] = books.map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category?.name ?? "",
        price: Number(b.price),
        image: b.coverUrl ?? "",
        badge: b.discountPct ? `-${b.discountPct}%` : undefined,
    }));
    return <AdminClient adminName={admin.name ?? admin.email} initialOrders={adminOrders} products={adminProducts} dbReady />;
}
