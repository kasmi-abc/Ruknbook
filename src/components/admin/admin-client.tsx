"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Bell,
  Wallet,
  Package,
  Truck,
  Gift,
  Search,
  ChevronLeft,
  X,
  Check,
  Phone,
  MapPin,
  CalendarDays,
  LayoutGrid,
  Users,
  Percent,
  ArrowUpRight,
  TriangleAlert,
} from "lucide-react";
import { WILAYAS } from "@/lib/constants";
import { formatDZD, cn } from "@/lib/utils";

const PHONE = "+213 555 00 00 00";

function wilayaName(code: string): string {
  const w = WILAYAS.find((x) => x.code === code);
  return w ? w.nameAr : code;
}

type OrderItem = { id: string; qty: number; price: number };

export type AdminOrder = {
  id: string;
  reference: string;
  fullName: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  notes?: string | null;
  gift: boolean;
  giftMessage?: string | null;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt?: string | Date | null;
};

export type AdminProduct = {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
};

type Tab = "dashboard" | "orders" | "products" | "settings";

const STATUS_LABEL: Record<string, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  shipped: "مشحون",
  cancelled: "ملغى",
};

const STATUS_DB: Record<string, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  shipped: "SHIPPED",
  cancelled: "CANCELLED",
};

const COLUMNS: {
  key: AdminOrder["status"];
  label: string;
  bar: string;
  dot: string;
}[] = [
  { key: "pending", label: "قيد المراجعة", bar: "bg-stone-400", dot: "bg-stone-400" },
  { key: "confirmed", label: "مؤكد", bar: "bg-brand", dot: "bg-brand" },
  { key: "shipped", label: "مشحون", bar: "bg-gold", dot: "bg-gold" },
  { key: "cancelled", label: "ملغى", bar: "bg-red-400", dot: "bg-red-400" },
];

const DEMO_ORDERS: AdminOrder[] = [
  {
    id: "1",
    reference: "GA-2026-00101",
    fullName: "عبد الرحمن بوزيد",
    phone: "0555123456",
    wilaya: "19",
    city: "علالة",
    address: "حي 1000 مسكن، عمارة 12",
    gift: true,
    giftMessage: "إلى أختي الحبيبة، وفقك الله في طلب العلم",
    items: [{ id: "b17", qty: 1, price: 1600 }],
    subtotal: 1600,
    deliveryFee: 600,
    total: 2200,
    status: "pending",
    createdAt: iso(-0, 10),
  },
  {
    id: "2",
    reference: "GA-2026-00102",
    fullName: "أم سلمة الأنصارية",
    phone: "0661987654",
    wilaya: "16",
    city: "أولاد فايت",
    address: "شارع الأمير عبد القادر 44",
    gift: false,
    items: [
      { id: "b05", qty: 1, price: 9800 },
      { id: "b28", qty: 2, price: 1400 },
    ],
    subtotal: 12600,
    deliveryFee: 600,
    total: 13200,
    status: "confirmed",
    createdAt: iso(-1, 11),
  },
  {
    id: "3",
    reference: "GA-2026-00103",
    fullName: "ياسمين حراث",
    phone: "0770567890",
    wilaya: "31",
    city: "بئر الجير",
    address: "حي النور، ب1",
    gift: false,
    items: [{ id: "b32", qty: 3, price: 1200 }],
    subtotal: 3600,
    deliveryFee: 600,
    total: 4200,
    status: "pending",
    createdAt: iso(-0, 14),
  },
  {
    id: "4",
    reference: "GA-2026-00104",
    fullName: "خالد عمراني",
    phone: "0561234567",
    wilaya: "09",
    city: "البليدة",
    address: "بوسماعيل، شارع المستقبل",
    gift: false,
    items: [{ id: "b06", qty: 2, price: 2200 }],
    subtotal: 4400,
    deliveryFee: 600,
    total: 5000,
    status: "confirmed",
    createdAt: iso(-2, 9),
  },
  {
    id: "5",
    reference: "GA-2026-00105",
    fullName: "سارة بن يوسف",
    phone: "0698765432",
    wilaya: "23",
    city: "تاروت",
    address: "حي 20 أوت 1955",
    gift: true,
    giftMessage: "تهانينا بالنجاح، أخوك أحمد",
    items: [
      { id: "b12", qty: 1, price: 2400 },
      { id: "b24", qty: 1, price: 1900 },
    ],
    subtotal: 4300,
    deliveryFee: 600,
    total: 4900,
    status: "shipped",
    createdAt: iso(-3, 12),
  },
  {
    id: "6",
    reference: "GA-2026-00106",
    fullName: "مصطفى قاسمي",
    phone: "0550202030",
    wilaya: "44",
    city: "عين التوتة",
    address: "بحري، عين أوسرة",
    gift: false,
    items: [{ id: "b34", qty: 1, price: 2900 }],
    subtotal: 2900,
    deliveryFee: 600,
    total: 3500,
    status: "cancelled",
    createdAt: iso(-4, 16),
  },
  {
    id: "7",
    reference: "GA-2026-00107",
    fullName: "نور الدين عيساوي",
    phone: "0663300440",
    wilaya: "15",
    city: "تيزي وزو",
    address: "وسط المدينة، عمارة الأمل",
    gift: false,
    items: [{ id: "b02", qty: 2, price: 1800 }],
    subtotal: 3600,
    deliveryFee: 600,
    total: 4200,
    status: "confirmed",
    createdAt: iso(-1, 15),
  },
  {
    id: "8",
    reference: "GA-2026-00108",
    fullName: "فاطمة الصالح",
    phone: "0542001020",
    wilaya: "25",
    city: "المسيلة",
    address: "حي الهدى، رقم 3",
    gift: false,
    items: [{ id: "b35", qty: 1, price: 3400 }],
    subtotal: 3400,
    deliveryFee: 600,
    total: 4000,
    status: "shipped",
    createdAt: iso(-2, 13),
  },
];

