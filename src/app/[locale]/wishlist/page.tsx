"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag, BookOpen, Share2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
export default function WishlistPage() {
    const { t, locale } = useI18n();
    const { items, remove, clear } = useWishlist();
    const addToCart = useCart((s) => s.add);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    async function share() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success(t("wishlist.copied"));
        }
        catch {
        }
    }
    if (!mounted)
        return <div className="mx-auto max-w-5xl px-4 py-16"/>;
    if (items.length === 0) {
        return (<div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={Heart} title={t("wishlist.empty")} description={t("wishlist.emptySub")} action={<Button asChild>
              <Link href={`/${locale}/books`}>{t("cart.continueShopping")}</Link>
            </Button>}/>
      </div>);
    }
    return (<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold">
          {t("wishlist.title")}{" "}
          <span className="text-base font-normal text-muted-foreground">({items.length})</span>
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={share}>
            <Share2 className="h-4 w-4"/> {t("wishlist.shareTitle")}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clear}>
            <Trash2 className="h-4 w-4"/> {t("cart.clearCart")}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((l) => (<div key={l.bookId} className="flex gap-4 rounded-2xl border bg-card p-4">
            <Link href={`/${locale}/books/${l.slug}`} className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              {l.coverUrl ? (<Image src={l.coverUrl} alt={l.title} fill sizes="64px" className="object-cover" unoptimized/>) : (<BookOpen className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground"/>)}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/${locale}/books/${l.slug}`} className="line-clamp-1 font-medium hover:text-primary">
                {l.title}
              </Link>
              <p className="line-clamp-1 text-sm text-muted-foreground">{l.author}</p>
              <p className="mt-1 font-semibold text-primary">
                {formatPrice(l.price, t("common.currency"), locale)}
              </p>
            </div>
            <div className="flex flex-col items-end justify-between gap-2">
              <button onClick={() => remove(l.bookId)} className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive" aria-label={t("cart.remove")}>
                <Trash2 className="h-4 w-4"/>
              </button>
              <Button size="sm" onClick={() => {
                addToCart({
                    bookId: l.bookId,
                    slug: l.slug,
                    title: l.title,
                    author: l.author,
                    coverUrl: l.coverUrl,
                    price: l.price,
                    format: "paperback",
                });
                toast.success(t("book.addToCart"));
            }}>
                <ShoppingBag className="h-4 w-4"/> {t("wishlist.moveToCart")}
              </Button>
            </div>
          </div>))}
      </div>
    </div>);
}
