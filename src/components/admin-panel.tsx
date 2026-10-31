"use client";
import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, BookOpen, Users, Mail, Search, ExternalLink, Gift, Save, X, Bell, Menu, ChevronRight, TrendingUp, Wallet, UserRound, Printer, Tag, FileText, Truck, Download, Plus, Minus, Package, AlertTriangle, MapPin, LogOut, Sparkles, } from "lucide-react";
import { signOut } from "next-auth/react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { WILAYAS, SITE } from "@/lib/constants";
import { printInvoice, printShippingLabel, printGiftCard, downloadCsv } from "@/lib/print-docs";
import type { PrintOrder, PrintStrings } from "@/lib/print-docs";
import type { Dictionary } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
const STATUSES: string[] = [
    "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
];
const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    CONFIRMED: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    PROCESSING: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
    SHIPPED: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    OUT_FOR_DELIVERY: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    DELIVERED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
};
type AdminOrderItem = { id: string; quantity: number; title: string; price: number };
type AdminOrder = {
    id: string;
    orderNumber: string;
    customerName: string;
    phone: string;
    status: string;
    total: number;
    subtotal: number;
    shippingFee: number;
    giftCardFee: number;
    giftCard: boolean;
    giftMessage: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
    note: string | null;
    createdAt: string;
    items: AdminOrderItem[];
};
type AdminBook = {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    stock: number;
    salesCount: number;
    rating: number;
    category: string;
};
type AdminCustomer = { id: string; name: string | null; email: string; phone: string | null; role: string; createdAt: string; orders: number };
type AdminSubscriber = { id: string; email: string; createdAt: string };
export type AdminData = {
    stats: {
        revenue: number;
        orderCount: number;
        bookCount: number;
        customerCount: number;
        subscriberCount: number;
        stockUnits: number;
        topWilaya: { state: string; count: number } | null;
        bestSeller: { title: string; author: string; salesCount: number } | null;
    };
    statusCounts: Record<string, number>;
    lowStockCount: number;
    series: { revenue: number; orders: number }[];
    lowStockBooks: { id: string; title: string; stock: number }[];
    orders: AdminOrder[];
    books: AdminBook[];
    customers: AdminCustomer[];
    subscribers: AdminSubscriber[];
};
function wilayaName(code: string | null | undefined) {
    if (!code)
        return "â€”";
    const w = WILAYAS.find((x) => x.code === code);
    return w ? `${code} Â· ${w.name}` : code;
}
export function AdminPanel({ data, locale, dict, adminName }: {
    data: AdminData;
    locale: string;
    dict: Dictionary;
    adminName: string;
}) {
    const { t } = useI18n();
    const currency = dict.common.currency;
    const fmt = (n: number) => formatPrice(n, currency, locale);
    const [tab, setTab] = React.useState("dashboard");
    const [q, setQ] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("ALL");
    const [categoryFilter, setCategoryFilter] = React.useState("ALL");
    const [orders, setOrders] = React.useState<AdminOrder[]>(data.orders);
    const [books, setBooks] = React.useState<AdminBook[]>(data.books);
    const [busyId, setBusyId] = React.useState<string | null>(null);
    const [stockDraft, setStockDraft] = React.useState<Record<string, string>>({});
    const [priceDraft, setPriceDraft] = React.useState<Record<string, string>>({});
    const [drawerId, setDrawerId] = React.useState<string | null>(null);
    const statusLabels = dict.order.status;
    const statusLabelOf = (s: string) => (statusLabels as Record<string, string>)[s] ?? s;
    const match = (haystack: (string | null | undefined)[]) => haystack.some((v) => (v ?? "").toLowerCase().includes(q.trim().toLowerCase()));
    const filteredOrders = orders.filter((o) => (statusFilter === "ALL" || o.status === statusFilter) &&
        match([o.orderNumber, o.customerName, o.phone, o.state, o.city]));
    const filteredBooks = books.filter((b) => (categoryFilter === "ALL" || b.category === categoryFilter) &&
        match([b.title, b.author, b.category]));
    const categoryOptions = React.useMemo(() => Array.from(new Set(books.map((b) => b.category).filter((c) => c && c !== "â€”"))).sort(), [books]);
    const filteredCustomers = data.customers.filter((c) => match([c.name, c.email, c.phone]));
    const filteredSubscribers = data.subscribers.filter((s) => match([s.email]));
    const statusCount = (status: string) => statusFilter === status ? filteredOrders.length : orders.filter((o) => o.status === status).length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").slice(0, 5);
    const drawerOrder = orders.find((o) => o.id === drawerId) ?? null;
    async function updateStatus(orderId: string, status: string) {
        setBusyId(orderId);
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status }),
            });
            if (!res.ok)
                throw new Error();
            setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
            toast.success(t("admin.orders.updated"));
        }
        catch {
            toast.error(t("admin.orders.updateFailed"));
        }
        finally {
            setBusyId(null);
        }
    }
    async function saveStock(bookId: string) {
        const raw = stockDraft[bookId];
        if (raw === undefined)
            return;
        const value = Number(raw);
        if (!Number.isFinite(value) || value < 0)
            return;
        setBusyId(bookId);
        try {
            const res = await fetch("/api/admin/books", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, stock: Math.floor(value) }),
            });
            if (!res.ok)
                throw new Error();
            setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, stock: Math.floor(value) } : b)));
            setStockDraft((d) => {
                const next = { ...d };
                delete next[bookId];
                return next;
            });
            toast.success(t("admin.books.stockSaved"));
        }
        catch {
            toast.error(t("common.error"));
        }
        finally {
            setBusyId(null);
        }
    }
    async function savePrice(bookId: string) {
        const raw = priceDraft[bookId];
        if (raw === undefined)
            return;
        const value = Number(raw);
        if (!Number.isFinite(value) || value <= 0)
            return;
        setBusyId(bookId);
        try {
            const res = await fetch("/api/admin/books", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, price: value }),
            });
            if (!res.ok)
                throw new Error();
            setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, price: value } : b)));
            setPriceDraft((d) => {
                const next = { ...d };
                delete next[bookId];
                return next;
            });
            toast.success(t("admin.books.priceSaved"));
        }
        catch {
            toast.error(t("common.error"));
        }
        finally {
            setBusyId(null);
        }
    }
    function buildPrintStrings(): PrintStrings {
        return {
            receiptTitle: dict.order.receiptTitle,
            receiptOrderNumber: dict.order.receiptOrderNumber,
            receiptThanks: dict.order.receiptThanks,
            receiptDate: dict.order.receiptDate,
            receiptCustomer: dict.order.receiptCustomer,
            receiptPhone: dict.order.receiptPhone,
            receiptAddress: dict.order.receiptAddress,
            receiptItems: dict.order.receiptItems,
            receiptSubtotal: dict.order.receiptSubtotal,
            receiptShipping: dict.order.receiptShipping,
            receiptFree: dict.cart.free,
            receiptGiftCard: dict.order.receiptGiftCard,
            receiptTotal: dict.order.receiptTotal,
            receiptPayment: dict.order.receiptPayment,
            receiptPaidOnDelivery: dict.order.receiptPaidOnDelivery,
            receiptGiftMessage: dict.order.receiptGiftMessage,
            receiptItem: dict.order.receiptItems,
            receiptQty: dict.cart.quantity,
            receiptUnit: t("admin.print.unitPrice"),
            receiptLineTotal: dict.order.receiptTotal,
            receiptFooterBrand: dict.order.receiptFooterBrand,
            printLabelTitle: t("admin.print.labelTitle"),
            printLabelReceiver: t("admin.print.labelReceiver"),
            printLabelSender: t("admin.print.labelSender"),
            printLabelAmount: t("admin.print.labelAmount"),
            printLabelItems: dict.order.receiptItems,
            printLabelGift: dict.order.receiptGiftMessage,
            printGiftTitle: t("admin.print.giftTitle"),
            printGiftTo: t("admin.print.giftTo"),
            brand: "BORDERS",
            brandSub: "Bookshop",
        };
    }
    function printDoc(kind: "invoice" | "label" | "gift", o: AdminOrder) {
        const po: PrintOrder = { ...o, items: o.items };
        const s: PrintStrings = buildPrintStrings();
        if (kind === "invoice")
            printInvoice(po, s, fmt, formatDate(o.createdAt, locale), locale);
        else if (kind === "label")
            printShippingLabel(po, s, fmt, locale);
        else if (o.giftCard)
            printGiftCard(po, s, locale);
    }
    function exportOrdersCsv() {
        const rows: (string | number)[][] = orders.map((o) => [
            o.orderNumber,
            o.createdAt,
            o.customerName,
            o.phone,
            wilayaName(o.state),
            [o.street, o.city, o.zip].filter(Boolean).join(", "),
            o.items.map((i) => `${i.title} ×${i.quantity}`).join("; "),
            o.subtotal,
            o.shippingFee,
            o.giftCardFee,
            o.total,
            statusLabelOf(o.status),
        ]);
        downloadCsv("rukn-orders.csv", [
            t("admin.orders.orderNumber"), t("admin.orders.date"),
            t("admin.orders.customer"), t("admin.orders.phone"),
            t("admin.orders.wilaya"), t("admin.orders.address"),
            t("order.receiptItems"), t("order.receiptSubtotal"),
            t("order.receiptShipping"), t("order.receiptGiftCard"),
            t("order.receiptTotal"), t("admin.orders.status"),
        ], rows);
        toast.success("CSV ✓");
    }
    const maxRevenue = Math.max(...data.series.map((d) => d.revenue), 1);
    const dayLabel = (i: number) => new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : locale, { weekday: "short" })
        .format(new Date(Date.now() - (6 - i) * 86_400_000));
    const revenue7 = data.series.reduce((s, d) => s + d.revenue, 0);
    const TABS: { id: string; icon: LucideIcon; label: string; count?: number }[] = [
        { id: "dashboard", icon: LayoutDashboard, label: t("admin.tabs.dashboard") },
        { id: "orders", icon: ShoppingBag, label: t("admin.tabs.orders"), count: data.stats.orderCount },
        { id: "books", icon: BookOpen, label: t("admin.tabs.books"), count: data.stats.bookCount },
        { id: "customers", icon: Users, label: t("admin.tabs.customers"), count: data.stats.customerCount },
        { id: "newsletter", icon: Mail, label: t("admin.tabs.newsletter"), count: data.stats.subscriberCount },
    ];
    const searchPlaceholder = tab === "orders" ? t("admin.orders.search")
        : tab === "books" ? t("admin.books.search")
            : tab === "customers" ? t("admin.customers.search")
                : tab === "newsletter" ? t("admin.newsletter.search")
                    : t("common.search");
    const sidebarNav = (<nav className="flex flex-1 flex-col gap-1 p-3">
      {TABS.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.id;
            return (<button key={tb.id} onClick={() => setTab(tb.id)} aria-current={active ? "page" : undefined} className={cn("group flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary")}>
            <Icon className="h-4 w-4 shrink-0"/>
            <span className="flex-1 text-start">{tb.label}</span>
            {tb.count !== undefined && (<span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", active ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
                {tb.count}
              </span>)}
          </button>);
        })}
    </nav>);
    const sidebarFooter = (<div className="border-t bg-muted/30 p-3">
      <div className="flex items-center gap-3 rounded-2xl px-2 pt-1 pb-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
          {adminName.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{adminName}</span>
      </div>
      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" asChild>
        <Link href={`/${locale}`}>
          <ExternalLink className="h-4 w-4"/> {t("admin.viewStore")}
        </Link>
      </Button>
      <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
        <LogOut className="h-4 w-4"/> {t("admin.signOut")}
      </Button>
    </div>);
    const searchBox = (<div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} className="rounded-full bg-muted/40 ps-9"/>
      {q && (<button onClick={() => setQ("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="clear">
          <X className="h-4 w-4"/>
        </button>)}
    </div>);
    return (<div className="mx-auto flex max-w-[1400px] gap-6 px-3 py-5 sm:px-6">
      
      <aside data-no-print className="sticky top-5 hidden h-[calc(100dvh-2.5rem)] w-64 shrink-0 flex-col self-start overflow-hidden rounded-3xl border bg-card lg:flex">
        <div className="flex items-center gap-3 border-b bg-primary px-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-serif text-xl font-bold text-[var(--gold)]">
            B
          </span>
          <div>
            <div className="font-serif text-base font-bold text-white">BORDERS</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
              {t("admin.brandShort")}
            </div>
          </div>
        </div>
        {sidebarNav}
        {sidebarFooter}
      </aside>

      
      <div className="min-w-0 flex-1">
        
        <div className="flex items-center gap-2 rounded-full border bg-card p-1.5 shadow-sm sm:gap-3" data-no-print>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full lg:hidden" aria-label="menu">
                <Menu className="h-4 w-4"/>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 p-0 sm:max-w-72">
              <SheetTitle className="sr-only">{t("admin.title")}</SheetTitle>
              <div className="flex items-center gap-3 border-b bg-primary px-5 py-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 font-serif text-xl font-bold text-[var(--gold)]">
                  B
                </span>
                <div>
                  <div className="font-serif text-base font-bold text-white">BORDERS</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
                    {t("admin.brandShort")}
                  </div>
                </div>
              </div>
              {sidebarNav}
              {sidebarFooter}
            </SheetContent>
          </Sheet>

          <div className="hidden min-w-0 flex-1 sm:block">{searchBox}</div>
          <div className="flex-1 sm:hidden">{searchBox}</div>

          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative shrink-0 rounded-full" aria-label={t("admin.notifications")} data-count={pendingOrders.length}>
                <Bell className="h-4 w-4"/>
                {(pendingOrders.length > 0 || data.lowStockCount > 0) && (<span className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
                    {pendingOrders.length + data.lowStockCount}
                  </span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 rounded-2xl p-0">
              <div className="border-b bg-muted/30 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t("admin.notifications")}
              </div>
              <div className="p-2">
                  {pendingOrders.length > 0 ? (<button onClick={() => { setTab("orders"); (document.activeElement as HTMLElement | null)?.blur(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm hover:bg-primary/5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <ShoppingBag className="h-4 w-4"/>
                    </span>
                    <span className="flex-1">
                      {t("admin.notifOrders").replace("{count}", String(pendingOrders.length))}
                    </span>
                    <ChevronRight className="h-4 w-4 rtl:rotate-180 text-muted-foreground"/>
                  </button>) : null}
                {data.lowStockCount > 0 ? (<>
                    <button onClick={() => { setTab("books"); setCategoryFilter("ALL"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm hover:bg-primary/5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4"/>
                      </span>
                      <span className="flex-1">
                        {t("admin.notifStock").replace("{count}", String(data.lowStockCount))}
                      </span>
                      <ChevronRight className="h-4 w-4 rtl:rotate-180 text-muted-foreground"/>
                    </button>
                    <ul className="mt-1 space-y-0.5 px-3 pb-1">
                      {data.lowStockBooks.slice(0, 4).map((b) => (<li key={b.id} className="flex items-center justify-between gap-2 py-1 text-xs text-muted-foreground">
                          <span className="truncate">{b.title}</span>
                          <span className="shrink-0 font-bold text-red-500">{b.stock}</span>
                        </li>))}
                    </ul>
                  </>) : null}
                {pendingOrders.length === 0 && data.lowStockCount === 0 && (<p className="px-3 py-4 text-sm text-muted-foreground">{t("admin.notifEmpty")}</p>)}
              </div>
            </PopoverContent>
          </Popover>

          <Badge variant="secondary" className="hidden rounded-full md:inline-flex">
            <UserRound className="h-3 w-3"/> {adminName}
          </Badge>
          <Button variant="outline" size="sm" className="shrink-0 rounded-full" asChild>
            <Link href={`/${locale}`}>
              <ExternalLink className="h-4 w-4 sm:me-1"/>
              <span className="hidden sm:inline">{t("admin.viewStore")}</span>
            </Link>
          </Button>
        </div>

        
        {tab === "dashboard" && (<div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard icon={Wallet} tone="primary" label={t("admin.stats.revenue")} value={fmt(data.stats.revenue)} hint={`${t("admin.kpiWeek")}: ${fmt(revenue7)}`} iconChip="bg-white/15 text-white"/>
              <KpiCard icon={ShoppingBag} tone="amber" label={t("admin.stats.orders")} value={String(data.stats.orderCount)} hint={`${orders.filter((o) => o.status === "PENDING").length} ${t("admin.stats.pending")}`} iconChip="bg-amber-500/15 text-amber-600 dark:text-amber-400" action={data.statusCounts["PENDING"] > 0 ? (<Button variant="ghost" size="sm" className="h-6 rounded-full px-2 text-xs" onClick={() => setTab("orders")}>
                    {t("admin.viewAll")} <ChevronRight className="h-3 w-3 rtl:rotate-180"/>
                  </Button>) : undefined}/>
              <KpiCard icon={BookOpen} tone="violet" label={t("admin.stats.books")} value={String(data.stats.bookCount)} hint={`${data.stats.stockUnits} ${t("admin.stockUnits")}`} iconChip="bg-violet-500/15 text-violet-600 dark:text-violet-400"/>
              <KpiCard icon={Users} tone="emerald" label={t("admin.stats.customers")} value={String(data.stats.customerCount)} hint={`${data.stats.subscriberCount} ${t("admin.stats.subscribers")}`} iconChip="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"/>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              
              <div className="rounded-3xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold">{t("admin.chartTitle")}</h3>
                  <Badge variant="secondary" className="rounded-full">
                    <TrendingUp className="h-3 w-3"/> {fmt(revenue7)}
                  </Badge>
                </div>
                <div className="mt-5 flex h-40 items-end gap-2 sm:gap-3">
                  {data.series.map((d, i) => {
                const h = Math.max(3, Math.round((d.revenue / maxRevenue) * 100));
                const isToday = i === data.series.length - 1;
                return (<div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                        <span className={cn("text-[10px] font-bold", isToday ? "text-gold" : "text-muted-foreground")}>
                          {d.revenue > 0 ? fmt(d.revenue) : "â€”"}
                        </span>
                        <div className={cn("w-full rounded-t-lg transition-all", isToday
                        ? "bg-gradient-to-t from-gold to-gold/60"
                        : "bg-gradient-to-t from-primary/25 to-primary/10")} style={{ height: `${h}%` }}/>
                        <span className={cn("text-[10px]", isToday ? "font-bold text-foreground" : "text-muted-foreground")}>
                          {dayLabel(i)}
                        </span>
                      </div>);
            })}
                </div>
                <div className="mt-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t("admin.chartHint")}
                </div>
              </div>

              <div className="space-y-5">
                
                <div className="rounded-3xl border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-serif font-bold">
                      <Sparkles className="h-4 w-4 text-gold"/> {t("admin.pendingOrdersTitle")}
                    </h3>
                    <Badge className="border-0 bg-amber-500/15 text-amber-700 dark:text-amber-400">
                      {orders.filter((o) => o.status === "PENDING").length}
                    </Badge>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {pendingOrders.map((o) => (<li key={o.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/40 px-3 py-2 text-sm">
                        <div className="min-w-0">
                          <span className="font-mono text-xs font-bold text-primary">{o.orderNumber}</span>
                          <div className="truncate text-xs text-muted-foreground">{o.customerName}</div>
                        </div>
                        <span className="shrink-0 font-semibold">{fmt(o.total)}</span>
                      </li>))}
                    {pendingOrders.length === 0 && (<li className="py-2 text-sm text-muted-foreground">âœ“ {t("admin.orders.empty")}</li>)}
                  </ul>
                  {orders.some((o) => o.status === "PENDING") && (<Button variant="outline" size="sm" className="mt-3 w-full rounded-full" onClick={() => setTab("orders")}>
                      {t("admin.viewAll")}
                    </Button>)}
                </div>

                
                {data.lowStockCount > 0 && (<div className="rounded-3xl border border-red-200 bg-red-500/5 p-5 dark:border-red-900/50">
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-2 font-serif font-bold text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4"/> {t("admin.lowStockTitle")}
                      </h3>
                      <Badge className="border-0 bg-red-500/15 text-red-700 dark:text-red-400">
                        {data.lowStockCount}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.lowStockBooks.map((b) => (<button key={b.id} onClick={() => { setTab("books"); setQ(b.title.slice(0, 12)); }} className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-card px-2.5 py-1 text-xs transition-colors hover:border-red-400 dark:border-red-900/50">
                          <span className="max-w-40 truncate">{b.title}</span>
                          <span className="font-bold text-red-500">{b.stock}</span>
                        </button>))}
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              
              <div className="rounded-3xl border bg-card p-5">
                <h3 className="font-serif font-bold">{t("admin.topBooks")}</h3>
                <ul className="mt-4 space-y-3">
                  {books.slice(0, 5).map((b, i) => {
                const maxSales = books[0]?.salesCount || 1;
                return (<li key={b.id}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <Link href={`/${locale}/books/${b.slug}`} className="truncate hover:text-primary">
                            <span className="me-2 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                            {b.title}
                          </Link>
                          <span className="shrink-0 text-xs text-muted-foreground">{b.salesCount} {t("admin.books.sales").toLowerCase()}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: `${Math.max(4, (b.salesCount / maxSales) * 100)}%` }}/>
                        </div>
                      </li>);
            })}
                </ul>
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <QuickFact icon={MapPin} label={t("admin.stats.topWilaya")} value={data.stats.topWilaya ? `${wilayaName(data.stats.topWilaya.state)}` : "â€”"} hint={data.stats.topWilaya ? `${data.stats.topWilaya.count} ${t("admin.stats.orders").toLowerCase()}` : ""}/>
                <QuickFact icon={Package} label={t("admin.stockUnits")} value={String(data.stats.stockUnits)} hint={t("admin.stats.books").toLowerCase()}/>
                <div className="col-span-2 rounded-2xl border bg-gradient-to-br from-primary/5 to-gold/10 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("admin.stats.bestseller")}
                  </div>
                  {data.stats.bestSeller ? (<>
                      <div className="mt-1.5 line-clamp-2 font-serif font-bold">{data.stats.bestSeller.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {data.stats.bestSeller.author} Â· {data.stats.bestSeller.salesCount} {t("admin.books.sales").toLowerCase()}
                      </div>
                    </>) : (<div className="mt-1.5 text-sm text-muted-foreground">â€”</div>)}
                </div>
              </div>
            </div>
          </div>)}

        
        {tab === "orders" && (<div className="mt-5">
            
            <div className="flex flex-wrap items-center gap-2" data-no-print>
              <StatusPill active={statusFilter === "ALL"} label={t("admin.orders.all")} count={orders.length} onClick={() => setStatusFilter("ALL")}/>
              {STATUSES.map((s) => (<StatusPill key={s} active={statusFilter === s} label={statusLabelOf(s)} count={statusCount(s)} dotClass={STATUS_STYLE[s] ?? ""} onClick={() => setStatusFilter(s)}/>))}
              <span className="flex-1"/>
              <Button variant="outline" size="sm" className="rounded-full" onClick={exportOrdersCsv}>
                <Download className="h-4 w-4"/> {t("admin.orders.exportCsv")}
              </Button>
            </div>

            
            <div className="mt-4 space-y-3">
              {filteredOrders.map((o) => (<div key={o.id} className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-primary">{o.orderNumber}</span>
                        <Badge className={cn("border-0", STATUS_STYLE[o.status] ?? "")}>
                          {statusLabelOf(o.status)}
                        </Badge>
                        {o.giftCard && (<Badge variant="gold" className="border-0">
                            <Gift className="h-3 w-3"/> {t("admin.orders.gift")}
                          </Badge>)}
                      </div>
                      <div className="mt-1.5 text-sm font-semibold">{o.customerName}</div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                        <span dir="ltr">{o.phone}</span>
                        <span>Â·</span>
                        <span>{wilayaName(o.state)}</span>
                        <span>Â·</span>
                        <span>{formatDate(o.createdAt, locale)}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-serif text-xl font-bold text-primary">{fmt(o.total)}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.items.reduce((n, i) => n + i.quantity, 0)} Ã— {t("admin.orders.items").toLowerCase()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" data-no-print>
                    <select value={o.status} disabled={busyId === o.id} onChange={(e) => updateStatus(o.id, e.target.value)} className={cn("h-8 rounded-full border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", STATUS_STYLE[o.status] ?? "")}>
                      {STATUSES.map((s) => (<option key={s} value={s}>{statusLabelOf(s)}</option>))}
                    </select>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setDrawerId(o.id)}>
                      <FileText className="h-3.5 w-3.5"/> {t("admin.orders.details")}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={() => printDoc("label", o)}>
                      <Truck className="h-3.5 w-3.5"/> {t("admin.print.labelTitle")}
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={() => printDoc("invoice", o)}>
                      <Printer className="h-3.5 w-3.5"/> {t("admin.orders.printInvoice")}
                    </Button>
                    {o.giftCard && (<Button variant="ghost" size="sm" className="rounded-full text-amber-600 hover:text-amber-700 dark:text-amber-400" onClick={() => printDoc("gift", o)}>
                        <Gift className="h-3.5 w-3.5"/> {t("admin.orders.printGiftCard")}
                      </Button>)}
                  </div>
                </div>))}
              {filteredOrders.length === 0 && (<div className="rounded-2xl border bg-card py-16 text-center text-muted-foreground">
                  {t("admin.orders.empty")}
                </div>)}
            </div>
          </div>)}

        
        {tab === "books" && (<div className="mt-5">
            <div className="flex flex-wrap items-center gap-2" data-no-print>
              <StatusPill active={categoryFilter === "ALL"} label={t("admin.books.categoryAll")} count={books.length} onClick={() => setCategoryFilter("ALL")}/>
              {categoryOptions.slice(0, 12).map((c) => (<StatusPill key={c} active={categoryFilter === c} label={c} count={books.filter((b) => b.category === c).length} onClick={() => setCategoryFilter(c)}/>))}
            </div>

            <div className="mt-4 space-y-2">
              {filteredBooks.map((b) => {
                const dirtyStock = stockDraft[b.id] !== undefined && Number(stockDraft[b.id]) !== b.stock;
                const dirtyPrice = priceDraft[b.id] !== undefined && Number(priceDraft[b.id]) !== b.price;
                return (<div key={b.id} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border bg-card px-4 py-3", b.stock < 5 && "border-red-200 dark:border-red-900/60")}>
                    <div className="min-w-44 flex-1">
                      <Link href={`/${locale}/books/${b.slug}`} className="font-serif text-sm font-bold hover:text-primary">
                        {b.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">{b.author} Â· {b.category}</div>
                    </div>
                    <div className="w-16 text-center text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{b.salesCount}</span> {t("admin.books.sales").toLowerCase()}
                    </div>
                    
                    <div className="flex items-center gap-1" data-no-print>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setStockDraft((d) => ({ ...d, [b.id]: String(Math.max(0, Number(d[b.id] ?? b.stock) - 1)) }))}>
                        <Minus className="h-3 w-3"/>
                      </Button>
                      <Input type="number" min={0} value={stockDraft[b.id] ?? String(b.stock)} onChange={(e) => setStockDraft((d) => ({ ...d, [b.id]: e.target.value }))} onFocus={() => setStockDraft((d) => (d[b.id] === undefined ? { ...d, [b.id]: String(b.stock) } : d))} className={cn("h-8 w-14 rounded-lg px-1.5 text-center text-xs", b.stock < 5 && "border-red-400 text-red-600 dark:text-red-400")}/>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setStockDraft((d) => ({ ...d, [b.id]: String(Number(d[b.id] ?? b.stock) + 1) }))}>
                        <Plus className="h-3 w-3"/>
                      </Button>
                      {dirtyStock && (<Button size="sm" className="h-8 rounded-full px-3" disabled={busyId === b.id} onClick={() => saveStock(b.id)}>
                          <Save className="h-3.5 w-3.5"/> {t("admin.books.setStock")}
                        </Button>)}
                    </div>
                    
                    <div className="flex items-center gap-1.5" data-no-print>
                      <Input type="number" min={0} step={1} value={priceDraft[b.id] ?? String(b.price)} onChange={(e) => setPriceDraft((d) => ({ ...d, [b.id]: e.target.value }))} onFocus={() => setPriceDraft((d) => (d[b.id] === undefined ? { ...d, [b.id]: String(b.price) } : d))} className="h-8 w-20 rounded-lg px-2 text-xs" aria-label={t("admin.books.editPrice")}/>
                      {dirtyPrice && (<Button size="sm" variant="secondary" className="h-8 rounded-full px-3" disabled={busyId === b.id} onClick={() => savePrice(b.id)}>
                          <Tag className="h-3.5 w-3.5"/> {t("common.save")}
                        </Button>)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {b.stock < 5 ? (<Badge className="border-0 bg-red-500/15 text-red-700 dark:text-red-400">{t("admin.books.lowStock")}</Badge>) : (`â˜… ${b.rating.toFixed(1)}`)}
                    </span>
                  </div>);
            })}
              {filteredBooks.length === 0 && (<div className="rounded-2xl border bg-card py-16 text-center text-muted-foreground">
                  {t("admin.books.empty")}
                </div>)}
            </div>
          </div>)}

        
        {tab === "customers" && (<div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b bg-muted/40 text-start">
                <tr>
                  <Th>{t("admin.customers.name")}</Th>
                  <Th>{t("admin.customers.email")}</Th>
                  <Th>{t("admin.customers.phone")}</Th>
                  <Th>{t("admin.customers.role")}</Th>
                  <Th>{t("admin.customers.orders")}</Th>
                  <Th>{t("admin.customers.joined")}</Th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (<tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                    <Td className="font-medium">{c.name || "â€”"}</Td>
                    <Td className="text-muted-foreground">{c.email}</Td>
                    <Td dir="ltr">{c.phone || "â€”"}</Td>
                    <Td>
                      <Badge variant={c.role === "ADMIN" ? "gold" : "secondary"}>{c.role}</Badge>
                    </Td>
                    <Td>{c.orders}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{formatDate(c.createdAt, locale)}</Td>
                  </tr>))}
                {filteredCustomers.length === 0 && (<tr>
                    <Td colSpan={6} className="py-10 text-center text-muted-foreground">{t("admin.customers.empty")}</Td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}

        
        {tab === "newsletter" && (<div className="mt-5 overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b bg-muted/40 text-start">
                <tr>
                  <Th>{t("admin.newsletter.email")}</Th>
                  <Th>{t("admin.newsletter.joined")}</Th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((s) => (<tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                    <Td dir="ltr" className="font-medium">{s.email}</Td>
                    <Td className="whitespace-nowrap text-muted-foreground">{formatDate(s.createdAt, locale)}</Td>
                  </tr>))}
                {filteredSubscribers.length === 0 && (<tr>
                    <Td colSpan={2} className="py-10 text-center text-muted-foreground">{t("admin.newsletter.empty")}</Td>
                  </tr>)}
              </tbody>
            </table>
          </div>)}

        <p className="mt-8 text-center text-xs text-muted-foreground" data-no-print>
          {dict.footer.designedBy.replace("{name}", "K.Haithem")} Â· {SITE.phone}
        </p>
      </div>

      
      <Sheet open={!!drawerOrder} onOpenChange={(open) => !open && setDrawerId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
          {drawerOrder && (<div className="flex flex-col">
              <div className="sticky top-0 z-10 border-b bg-primary px-5 py-3">
                <SheetTitle className="flex items-center justify-between font-mono text-base font-bold text-white">
                  {drawerOrder.orderNumber}
                  <Badge className={cn("border-0", STATUS_STYLE[drawerOrder.status] ?? "")}>
                    {statusLabelOf(drawerOrder.status)}
                  </Badge>
                </SheetTitle>
                <div className="mt-0.5 text-xs text-white/70">{formatDate(drawerOrder.createdAt, locale)}</div>
              </div>

              <div className="space-y-4 p-5">
                
                <section className="rounded-2xl border p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("admin.orders.customer")}</h4>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="font-semibold">{drawerOrder.customerName}</div>
                    <div dir="ltr" className="text-sm">{drawerOrder.phone}</div>
                    <div className="border-t pt-2 text-xs leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">{t("admin.orders.address")}: </span>
                      {[drawerOrder.street, drawerOrder.city, wilayaName(drawerOrder.state), drawerOrder.zip].filter(Boolean).join(", ")}
                    </div>
                  </div>
                </section>

                
                <section className="rounded-2xl border p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("admin.orders.items")}</h4>
                  <ul className="mt-2 space-y-2 text-sm">
                    {drawerOrder.items.map((it) => (<li key={it.id} className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="line-clamp-1">{it.title}</span>
                          <span className="text-xs text-muted-foreground">Ã— {it.quantity} Â· {fmt(it.price)}</span>
                        </span>
                        <span className="shrink-0 font-semibold">{fmt(it.price * it.quantity)}</span>
                      </li>))}
                  </ul>
                  <dl className="mt-3 space-y-1 border-t pt-3 text-xs">
                    <div className="flex justify-between"><dt className="text-muted-foreground">{dict.order.receiptSubtotal}</dt><dd>{fmt(drawerOrder.subtotal)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">{dict.order.receiptShipping}</dt><dd>{fmt(drawerOrder.shippingFee)}</dd></div>
                    {drawerOrder.giftCardFee > 0 && (<div className="flex justify-between"><dt className="text-muted-foreground">{dict.order.receiptGiftCard}</dt><dd>{fmt(drawerOrder.giftCardFee)}</dd></div>)}
                    <div className="flex justify-between border-t pt-1.5 text-sm font-bold"><dt>{dict.order.receiptTotal}</dt><dd className="text-primary">{fmt(drawerOrder.total)}</dd></div>
                  </dl>
                </section>

                
                {(drawerOrder.giftCard || drawerOrder.note) && (<section className="space-y-2">
                    {drawerOrder.giftCard && (<div className="rounded-2xl border-2 border-dashed border-[var(--gold)] bg-[var(--gold)]/5 p-4 text-sm">
                        <div className="flex items-start gap-2">
                          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground"/>
                          <p className="font-serif italic leading-relaxed">{drawerOrder.giftMessage || "â€”"}</p>
                        </div>
                      </div>)}
                    {drawerOrder.note && (<div className="rounded-2xl bg-muted/40 p-4 text-sm">
                        <span className="font-semibold">{dict.checkout.note}:</span>
                        <p className="mt-1 text-muted-foreground">{drawerOrder.note}</p>
                      </div>)}
                  </section>)}

                
                <section className="rounded-2xl border p-4" data-no-print>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("admin.orders.updateStatus")}</h4>
                  <select value={drawerOrder.status} disabled={busyId === drawerOrder.id} onChange={(e) => updateStatus(drawerOrder.id, e.target.value)} className="mt-2 h-10 w-full rounded-full border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {STATUSES.map((s) => (<option key={s} value={s}>{statusLabelOf(s)}</option>))}
                  </select>
                </section>

                
                <section className="grid grid-cols-3 gap-2" data-no-print>
                  <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => printDoc("invoice", drawerOrder)}>
                    <Printer className="h-3.5 w-3.5"/> {t("admin.orders.printInvoice")}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 rounded-full" onClick={() => printDoc("label", drawerOrder)}>
                    <Truck className="h-3.5 w-3.5"/> {t("admin.print.labelShort")}
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 rounded-full" disabled={!drawerOrder.giftCard} onClick={() => printDoc("gift", drawerOrder)}>
                    <Gift className="h-3.5 w-3.5"/> {t("admin.print.giftShort")}
                  </Button>
                </section>
              </div>
            </div>)}
        </SheetContent>
      </Sheet>
    </div>);
}
function KpiCard({ icon: Icon, tone, label, value, hint, iconChip, action }: {
    icon: LucideIcon;
    tone: "primary" | "amber" | "violet" | "emerald";
    label: string;
    value: string;
    hint?: string;
    iconChip: string;
    action?: React.ReactNode;
}) {
    const strip: Record<string, string> = {
        primary: "bg-gradient-to-r from-primary to-primary/60",
        amber: "bg-gradient-to-r from-amber-400 to-amber-200",
        violet: "bg-gradient-to-r from-violet-500 to-violet-300",
        emerald: "bg-gradient-to-r from-emerald-500 to-emerald-300",
    };
    return (<div className="overflow-hidden rounded-2xl border bg-card">
      <div className={cn("h-1.5 w-full", strip[tone])}/>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", iconChip)}>
            <Icon className="h-4.5 w-4.5"/>
          </span>
          {action}
        </div>
        <div className="mt-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-serif text-2xl font-bold">{value}</div>
        {hint && <div className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</div>}
      </div>
    </div>);
}
function QuickFact({ icon: Icon, label, value, hint }: {
    icon: LucideIcon;
    label: string;
    value: string;
    hint?: string;
}) {
    return (<div className="rounded-2xl border bg-card p-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4"/>
      </span>
      <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-serif text-lg font-bold">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>);
}
function StatusPill({ active, label, count, dotClass, onClick }: {
    active: boolean;
    label: string;
    count?: number;
    dotClass?: string;
    onClick: () => void;
}) {
    return (<button onClick={onClick} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40 hover:text-primary")}>
      {dotClass && <span className={cn("h-2 w-2 rounded-full", dotClass)}/>}
      {label}
      {count !== undefined && (<span className={cn("rounded-full px-1.5 text-[10px] font-bold", active ? "bg-white/20" : "bg-primary/10 text-primary")}>
          {count}
        </span>)}
    </button>);
}
function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</th>;
}
function Td({ children, colSpan, className, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (<td colSpan={colSpan} className={cn("px-4 py-3 align-top", className)} {...rest}>
      {children}
    </td>);
}
