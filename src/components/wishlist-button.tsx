"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export function WishlistButton() {
    const { t, locale } = useI18n();
    const items = useWishlist((s) => s.items);
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return (<Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" asChild>
      <Link href={`/${locale}/wishlist`} aria-label={t("nav.wishlist")}>
        <Heart className="h-[1.1rem] w-[1.1rem]"/>
        {mounted && items.length > 0 && (<span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
            {items.length > 9 ? "9+" : items.length}
          </span>)}
      </Link>
    </Button>);
}
