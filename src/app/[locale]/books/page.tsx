import { Suspense } from "react";
import { getDictionary } from "@/lib/i18n";
import { queryBooks, getAllCategories, toCard } from "@/lib/books";
import { BookGrid } from "@/components/book-grid";
import { BookFilters } from "@/components/book-filters";
import { SortSelect } from "@/components/sort-select";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { SearchX } from "lucide-react";
export const revalidate = 60;
export default async function CatalogPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const { locale } = await params;
    const sp = await searchParams;
    const dict = getDictionary(locale);
    const num = (v: string | string[] | undefined): number | undefined => {
        const raw = Array.isArray(v) ? v[0] : v;
        return raw != null && raw !== "" ? Number(raw) : undefined;
    };
    const str = (v: string | string[] | undefined): string | undefined => {
        const raw = Array.isArray(v) ? v[0] : v;
        return raw && raw !== "all" ? raw : undefined;
    };
    const page = Math.max(1, num(sp.page) ?? 1);
    const [result, categories] = await Promise.all([
        queryBooks({
            category: str(sp.category),
            maxPrice: num(sp.maxPrice),
            minRating: num(sp.minRating),
            language: str(sp.language),
            format: str(sp.format),
            sort: str(sp.sort),
            q: str(sp.q),
            page,
            perPage: 24,
        }),
        getAllCategories().catch(() => []),
    ]);
    const catFilters = categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        count: c._count?.books ?? 0,
    }));
    return (<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{dict.catalog.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dict.catalog.subtitle}</p>
      </div>

      <div className="flex gap-8">
        <Suspense>
          <BookFilters categories={catFilters}/>
        </Suspense>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{result.total}</span>{" "}
              {dict.catalog.results}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>

          {result.books.length > 0 ? (<>
              <BookGrid books={result.books.map(toCard)}/>
              <Pagination page={result.page} pages={result.pages}/>
            </>) : (<EmptyState icon={SearchX} title={dict.catalog.noResults} description={dict.catalog.noResultsSub}/>)}
        </div>
      </div>
    </div>);
}
