import { BookCard } from "@/components/book-card";
import type { BookCard as BookCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BookGrid({
  books,
  className,
  cols = "default",
}: {
  books: BookCardData[];
  className?: string;
  cols?: "default" | "compact";
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5",
        cols === "compact"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}
