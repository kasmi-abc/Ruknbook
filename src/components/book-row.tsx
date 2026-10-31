"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";
import type { BookCard as BookCardData } from "@/lib/types";

export function BookRow({
  title,
  subtitle,
  href,
  books,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  books: BookCardData[];
}) {
  const { t } = useI18n();
  const ref = React.useRef<HTMLDivElement>(null);
  function scroll(dir: number) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }
  if (!books.length) return null;
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="hidden text-sm font-medium text-primary hover:underline sm:block"
            >
              {t("home.viewAll")}
            </Link>
          )}
          <div className="hidden gap-1 sm:flex">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {books.map((b) => (
          <div key={b.id} className="w-40 shrink-0 snap-start sm:w-48">
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </section>
  );
}
