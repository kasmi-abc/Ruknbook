import { getDictionary } from "@/lib/i18n";
import { getBestSellers, toCard } from "@/lib/books";
import { BookGrid } from "@/components/book-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Star } from "lucide-react";
export const revalidate = 300;
export default async function BestSellersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const books = await getBestSellers(48).catch(() => []);
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.bestSellers }]}/>
      <div className="mb-8 mt-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Star className="h-6 w-6 fill-gold"/>
        </span>
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{dict.home.bestSellers}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{dict.home.bestSellersSub}</p>
        </div>
      </div>
      <BookGrid books={books.map(toCard)}/>
    </div>);
}
