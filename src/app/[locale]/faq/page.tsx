"use client";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ChevronDown } from "lucide-react";
const FAQS_EN = [
    { q: "How long does delivery take?", a: "Orders are typically delivered within 2–4 business days across Algeria. Major cities like Algiers, Oran and Constantine often receive orders in 48 hours." },
    { q: "What are the shipping fees?", a: "Shipping costs 400 DA nationwide. Orders above 8,000 DA enjoy free shipping." },
    { q: "Can I pay on delivery?", a: "Yes. We operate on a cash-on-delivery basis — you pay when your books arrive at your door." },
    { q: "Do you ship to all wilayas?", a: "Yes, we deliver to all 58 wilayas in Algeria." },
    { q: "Can I return a book?", a: "You can return or exchange a book within 7 days of delivery if it is in its original condition. Contact us to arrange a pickup." },
    { q: "Do you have English and French books?", a: "Yes, our catalogue is primarily in English and French, spanning classics, fantasy, philosophy, kids' books and more." },
];
const FAQS_AR = [
    { q: "كم تستغرق مدة التوصيل؟", a: "تُسلَّم الطلبات عادة خلال 2–4 أيام عمل في جميع أنحاء الجزائر. المدن الكبرى مثل الجزائر ووهران وقسنطينة غالباً خلال 48 ساعة." },
    { q: "ما هي رسوم الشحن؟", a: "تكلفة الشحن 400 دج داخل الجزائر. الطلبات التي تتجاوز 8,000 دج تتمتع بشحن مجاني." },
    { q: "هل يمكنني الدفع عند الاستلام؟", a: "نعم، نعمل بنظام الدفع عند الاستلام — تدفع نقداً عند وصول كتبك إلى بابك." },
    { q: "هل تشحنون إلى جميع الولايات؟", a: "نعم، نوصّل إلى جميع الولايات الـ58 في الجزائر." },
    { q: "هل يمكنني إرجاع كتاب؟", a: "يمكنك إرجاع أو استبدال كتاب خلال 7 أيام من الاستلام إذا كان بحالته الأصلية. تواصل معنا لترتيب الاستلام." },
    { q: "هل لديكم كتب بالإنجليزية والفرنسية؟", a: "نعم، كتالوجنا يضم كتباً بالإنجليزية والفرنسية تشمل الكلاسيكيات والخيال والفلسفة وكتب الأطفال وغيرها." },
];
const FAQS_FR = [
    { q: "Quel est le délai de livraison ?", a: "Les commandes sont livrées sous 2 à 4 jours ouvrés partout en Algérie. Les grandes villes reçoivent souvent en 48 heures." },
    { q: "Quels sont les frais de livraison ?", a: "La livraison coûte 400 DA partout en Algérie. Les commandes au-dessus de 8 000 DA bénéficient de la livraison gratuite." },
    { q: "Puis-je payer à la livraison ?", a: "Oui. Nous fonctionnons en paiement à la livraison — vous payez à la réception de vos livres." },
    { q: "Livrez-vous dans toutes les wilayas ?", a: "Oui, nous livrons dans les 58 wilayas d'Algérie." },
    { q: "Puis-je retourner un livre ?", a: "Vous pouvez retourner ou échanger un livre sous 7 jours s'il est en état d'origine. Contactez-nous pour organiser l'enlèvement." },
    { q: "Avez-vous des livres en anglais et en français ?", a: "Oui, notre catalogue est principalement en anglais et en français : classiques, fantasy, philosophie, jeunesse et plus." },
];
export default function FaqPage() {
    const { t, locale } = useI18n();
    const faqs = locale === "ar" ? FAQS_AR : locale === "fr" ? FAQS_FR : FAQS_EN;
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.faqTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.faqTitle")}</h1>
      <div className="mt-8 divide-y rounded-2xl border">
        {faqs.map((f, i) => (<details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"/>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </details>))}
      </div>
    </div>);
}
