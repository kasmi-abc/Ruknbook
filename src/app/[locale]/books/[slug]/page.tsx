import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import Image from "next/image";
import { BookOpen, FileText, Layers, Calendar, Globe, Hash, Ruler } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getBookBySlug, getRelatedBooks, getSeriesBooks, toCard } from "@/lib/books";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { RatingStars } from "@/components/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Reviews } from "@/components/reviews";
import { BookRow } from "@/components/book-row";
import { SamplePreview } from "@/components/sample-preview";
import { ShareButton } from "@/components/share-button";
import { Breadcrumbs } from "@/components/breadcrumbs";
export const revalidate = 300;
export default async function BookPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const dict = getDictionary(locale);
    const book = await getBookBySlug(slug).catch(() => null);
    if (!book)
        notFound();
    const session = await auth().catch(() => null);
    const [related, series, reviews] = await Promise.all([
        getRelatedBooks(book.id, book.categoryId, 8).catch(() => []),
        book.series ? getSeriesBooks(book.series, book.id).catch(() => []) : [],
        prisma.review
            .findMany({
            where: { bookId: book.id },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" },
            take: 20,
        })
            .catch(() => []),
    ]);
    const price = Number(book.price);
    const outOfStock = book.stock <= 0;
    return (<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
            { label: dict.nav.home, href: `/${locale}` },
            { label: book.category.name, href: `/${locale}/categories/${book.category.slug}` },
            { label: book.title },
        ]}/>

      <div className="mt-6 grid gap-10 lg:grid-cols-[320px_1fr] book-details-grid">
        
        <div className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-xs">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border bg-muted shadow-xl">
            {book.coverUrl ? (<Image src={book.coverUrl} alt={book.title} fill sizes="(max-width: 1024px) 80vw, 320px" className="object-cover" priority unoptimized/>) : (<div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary/20 to-primary/5 p-6 text-center">
                <BookOpen className="h-12 w-12 text-primary/60"/>
                <span className="font-serif text-lg font-semibold text-primary/80">{book.title}</span>
              </div>)}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <ShareButton title={book.title}/>
          </div>
        </div>

        
        <div dir={locale}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{book.category.name}</Badge>
            {book.isBestSeller && <Badge variant="gold">{dict.nav.bestSellers}</Badge>}
            {book.discountPct > 0 && <Badge variant="destructive">-{book.discountPct}%</Badge>}
          </div>

          <h1 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {dict.book.author}: <span className="font-medium text-foreground">{book.author}</span>
          </p>

          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={book.rating} size={16}/>
            <span className="text-sm text-muted-foreground">
              {book.rating.toFixed(1)} Â· {book.reviewsCount} {dict.book.reviewsCount}
            </span>
          </div>

          
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-bold text-primary">
              {formatPrice(price, dict.common.currencySymbol, locale)}
            </span>
            {book.oldPrice && (<span className="text-lg text-muted-foreground line-through">
                {formatPrice(Number(book.oldPrice), dict.common.currencySymbol, locale)}
              </span>)}
            {book.discountPct > 0 && (<Badge variant="destructive">-{book.discountPct}%</Badge>)}
          </div>

          
          <div className="mt-2">
            {outOfStock ? (<span className="text-sm font-medium text-destructive">{dict.book.outOfStock}</span>) : book.stock <= 5 ? (<span className="text-sm font-medium text-amber-600">{dict.book.lowStock}</span>) : (<span className="text-sm font-medium text-emerald-600">{dict.book.inStock}</span>)}
          </div>

          
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">{dict.book.format}</h3>
            <FormatWrapper formats={book.formats} basePrice={price} book={book} outOfStock={outOfStock}/>
          </div>

          
          <div className="mt-8">
            <h2 className="font-serif text-lg font-bold">{dict.book.description}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{book.description}</p>
          </div>

          
          <div className="mt-8">
            <h2 className="font-serif text-lg font-bold">{dict.book.details}</h2>
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Detail icon={FileText} label={dict.book.pages} value={book.pages ? `${book.pages}` : "â€”"}/>
              <Detail icon={Layers} label={dict.book.publisher} value={book.publisher ?? "â€”"}/>
              <Detail icon={Calendar} label={dict.book.publishYear} value={book.publishYear ? `${book.publishYear}` : "â€”"}/>
              <Detail icon={Globe} label={dict.book.languageLabel} value={book.language}/>
              {book.isbn && <Detail icon={Hash} label={dict.book.isbn} value={book.isbn}/>}
              {book.series && <Detail icon={Ruler} label={dict.book.series} value={`${book.series} #${book.seriesOrder ?? ""}`}/>}
            </dl>
          </div>
        </div>
      </div>

      
      <div className="mt-14">
        <SamplePreview title={book.title} author={book.author} excerpt={book.excerpt}/>
      </div>

      
      {series.length > 0 && (<div className="mt-14">
          <BookRow title={dict.book.sameSeries} books={series.map(toCard)} href={`/${locale}/books?category=${book.category.slug}`}/>
        </div>)}

      
      <div className="mt-14">
        <Reviews bookId={book.id} reviews={reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            title: r.title,
            content: r.content,
            createdAt: r.createdAt.toISOString(),
            user: r.user,
        }))} avg={book.rating} count={book.reviewsCount} canReview={!!session?.user} loginHref={`/${locale}/login`}/>
      </div>

      
      {related.length > 0 && (<div className="mt-14">
          <BookRow title={dict.book.related} subtitle={dict.book.relatedSub} books={related.map(toCard)} href={`/${locale}/categories/${book.category.slug}`}/>
        </div>)}
    </div>);
}
function Detail({
    icon: Icon,
    label,
    value,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
}) {
    return (<div className="rounded-xl border bg-card p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5"/> {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>);
}
import { FormatState } from "@/components/format-state";
function FormatWrapper({
    formats,
    basePrice,
    book,
    outOfStock,
}: {
    formats: string[];
    basePrice: number;
    book: Parameters<typeof toCard>[0];
    outOfStock: boolean;
}) {
    return <FormatState formats={formats} basePrice={basePrice} book={toCard(book)} outOfStock={outOfStock}/>;
}
