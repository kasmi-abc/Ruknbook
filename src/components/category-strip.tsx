"use client";
import * as React from "react";
import Link from "next/link";
import {
    Book, Heart, Sparkles, Rocket, Search, Ghost, Landmark, Globe, User, Brain,
    Sprout, Briefcase, Atom, Feather, Scale, Moon, Smile, GraduationCap, Baby, Library,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { CATEGORY_MAP, CATEGORY_ORDER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
const ICONS: Record<string, LucideIcon> = {
    book: Book, heart: Heart, sparkles: Sparkles, rocket: Rocket, search: Search,
    ghost: Ghost, landmark: Landmark, globe: Globe, user: User, brain: Brain,
    sprout: Sprout, briefcase: Briefcase, atom: Atom, feather: Feather, scale: Scale,
    moon: Moon, smile: Smile, graduation: GraduationCap, baby: Baby, library: Library,
};
const INITIAL_VISIBLE = 10;
const DESKTOP_INITIAL_VISIBLE = 16;
const slug = (name: string) => name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
type CatMeta = { nameAr: string; nameFr: string; icon: string };
const META_BY_NAME = Object.values(CATEGORY_MAP).reduce<Record<string, CatMeta>>((acc, c) => {
    if (!acc[c.name])
        acc[c.name] = { nameAr: c.nameAr, nameFr: c.nameFr, icon: c.icon };
    return acc;
}, {});
export function CategoryStrip() {
    const { t, locale } = useI18n();
    const [expanded, setExpanded] = React.useState(false);
    const cats = CATEGORY_ORDER.filter((name) => META_BY_NAME[name]);
    const hiddenCount = Math.max(0, cats.length - INITIAL_VISIBLE);
    const labelFor = (name: string) => {
        const meta = META_BY_NAME[name];
        if (meta && locale === "ar")
            return meta.nameAr;
        if (meta && locale === "fr")
            return meta.nameFr;
        return name;
    };
    return (<section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold sm:text-3xl">{t("home.categories")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.categoriesSub")}</p>
        </div>
        <Link href={`/${locale}/categories`} className="shrink-0 text-sm font-medium text-primary hover:underline">
          {t("home.viewAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {cats.map((name, i) => {
            const Icon = ICONS[META_BY_NAME[name].icon] ?? Book;
            const base = "group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md";
            let cls = base;
            if (!expanded) {
                if (i >= DESKTOP_INITIAL_VISIBLE)
                    cls = `${base} hidden`;
                else if (i >= INITIAL_VISIBLE)
                    cls = `${base} hidden sm:flex`;
            }
            return (<Link key={name} href={`/${locale}/categories/${slug(name)}`} className={cls}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5"/>
              </span>
              <span className="text-center text-xs font-medium leading-tight">{labelFor(name)}</span>
            </Link>);
        })}
      </div>

      {hiddenCount > 0 && (<div className="mt-6 flex justify-center">
          <Button variant="outline" className="rounded-full" onClick={() => setExpanded((v) => !v)}>
            {expanded ? t("home.showFewerCategories") : `${t("home.showAllCategories")} (${hiddenCount})`}
          </Button>
        </div>)}
    </section>);
}
