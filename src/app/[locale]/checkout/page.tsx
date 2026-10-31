"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, Loader2, Gift, Printer } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useCart, cartSubtotal } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { SITE, WILAYAS, GIFT_CARD_FEE, GIFT_MESSAGE_MAX_WORDS, GIFT_MESSAGE_MAX_CHARS } from "@/lib/constants";
import { isValidAlgerianPhone, isValidNameText, isValidStreet, isValidPostalCode, onlyLetters, onlyPhoneChars, onlyDigits, countWords, } from "@/lib/validation";
export default function CheckoutPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const { lines, clear } = useCart();
    const hydrated = useCart((s) => s.hydrated);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    const [form, setForm] = React.useState({
        customerName: "", phone: "", street: "", city: "", state: "", zip: "", note: "",
    });
    const [giftCard, setGiftCard] = React.useState(false);
    const [giftMessage, setGiftMessage] = React.useState("");
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);
    const subtotal = cartSubtotal(lines);
    const shipping = subtotal >= SITE.freeShippingThreshold ? 0 : SITE.shippingFee;
    const giftCardFee = giftCard ? GIFT_CARD_FEE : 0;
    const total = subtotal + shipping + giftCardFee;
    const currency = t("common.currency");
    const giftWords = countWords(giftMessage);
    type FormKey = keyof typeof form;
    function set(k: FormKey, v: string) {
        setForm((f) => ({ ...f, [k]: v }));
        if (errors[k])
            setErrors((e) => ({ ...e, [k]: "" }));
    }
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!form.customerName.trim())
            next.customerName = t("checkout.required");
        else if (!isValidNameText(form.customerName))
            next.customerName = t("checkout.invalidName");
        if (!form.phone.trim())
            next.phone = t("checkout.required");
        else if (!isValidAlgerianPhone(form.phone))
            next.phone = t("checkout.invalidPhone");
        if (!form.street.trim())
            next.street = t("checkout.required");
        else if (!isValidStreet(form.street))
            next.street = t("checkout.invalidStreet");
        if (!form.city.trim())
            next.city = t("checkout.required");
        else if (!isValidNameText(form.city))
            next.city = t("checkout.invalidCity");
        if (!form.state)
            next.state = t("checkout.invalidWilaya");
        if (form.zip.trim() && !isValidPostalCode(form.zip))
            next.zip = t("checkout.invalidZip");
        if (giftCard) {
            if (!giftMessage.trim())
                next.giftMessage = t("checkout.required");
            else if (giftWords > GIFT_MESSAGE_MAX_WORDS)
                next.giftMessage = t("checkout.giftMessageLimit", { words: String(GIFT_MESSAGE_MAX_WORDS) });
        }
        setErrors(next);
        if (Object.keys(next).length > 0)
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: form.customerName.trim(),
                    phone: form.phone.trim(),
                    street: form.street.trim(),
                    city: form.city.trim(),
                    state: form.state,
                    zip: form.zip.trim(),
                    note: form.note.trim(),
                    giftCard,
                    giftMessage: giftCard ? giftMessage.trim() : "",
                    items: lines.map((l) => ({
                        bookId: l.bookId,
                        quantity: l.quantity,
                        format: l.format,
                    })),
                }),
            });
            const data = await res.json();
            if (res.ok && data.ok) {
                clear();
                router.push(`/${locale}/order-confirmed/${data.orderNumber}`);
            }
            else {
                setErrors({ form: t("common.error") });
            }
        }
        catch {
            setErrors({ form: t("common.error") });
        }
        finally {
            setLoading(false);
        }
    }
    if (!mounted || !hydrated) {
        return (<div className="mx-auto max-w-5xl px-4 py-24 text-center" aria-busy="true">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary"/>
      </div>);
    }
    if (lines.length === 0) {
        return (<div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">{t("checkout.emptyCart")}</h1>
        <Button className="mt-6" asChild>
          <Link href={`/${locale}/books`}>{t("cart.continueShopping")}</Link>
        </Button>
      </div>);
    }
    return (<div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold">{t("checkout.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("checkout.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()} data-no-print>
          <Printer className="h-4 w-4"/> {t("order.printReceipt")}
        </Button>
      </div>

      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">{t("checkout.contactInfo")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="customerName">{t("checkout.fullName")}</Label>
                <Input id="customerName" value={form.customerName} onChange={(e) => set("customerName", onlyLetters(e.target.value))} placeholder="Ahmed Benali" autoComplete="name" className="mt-1.5"/>
                {errors.customerName && (<p className="mt-1 text-xs text-destructive">{errors.customerName}</p>)}
              </div>
              <div>
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input id="phone" type="tel" inputMode="tel" dir="ltr" value={form.phone} onChange={(e) => set("phone", onlyPhoneChars(e.target.value))} placeholder="0555 12 34 56" autoComplete="tel" className="mt-1.5 text-start"/>
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>
          </section>

          
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">{t("checkout.shippingAddress")}</h2>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="street">{t("checkout.street")}</Label>
                <Input id="street" value={form.street} onChange={(e) => set("street", e.target.value.slice(0, 80))} placeholder="Cité 200 logements, Bât. B, N° 12" autoComplete="street-address" className="mt-1.5"/>
                {errors.street && <p className="mt-1 text-xs text-destructive">{errors.street}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="city">{t("checkout.city")}</Label>
                  <Input id="city" value={form.city} onChange={(e) => set("city", onlyLetters(e.target.value))} placeholder="Bab Ezzouar" autoComplete="address-level2" className="mt-1.5"/>
                  {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">{t("checkout.state")}</Label>
                  <select id="state" value={form.state} onChange={(e) => set("state", e.target.value)} className="mt-1.5 h-10 w-full rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">—</option>
                    {WILAYAS.map((w) => (<option key={w.code} value={w.code}>
                        {w.code} — {locale === "ar" ? w.nameAr : w.name}
                      </option>))}
                  </select>
                  {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="zip">
                  {t("checkout.zip")}{" "}
                  <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Input id="zip" inputMode="numeric" dir="ltr" value={form.zip} onChange={(e) => set("zip", onlyDigits(e.target.value, 5))} placeholder="16000" autoComplete="postal-code" className="mt-1.5 text-start"/>
                {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
              </div>

              <div>
                <Label htmlFor="note">
                  {t("checkout.notes")} <span className="text-muted-foreground">({t("common.optional")})</span>
                </Label>
                <Textarea id="note" value={form.note} onChange={(e) => set("note", e.target.value.slice(0, 500))} placeholder={t("checkout.notesPlaceholder")} className="mt-1.5"/>
              </div>
            </div>
          </section>

          
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">{t("checkout.giftWrapSection")}</h2>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
              <input type="checkbox" checked={giftCard} onChange={(e) => {
            setGiftCard(e.target.checked);
            if (!e.target.checked) {
                setGiftMessage("");
                setErrors((x) => ({ ...x, giftMessage: "" }));
            }
        }} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"/>
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  <Gift className="h-4 w-4 text-primary"/> {t("checkout.giftCard")}
                  <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatPrice(GIFT_CARD_FEE, currency, locale)}
                  </span>
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("checkout.giftCardDesc")}
                </span>
              </span>
            </label>

            {giftCard && (<div className="mt-4">
                <Label htmlFor="giftMessage">{t("checkout.giftMessage")}</Label>
                <Textarea id="giftMessage" value={giftMessage} onChange={(e) => setGiftMessage(e.target.value.replace(/\s+/g, " ").slice(0, GIFT_MESSAGE_MAX_CHARS))} placeholder={t("checkout.giftMessagePlaceholder")} rows={3} className="mt-1.5"/>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t("checkout.giftMessageLimit", { words: String(GIFT_MESSAGE_MAX_WORDS) })}
                  </span>
                  <span className={giftWords > GIFT_MESSAGE_MAX_WORDS
                ? "text-xs font-semibold text-destructive"
                : "text-xs text-muted-foreground"}>
                    {giftWords}/{GIFT_MESSAGE_MAX_WORDS}
                  </span>
                </div>
                {errors.giftMessage && (<p className="mt-1 text-xs text-destructive">{errors.giftMessage}</p>)}
              </div>)}
          </section>
        </div>

        
        <aside className="h-fit rounded-2xl border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-lg font-bold">{t("checkout.orderSummary")}</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (<li key={`${l.bookId}-${l.format}`} className="flex items-start justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="line-clamp-1 font-medium">{l.title}</span>
                  <span className="text-xs text-muted-foreground">× {l.quantity}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(l.price * l.quantity, currency, locale)}
                </span>
              </li>))}
          </ul>
          <Separator className="my-4"/>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotal, currency, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping, currency, locale)}</span>
            </div>
            {giftCardFee > 0 && (<div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>{t("checkout.giftCardPrice")}</span>
                <span>+{formatPrice(giftCardFee, currency, locale)}</span>
              </div>)}
          </div>
          <Separator className="my-4"/>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t("cart.total")}</span>
            <span className="font-serif text-2xl font-bold text-primary">
              {formatPrice(total, currency, locale)}
            </span>
          </div>

          <div className="mt-5 rounded-xl border bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Banknote className="h-4 w-4 text-primary"/> {t("checkout.cod")}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t("checkout.codDesc")}</p>
          </div>

          {errors.form && <p className="mt-3 text-sm text-destructive">{errors.form}</p>}

          <Button type="submit" size="lg" className="mt-5 w-full" loading={loading}>
            {loading ? t("checkout.placing") : t("checkout.placeOrder")}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t("checkout.byPlacing")}</p>
        </aside>
      </form>
    </div>);
}
