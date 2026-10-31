"use client";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
const CONTENT = {
    en: {
        intro: "Your satisfaction matters. Here is our return & exchange policy.",
        sections: [
            { h: "7-day window", p: "You can request a return or exchange within 7 days of receiving your order." },
            { h: "Original condition", p: "Books must be unused and in their original packaging to be eligible for a return or exchange." },
            { h: "Damaged or wrong item", p: "If your book arrives damaged or you received the wrong title, contact us and we will arrange a free replacement or pickup." },
            { h: "How to start", p: "Reach out via the contact page or call us with your order number. Our team will guide you through the pickup and exchange process." },
            { h: "Refunds", p: "For cash-on-delivery orders, exchanges are processed on the spot or via a replacement order. Contact us for any special case." },
        ],
    },
    ar: {
        intro: "رضاكم أولويتنا. إليكم سياسة الإرجاع والاستبدال.",
        sections: [
            { h: "مدة 7 أيام", p: "يمكنك طلب الإرجاع أو الاستبدال خلال 7 أيام من استلام طلبك." },
            { h: "الحالة الأصلية", p: "يجب أن تكون الكتب غير مستعملة وبتغليفها الأصلي لتكون مؤهلة للإرجاع أو الاستبدال." },
            { h: "تالف أو خاطئ", p: "إذا وصل الكتاب متضرراً أو استلمت عنواناً خاطئاً، تواصل معنا وسنرتب استبدالاً مجانياً أو استلاماً." },
            { h: "كيف تبدأ", p: "تواصل عبر صفحة الاتصال أو اتصل بنا برقم طلبك. سيرشدك فريقنا خلال عملية الاستلام والاستبدال." },
            { h: "المبالغ", p: "لطلبات الدفع عند الاستلام، تتم الاستبدالات في الحال أو عبر طلب جديد. تواصل معنا لأي حالة خاصة." },
        ],
    },
    fr: {
        intro: "Votre satisfaction compte. Voici notre politique de retour et d'échange.",
        sections: [
            { h: "Délai de 7 jours", p: "Vous pouvez demander un retour ou un échange sous 7 jours après réception de votre commande." },
            { h: "État d'origine", p: "Les livres doivent être non utilisés et dans leur emballage d'origine pour être éligibles." },
            { h: "Article endommagé ou incorrect", p: "Si un livre arrive abîmé ou si vous avez reçu le mauvais titre, contactez-nous pour un remplacement gratuit." },
            { h: "Comment commencer", p: "Contactez-nous via la page de contact ou par téléphone avec votre numéro de commande." },
            { h: "Remboursements", p: "Pour les commandes à la livraison, les échanges se font sur place ou via une nouvelle commande." },
        ],
    },
};
export default function ReturnsPage() {
    const { t, locale } = useI18n();
    const c = CONTENT[locale] ?? CONTENT.en;
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.returnsTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.returnsTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{c.intro}</p>
      <div className="mt-8 space-y-6">
        {c.sections.map((s) => (<div key={s.h} className="rounded-2xl border bg-card p-5">
            <h2 className="font-serif text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </div>))}
      </div>
    </div>);
}
