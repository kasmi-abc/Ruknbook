"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { User, Package, LogOut, Heart, LayoutDashboard, Loader2 } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
export function UserButton({ session: sessionProp }: { session?: Session | null }) {
    const { t, locale } = useI18n();
    const { data: clientSession, status } = useSession();
    const session = sessionProp ?? clientSession;
    if (status === "loading") {
        return (<span className="flex h-9 w-9 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground"/>
      </span>);
    }
    if (!session?.user) {
        return (<Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-full px-3" asChild>
        <Link href={`/${locale}/login`}>
          <User className="h-4 w-4"/>
          <span className="text-xs font-medium">{t("nav.login")}</span>
        </Link>
      </Button>);
    }
    const isAdmin = session.user.role === "ADMIN";
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label={t("nav.account")}>
          <User className="h-[1.1rem] w-[1.1rem]"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {session.user.name || session.user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/account`}>
            <Package className="h-4 w-4"/> {t("account.myOrders")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/wishlist`}>
            <Heart className="h-4 w-4"/> {t("nav.wishlist")}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (<>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/admin`}>
                <LayoutDashboard className="h-4 w-4"/> {t("nav.admin")}
              </Link>
            </DropdownMenuItem>
          </>)}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: `/${locale}` })}>
          <LogOut className="h-4 w-4"/> {t("nav.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
}
