"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
const LABELS = { en: "English", ar: "العربية", fr: "Français" };
export function LocaleSwitcher({ current }: { current: string }) {
    const pathname = usePathname();
    const router = useRouter();
    function switchTo(next: string) {
        const segments = pathname.split("/");
        segments[1] = next;
        router.push(segments.join("/") || "/");
    }
    return (<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-full px-2.5">
          <Globe className="h-4 w-4"/>
          <span className="hidden text-xs font-medium uppercase sm:inline">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LOCALES.map((loc) => (<DropdownMenuItem key={loc} onClick={() => switchTo(loc)} className={loc === current ? "bg-accent font-semibold" : ""}>
            <span className="flex-1">{LABELS[loc]}</span>
            {loc === current && <span className="text-primary">✓</span>}
          </DropdownMenuItem>))}
      </DropdownMenuContent>
    </DropdownMenu>);
}
