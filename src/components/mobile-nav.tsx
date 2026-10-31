"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Star, Clock, Tag, LayoutGrid, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/lib/nav-data";
export function MobileNav() {
    const { t, locale } = useI18n();
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => setOpen(false), [pathname]);
    const main: { href: string; label: string; icon: LucideIcon }[] = [
        { href: `/${locale}`, label: t("nav.home"), icon: Home },
        { href: `/${locale}/books`, label: t("nav.explore"), icon: LayoutGrid },
        { href: `/${locale}/best-sellers`, label: t("nav.bestSellers"), icon: Star },
        { href: `/${locale}/new-releases`, label: t("nav.newReleases"), icon: Clock },
        { href: `/${locale}/offers`, label: t("nav.offers"), icon: Tag },
    ];
    return (<Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full lg:hidden" aria-label={t("nav.menu")}>
          <Menu className="h-[1.1rem] w-[1.1rem]"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 border-s p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="font-serif text-lg text-primary">BORDERS</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-140px)] overflow-y-auto px-3 py-3">
          <div className="flex flex-col gap-1">
            {main.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (<Link key={l.href} href={l.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent"}`}>
                  <Icon className="h-4 w-4 text-primary"/>
                  {l.label}
                </Link>);
        })}
          </div>

          <div className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("nav.allCategories")}
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {CATEGORIES.map((c) => (<Link key={c.slug} href={`/${locale}/categories/${c.slug}`} className="rounded-xl px-3 py-2 text-sm transition-colors hover:bg-accent">
                {c.name}
              </Link>))}
          </div>

          <div className="mt-4 border-t px-3 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("nav.wishlist")}</span>
              <Link href={`/${locale}/wishlist`} className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-accent">
                <Heart className="h-[1.1rem] w-[1.1rem]"/>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("nav.theme")}</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t("nav.language")}</span>
              <LocaleSwitcher current={locale}/>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>);
}
