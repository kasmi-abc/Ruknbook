import { getDictionary } from "@/lib/i18n";
import { getNewReleases, toCard } from "@/lib/books";
import { BookGrid } from "@/components/book-grid";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sparkles } from "lucide-react";
export const revalidate = 300;
export default async function NewReleasesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const books = await getNewReleases(48).catch(() => []);
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.nav.newReleases }]}/>
      <div className="mb-8 mt-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6"/>
        </span>
        <div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">{dict.home.newReleases}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{dict.home.newReleasesSub}</p>
        </div>
      </div>
      <BookGrid books={books.map(toCard)}/>
    </div>);
}
