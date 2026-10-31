# هوية متجر ركن كتب (Rukn Books)

## المصدر
هذا المتجر مبني على تصميم متجر "Border Website" الأصلي الموجود في:
`Z:\unfinished projects\borderbookstore\BorderWebsite\BorderWebsite`
لم يتم تعديل أو حذف أو المس بأي شيء من المتجر الأصلي؛ تم نسخ تصميمه وصوره وكل تفاصيله إلى هذا المجلد الجديد فقط.

## الملفات المأخوذة من زكية ruknbooks
تم أخذ الملفات التالية من `Z:\unfinished projects\ruknbooks` واستخدامها في المتجر الجديد:
- `logo.jpg` → `public/logo.jpg` (شعار المتجر الجديد)
- `favicon.ico` → `public/favicon.ico` (أيقونة المتصفح الجديدة)
- `معلومات.txt` → المرجع للمعلومات النصية أدناه (موجودة في المسار المصدر)

## المعلومات من ملف معلومات.txt
- الشعار / التاجلين: "CUZ EVERY BOOK NEEDS A CORNER" (لأن كل كتاب يحتاج ركناً)
- اللغات: English, French, Arabic (نسخ عالية الجودة)
- التوصيل: across all Algeria (جميع ولايات الجزائر)
- الطلب: DM to order! (اطلب عبر الرسائل الخاصة)
- إنستغرام: https://www.instagram.com/ruknbooks/
- ثريدز: https://www.threads.com/@ruknbooks?xmt=AQG0Gd6biyiMgcdde0Wk5hULwvrJ5BRpRdmbU3Ocvpe1JRg

## نسق الألوان والهوية (مستخلص من اللوغو)
الألوان الأساسية المستخرجة مباشرة من شعار "ركن الكتب":

| اللون | الرمز الستّي | oklch | الاستخدام |
|------|-------------|-------|-----------|
| Dark Slate / Charcoal | #1E252B | oklch(0.26 0.015 276) | الخطوط الأساسية، تفاصيل الكتب، اسم البراند (RUKN BOOKS) |
| Cream / Warm Off-White | #F2EFE9 | oklch(0.95 0.007 237) | الخلفية العامة (ورق دافئ يشبه صفحات الكتب القديمة) |
| Warm Gray / Taupe (فاتح) | #8C8275 | oklch(0.61 0.011 120) | الظلال وتعبئة صفحات الكتب في الأيقونة |
| Warm Gray / Taupe (داكن) | #6B6155 | oklch(0.49 0.012 115) | التفاصيل الداكنة والتباين ثلاثي الأبعاد |
| ذهبي accent | — | oklch(0.80 0.16 70) | لمسات ذهبية للأغلفة والعناصر البارزة |

التطبيق في الكود (`src/app/globals.css`):
- الوضع الفاتح: backgroun=كريمي، foreground=داكن سلتي، primary=داكن سلتي
- الوضع الليلي: معكوس — خلفية داكنة سلتي، نصوص كريمية

ملاحظة: يمكن ضبط الدرجات بدقة أكبر بعد الاطلاع على ملف `logo.jpg` الفعلي.

## الشبكات الاجتماعية
- إنستغرام: https://www.instagram.com/ruknbooks/
- ثريدز: https://www.threads.com/@ruknbooks?xmt=AQG0Gd6biyiMgcdde0Wk5hULwvrJ5BRpRdmbU3Ocvpe1JRg
- فيسبوك: https://www.facebook.com/ruknbooks
- تيك توك: https://www.tiktok.com/@ruknbooks

## البيانات للاتصال
- البريد: contact@ruknbooks.com
- الهاتف: +213 555 00 00 00
- العنوان: الجزائر
- العملة: دينار جزائري (DZD)

## هيكل المسارات
- Z:\unfinished projects\ruknbooks\Website\        ← المشروع الجديد (هذا المجلد)
- Z:\unfinished projects\borderbookstore\BorderWebsite\  ← المتجر الأصلي (لم يُمس)
