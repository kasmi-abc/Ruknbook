import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/sign-out-button";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package, User } from "lucide-react";
export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const session = await auth().catch(() => null);
    if (!session?.user?.id)
        redirect(`/${locale}/login`);
    const [user, orders] = await Promise.all([
        prisma.user.findUnique({ where: { id: session.user.id } }),
        prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        }),
    ]);
    const statusLabel = (s: string) => dict.order.status[s as keyof typeof dict.order.status] ?? s;
    return (<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">{dict.account.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {dict.account.welcome}, {user?.name ?? session.user.email}
          </p>
        </div>
        <SignOutButton locale={locale} label={dict.account.signOut}/>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <User className="h-4 w-4 text-primary"/> {dict.account.profile}
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{dict.account.name}</dt>
              <dd className="font-medium">{user?.name ?? "â€”"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{dict.account.email}</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            {user?.createdAt && (<div className="flex justify-between">
                <dt className="text-muted-foreground">{dict.account.memberSince}</dt>
                <dd className="font-medium">{formatDate(user.createdAt, locale)}</dd>
              </div>)}
          </dl>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <Package className="h-4 w-4 text-primary"/> {dict.account.myOrders}
        </h2>
        {orders.length === 0 ? (<p className="mt-4 text-sm text-muted-foreground">{dict.account.noOrders}</p>) : (<ul className="mt-4 divide-y">
            {orders.map((o) => (<li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-mono text-sm font-bold text-primary">{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(o.createdAt, locale)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    {statusLabel(o.status)}
                  </span>
                  <span className="font-semibold">
                    {formatPrice(Number(o.total), dict.common.currency, locale)}
                  </span>
                </div>
              </li>))}
          </ul>)}
      </div>
    </div>);
}
