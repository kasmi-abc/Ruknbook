"use client";
import { useI18n } from "@/components/i18n-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
const CONTENT = {
    en: {
        intro: "Your privacy is important to us. Here is how we handle your data.",
        sections: [
            { h: "1. What we collect", p: "We collect the information you provide when placing an order or creating an account: name, email, phone and delivery address." },
            { h: "2. How we use it", p: "We use this data only to process and deliver your orders, provide support, and (if you opt in) send you our newsletter." },
            { h: "3. Payments", p: "We do not store any card or banking details. Payment is made in cash on delivery." },
            { h: "4. Sharing", p: "We share your delivery details only with the carrier fulfilling your order. We never sell your personal data." },
            { h: "5. Cookies", p: "We use essential cookies to keep your cart and preferences working. You can clear them at any time via your browser." },
            { h: "6. Your rights", p: "You can request access to, correction of, or deletion of your personal data at any time by contacting us." },
        ],
    },
    ar: {
        intro: "خصوصيتكم مهمة لدينا. إليكم كيف نتعامل مع بياناتكم.",
        sections: [
            { h: "1. ماذا نجمع", p: "نجمع المعلومات التي تقدمها عند الطلب أو إنشاء الحساب: الاسم والبريد والهاتف وعنوان التوصيل." },
            { h: "2. كيف نستخدمها", p: "نستخدم هذه البيانات لمعالجة وتسليم طلباتكم وتقديم الدعم، و (بموافقتم) لإرسال النشرة البريدية." },
            { h: "3. الدفع", p: "لا نخزّن أي بيانات بطاقات أو بنكية. الدفع نقداً عند الاستلام." },
            { h: "4. المشاركة", p: "نشارك بيانات التوصيل فقط مع شركة الشحن المنفذة لطلبكم. لا نبيع بياناتكم الشخصية أبداً." },
            { h: "5. ملفات الارتباط", p: "نستخدم ملفات ارتباط أساسية لعمل السلة وتفضيلاتكم. يمكنكم مسحها في أي وقت من متصفحكم." },
            { h: "6. حقوقكم", p: "يمكنكم طلب الاطلاع على بياناتكم أو تصحيحها أو حذفها في أي وقت بالتواصل معنا." },
        ],
    },
    fr: {
        intro: "Votre vie privée compte. Voici comment nous traitons vos données.",
        sections: [
            { h: "1. Ce que nous collectons", p: "Nous collectons les informations fournies à la commande ou à la création d'un compte : nom, e-mail, téléphone et adresse." },
            { h: "2. Utilisation", p: "Ces données servent uniquement à traiter et livrer vos commandes, assister, et (si vous l'acceptez) envoyer la newsletter." },
            { h: "3. Paiements", p: "Nous ne conservons aucune donnée bancaire. Le paiement se fait en espèces à la livraison." },
            { h: "4. Partage", p: "Vos informations de livraison ne sont partagées qu'avec le transporteur. Nous ne vendons jamais vos données." },
            { h: "5. Cookies", p: "Nous utilisons des cookies essentiels au panier et à vos préférences." },
            { h: "6. Vos droits", p: "Vous pouvez demander l'accès, la correction ou la suppression de vos données à tout moment." },
        ],
    },
};
export default function PrivacyPage() {
    const { t, locale } = useI18n();
    const c = CONTENT[locale] ?? CONTENT.en;
    return (<div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ label: t("nav.home"), href: `/${locale}` }, { label: t("pages.privacyTitle") }]}/>
      <h1 className="mt-4 font-serif text-3xl font-bold sm:text-4xl">{t("pages.privacyTitle")}</h1>
      <p className="mt-3 text-muted-foreground">{c.intro}</p>
      <div className="mt-8 space-y-5">
        {c.sections.map((s) => (<div key={s.h}>
            <h2 className="font-serif text-lg font-semibold">{s.h}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </div>))}
      </div>
    </div>);
}
