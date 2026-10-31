export const SITE = {
    name: "Rukn Books",
    nameAr: "ركن الكتب",
    tagline: "CUZ EVERY BOOK NEEDS A CORNER",
    taglineAr: "لأن كل كتاب يحتاج ركناً",
    url: "https://ruknbooks.com",
    email: "contact@ruknbooks.com",
    phone: "+213 555 00 00 00",
    address: "Algeria",
    currency: "DZD",
    shippingFee: 400,
    freeShippingThreshold: 8000,
    socials: {
        instagram: "https://www.instagram.com/ruknbooks/",
        facebook: "https://www.facebook.com/ruknbooks",
        tiktok: "https://www.tiktok.com/@ruknbooks",
        threads: "https://www.threads.com/@ruknbooks?xmt=AQG0Gd6biyiMgcdde0Wk5hULwvrJ5BRpRdmbU3Ocvpe1JRg",
    },
} as const;

export type Locale = "en" | "ar" | "fr";

export const LOCALES: Locale[] = ["en", "ar", "fr"];
export const DEFAULT_LOCALE: Locale = "en";

export const FORMAT_MODIFIERS = {
    paperback: 0,
    hardcover: 0.3,
    ebook: -0.4,
} as const;

export const FORMATS: string[] = ["paperback", "hardcover", "ebook"];
export const BOOK_LANGUAGES: string[] = ["English", "French", "Arabic"];

export type CategoryMeta = { name: string; nameAr: string; nameFr: string; icon: string };

export const CATEGORY_MAP: Record<string, CategoryMeta> = {
    "CLASSICS": { name: "Classics", nameAr: "كلاسيكيات", nameFr: "Classiques", icon: "book" },
    "CLASSICS PLAYS": { name: "Classics", nameAr: "كلاسيكيات", nameFr: "Classiques", icon: "book" },
    "CLASSICS ROMANCE": { name: "Romance", nameAr: "رومانسية", nameFr: "Romance", icon: "heart" },
    "ROMANCE": { name: "Romance", nameAr: "رومانسية", nameFr: "Romance", icon: "heart" },
    "FANTASY": { name: "Fantasy", nameAr: "خيال", nameFr: "Fantastique", icon: "sparkles" },
    "FANTASY ROMANTIC": { name: "Fantasy", nameAr: "خيال", nameFr: "Fantastique", icon: "sparkles" },
    "SCIENCE FICTION": { name: "Sci-Fi", nameAr: "خيال علمي", nameFr: "Science-Fiction", icon: "rocket" },
    "THRILLER MYSTERY": { name: "Thriller", nameAr: "إثارة", nameFr: "Thriller", icon: "search" },
    "HORROR": { name: "Horror", nameAr: "رعب", nameFr: "Horreur", icon: "ghost" },
    "HISTORICAL FICTION": { name: "Historical Fiction", nameAr: "رواية تاريخية", nameFr: "Historique", icon: "landmark" },
    "HISTORY": { name: "History", nameAr: "تاريخ", nameFr: "Histoire", icon: "landmark" },
    "CONTEMPORARY": { name: "Contemporary", nameAr: "معاصرة", nameFr: "Contemporain", icon: "globe" },
    "BIOGRAPHY & AUTOBIOGRAPHY": { name: "Biography", nameAr: "سيرة", nameFr: "Biographie", icon: "user" },
    "PHILOSOPHY PSYCHOLOGY": { name: "Philosophy", nameAr: "فلسفة وعلم نفس", nameFr: "Philosophie", icon: "brain" },
    "SELF HELP PSYCHOLOGY": { name: "Self Help", nameAr: "تطوير ذات", nameFr: "Développement", icon: "sprout" },
    "SELF HELP BUSINESS": { name: "Business", nameAr: "أعمال", nameFr: "Business", icon: "briefcase" },
    "BUSINESS": { name: "Business", nameAr: "أعمال", nameFr: "Business", icon: "briefcase" },
    "SCIENCE": { name: "Science", nameAr: "علوم", nameFr: "Sciences", icon: "atom" },
    "POETRY": { name: "Poetry", nameAr: "شعر", nameFr: "Poésie", icon: "feather" },
    "POLITICS": { name: "Politics", nameAr: "سياسة", nameFr: "Politique", icon: "scale" },
    "RELIGION": { name: "Religion", nameAr: "دين", nameFr: "Religion", icon: "moon" },
    "CULTURE": { name: "Culture", nameAr: "ثقافة", nameFr: "Culture", icon: "globe" },
    "HUMOR": { name: "Humor", nameAr: "فكاهة", nameFr: "Humour", icon: "smile" },
    "MANGA": { name: "Manga", nameAr: "مانغا", nameFr: "Manga", icon: "sparkles" },
    "COMICS": { name: "Manga", nameAr: "مانغا", nameFr: "Manga", icon: "sparkles" },
    "LEVELED": { name: "Leveled Readers", nameAr: "قصص مُدرَجة", nameFr: "Lectures guidées", icon: "graduation" },
    "KID'S STORIES": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "KID'S ACTIVITIES": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "KID'S CULTURE": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "KID'S STUDIES": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "KID'S TRANSLATED": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "STUDIES": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "TRANSLATED": { name: "Kids", nameAr: "أطفال", nameFr: "Enfants", icon: "baby" },
    "DICTIONARY": { name: "Reference", nameAr: "مراجع", nameFr: "Référence", icon: "library" },
};

