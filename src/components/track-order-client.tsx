"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { onlyPhoneChars } from "@/lib/validation";
const STATUS_FLOW = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
type TrackedOrder = {
    orderNumber: string;
    status: string;
    createdAt: string;
    total: number;
    items: { id: string; quantity: number; book: { title: string } }[];
};
export function TrackOrderClient() {
    const { t, locale, dict } = useI18n();
    const searchParams = useSearchParams();
    const [orderNumber, setOrderNumber] = React.useState(searchParams.get("orderNumber") || "");
    const [phone, setPhone] = React.useState(searchParams.get("phone") || "");
    const [order, setOrder] = React.useState<TrackedOrder | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [notFound, setNotFound] = React.useState(false);
    React.useEffect(() => {
        const on = searchParams.get("orderNumber");
        const ph = searchParams.get("phone");
        if (on && ph)
            track(on, ph);
    }, [searchParams]);
    async function track(on: string = orderNumber, ph: string = phone) {
        if (!on)
            return;
        setLoading(true);
        setNotFound(false);
        try {
            const qs = new URLSearchParams({ orderNumber: on });
            if (ph)
                qs.set("phone", ph);
            const res = await fetch(`/api/orders?${qs.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data.order);
            }
            else {
                setOrder(null);
                setNotFound(true);
            }
        }
        finally {
            setLoading(false);
        }
    }
    const stepIndex = order
        ? Math.max(0, STATUS_FLOW.indexOf(order.status === "OUT_FOR_DELIVERY" ? "SHIPPED" : order.status))
        : -1;
    const statusLabel =
        order && order.status in dict.order.status
            ? dict.order.status[order.status as keyof typeof dict.order.status]
            : (order?.status ?? "");
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("order.trackTitle") }]}/>

      <div className="mt-6">
        <h1 className="font-serif text-3xl font-bold">{t("order.trackTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("order.trackSub")}</p>
      </div>

      <form onSubmit={(e) => {
            e.preventDefault();
            track();
        }} className="mt-6 rounded-2xl border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="orderNumber">{t("order.orderNumberLabel")}</Label>
            <Input id="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="BB-..." className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="phone">{t("order.phoneLabel")}</Label>
            <Input id="phone" type="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(onlyPhoneChars(e.target.value))} placeholder="0555 12 34 56" className="mt-1.5"/>
          </div>
        </div>
        <Button type="submit" className="mt-4" loading={loading}>
          <Search className="h-4 w-4"/> {t("order.track")}
        </Button>
      </form>

      {notFound && (<div className="mt-8">
          <EmptyState icon={Package} title={t("order.notFound")}/>
        </div>)}

      {order && (<div className="mt-8 rounded-2xl border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("order.orderNumber")}</div>
              <div className="font-mono text-lg font-bold text-primary">{order.orderNumber}</div>
            </div>
            <div className="text-end">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("order.orderedOn")}</div>
              <div className="font-medium">{formatDate(order.createdAt, locale)}</div>
            </div>
          </div>

          <div className="mt-8">
            <div className="relative flex justify-between">
              <div className="absolute inset-x-0 top-4 h-0.5 bg-border"/>
              <div className="absolute start-0 top-4 h-0.5 bg-primary transition-all" style={{ width: `${(stepIndex / (STATUS_FLOW.length - 1)) * 100}%` }}/>
              {STATUS_FLOW.map((s, i) => {
                const done = i <= stepIndex;
                return (<div key={s} className="relative z-10 flex flex-col items-center gap-2">
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold", done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground")}>
                      {done ? <Check className="h-4 w-4"/> : i + 1}
                    </span>
                    <span className="w-16 text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
                      {dict.order.statusSteps[i]}
                    </span>
                  </div>);
            })}
            </div>
            <div className="mt-4 rounded-xl bg-primary/5 p-3 text-center text-sm font-medium">
              {statusLabel}
            </div>
          </div>

          <ul className="mt-6 space-y-2 border-t pt-4">
            {order.items.map((it) => (<li key={it.id} className="flex justify-between text-sm">
                <span className="line-clamp-1">
                  {it.book.title} × {it.quantity}
                </span>
              </li>))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="font-semibold">{t("order.totalPaid")}</span>
            <span className="font-serif text-xl font-bold text-primary">
              {formatPrice(Number(order.total), t("common.currency"), locale)}
            </span>
          </div>
        </div>)}
    </div>);
}
