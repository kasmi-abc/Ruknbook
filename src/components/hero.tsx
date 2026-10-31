"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBooks } from "@/components/hero-books";
import type { BookCard as BookCardData } from "@/lib/types";

export type HeroBook = Pick<
  BookCardData,
  "id" | "slug" | "title" | "price" | "oldPrice" | "discountPct" | "coverUrl"
>;

export function Hero({ books = [] }: { books?: HeroBook[] }) {
    const { t, locale } = useI18n();
    const rtl = locale === "ar";
    return (<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
      
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"/>
        <div className="absolute -bottom-24 -start-16 h-72 w-72 rounded-full bg-gold/30 blur-3xl"/>
        <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}/>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-20">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3 gap-1.5 bg-white/15 text-primary-foreground backdrop-blur sm:mb-5">
              <Sparkles className="h-3.5 w-3.5 text-gold"/>
              {t("home.heroBadge")}
            </Badge>
            <h1 className="font-serif text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/85 sm:mt-5 sm:text-lg">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 sm:mt-8">
              <Button size="lg" variant="secondary" className="shadow-lg" asChild>
                <Link href={`/${locale}/books`}>
                  {t("home.shopNow")} <ArrowRight className="h-4 w-4 rtl:rotate-180"/>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-primary-foreground backdrop-blur hover:bg-white/20 hover:text-primary-foreground" asChild>
                <Link href={`/${locale}/best-sellers`}>{t("home.browseCatalog")}</Link>
              </Button>
            </div>
          </div>

          
          {books.length > 0 && (<div className={rtl ? "" : ""}>
              <HeroBooks books={books}/>
            </div>)}
        </div>
      </div>
    </section>);
}
