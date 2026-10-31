"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BookMarked, BookOpenText, Library } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type LanguageEntry = { value: string; titleKey: string; subKey: string; icon: LucideIcon; accent: string };

const LANGUAGES: LanguageEntry[] = [
    { value: "Arabic", titleKey: "langArabic", subKey: "languageArabicSub", icon: BookMarked, accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { value: "French", titleKey: "langFrench", subKey: "languageFrenchSub", icon: BookOpenText, accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
    { value: "English", titleKey: "langEnglish", subKey: "languageEnglishSub", icon: Library, accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
];

export function LanguageStrip() {
    const { t, locale } = useI18n();
    return (<section className="space-y-4">
      <div className="text-center">
        <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("catalog.shopByLanguage")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {LANGUAGES.map((l) => {
            const Icon = l.icon;
            return (<Link key={l.value} href={`/${locale}/books?language=${l.value}`} className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${l.accent}`}>
                <Icon className="h-6 w-6"/>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-semibold">{t(`catalog.${l.titleKey}`)}</span>
                <span className="block truncate text-sm text-muted-foreground">{t(`catalog.${l.subKey}`)}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"/>
            </Link>);
        })}
      </div>
    </section>);
}
