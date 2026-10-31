"use client";
import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { formatPriceFor } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function FormatSelector({
  formats,
  basePrice,
  value,
  onChange,
}: {
  formats: string[];
  basePrice: number;
  value: string;
  onChange: (f: string) => void;
}) {
  const { t, locale, dict } = useI18n();
  const currency = dict.common.currencySymbol;
  const labels: Record<string, string> = {
    paperback: t("book.paperback"),
    hardcover: t("book.hardcover"),
    ebook: t("book.ebook"),
  };
  const available = formats.length ? formats : ["paperback"];
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {available.map((f) => {
        const selected = value === f;
        const price = formatPriceFor(basePrice, f);
        return (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            className={cn(
              "relative rounded-2xl border p-3 text-start transition-all",
              selected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "hover:border-primary/40"
            )}
          >
            {selected && (
              <span className="absolute end-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            <div className="text-sm font-semibold">{labels[f] ?? f}</div>
            <div className="mt-1 text-sm font-bold text-primary">
              {formatPrice(price, currency, locale)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
