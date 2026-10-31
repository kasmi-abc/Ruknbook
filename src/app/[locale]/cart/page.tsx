"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, Plus, Minus, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useCart, cartSubtotal } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";
export default function CartPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const { lines, remove, setQuantity, clear } = useCart();
    const hydrated = useCart((s) => s.hydrated);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const subtotal = cartSubtotal(lines);
    const shipping = subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
    const total = subtotal + shipping;
    const currency = t("common.currency");
    if (!mounted || !hydrated) {
        return (<div className="mx-auto max-w-5xl px-4 py-24 text-center" aria-busy="true">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary"/>
      </div>);
    }
    if (lines.length === 0) {
        return (<div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={ShoppingBag} title={t("cart.empty")} description={t("cart.emptySub")} action={<Button asChild>
              <Link href={`/${locale}/books`}>{t("cart.continueShopping")}</Link>
            </Button>}/>
      </div>);
    }
    return (<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">{t("cart.title")}</h1>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clear}>
          <Trash2 className="h-4 w-4"/> {t("cart.clearCart")}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {lines.map((l) => (<div key={`${l.bookId}-${l.format}`} className="flex gap-4 rounded-2xl border bg-card p-4">
              <Link href={`/${locale}/books/${l.slug}`} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {l.coverUrl ? (<Image src={l.coverUrl} alt={l.title} fill sizes="64px" className="object-cover" unoptimized/>) : (<BookOpen className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground"/>)}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/${locale}/books/${l.slug}`} className="line-clamp-1 font-medium hover:text-primary">
                  {l.title}
                </Link>
                <p className="line-clamp-1 text-sm text-muted-foreground">{l.author}</p>
                <p className="mt-0.5 text-xs capitalize text-primary/80">
                  {l.format === "paperback" ? t("book.paperback") : l.format === "hardcover" ? t("book.hardcover") : t("book.ebook")}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center rounded-full border">
                    <button onClick={() => setQuantity(l.bookId, l.format, l.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="minus">
                      <Minus className="h-3.5 w-3.5"/>
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{l.quantity}</span>
                    <button onClick={() => setQuantity(l.bookId, l.format, l.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="plus">
                      <Plus className="h-3.5 w-3.5"/>
                    </button>
                  </div>
                  <span className="font-semibold text-primary">
                    {formatPrice(l.price * l.quantity, currency, locale)}
                  </span>
                </div>
              </div>
              <button onClick={() => remove(l.bookId, l.format)} className="self-start rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={t("cart.remove")}>
                <Trash2 className="h-4 w-4"/>
              </button>
            </div>))}
        </div>

        
        <aside className="h-fit rounded-2xl border bg-card p-6">
          <h2 className="font-serif text-lg font-bold">{t("cart.title")}</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span className="font-medium">{formatPrice(subtotal, currency, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span className="font-medium">
                {shipping === 0 ? t("cart.free") : formatPrice(shipping, currency, locale)}
              </span>
            </div>
          </div>
          {shipping > 0 && (<p className="mt-3 rounded-xl bg-primary/5 p-2.5 text-xs text-muted-foreground">
              {t("cart.freeShippingNote").replace("{amount}", formatPrice(SITE.freeShippingThreshold - subtotal, currency, locale))}
            </p>)}
          <Separator className="my-4"/>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t("cart.total")}</span>
            <span className="font-serif text-2xl font-bold text-primary">
              {formatPrice(total, currency, locale)}
            </span>
          </div>
          <Button size="lg" className="mt-5 w-full" onClick={() => router.push(`/${locale}/checkout`)}>
            {t("cart.proceedToCheckout")} <ArrowRight className="h-4 w-4 rtl:rotate-180"/>
          </Button>
          <Button variant="ghost" className="mt-2 w-full" asChild>
            <Link href={`/${locale}/books`}>{t("cart.continueShopping")}</Link>
          </Button>
        </aside>
      </div>
    </div>);
}
