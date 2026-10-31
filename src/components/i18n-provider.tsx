"use client";
import * as React from "react";
import type { Dictionary } from "@/lib/i18n";

export type Locale = "en" | "ar" | "fr";

export type TranslateFn = (
  path: string,
  vars?: Record<string, string | number>
) => string;

interface I18nValue {
  dict: Dictionary;
  locale: Locale;
  dir: "ltr" | "rtl";
  t: TranslateFn;
}

const I18nContext = React.createContext<I18nValue | null>(null);

export function I18nProvider({
  dict,
  locale,
  dir,
  children,
}: {
  dict: Dictionary;
  locale: string;
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  const t = React.useCallback<TranslateFn>((path, vars) => {
    const parts = path.split(".");
    let cur: unknown = dict;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return path;
      }
    }
    const value = typeof cur === "string" ? cur : path;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
  }, [dict]);
  const value = React.useMemo<I18nValue>(
    () => ({ dict, locale: locale as Locale, dir, t }),
    [dict, locale, dir, t]
  );
  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
