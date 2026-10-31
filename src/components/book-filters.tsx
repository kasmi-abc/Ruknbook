"use client";
import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/rating-stars";
const PRICE_MAX = 8000;
type FilterCategory = { name: string; slug: string; count?: number };
export function BookFilters({ categories }: { categories: FilterCategory[] }) {
    const { t } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [price, setPrice] = React.useState(Number(searchParams.get("maxPrice")) || PRICE_MAX);
    const [rating, setRating] = React.useState(Number(searchParams.get("minRating")) || 0);
    const [langs, setLangs] = React.useState<string[]>(searchParams.get("language") ? [searchParams.get("language")!] : []);
    const [formats, setFormats] = React.useState<string[]>(searchParams.get("format") ? [searchParams.get("format")!] : []);
    function apply(next: Record<string, string | undefined>) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [k, v] of Object.entries(next)) {
            if (v === undefined || v === "" || v === "all")
                params.delete(k);
            else
                params.set(k, v);
        }
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }
    function toggleIn(list: string[], value: string, key: "language" | "format") {
        const next = list.includes(value) ? list.filter((x) => x !== value) : [value];
        const el = key === "language" ? setLangs : setFormats;
        el(next);
        apply({ [key]: next[0] });
    }
    function clear() {
        setPrice(PRICE_MAX);
        setRating(0);
        setLangs([]);
        setFormats([]);
        router.push(pathname);
    }
    const activeCount = (searchParams.get("category") ? 1 : 0) +
        (price < PRICE_MAX ? 1 : 0) +
        (rating > 0 ? 1 : 0) +
        langs.length +
        formats.length;
    const panel = (<div className="space-y-6">
      
      <div>
        <h4 className="mb-3 text-sm font-semibold">{t("catalog.category")}</h4>
        <div className="max-h-64 space-y-1 overflow-y-auto pe-1">
          <button onClick={() => apply({ category: undefined })} className={`block w-full rounded-lg px-2 py-1.5 text-start text-sm transition-colors hover:bg-accent ${!searchParams.get("category") ? "bg-accent font-medium" : ""}`}>
            {t("catalog.all")}
          </button>
          {categories.map((c) => (<button key={c.slug} onClick={() => apply({ category: c.slug })} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-start text-sm transition-colors hover:bg-accent ${searchParams.get("category") === c.slug ? "bg-accent font-medium" : ""}`}>
              <span className="truncate">{c.name}</span>
              {c.count != null && (<span className="ms-2 text-xs text-muted-foreground">{c.count}</span>)}
            </button>))}
        </div>
      </div>

      <Separator />

      
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-semibold">{t("catalog.priceRange")}</h4>
          <span className="text-xs font-medium text-primary">
            0 – {price.toLocaleString()} {t("common.currency")}
          </span>
        </div>
        <Slider value={[price]} min={0} max={PRICE_MAX} step={100} onValueChange={(v) => setPrice(v[0])} onValueCommit={(v) => apply({ maxPrice: String(v[0]) })}/>
      </div>

      <Separator />

      
      <div>
        <h4 className="mb-3 text-sm font-semibold">{t("catalog.rating")}</h4>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (<button key={r} onClick={() => {
                const next = rating === r ? 0 : r;
                setRating(next);
                apply({ minRating: next ? String(next) : undefined });
            }} className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent ${rating === r ? "bg-accent font-medium" : ""}`}>
              <RatingStars rating={r} size={14}/>
              <span>& up</span>
            </button>))}
        </div>
      </div>

      <Separator />

      
      <div>
        <h4 className="mb-3 text-sm font-semibold">{t("catalog.language")}</h4>
        <div className="space-y-2">
          {([["English", "langEnglish"], ["French", "langFrench"], ["Arabic", "langArabic"]] as const).map(([l, key]) => (<label key={l} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={langs.includes(l)} onCheckedChange={() => toggleIn(langs, l, "language")}/>
              {t(`catalog.${key}`)}
            </label>))}
        </div>
      </div>

      <Separator />

      
      <div>
        <h4 className="mb-3 text-sm font-semibold">{t("catalog.format")}</h4>
        <div className="space-y-2">
          {[
            { key: "paperback", label: t("book.paperback") },
            { key: "hardcover", label: t("book.hardcover") },
            { key: "ebook", label: t("book.ebook") },
        ].map((f) => (<label key={f.key} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox checked={formats.includes(f.key)} onCheckedChange={() => toggleIn(formats, f.key, "format")}/>
              {f.label}
            </label>))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clear}>
        {t("catalog.clearFilters")}
      </Button>
    </div>);
    return (<>
      
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-28 rounded-2xl border bg-card p-5">{panel}</div>
      </aside>

      
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4"/>
              {t("catalog.filters")}
              {activeCount > 0 && <Badge className="ms-1">{activeCount}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t("catalog.filters")}</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">{panel}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>);
}
