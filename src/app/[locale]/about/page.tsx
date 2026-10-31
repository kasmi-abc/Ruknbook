import { getDictionary } from "@/lib/i18n";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookOpen, Heart, Truck, Shield } from "lucide-react";
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const dict = getDictionary(locale);
    const values = [
        { icon: BookOpen, title: "Curated selection", desc: "Every title is hand-picked by our booksellers across 20+ categories." },
        { icon: Heart, title: "For readers", desc: "From timeless classics to the latest best sellers and kids' favourites." },
        { icon: Truck, title: "Fast delivery", desc: "We deliver to all 58 wilayas of Algeria, usually within 2â€“4 days." },
        { icon: Shield, title: "Trusted shop", desc: "Cash on delivery, easy returns and real human support." },
    ];
    return (<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: dict.nav.home, href: `/${locale}` }, { label: dict.pages.aboutTitle }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{dict.pages.aboutTitle}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{dict.footer.aboutText}</p>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{dict.home.heroSubtitle}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {values.map((v) => {
            const Icon = v.icon;
            return (<div key={v.title} className="rounded-2xl border bg-card p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5"/>
              </span>
              <h3 className="mt-3 font-serif text-lg font-semibold">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
            </div>);
        })}
      </div>

      <div className="mt-10 rounded-2xl border bg-card p-6">
        <h2 className="font-serif text-lg font-bold">{dict.footer.contactTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {SITE.email} Â· {SITE.phone} Â· {SITE.address}
        </p>
        <div className="mt-4 flex gap-3">
          {Object.entries(SITE.socials).map(([k, href]) => (<a key={k} href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium capitalize text-primary hover:underline">
              {k}
            </a>))}
        </div>
      </div>
    </div>);
}
