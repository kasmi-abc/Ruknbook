"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { CartButton } from "@/components/cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { SearchButton } from "@/components/search-button";
import { UserButton } from "@/components/user-button";
import { MobileNav } from "@/components/mobile-nav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { CATEGORIES } from "@/lib/nav-data";
export function Navbar() {
    const { t, dir } = useI18n();
    const pathname = usePathname();
    const [open, setOpen] = React.useState(false);
    const locale = pathname.split("/")[1] || "en";
    React.useEffect(() => setOpen(false), [pathname]);
    const links = [
        { href: `/${locale}`, label: t("nav.home") },
        { href: `/${locale}/best-sellers`, label: t("nav.bestSellers") },
        { href: `/${locale}/new-releases`, label: t("nav.newReleases") },
        { href: `/${locale}/offers`, label: t("nav.offers") },
    ];
    return (<header className="sticky top-0 z-40 w-full px-3 py-3 sm:px-6" data-site-header data-no-print>
      <nav className={cn("mx-auto flex max-w-7xl items-center gap-2 rounded-full border bg-background/70 px-3 py-2 shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-background/60", "transition-all")}>
        
        <Link href={`/${locale}`} className="flex shrink-0 items-center gap-2 ps-1">
          <span className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-primary/20">
            <Image src="/logo.jpg" alt="Rukn Books" fill sizes="36px" className="object-cover" priority/>
          </span>
          <span className="font-serif text-base font-bold tracking-tight text-primary sm:text-lg">
            RUKN
          </span>
        </Link>

        
        <div className="mx-2 hidden items-center gap-1 lg:flex">
          {links.slice(0, 1).map((l) => (<NavLink key={l.href} href={l.href} active={pathname === l.href}>
              {l.label}
            </NavLink>))}

          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn("flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent", pathname.includes("/books") || pathname.includes("/categories") ? "bg-accent text-accent-foreground" : "text-foreground/80")}>
                {t("nav.explore")}
                <ChevronDown className="h-3.5 w-3.5 opacity-60"/>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-80 w-64 overflow-y-auto p-1.5">
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/books`} className="font-semibold">
                  {t("nav.allCategories")}
                </Link>
              </DropdownMenuItem>
              <div className="my-1 h-px bg-border"/>
              {CATEGORIES.map((c) => (<DropdownMenuItem key={c.slug} asChild>
                  <Link href={`/${locale}/categories/${c.slug}`} className="block">
                    {c.name}
                  </Link>
                </DropdownMenuItem>))}
            </DropdownMenuContent>
          </DropdownMenu>

          {links.slice(1).map((l) => (<NavLink key={l.href} href={l.href} active={pathname === l.href}>
              {l.label}
            </NavLink>))}
        </div>

        
        <div className="ms-auto flex items-center gap-0.5">
          <SearchButton />
          <CartButton />
          <WishlistButton />
          <div className="hidden sm:block">
            <LocaleSwitcher current={locale}/>
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden md:block">
            <UserButton />
          </div>
          <div className="lg:hidden">
            <MobileNav />
          </div>
        </div>
      </nav>
    </header>);
}
function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (<Link href={href} className={cn("rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent", active ? "bg-accent text-accent-foreground" : "text-foreground/80")}>
      {children}
    </Link>);
}
