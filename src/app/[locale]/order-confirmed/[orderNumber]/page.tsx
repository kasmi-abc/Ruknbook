import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Gift, MapPin, Phone } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/print-button";
import { SITE, WILAYAS } from "@/lib/constants";
export default async function OrderConfirmedPage({
    params,
}: {
    params: Promise<{ locale: string; orderNumber: string }>;
}) {
    const { locale, orderNumber } = await params;
    const dict = getDictionary(locale);
    const order = await prisma.order
        .findUnique({ where: { orderNumber }, include: { items: { include: { book: true } } } })
        .catch(() => null);
    if (!order)
        notFound();
    const currency = dict.common.currency;
    const estimated = new Date(order.createdAt);
    estimated.setDate(estimated.getDate() + 3);
    const subtotal = Number(order.subtotal);
    const shippingFee = Number(order.shippingFee);
    const giftCardFee = Number(order.giftCardFee);
    const total = Number(order.total);
    const wilayaName = WILAYAS.find((w) => w.code === order.state)?.name ?? order.state ?? "";
    const trackHref = `/${locale}/track-order?orderNumber=${order.orderNumber}&phone=${encodeURIComponent(order.phone)}`;
    return (<div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      
      <div className="rounded-3xl border bg-card p-8 text-center shadow-sm sm:p-10" data-no-print>
        <span className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="h-10 w-10 text-emerald-600"/>
        </span>
        <h1 className="mt-6 font-serif text-3xl font-bold sm:text-4xl">{dict.order.title}</h1>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">{dict.order.subtitle}</p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-accent px-6 py-3 text-accent-foreground">
          <span className="text-sm">{dict.order.orderNumber}</span>
          <span className="font-mono text-xl font-bold">{order.orderNumber}</span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          {(order.customerName || order.phone) && (<span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5"/>
              <span dir="ltr">{order.phone}</span>
            </span>)}
          {wilayaName && (<span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5"/>
              {wilayaName}
            </span>)}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="sm:min-w-52">
            <Link href={trackHref}>
              <Package className="h-4 w-4"/> {dict.nav.trackOrder}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/${locale}`}>{dict.order.backHome}</Link>
          </Button>
        </div>

        <div className="mt-5 text-xs text-muted-foreground">{dict.order.trackHint}</div>

        <div className="mt-8 rounded-2xl border bg-background p-4 text-start">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4 text-primary"/> {dict.order.items}
          </h2>
          <ul className="space-y-2">
            {order.items.map((it) => (<li key={it.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="line-clamp-1">{it.book.title}</span>
                  <span className="text-xs text-muted-foreground">Ã— {it.quantity}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(Number(it.price) * it.quantity, currency, locale)}
                </span>
              </li>))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="font-semibold">{dict.order.totalPaid}</span>
            <span className="font-serif text-xl font-bold text-primary">
              {formatPrice(total, currency, locale)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>{dict.order.estimatedDelivery}</span>
            <span>{formatDate(estimated, locale)}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center" data-print-button-row>
          <PrintButton label={dict.order.printReceipt}/>
        </div>
      </div>

      
      <div data-print-area className="mt-8 hidden border bg-white text-black print:block">
        
        <div className="rounded-t-xl bg-[var(--primary)] px-6 py-4 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-serif text-3xl font-bold leading-none tracking-tight">BORDERS</div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--gold)]">
                Bookshop
              </div>
            </div>
            <div className="text-end text-[10px] leading-4 opacity-90">
              <div>{SITE.address}</div>
              <div dir="ltr">{SITE.phone}</div>
              <div>ruknbooks.dz</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-white/25 pt-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {dict.order.receiptTitle}
            </span>
            <span className="rounded-full bg-[var(--gold)] px-3 py-0.5 font-mono text-xs font-bold text-black">
              {order.orderNumber}
            </span>
          </div>
        </div>

        
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                {dict.order.receiptDate}
              </div>
              <div className="font-medium">{formatDate(order.createdAt, locale)}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                {dict.order.receiptPayment}
              </div>
              <div className="font-medium">{dict.order.receiptPaidOnDelivery}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                {dict.order.receiptCustomer}
              </div>
              <div className="font-medium">{order.customerName}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                {dict.order.receiptPhone}
              </div>
              <div dir="ltr" className="font-medium">
                {order.phone}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[9px] font-bold uppercase tracking-wider text-black/50">
                {dict.order.receiptAddress}
              </div>
              <div className="font-medium">
                {order.street}
                {order.city ? `, ${order.city}` : ""}
                {wilayaName ? `, ${wilayaName}` : ""}
                {order.zip ? ` ${order.zip}` : ""}
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-4 px-6">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-y border-[var(--primary)]/30 text-start">
                <th className="py-1.5 pe-2 text-start text-[9px] font-bold uppercase tracking-wider text-black/60">
                  {dict.order.receiptItems}
                </th>
                <th className="py-1.5 text-end text-[9px] font-bold uppercase tracking-wider text-black/60">
                  {dict.cart.quantity}
                </th>
                <th className="py-1.5 ps-2 text-end text-[9px] font-bold uppercase tracking-wider text-black/60">
                  {dict.cart.price}
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((it) => (<tr key={it.id} className="border-b border-black/10 align-top">
                  <td className="py-1.5 pe-2">{it.book.title}</td>
                  <td className="py-1.5 text-end">Ã—{it.quantity}</td>
                  <td className="py-1.5 ps-2 text-end">
                    {formatPrice(Number(it.price) * it.quantity, currency, locale)}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>

        
        <div className="mt-3 flex justify-end px-6">
          <dl className="w-full max-w-xs space-y-1 text-[11px]">
            <div className="flex justify-between">
              <dt className="text-black/60">{dict.order.receiptSubtotal}</dt>
              <dd>{formatPrice(subtotal, currency, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black/60">{dict.order.receiptShipping}</dt>
              <dd>{shippingFee === 0 ? dict.cart.free : formatPrice(shippingFee, currency, locale)}</dd>
            </div>
            {giftCardFee > 0 && (<div className="flex justify-between">
                <dt className="text-black/60">{dict.order.receiptGiftCard}</dt>
                <dd>{formatPrice(giftCardFee, currency, locale)}</dd>
              </div>)}
            <div className="mt-1 flex items-center justify-between border-t-2 border-[var(--primary)] bg-[var(--accent)] px-2 py-1.5">
              <dt className="font-bold uppercase tracking-wider">{dict.order.receiptTotal}</dt>
              <dd className="font-serif text-base font-bold text-[var(--primary)]">
                {formatPrice(total, currency, locale)}
              </dd>
            </div>
          </dl>
        </div>

        
        {order.giftCard && order.giftMessage && (<div className="mx-6 mt-4 rounded-lg border-2 border-dashed border-[var(--gold)] bg-[var(--gold)]/5 p-3">
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-black/60">
              <Gift className="h-3 w-3"/> {dict.order.receiptGiftMessage}
            </div>
            <p className="mt-1 font-serif text-xs italic leading-relaxed">{order.giftMessage}</p>
          </div>)}

        
        <div className="mt-5 border-t border-black/15 px-6 py-3">
          <div className="flex items-end justify-between gap-4">
            <p className="text-[10px] leading-4 text-black/60">
              {dict.order.receiptThanks}
              <br />
              <span className="font-semibold text-black/80">{dict.order.receiptFooterBrand}</span>
            </p>
            <div className="h-8 w-32 shrink-0 opacity-80" style={{
            background: "repeating-linear-gradient(90deg, #000 0 2px, transparent 2px 4px, #000 4px 5px, transparent 5px 9px)",
        }} aria-hidden/>
          </div>
        </div>
      </div>
    </div>);
}
