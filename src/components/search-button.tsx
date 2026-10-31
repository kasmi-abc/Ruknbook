"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, BookOpen } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";
type SearchHit = {
    id: string;
    slug: string;
    title: string;
    author: string;
    price: number;
    coverUrl: string | null;
};
export function SearchButton() {
    const { t, locale, dict } = useI18n();
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchHit[]>([]);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if (!open)
            return;
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`, {
                    signal: controller.signal,
                });
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.results || []);
                }
            }
            catch {
            }
            finally {
                setLoading(false);
            }
        }, 250);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, open, locale]);
    function go(href: string) {
        setOpen(false);
        setQuery("");
        router.push(href);
    }
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label={t("nav.search")}>
          <Search className="h-[1.1rem] w-[1.1rem]"/>
        </Button>
      </DialogTrigger>
      <DialogContent className="top-24 max-w-xl -translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">{t("nav.search")}</DialogTitle>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground"/>
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("nav.searchPlaceholder")} className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"/>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (<div className="p-6 text-center text-sm text-muted-foreground">{dict.common.loading}</div>)}
          {!loading && query.trim().length < 2 && (<div className="p-6 text-center text-sm text-muted-foreground">{t("nav.searchPlaceholder")}</div>)}
          {!loading && query.trim().length >= 2 && results.length === 0 && (<div className="p-6 text-center text-sm text-muted-foreground">{dict.common.noResultsFound}</div>)}
          {results.map((r) => (<button key={r.id} onClick={() => go(`/${locale}/books/${r.slug}`)} className="flex w-full items-center gap-3 rounded-xl p-2 text-start transition-colors hover:bg-accent">
              <span className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-muted">
                {r.coverUrl ? (<Image src={r.coverUrl} alt={r.title} fill sizes="36px" className="object-cover" unoptimized/>) : (<BookOpen className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground"/>)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{r.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{r.author}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-primary">
                {formatPrice(r.price, dict.common.currencySymbol, locale)}
              </span>
            </button>))}
        </div>
      </DialogContent>
    </Dialog>);
}
