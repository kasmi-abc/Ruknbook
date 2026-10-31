"use client";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
const CONTENT = {
    en: {
        intro: "By using Rukn Books you agree to these terms.",
        sections: [
            { h: "1. Use of the site", p: "You agree to use this website for lawful purposes only and in a way that does not infringe the rights of others." },
            { h: "2. Orders & pricing", p: "All prices are listed in Algerian Dinars (DA). We reserve the right to correct pricing errors and to cancel orders affected by such errors." },
            { h: "3. Payment", p: "Payment is collected in cash upon delivery. Ownership of goods transfers once payment is received." },
            { h: "4. Delivery", p: "Estimated delivery times are indicative. We are not responsible for delays caused by carriers or force majeure." },
            { h: "5. Intellectual property", p: "All content on this site, including logos and text, belongs to Rukn Books and may not be used without permission." },
            { h: "6. Contact", p: "Questions about these terms can be sent via our contact page." },
        ],
    },
    ar: {
        intro: "باستخدامك متجر بوردرز فإنك توافق على هذه الشروط.",
        sections: [
            { h: "1. استخدام الموقع", p: "توافق على استخدام هذا الموقع لأغراض قانونية فقط وبشكل لا ينتهك حقوق الآخرين." },
            { h: "2. الطلبات والأسعار", p: "جميع الأسعار بالدينار الجزائري (دج). نحتفظ بحق تصحيح أخطاء التسعير وإلغاء الطلبات المتأثرة بها." },
            { h: "3. الدفع", p: "يُحصَّل الدفع نقداً عند الاستلام. تنتقل ملكية البضائع عند استلام المبلغ." },
            { h: "4. التوصيل", p: "أوقات التوصيل تقديرية. لسنا مسؤولين عن التأخيرات الناجمة عن شركات الشحن أو القوة القاهرة." },
            { h: "5. الملكية الفكرية", p: "كل محتوى هذا الموقع، بما في ذلك الشعار والنصوص، ملك لمكتبة بوردرز ولا يجوز استخدامه دون إذن." },
            { h: "6. التواصل", p: "يمكن إرسال أي استفسار حول هذه الشروط عبر صفحة الاتصال." },
        ],
    },
    fr: {
        intro: "En utilisant Rukn Books, vous acceptez ces conditions.",
        sections: [
            { h: "1. Utilisation du site", p: "Vous vous engagez à utiliser ce site à des fins légales uniquement et sans porter atteinte aux droits d'autrui." },
            { h: "2. Commandes et prix", p: "Les prix sont en dinars algériens (DA). Nous nous réservons le droit de corriger les erreurs de prix." },
            { h: "3. Paiement", p: "Le paiement est en espèces à la livraison. Le transfert de propriété intervient à réception du paiement." },
            { h: "4. Livraison", p: "Les délais sont indicatifs. Nous ne sommes pas responsables des retards imputables aux transporteurs." },
            { h: "5. Propriété intellectuelle", p: "Tout le contenu du site appartient à Rukn Books." },
            { h: "6. Contact", p: "Toute question sur ces conditions peut être envoyée via la page de contact." },
        ],
    },
};
export default function TermsPage() {
    const { t, locale } = useI18n();
    const c = CONTENT[locale] ?? CONTENT.en;
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.termsTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.termsTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{c.intro}</p>
      <div className="mt-8 space-y-5">
        {c.sections.map((s) => (<div key={s.h}>
            <h2 className="font-serif text-lg font-semibold">{s.h}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </div>))}
      </div>
    </div>);
}
