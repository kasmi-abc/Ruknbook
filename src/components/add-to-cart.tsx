"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Minus, Plus, Zap } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { BookCard as BookCardData } from "@/lib/types";

export function AddToCart({
  book,
  format,
  price,
  outOfStock,
}: {
  book: BookCardData;
  format: string;
  price: number;
  outOfStock: boolean;
}) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishItems = useWishlist((s) => s.items);
  const inWish = wishItems.some((i) => i.bookId === book.id);
  const [qty, setQty] = React.useState(1);
  function addToCart(quantity = qty) {
    add(
      {
        bookId: book.id,
        slug: book.slug,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        price,
        format,
      },
      quantity
    );
  }
  function onAddToCart() {
    addToCart();
    toast.success(t("book.addToCart"));
  }
  function onBuyNow() {
    addToCart();
    router.push(`/${locale}/checkout`);
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Decrease"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Increase"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">{t("book.qty")}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" className="min-w-0 flex-1" onClick={onAddToCart} disabled={outOfStock}>
          <ShoppingBag className="h-4 w-4 shrink-0" />
          <span className="truncate">{outOfStock ? t("book.outOfStock") : t("book.addToCart")}</span>
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="min-w-0 flex-1"
          onClick={onBuyNow}
          disabled={outOfStock}
        >
          <Zap className="h-4 w-4 shrink-0" />
          <span className="truncate">{t("book.buyNow")}</span>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className={cn("w-12 shrink-0", inWish && "text-gold")}
          aria-label={t("book.addToWishlist")}
          onClick={() => {
            toggleWish({
              bookId: book.id,
              slug: book.slug,
              title: book.title,
              author: book.author,
              coverUrl: book.coverUrl,
              price,
              rating: book.rating ?? 0,
            });
            toast.success(inWish ? t("book.addToWishlist") : t("wishlist.title"));
          }}
        >
          <Heart className={cn("h-5 w-5", inWish && "fill-gold")} />
        </Button>
      </div>
    </div>
  );
}
