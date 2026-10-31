"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, BookOpen } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";
import type { BookCard as BookCardData } from "@/lib/types";

export function BookCard({
  book,
  className,
}: {
  book: BookCardData;
  className?: string;
}) {
  const { locale, dict } = useI18n();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const inWish = wishItems.some((i) => i.bookId === book.id);
  const currency = dict.common.currencySymbol;
  const pct = book.discountPct ?? 0;
  const referencePrice =
    book.oldPrice && book.oldPrice > book.price
      ? book.oldPrice
      : pct > 0
        ? Math.round(book.price / (1 - pct / 100))
        : null;
  const hasDiscount = referencePrice !== null && referencePrice > book.price;
  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      bookId: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl ?? null,
      price: book.price,
      format: "paperback",
    });
    toast.success(dict.book.addToCart);
  }
  function onWish(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWish({
      bookId: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl ?? null,
      price: book.price,
      rating: book.rating ?? 0,
    });
  }
  return (
    <Link
      href={`/${locale}/books/${book.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/15 to-primary/5 p-4 text-center">
            <BookOpen className="h-8 w-8 text-primary/60" />
            <span className="line-clamp-3 font-serif text-sm font-semibold text-primary/80">
              {book.title}
            </span>
          </div>
        )}

        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {hasDiscount ? <Badge variant="success">-{pct}%</Badge> : null}
          {!hasDiscount && book.isBestSeller ? (
            <Badge variant="gold">{dict.nav.bestSellers}</Badge>
          ) : null}
          {!hasDiscount && book.isNew && !book.isBestSeller ? (
            <Badge variant="success">{dict.nav.newReleases}</Badge>
          ) : null}
        </div>

        <button
          onClick={onWish}
          aria-label={dict.book.addToWishlist}
          className={cn(
            "absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background",
            inWish && "text-gold"
          )}
        >
          <Heart className={cn("h-4 w-4", inWish && "fill-gold")} />
        </button>

        <div className="pointer-events-auto absolute inset-x-2 bottom-2 translate-y-0 opacity-100 transition-all duration-300 md:pointer-events-none md:translate-y-2 md:opacity-0 md:group-hover:pointer-events-auto md:group-hover:translate-y-0 md:group-hover:opacity-100">
          <Button size="sm" className="w-full shadow-lg" onClick={addToCart}>
            <ShoppingBag className="h-4 w-4" /> {dict.book.addToCart}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {book.category && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-primary/80">
            {book.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-snug">{book.title}</h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{book.author}</p>
        <div className="mt-auto flex items-center gap-2 pt-1">
          {book.rating ? (
            <>
              <RatingStars rating={book.rating} size={12} />
              <span className="text-[11px] text-muted-foreground">({book.reviewsCount ?? 0})</span>
            </>
          ) : null}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 pt-0.5">
          {hasDiscount ? (
            <>
              <span className="font-serif text-base font-bold text-emerald-600 dark:text-emerald-500">
                {formatPrice(book.price, currency, locale)}
              </span>
              <span className="text-xs font-medium text-red-500 line-through dark:text-red-400">
                {formatPrice(referencePrice, currency, locale)}
              </span>
              <span className="rounded bg-emerald-600/10 px-1 py-px text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                -{pct}%
              </span>
            </>
          ) : (
            <span className="font-serif text-base font-bold text-primary">
              {formatPrice(book.price, currency, locale)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
