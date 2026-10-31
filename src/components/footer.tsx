"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Share2, Mail, Phone, MapPin, Send, Banknote } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { SITE, DESIGNER } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
export function Footer() {
    const { t, locale } = useI18n();
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const year = new Date().getFullYear();
    async function subscribe(e: React.FormEvent) {
        e.preventDefault();
        if (!email)
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                toast.success(t("home.subscribed"));
                setEmail("");
            }
            else {
                toast.error(t("common.error"));
            }
        }
        catch {
            toast.error(t("common.error"));
        }
        finally {
            setLoading(false);
        }
    }
    const quickLinks = [
        { href: `/${locale}/books`, label: t("nav.allCategories") },
        { href: `/${locale}/best-sellers`, label: t("nav.bestSellers") },
        { href: `/${locale}/new-releases`, label: t("nav.newReleases") },
        { href: `/${locale}/offers`, label: t("nav.offers") },
        { href: `/${locale}/about`, label: t("footer.about") },
        { href: `/${locale}/contact`, label: t("footer.contact") },
    ];
    const careLinks = [
        { href: `/${locale}/faq`, label: t("footer.faq") },
        { href: `/${locale}/shipping`, label: t("footer.shipping") },
        { href: `/${locale}/returns`, label: t("footer.returns") },
        { href: `/${locale}/track-order`, label: t("footer.trackOrder") },
        { href: `/${locale}/terms`, label: t("footer.terms") },
        { href: `/${locale}/privacy`, label: t("footer.privacy") },
    ];
    const socials = [
        { href: SITE.socials.instagram, icon: Instagram, label: "Instagram" },
        { href: SITE.socials.threads, icon: Share2, label: "Threads" },
        { href: SITE.socials.facebook, icon: Facebook, label: "Facebook" },
    ];
    return (<footer className="mt-20 border-t bg-card" data-site-footer data-no-print>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="relative h-11 w-11 overflow-hidden rounded-xl ring-1 ring-primary/20">
                <Image src="/logo.jpg" alt="Rukn Books" fill sizes="44px" className="object-cover"/>
              </span>
              <div>
                <div className="font-serif text-xl font-bold text-primary">RUKN</div>
                <div className="text-xs tracking-[0.3em] text-muted-foreground">BOOKS</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("footer.aboutText")}</p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => {
            const Icon = s.icon;
            return (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-primary hover:text-primary-foreground">
                    <Icon className="h-4 w-4"/>
                  </a>);
        })}
            </div>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.quickLinks")}</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((l) => (<li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.customerCare")}</h3>
            <ul className="mt-4 space-y-2.5">
              {careLinks.map((l) => (<li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">{t("footer.newsletterTitle")}</h3>
            <p className="mt-4 text-sm text-muted-foreground">{t("footer.newsletterSub")}</p>
            <form onSubmit={subscribe} className="mt-3 flex gap-2">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("footer.emailPlaceholder")} className="h-10 rounded-full"/>
              <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-full" loading={loading} aria-label={t("footer.subscribe")}>
                <Send className="h-4 w-4"/>
              </Button>
            </form>

            <div className="mt-6 space-y-2.5 text-sm text-muted-foreground">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4"/> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4"/> {SITE.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4"/> {SITE.address}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-8"/>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} Rukn Books. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 font-medium text-foreground">
              <Banknote className="h-4 w-4 text-primary"/>
              {t("footer.payCod")}
            </span>
            <span className="rounded-full border border-dashed px-3 py-1.5">
              {t("footer.paySoon")}
            </span>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("footer.designedBy").replace("{name}", "")}{" "}
          <a href={DESIGNER.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline">
            {DESIGNER.name}
            <Instagram className="h-3 w-3"/>
          </a>
        </p>
      </div>
    </footer>);
}
