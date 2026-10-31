"use client";
import * as React from "react";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/constants";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
export default function ContactPage() {
    const { t, locale } = useI18n();
    const [sent, setSent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        setLoading(false);
        setSent(true);
    }
    return (<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.contactTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.contactTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("pages.contactSub")}</p>

      <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_280px]">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">{t("checkout.fullName")}</Label>
              <Input id="name" required className="mt-1.5"/>
            </div>
            <div>
              <Label htmlFor="email">{t("checkout.email")}</Label>
              <Input id="email" type="email" required className="mt-1.5"/>
            </div>
          </div>
          <div>
            <Label htmlFor="subject">{t("pages.subject")}</Label>
            <Input id="subject" required className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="message">{t("pages.message")}</Label>
            <Textarea id="message" required rows={6} className="mt-1.5"/>
          </div>
          {sent ? (<div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-5 w-5"/> {t("pages.messageSent")}
            </div>) : (<Button type="submit" loading={loading}>
              <Send className="h-4 w-4"/> {t("pages.sendMessage")}
            </Button>)}
        </form>

        <aside className="space-y-3 rounded-2xl border bg-card p-6 text-sm">
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <Mail className="h-4 w-4"/> {SITE.email}
          </a>
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <Phone className="h-4 w-4"/> {SITE.phone}
          </a>
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4"/> {SITE.address}
          </span>
        </aside>
      </div>
    </div>);
}