const AR_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function iso(daysAgo: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function fmtDate(d: Date) {
  return `${AR_DAYS[d.getDay()]}، ${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}
function fmtShort(d: Date) {
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]}`;
}
function fmtTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "ص" : "م";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}
function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function Spark({ points, className = "stroke-brand" }: { points: number[]; className?: string }) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const w = 96;
  const h = 30;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className={cn("shrink-0", className)}>
      <path d={path} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]).join("");
}

const AVATAR_COLORS = [
  "bg-amber-200 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-lime-200 text-lime-800",
  "bg-orange-200 text-orange-800",
  "bg-teal-100 text-teal-700",
  "bg-rose-200 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
];

export default function AdminClient({
  adminName,
  initialOrders,
  products,
  dbReady,
}: {
  adminName: string;
  initialOrders: AdminOrder[];
  products: AdminProduct[];
  dbReady: boolean;
}) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<AdminOrder[]>(
    initialOrders.length > 0 ? initialOrders : DEMO_ORDERS
  );
  const [demo, setDemo] = useState(!dbReady);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const active = orders.find((o) => o.id === activeId) ?? null;

  const productMap = useMemo(() => {
    const m = new Map<string, AdminProduct>();
    products.forEach((p) => m.set(p.id, p));
    return m;
  }, [products]);

  const setStatus = async (id: string, status: AdminOrder["status"]) => {
    const prev = orders;
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)));
    if (demo) return;
    setSavingId(id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: String(id), status: STATUS_DB[status] ?? status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setOrders(prev);
    } finally {
      setSavingId(null);
    }
  };

  const moveOrder = (id: string, status: AdminOrder["status"]) => {
    const order = orders.find((o) => o.id === id);
    if (!order || order.status === status) return;
    setStatus(id, status);
  };

  const pending = orders.filter((o) => o.status === "pending");
  const confirmedN = orders.filter((o) => o.status === "confirmed").length;
  const shippedN = orders.filter((o) => o.status === "shipped").length;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const confirmRate = orders.length ? Math.round((confirmedN + shippedN) / Math.max(orders.filter((o) => o.status !== "cancelled").length, 1) * 100) : 0;

  const today = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });

  const dailyIn = last7.map((d) =>
    orders
      .filter((o) => o.status !== "cancelled" && o.createdAt && dayKey(new Date(o.createdAt)) === dayKey(d))
      .reduce((s, o) => s + o.total, 0)
  );
  const dailyOut = last7.map((d) =>
    orders
      .filter((o) => o.status === "cancelled" && o.createdAt && dayKey(new Date(o.createdAt)) === dayKey(d))
      .reduce((s, o) => s + o.total, 0)
  );
  const maxDaily = Math.max(...dailyIn, ...dailyOut, 1);

  const source = useMemo(() => {
    const q = search.trim();
    if (!q) return orders;
    return orders.filter(
      (o) => o.reference.toLowerCase().includes(q.toLowerCase()) || o.fullName.includes(q) || o.phone.includes(q)
    );
  }, [orders, search]);

  const navItems: { id: Tab; label: string; badge?: number }[] = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "orders", label: "الطلبات", badge: pending.length },
    { id: "products", label: "المنتجات" },
    { id: "settings", label: "الإعدادات" },
  ];

  return (
    <div>
      {demo && (
        <div className="flex items-center gap-2 rounded-2xl bg-gold/10 border border-gold/30 px-4 py-2 mb-4 text-xs font-extrabold text-gold-dark">
          <TriangleAlert className="h-4 w-4" />
          وضع تجريبي — البيانات محلية
        </div>
      )}

      <nav className="flex items-center justify-center my-3">
        <div className="flex items-center gap-1 rounded-2xl bg-white border border-stone-200/80 p-1.5 shadow-card overflow-x-auto">
          {navItems.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold whitespace-nowrap transition-colors",
                tab === n.id ? "bg-brand-deep text-white" : "text-stone-500 hover:text-ink"
              )}
            >
              {n.label}
              {n.badge != null && n.badge > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-[11px] font-extrabold h-5 min-w-5 px-1",
                    tab === n.id ? "bg-gold text-brand-deep" : "bg-brand text-white"
                  )}
                >
                  {n.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {tab === "dashboard" && <DashboardView {...{ adminName, orders, pending, revenue, confirmRate, confirmedN, shippedN, dailyIn, dailyOut, last7, maxDaily, setTab }} />}
      {tab === "orders" && (
        <OrderBoard
          orders={source}
          search={search}
          setSearch={setSearch}
          setTab={setTab}
          onOpen={(id) => setActiveId(id)}
          onMove={moveOrder}
          dragId={dragId}
          setDragId={setDragId}
          dragOver={dragOver}
          setDragOver={setDragOver}
        />
      )}
      {tab === "products" && <ProductsView products={products} />}
      {tab === "settings" && <SettingsView demo={demo} dbReady={dbReady} />}

      {active && (
        <OrderPanel
          order={active}
          orders={orders}
          productMap={productMap}
          onClose={() => setActiveId(null)}
          onStatus={setStatus}
          saving={savingId === active.id}
        />
      )}
    </div>
  );
}

