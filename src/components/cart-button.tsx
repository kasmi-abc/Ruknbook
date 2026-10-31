"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart, cartCount } from "@/store/cart";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
export function CartButton() {
    const { t, locale } = useI18n();
    const lines = useCart((s) => s.lines);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const count = mounted ? cartCount(lines) : 0;
    return (<Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full" asChild>
      <Link href={`/${locale}/cart`} aria-label={t("nav.cart")}>
        <ShoppingBag className="h-[1.1rem] w-[1.1rem]"/>
        {mounted && count > 0 && (<span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>)}
      </Link>
    </Button>);
}
