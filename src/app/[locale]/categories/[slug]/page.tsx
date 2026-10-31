import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { getCategoryBySlug, queryBooks, toCard, getAllCategories } from "@/lib/books";
import { BookGrid } from "@/components/book-grid";
import { BookFilters } from "@/components/book-filters";
import { SortSelect } from "@/components/sort-select";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchX } from "lucide-react";
export const revalidate = 120;
export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const { locale, slug } = await params;
    const sp = await searchParams;
    const dict = getDictionary(locale);
    const category = await getCategoryBySlug(slug).catch(() => null);
    if (!category)
        notFound();
    const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);
    const [result, categories] = await Promise.all([
        queryBooks({
            category: slug,
            maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
            minRating: sp.minRating ? Number(sp.minRating) : undefined,
            language: typeof sp.language === "string" ? sp.language : undefined,
            format: typeof sp.format === "string" ? sp.format : undefined,
            sort: typeof sp.sort === "string" ? sp.sort : undefined,
            page,
            perPage: 24,
        }),
        getAllCategories().catch(() => []),
    ]);
    const label = locale === "ar" ? category.nameAr || category.name : locale === "fr" ? category.nameFr || category.name : category.name;
    return (<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: dict.home.categories, href: `/${locale}/categories` },
            { label },
        ]}/>
      <div className="mb-8 mt-4">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{label}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{result.total}</span> {dict.catalog.results}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <BookFilters categories={categories.map((c) => ({ name: c.name, slug: c.slug, count: c._count?.books ?? 0 }))}/>
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-end">
            <SortSelect />
          </div>
          {result.books.length > 0 ? (<>
              <BookGrid books={result.books.map(toCard)}/>
              <Pagination page={result.page} pages={result.pages}/>
            </>) : (<EmptyState icon={SearchX} title={dict.catalog.noResults} description={dict.catalog.noResultsSub}/>)}
        </div>
      </div>
    </div>);
}
