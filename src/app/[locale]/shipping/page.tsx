"use client";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SITE } from "@/lib/constants";
import { Truck, Clock, MapPin, Package } from "lucide-react";
const CONTENT = {
    en: {
        intro: "We deliver books across all of Algeria, carefully packed and tracked.",
        points: [
            { icon: Truck, title: "Nationwide delivery", text: "We ship to all 58 wilayas in Algeria, from the north to the deep south." },
            { icon: Clock, title: "Fast turnaround", text: "Orders are prepared within 24 hours and typically arrive in 2–4 business days." },
            { icon: Package, title: "Careful packaging", text: "Every book is protected so it reaches you in perfect reading condition." },
            { icon: MapPin, title: "Free shipping over 8,000 DA", text: `Standard shipping is ${SITE.shippingFee} DA. Spend more than ${SITE.freeShippingThreshold} DA and shipping is on us.` },
        ],
        note: "You will receive a tracking number by email and SMS once your order ships. Payment is collected on delivery (cash).",
    },
    ar: {
        intro: "نوصل الكتب إلى جميع أنحاء الجزائر، بتغليف آمن وتتبع للطلب.",
        points: [
            { icon: Truck, title: "توصيل لكل الولايات", text: "نشحن إلى جميع الولايات الـ58 في الجزائر، من الشمال إلى الجنوب العميق." },
            { icon: Clock, title: "تجهيز سريع", text: "تُجهَّز الطلبات خلال 24 ساعة وتصل عادة خلال 2–4 أيام عمل." },
            { icon: Package, title: "تغليف محكم", text: "كل كتاب محمي ليصلك بحالة مثالية للقراءة." },
            { icon: MapPin, title: "شحن مجاني فوق 8,000 دج", text: `الشحن العادي ${SITE.shippingFee} دج. اتجاوز ${SITE.freeShippingThreshold} دج ويصبح الشحن مجانياً.` },
        ],
        note: "تصلك رقم تتبع عبر البريد والرسائل النصية عند شحن الطلب. الدفع عند الاستلام نقداً.",
    },
    fr: {
        intro: "Nous livrons des livres partout en Algérie, soigneusement emballés et suivis.",
        points: [
            { icon: Truck, title: "Livraison nationale", text: "Nous livrons dans les 58 wilayas, du nord au grand sud." },
            { icon: Clock, title: "Traitement rapide", text: "Les commandes sont préparées sous 24 heures et arrivent en 2 à 4 jours ouvrés." },
            { icon: Package, title: "Emballage soigné", text: "Chaque livre est protégé pour arriver en parfait état." },
            { icon: MapPin, title: "Livraison gratuite dès 8 000 DA", text: `La livraison standard coûte ${SITE.shippingFee} DA. Au-delà de ${SITE.freeShippingThreshold} DA, elle est offerte.` },
        ],
        note: "Vous recevrez un numéro de suivi par e-mail et SMS à l'expédition. Paiement à la livraison en espèces.",
    },
};
export default function ShippingPage() {
    const { t, locale } = useI18n();
    const c = CONTENT[locale] ?? CONTENT.en;
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.shippingTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.shippingTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{c.intro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {c.points.map((p) => {
            const Icon = p.icon;
            return (<div key={p.title} className="rounded-2xl border bg-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5"/>
              </span>
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
            </div>);
        })}
      </div>
      <p className="mt-8 rounded-2xl border bg-primary/5 p-4 text-sm text-muted-foreground">{c.note}</p>
    </div>);
}