export const CATEGORY_ORDER: string[] = [
    "Classics",
    "Romance",
    "Fantasy",
    "Sci-Fi",
    "Thriller",
    "Horror",
    "Historical Fiction",
    "History",
    "Contemporary",
    "Biography",
    "Philosophy",
    "Self Help",
    "Business",
    "Science",
    "Poetry",
    "Politics",
    "Religion",
    "Culture",
    "Humor",
    "Manga",
    "Leveled Readers",
    "Kids",
    "Reference",
];

export const GIFT_CARD_FEE = 200;
export const GIFT_MESSAGE_MAX_WORDS = 25;
export const GIFT_MESSAGE_MAX_CHARS = 200;

export type Wilaya = { code: string; name: string; nameAr: string };

export const WILAYAS: Wilaya[] = [
    { code: "01", name: "Adrar", nameAr: "أدرار" },
    { code: "02", name: "Chlef", nameAr: "الشلف" },
    { code: "03", name: "Laghouat", nameAr: "الأغواط" },
    { code: "04", name: "Oum El Bouaghi", nameAr: "أم البواقي" },
    { code: "05", name: "Batna", nameAr: "باتنة" },
    { code: "06", name: "Béjaïa", nameAr: "بجاية" },
    { code: "07", name: "Biskra", nameAr: "بسكرة" },
    { code: "08", name: "Béchar", nameAr: "بشار" },
    { code: "09", name: "Blida", nameAr: "البليدة" },
    { code: "10", name: "Bouira", nameAr: "البويرة" },
    { code: "11", name: "Tamanrasset", nameAr: "تمنراست" },
    { code: "12", name: "Tébessa", nameAr: "تبسة" },
    { code: "13", name: "Tlemcen", nameAr: "تلمسان" },
    { code: "14", name: "Tiaret", nameAr: "تيارت" },
    { code: "15", name: "Tizi Ouzou", nameAr: "تيزي وزو" },
    { code: "16", name: "Alger", nameAr: "الجزائر" },
    { code: "17", name: "Djelfa", nameAr: "الجلفة" },
    { code: "18", name: "Jijel", nameAr: "جيجل" },
    { code: "19", name: "Sétif", nameAr: "سطيف" },
    { code: "20", name: "Saïda", nameAr: "سعيدة" },
    { code: "21", name: "Skikda", nameAr: "سكيكدة" },
    { code: "22", name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
    { code: "23", name: "Annaba", nameAr: "عنابة" },
    { code: "24", name: "Guelma", nameAr: "قالمة" },
    { code: "25", name: "Constantine", nameAr: "قسنطينة" },
    { code: "26", name: "Médéa", nameAr: "المدية" },
    { code: "27", name: "Mostaganem", nameAr: "مستغانم" },
    { code: "28", name: "M'Sila", nameAr: "المسيلة" },
    { code: "29", name: "Mascara", nameAr: "معسكر" },
    { code: "30", name: "Ouargla", nameAr: "ورقلة" },
    { code: "31", name: "Oran", nameAr: "وهران" },
    { code: "32", name: "El Bayadh", nameAr: "البيض" },
    { code: "33", name: "Illizi", nameAr: "إليزي" },
    { code: "34", name: "Bordj Bou Arreridj", nameAr: "برج بوعريريج" },
    { code: "35", name: "Boumerdès", nameAr: "بومرداس" },
    { code: "36", name: "El Tarf", nameAr: "الطارف" },
    { code: "37", name: "Tindouf", nameAr: "تندوف" },
    { code: "38", name: "Tissemsilt", nameAr: "تيسمسيلت" },
    { code: "39", name: "El Oued", nameAr: "الوادي" },
    { code: "40", name: "Khenchela", nameAr: "خنشلة" },
    { code: "41", name: "Souk Ahras", nameAr: "سوق أهراس" },
    { code: "42", name: "Tipaza", nameAr: "تيبازة" },
    { code: "43", name: "Mila", nameAr: "ميلة" },
    { code: "44", name: "Aïn Defla", nameAr: "عين الدفلى" },
    { code: "45", name: "Naâma", nameAr: "النعامة" },
    { code: "46", name: "Aïn Témouchent", nameAr: "عين تموشنت" },
    { code: "47", name: "Ghardaïa", nameAr: "غرداية" },
    { code: "48", name: "Relizane", nameAr: "غليزان" },
    { code: "49", name: "Timimoun", nameAr: "تيميمون" },
    { code: "50", name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار" },
    { code: "51", name: "Ouled Djellal", nameAr: "أولاد جلال" },
    { code: "52", name: "Béni Abbès", nameAr: "بني عباس" },
    { code: "53", name: "In Salah", nameAr: "عين صالح" },
    { code: "54", name: "In Guezzam", nameAr: "عين قزام" },
    { code: "55", name: "Touggourt", nameAr: "تقرت" },
    { code: "56", name: "Djanet", nameAr: "جانت" },
    { code: "57", name: "El M'Ghair", nameAr: "المغير" },
    { code: "58", name: "El Meniaa", nameAr: "المنيعة" },
];

export const DESIGNER = {
    name: "K.Haithem",
    instagram: "https://www.instagram.com/abdelkader_haith/",
} as const;