type DashProps = {
  adminName: string;
  orders: AdminOrder[];
  pending: AdminOrder[];
  revenue: number;
  confirmRate: number;
  confirmedN: number;
  shippedN: number;
  dailyIn: number[];
  dailyOut: number[];
  last7: Date[];
  maxDaily: number;
  setTab: (t: Tab) => void;
};

function DashboardView({ adminName, orders, pending, revenue, confirmRate, confirmedN, shippedN, dailyIn, dailyOut, last7, maxDaily, setTab }: DashProps) {
  const now = new Date();
  const onRoad = orders.filter((o) => o.status === "shipped").length;
  const gifts = orders.filter((o) => o.gift).length;

  const hourDots = orders
    .filter((o) => o.createdAt)
    .map((o) => ({ o, h: new Date(o.createdAt as string).getHours(), muted: o.status === "cancelled" }));

  const stats = [
    { label: "مبيعات آخر ٧ أيام", value: formatDZD(revenue), sub: `${orders.length} طلبات`, spark: dailyIn, card: "bg-brand-deep text-white", icon: Wallet, ink: "text-white", subInk: "text-white/70", sparkCls: "stroke-gold" },
    { label: "طلبات جديدة", value: String(pending.length), sub: "بانتظار المراجعة", spark: dailyIn, card: "bg-white", icon: Package, ink: "text-ink", subInk: "text-stone-400", sparkCls: "stroke-brand" },
    { label: "في الطريق", value: String(shippedN), sub: `${confirmedN} في التحضير`, spark: dailyOut, card: "bg-white", icon: Truck, ink: "text-ink", subInk: "text-stone-400", sparkCls: "stroke-gold-dark" },
    { label: "نسبة التأكيد", value: `${confirmRate}%`, sub: `${gifts} طلب هدايا`, spark: [1, 2, 2, 3, 3, 2, confirmRate / 10], card: "bg-white", icon: Percent, ink: "text-ink", subInk: "text-stone-400", sparkCls: "stroke-brand" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-4xl bg-white border border-stone-200/70 p-6 md:p-7">
          <p className="text-[11px] font-extrabold tracking-wide text-brand">{fmtDate(now)} — {fmtTime(now)}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mt-2">أهلاً بك، {adminName}</h1>
          <p className="text-sm text-stone-500 mt-2 leading-7">
            <b className="text-ink">{pending.length} طلبات جديدة</b> بانتظار المراجعة، <b className="text-ink">{onRoad} شحنة</b> في الطريق، و<b className="text-ink">{orders.length} طلبات</b> إجمالاً.
          </p>
          <div className="relative mt-8 mb-2">
            <div className="h-0.5 bg-stone-100 rounded-full" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1">
              {hourDots.slice(0, 12).map(({ o, h, muted }, i) => {
                const left = ((h / 23) * 100).toFixed(1);
                return (
                  <span
                    key={o.id + i}
                    style={{ left: `${left}%` }}
                    className={cn(
                      "absolute h-3.5 w-3.5 rounded-full -translate-y-1/2 top-1/2 border-2 border-white shadow",
                      muted ? "bg-stone-300" : i % 2 === 0 ? "bg-brand" : "bg-gold"
                    )}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-stone-400 pt-4">
              <span>12 ص</span>
              <span>6 ص</span>
              <span>12 م</span>
              <span>6 م</span>
              <span>11 م</span>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-white border border-stone-200/70 p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 rounded-full bg-brand/10 text-brand items-center justify-center">
                <Wallet className="h-[18px] w-[18px]" />
              </span>
              <span className="font-extrabold text-ink text-sm">الإيرادات</span>
            </div>
            <button onClick={() => setTab("orders")} className="rounded-full bg-stone-50 border border-stone-200 px-3 py-1.5 text-xs font-extrabold text-stone-500 hover:text-brand transition-colors inline-flex items-center gap-1">
              الطلبات
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-4 text-3xl md:text-4xl font-extrabold text-ink" dir="ltr">
            {formatDZD(revenue)}
          </div>
          <div className="flex items-end gap-1.5 h-24 mt-6">
            {last7.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 h-full" title={fmtShort(d)}>
                <div className="flex items-end gap-0.5 h-full">
                  <div
                    className={cn("w-full rounded-t-md bg-brand", dailyIn[i] === 0 && "bg-stone-100")}
                    style={{ height: `${Math.max((dailyIn[i] / maxDaily) * 100, 4)}%` }}
                  />
                  {dailyOut[i] > 0 && (
                    <div className="w-full rounded-t-md bg-red-300" style={{ height: `${Math.max((dailyOut[i] / maxDaily) * 100, 4)}%` }} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[11px] font-extrabold">
            <span className="inline-flex items-center gap-1.5 text-ink">
              <span className="h-2 w-2 rounded-sm bg-brand" /> داخل
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-500">
              <span className="h-2 w-2 rounded-sm bg-red-300" /> ملغى
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={cn("rounded-4xl border p-5 flex flex-col justify-between", s.card, s.card === "bg-white" ? "border-stone-200/70" : "border-brand-deep")}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={cn("flex h-9 w-9 rounded-full items-center justify-center", s.card === "bg-white" ? "bg-stone-100 text-stone-500" : "bg-white/10 text-gold")}>
                  <s.icon className="h-[18px] w-[18px]" />
                </span>
                <span className={cn("font-extrabold text-sm", s.ink)}>{s.label}</span>
              </div>
              <Spark points={s.spark.length > 1 ? s.spark : [1, 2, 1]} className={cn("h-8 w-24", s.card === "bg-white" ? "opacity-70" : "")} />
            </div>
            <div className={cn("text-3xl font-extrabold mt-5", s.ink)}>{s.value}</div>
            <div className={cn("text-xs font-bold mt-1", s.subInk)}>
              <ArrowUpRight className="inline h-3.5 w-3.5 align-[-2px]" /> {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-4xl bg-white border border-stone-200/70 p-6">
          <h3 className="font-extrabold text-ink text-sm mb-5">مسار الطلبات</h3>
          <div className="space-y-3">
            {COLUMNS.filter((c) => c.key !== "cancelled").map((c) => {
              const n = orders.filter((o) => o.status === c.key).length;
              const pct = Math.round((n / Math.max(orders.length, 1)) * 100);
              return (
                <div key={c.key}>
                  <div className="flex justify-between text-xs font-extrabold mb-1.5">
                    <span className="text-ink">{c.label}</span>
                    <span className="text-stone-400">{n} طلبات</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", c.bar)} style={{ width: `${Math.max(pct, 3)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-4xl bg-white border border-stone-200/70 p-6">
          <h3 className="font-extrabold text-ink text-sm mb-5">أحدث الطلبات</h3>
          <div className="space-y-2">
            {orders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3">
                <span className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0", AVATAR_COLORS[Number(o.id) % AVATAR_COLORS.length])}>
                  {initials(o.fullName)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-extrabold text-ink truncate">{o.fullName}</div>
                  <div className="text-[11px] text-stone-400" dir="ltr">{o.reference}</div>
                </div>
                <span className="font-extrabold text-sm text-ink">{formatDZD(o.total)}</span>
                <span className={cn("h-2 w-2 rounded-full shrink-0", COLUMNS.find((c) => c.key === o.status)?.dot)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderBoard({
  orders,
  search,
  setSearch,
  setTab,
  onOpen,
  onMove,
  dragId,
  setDragId,
  dragOver,
  setDragOver,
}: {
  orders: AdminOrder[];
  search: string;
  setSearch: (s: string) => void;
  setTab: (t: Tab) => void;
  onOpen: (id: string) => void;
  onMove: (id: string, status: AdminOrder["status"]) => void;
  dragId: string | null;
  setDragId: (id: string | null) => void;
  dragOver: string | null;
  setDragOver: (s: string | null) => void;
}) {
  return (
    <div className="rounded-4xl bg-white/60 border border-stone-200/70 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 rounded-full bg-brand/10 text-brand items-center justify-center">
            <LayoutGrid className="h-[18px] w-[18px]" />
          </span>
          <h2 className="font-extrabold text-ink">لوحة الطلبات</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم أو رقم الطلب..."
              className="h-10 rounded-xl border border-stone-200 bg-white pr-9 pl-3 text-sm focus:border-brand focus:outline-none w-56"
            />
          </div>
          <button onClick={() => setTab("dashboard")} className="rounded-full bg-white border border-stone-200 px-3 py-2 text-xs font-extrabold text-stone-500 hover:text-brand">
            إحصائيات
          </button>
        </div>
      </div>

      <p className="text-[11px] font-bold text-stone-400 mb-3">اسحب البطاقة بين الأعمدة لتغيير حالتها</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const list = orders.filter((o) => o.status === col.key);
          const total = list.reduce((s, o) => s + o.total, 0);
          return (
            <div
              key={col.key}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(col.key);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                setDragOver(null);
                setDragId(null);
                if (id) onMove(id, col.key);
              }}
              className={cn(
                "rounded-3xl bg-white border p-3 transition-colors min-h-40",
                dragOver === col.key ? "border-brand bg-brand/5" : "border-stone-200/80"
              )}
            >
              <div className={cn("h-1 rounded-full mb-3", col.bar)} />
              <div className="flex items-center justify-between px-1 mb-0.5">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                  <span className="font-extrabold text-ink text-sm">{col.label}</span>
                  <span className="rounded-full bg-stone-100 text-stone-500 text-[11px] font-extrabold h-5 min-w-5 px-1.5 inline-flex items-center justify-center">
                    {list.length}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold text-stone-400">{formatDZD(total)}</span>
              </div>
              <div className="space-y-2.5 mt-3">
                {list.map((o) => (
                  <div
                    key={o.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", String(o.id));
                      setDragId(o.id);
                    }}
                    onDragEnd={() => setDragId(null)}
                    onClick={() => onOpen(o.id)}
                    className={cn(
                      "rounded-2xl border border-stone-100 bg-white p-3 cursor-pointer hover:border-brand/60 hover:shadow-card transition-all",
                      dragId === o.id && "opacity-40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn("h-9 w-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0", AVATAR_COLORS[Number(o.id) % AVATAR_COLORS.length])}>
                        {initials(o.fullName)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-extrabold text-ink truncate">{o.fullName}</div>
                        <div className="text-[10px] text-stone-400" dir="ltr">{o.reference}</div>
                      </div>
                      {o.gift && <Gift className="h-4 w-4 text-gold-dark shrink-0" />}
                    </div>
                    <div className="mt-2 text-[11px] text-stone-500 font-bold">
                      {o.items.map((i) => `×${i.qty}`).join(" + ")} نسخ
                      <span className="text-stone-400"> — {[wilayaName(o.wilaya), o.city].filter(Boolean).join("، ")}</span>
                    </div>
                    {o.gift && o.giftMessage && (
                      <p className="mt-1 text-[10px] text-gold-dark leading-4 line-clamp-2" >{o.giftMessage}</p>
                    )}
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-stone-100">
                      <span className="font-extrabold text-sm text-ink">{formatDZD(o.total)}</span>
                      {o.createdAt && (
                        <span className="text-[10px] font-bold text-stone-400 inline-flex items-center gap-1" dir="ltr">
                          <CalendarDays className="h-3 w-3" />
                          {fmtShort(new Date(o.createdAt))}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <p className="text-center text-[11px] text-stone-300 py-6 font-bold">أسقط بطاقة هنا</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PANEL_STEPS = ["مستلَم", "مؤكد", "مشحون"];

function OrderPanel({
  order,
  orders,
  productMap,
  onClose,
  onStatus,
  saving,
}: {
  order: AdminOrder;
  orders: AdminOrder[];
  productMap: Map<string, AdminProduct>;
  onClose: () => void;
  onStatus: (id: string, status: AdminOrder["status"]) => void;
  saving: boolean;
}) {
  const stepIndex = order.status === "pending" ? 0 : order.status === "confirmed" ? 1 : order.status === "shipped" ? 2 : -1;
  const products = orders.length;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-brand-deep/30" onClick={onClose} />
      <aside
        className="absolute inset-y-0 left-0 w-full max-w-lg bg-white shadow-lift overflow-y-auto animate-slide-left"
        dir="rtl"
      >
        <div className="p-6 md:p-7">
          <div className="flex items-start gap-3">
            <span className={cn("h-14 w-14 rounded-full flex items-center justify-center text-base font-extrabold shrink-0", AVATAR_COLORS[Number(order.id) % AVATAR_COLORS.length])}>
              {initials(order.fullName)}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-extrabold text-ink" dir="ltr">{order.reference}</h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {order.fullName} • {order.createdAt ? fmtShort(new Date(order.createdAt)) : ""} • {wilayaName(order.wilaya)}
              </p>
            </div>
            <button onClick={onClose} className="h-10 w-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-ink shrink-0" aria-label="إغلاق">
              <X className="h-5 w-5" />
            </button>
          </div>

          {stepIndex >= 0 && (
            <div className="mt-7 mb-2 relative">
              <div className="top-[14px] absolute inset-x-8 h-0.5 bg-stone-100" />
              <div className="relative flex justify-between">
                {PANEL_STEPS.map((s, i) => {
                  const done = i < stepIndex;
                  const current = i === stepIndex;
                  return (
                    <div key={s} className="flex flex-col items-center gap-1.5 relative">
                      <span
                        className={cn(
                          "relative h-7 w-7 rounded-full flex items-center justify-center z-10 bg-white",
                          done && "bg-ink",
                          current && "ring-2 ring-ink ring-offset-2"
                        )}
                      >
                        {done ? (
                          <span className="h-7 w-7 rounded-full bg-ink flex items-center justify-center">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </span>
                        ) : current ? (
                          <span className="h-3.5 w-3.5 rounded-full bg-ink" />
                        ) : (
                          <span className="h-7 w-7 rounded-full border-2 border-stone-200" />
                        )}
                      </span>
                      <span className={cn("text-[10px] font-extrabold", done || current ? "text-ink" : "text-stone-400")}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-extrabold px-4 py-3">
              تم إلغاء هذا الطلب
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl border border-stone-200/80 p-4">
              <div className="text-[11px] font-bold text-stone-400">الإجمالي</div>
              <div className="text-lg font-extrabold text-ink mt-1">{formatDZD(order.total)}</div>
            </div>
            <div className="rounded-2xl border border-stone-200/80 p-4">
              <div className="text-[11px] font-bold text-stone-400">تاريخ الطلب</div>
              <div className="text-lg font-extrabold text-ink mt-1">{order.createdAt ? fmtDate(new Date(order.createdAt)) : "—"}</div>
            </div>
            <div className="rounded-2xl border border-stone-200/80 p-4">
              <div className="text-[11px] font-bold text-stone-400">طريقة الدفع</div>
              <div className="text-sm font-extrabold text-ink mt-1">عند الاستلام</div>
            </div>
            <div className="rounded-2xl border border-stone-200/80 p-4">
              <div className="text-[11px] font-bold text-stone-400">الحالة</div>
              <div className="mt-1">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-3 py-1 text-xs font-extrabold border", `border-stone-200`)}>
                  <span className={cn("h-2 w-2 rounded-full", order.status === "cancelled" ? "bg-red-400" : COLUMNS.find((c) => c.key === order.status)?.dot)} />
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200/80 p-4 mt-3 text-sm space-y-2">
            <div className="flex items-center gap-2 text-stone-500">
              <Phone className="h-4 w-4 text-brand" />
              <a href={`tel:${order.phone}`} dir="ltr" className="font-extrabold text-ink hover:text-brand">{order.phone}</a>
            </div>
            <div className="flex items-start gap-2 text-stone-500">
              <MapPin className="h-4 w-4 text-brand mt-0.5" />
              <span className="font-bold text-ink">{wilayaName(order.wilaya)}، {order.city} — {order.address}</span>
            </div>
            {order.notes && (
              <p className="text-xs text-stone-400 pt-1 leading-6">ملاحظات: {order.notes}</p>
            )}
            {order.gift && order.giftMessage && (
              <div className="rounded-xl bg-gold/10 border border-gold/30 p-3 mt-1">
                <div className="text-[11px] font-extrabold text-gold-dark flex items-center gap-1 mb-1">
                  <Gift className="h-3.5 w-3.5" /> بطاقة الإهداء
                </div>
                <p className="text-sm text-ink leading-7">{order.giftMessage}</p>
              </div>
            )}
          </div>

          <h4 className="text-[11px] font-extrabold text-stone-400 tracking-wide mt-6 mb-2">محتوى الطلب</h4>
          <div className="space-y-2">
            {order.items.map((it, i) => {
              const p = productMap.get(it.id);
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-100">
                  {p ? (
                    <Image src={p.image} alt={p.title} width={38} height={50} className="rounded-lg object-cover" />
                  ) : (
                    <span className="h-12 w-9 rounded-lg bg-stone-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-ink truncate">{p?.title ?? it.id}</div>
                    <div className="text-[11px] text-stone-400" dir="ltr">{it.id} • ×{it.qty} • {formatDZD(it.price)}</div>
                  </div>
                  <span className="font-extrabold text-sm text-ink">{formatDZD(it.price * it.qty)}</span>
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-stone-50 p-4 mt-4 text-sm space-y-1.5">
            <div className="flex justify-between text-stone-500">
              <span>المجموع الفرعي</span>
              <span className="font-extrabold text-ink">{formatDZD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>التوصيل</span>
              <span className="font-extrabold text-ink">{formatDZD(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-stone-500 pt-1.5 border-t border-stone-200">
              <span>الإجمالي</span>
              <span className="font-extrabold text-brand">{formatDZD(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-100 p-4 flex items-center gap-2">
          <span className="text-[11px] text-stone-300 mr-1">{products} في القائمة</span>
          <div className="flex items-center gap-2 mr-auto">
            {order.status !== "confirmed" && order.status !== "shipped" && order.status !== "cancelled" && (
              <button
                onClick={() => onStatus(order.id, "confirmed")}
                disabled={saving}
                className="rounded-full bg-brand-deep text-white px-5 py-3 text-sm font-extrabold inline-flex items-center gap-2 hover:bg-brand transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> تأكيد الطلب
              </button>
            )}
            {order.status === "confirmed" && (
              <button
                onClick={() => onStatus(order.id, "shipped")}
                disabled={saving}
                className="rounded-full bg-brand-deep text-white px-5 py-3 text-sm font-extrabold inline-flex items-center gap-2 hover:bg-brand transition-colors disabled:opacity-50"
              >
                <Truck className="h-4 w-4" /> تم الشحن
              </button>
            )}
            <button
              onClick={() => onStatus(order.id, "confirmed")}
              disabled={saving}
              className="rounded-full border border-stone-200 text-stone-600 px-4 py-3 text-sm font-extrabold inline-flex items-center gap-2 hover:border-brand hover:text-brand transition-colors disabled:opacity-50"
            >
              <Users className="h-4 w-4" /> العميل
            </button>
            {order.status !== "cancelled" && (
              <button
                onClick={() => onStatus(order.id, "cancelled")}
                disabled={saving}
                className="rounded-full text-red-500 px-3 py-3 text-sm font-extrabold hover:bg-red-50 disabled:opacity-50"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function ProductsView({ products }: { products: AdminProduct[] }) {
  return (
    <div className="rounded-4xl bg-white/60 border border-stone-200/70 p-4 md:p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="flex h-9 w-9 rounded-full bg-brand/10 text-brand items-center justify-center">
          <Package className="h-[18px] w-[18px]" />
        </span>
        <h2 className="font-extrabold text-ink">المنتجات ({products.length})</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-3xl bg-white border border-stone-200/80 p-4">
            <Image src={p.image} alt={p.title} width={120} height={160} className="rounded-2xl object-cover w-full aspect-[3/4]" />
            <div className="mt-3 text-sm font-extrabold text-ink line-clamp-2 min-h-10">{p.title}</div>
            <div className="text-[11px] text-stone-400 mt-0.5">{p.author}</div>
            <div className="flex items-center justify-between mt-2.5">
              <span className="font-extrabold text-brand text-sm">{formatDZD(p.price)}</span>
              {p.badge && (
                <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-extrabold">{p.badge}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView({ demo, dbReady }: { demo: boolean; dbReady: boolean }) {
  const rows = [
    { label: "الهاتف", value: PHONE, ltr: true },
    { label: "رسوم التوصيل", value: formatDZD(600) },
    { label: "طريقة الدفع", value: "الدفع عند الاستلام" },
    { label: "قاعدة البيانات", value: dbReady ? "موصلة" : "وضع تجريبي" },
  ];
  return (
    <div className="rounded-4xl bg-white border border-stone-200/70 p-6 max-w-xl">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="flex h-9 w-9 rounded-full bg-brand/10 text-brand items-center justify-center">
          <Users className="h-[18px] w-[18px]" />
        </span>
        <h2 className="font-extrabold text-ink">إعدادات المتجر</h2>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
            <span className="text-sm text-stone-500 font-bold">{r.label}</span>
            <span className={cn("text-sm font-extrabold text-ink")} dir={r.ltr ? "ltr" : undefined}>
              {r.value}
            </span>
          </div>
        ))}
      </div>
      {demo && (
        <p className="mt-4 text-xs text-gold-dark font-extrabold">وضع تجريبي — لا يتم حفظ التغييرات في قاعدة بيانات</p>
      )}
    </div>
  );
}

