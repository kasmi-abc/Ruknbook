import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Book, Heart, Sparkles, Rocket, Search, Ghost, Landmark, Globe, User, Brain, Sprout, Briefcase, Atom, Feather, Scale, Moon, Smile, GraduationCap, Baby, Library, } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getAllCategories } from "@/lib/books";
const ICONS: Record<string, LucideIcon> = {
    book: Book, heart: Heart, sparkles: Sparkles, rocket: Rocket, search: Search,
    ghost: Ghost, landmark: Landmark, globe: Globe, user: User, brain: Brain,
    sprout: Sprout, briefcase: Briefcase, atom: Atom, feather: Feather, scale: Scale,
    moon: Moon, smile: Smile, graduation: GraduationCap, baby: Baby, library: Library,
};
export const revalidate = 600;
export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const categories = await getAllCategories().catch(() => []);
    type Cat = Awaited<ReturnType<typeof getAllCategories>>[number];
    const label = (c: Cat) => locale === "ar" ? c.nameAr || c.name : locale === "fr" ? c.nameFr || c.name : c.name;
    return (<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">{dict.home.categories}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dict.home.categoriesSub}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => {
            const Icon = ICONS[c.icon ?? "book"] ?? Book;
            return (<Link key={c.id} href={`/${locale}/categories/${c.slug}`} className="group flex flex-col items-start gap-3 rounded-2xl border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6"/>
              </span>
              <div>
                <h2 className="font-serif text-lg font-semibold">{label(c)}</h2>
                <p className="text-xs text-muted-foreground">
                  {c._count?.books ?? 0} {dict.catalog.results}
                </p>
              </div>
            </Link>);
        })}
      </div>
    </div>);
}
