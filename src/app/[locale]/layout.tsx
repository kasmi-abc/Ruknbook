import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LOCALES } from "@/lib/constants";
import { getDictionary } from "@/lib/i18n";
import { I18nProvider } from "@/components/i18n-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!(LOCALES as readonly string[]).includes(locale))
        notFound();
    const dict = getDictionary(locale);
    const dir = locale === "ar" ? "rtl" : "ltr";
    return (<I18nProvider dict={dict} locale={locale} dir={dir}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>);
}
