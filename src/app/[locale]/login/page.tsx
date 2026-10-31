"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
export default function LoginPage() {
    const { t, locale } = useI18n();
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (res?.error) {
            setError(t("auth.error"));
        }
        else {
            router.push(`/${locale}/account`);
            router.refresh();
        }
    }
    return (<div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold">{t("auth.loginTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.loginSub")}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5"/>
          </div>
          <div>
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5"/>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            {t("auth.signIn")}
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">{t("auth.demoHint")}</p>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1"/>
          <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
          <Separator className="flex-1"/>
        </div>

        <p className="text-center text-sm">
          {t("auth.noAccount")}{" "}
          <Link href={`/${locale}/register`} className="font-medium text-primary hover:underline">
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>);
}
