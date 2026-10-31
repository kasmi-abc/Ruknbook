"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { cn, formatPrice } from "@/lib/utils";

export type HeroBookInput = {
  id: string;
  slug: string;
  title: string;
  price: number;
  oldPrice: number | null;
  discountPct: number;
  coverUrl: string | null;
};

const SLOTS = [
    { rot: -24, x: "-168px", z: "-90px", scale: 0.8, op: 0.55, delay: "0s", blur: "blur-[1.5px]" },
    { rot: -12, x: "-84px", z: "-26px", scale: 0.92, op: 0.85, delay: "0.6s", blur: "" },
    { rot: 0, x: "0px", z: "46px", scale: 1, op: 1, delay: "1.2s", blur: "" },
    { rot: 12, x: "84px", z: "-26px", scale: 0.92, op: 0.85, delay: "1.8s", blur: "" },
    { rot: 24, x: "168px", z: "-90px", scale: 0.8, op: 0.55, delay: "2.4s", blur: "blur-[1.5px]" },
];
export function HeroBooks({ books }: { books: HeroBookInput[] }) {
    const { t, locale, dict } = useI18n();
    const currency = dict.common.currencySymbol;
    const picked = React.useMemo(() => {
        const withCover = books.filter((b) => b.coverUrl);
        const pool = withCover.length >= 5 ? withCover : books;
        const sorted = [...pool].sort((a, b) => (b.discountPct || 0) - (a.discountPct || 0));
        const head = sorted.slice(0, 5);
        while (head.length < 5 && sorted.length > 0)
            head.push(sorted[head.length % sorted.length]);
        return head;
    }, [books]);
    if (picked.length === 0)
        return null;
    const ordered = locale === "ar" ? [...picked].reverse() : picked;
    return (<div className="relative mx-auto h-[190px] w-full max-w-[320px] sm:h-[380px] sm:max-w-[480px]" style={{ perspective: "1100px" }} aria-hidden={false}>
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[420px] -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:h-[380px] sm:w-[480px] sm:scale-100">
      {ordered.map((book, i) => {
            const slot = SLOTS[i] ?? SLOTS[SLOTS.length - 1];
            const transform = `translateX(${slot.x}) translateZ(${slot.z}) rotateY(${slot.rot}deg) scale(${slot.scale})`;
            return (<Link key={`${book.id}-${i}`} href={`/${locale}/books/${book.slug}`} title={book.title} className={cn("group/book absolute start-1/2 top-1/2 block h-[210px] w-[150px] sm:h-[260px] sm:w-[186px]", "transition-[opacity,filter] duration-500 hover:z-20")} style={{
                    marginLeft: "-75px",
                    marginTop: "-130px",
                    zIndex: 20 - i,
                    opacity: slot.op,
                    filter: slot.blur || undefined,
                }}>
            <div className="animate-book-float h-full w-full" style={{
                    "--book-transform": transform,
                    "--book-delay": slot.delay,
                } as React.CSSProperties}>
              <div className="book-3d relative h-full w-full transition-transform duration-500 group-hover/book:scale-110" style={{ transform: "rotateY(0deg)" }}>
                
                <div className="book-3d-face absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm border border-white/25 bg-gradient-to-br from-primary/25 to-primary/5 shadow-2xl">
                  {book.coverUrl ? (<Image src={book.coverUrl} alt={book.title} fill sizes="186px" className="object-cover" unoptimized priority={i === 2}/>) : (<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-3 text-center">
                      <BookOpen className="h-7 w-7 text-primary/60"/>
                      <span className="line-clamp-3 font-serif text-[11px] font-semibold text-primary/80">
                        {book.title}
                      </span>
                    </div>)}
                  
                  <span className="pointer-events-none absolute inset-y-0 start-0 w-1/3 bg-gradient-to-r from-white/25 to-transparent"/>
                </div>

                
                <div className="book-3d-spine absolute inset-y-0 start-0 w-3 bg-gradient-to-r from-black/45 via-black/25 to-black/10"/>

                
                {book.discountPct > 0 && (<span className="absolute -top-2 end-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                    -{book.discountPct}%
                  </span>)}

                
                <span className="book-reflection absolute -bottom-6 start-1/2 h-6 w-[120%] -translate-x-1/2 opacity-60"/>
              </div>
            </div>
          </Link>);
        })}
      </div>

      
      <div className="absolute inset-x-0 -bottom-1 flex justify-center sm:-bottom-3">
        <p className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur">
          {formatPrice(picked[0].price, currency, locale)}
          {picked[0].oldPrice ? (<span className="ms-2 text-primary-foreground/60 line-through">
              {formatPrice(picked[0].oldPrice, currency, locale)}
            </span>) : null}
          <span className="ms-2 text-primary-foreground/70">{t("home.heroBadge")}</span>
        </p>
      </div>
    </div>);
}
