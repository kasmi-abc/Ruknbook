"use client";
import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function NewsletterCta() {
    const { t } = useI18n();
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [done, setDone] = React.useState(false);
    async function submit(e: React.FormEvent) {
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
                setDone(true);
                setEmail("");
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-gold/10 border p-8 text-center sm:p-14">
      <h2 className="font-serif text-3xl font-bold sm:text-4xl">{t("home.newsletterTitle")}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        {t("home.newsletterSub")}
      </p>
      {done ? (<div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full bg-emerald-500/10 py-3 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-5 w-5"/> {t("home.subscribed")}
        </div>) : (<form onSubmit={submit} className="mx-auto mt-7 flex max-w-md gap-2">
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("home.emailPlaceholder")} className="h-12"/>
          <Button type="submit" size="lg" className="h-12 shrink-0" loading={loading}>
            <Send className="h-4 w-4"/>
            <span className="hidden sm:inline">{t("home.subscribe")}</span>
          </Button>
        </form>)}
    </section>);
}
