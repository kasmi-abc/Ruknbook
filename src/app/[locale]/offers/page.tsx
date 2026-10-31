import { getDictionary } from "@/lib/i18n";
import { getOnSaleBooks, toCard } from "@/lib/books";
import { BookGrid } from "@/components/book-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Tag } from "lucide-react";
export const revalidate = 300;
export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const books = await getOnSaleBooks(48).catch(() => []);
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.offers }]}/>
      <div className="mb-8 mt-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Tag className="h-6 w-6"/>
        </span>
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{dict.home.offers}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{dict.home.offersSub}</p>
        </div>
      </div>
      {books.length > 0 ? (<BookGrid books={books.map(toCard)}/>) : (<p className="py-16 text-center text-muted-foreground">{dict.catalog.noResults}</p>)}
    </div>);
}
