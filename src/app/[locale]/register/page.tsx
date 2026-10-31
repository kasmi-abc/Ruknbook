"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function RegisterPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const [form, setForm] = React.useState({ name: "", email: "", password: "", confirm: "" });
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError(t("auth.error"));
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            if (!res.ok) {
                setError(t("auth.registerError"));
                return;
            }
            await signIn("credentials", {
                email: form.email,
                password: form.password,
                redirect: false,
            });
            router.push(`/${locale}/account`);
            router.refresh();
        }
        catch {
            setError(t("auth.registerError"));
        }
        finally {
            setLoading(false);
        }
    }
    return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold">{t("auth.registerTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.registerSub")}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">{t("auth.name")}</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
            <Input id="confirm" type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="mt-1.5"/>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {t("auth.signUp")}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          {t("auth.haveAccount")}{" "}
          <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>);
}
