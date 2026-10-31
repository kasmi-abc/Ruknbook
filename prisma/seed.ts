import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { CATEGORY_MAP, CATEGORY_ORDER } from "../src/lib/constants";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

const RAW = path.join(__dirname, "..", "..", "books_raw.json");

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickDesc(title: string, author: string, category: string) {
  const templates = [
    `A compelling ${category.toLowerCase()} title, "${title}" by ${author} is a must-read that has captivated readers worldwide. Order your copy from Rukn Books with fast delivery across Algeria.`,
    `"${title}" is a standout ${category.toLowerCase()} work from ${author}. Discover why readers keep coming back to this title â€” available now at Rukn Books.`,
    `Dive into "${title}" by ${author}. A celebrated ${category.toLowerCase()} book, hand-picked by our booksellers and ready to ship to your door.`,
  ];
  return templates[hash(title + author) % templates.length];
}

function pickExcerpt(title: string, author: string) {
  return `Open the first pages of "${title}" and you'll immediately understand why ${author} has earned a devoted readership. This sample gives you a taste of the prose, pacing and voice that make this book worth owning on your shelf at Rukn Books.`;
}

async function fetchCover(title: string, author: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(`title:${title} author:${author}`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=1&fields=cover_i`, {
      signal: controller.signal,
      headers: { "User-Agent": "RuknBooks/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = (await res.json()) as { docs?: { cover_i?: number }[] };
    const coverId = data?.docs?.[0]?.cover_i;
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  } catch {
    return null;
  }
}

async function pooled<T, R>(items: T[], size: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return results;
}

async function main() {
  console.log("Reading book dataâ€¦");
  if (!fs.existsSync(RAW)) {
    throw new Error(`Missing ${RAW}. Run extract_books.py first.`);
  }
  const raw = JSON.parse(fs.readFileSync(RAW, "utf-8")) as {
    books: { category: string; author: string; title: string; price: number }[];
  };

  console.log("Seeding categoriesâ€¦");
  const nameToSlug = new Map<string, string>();
  const catRecords: { name: string; slug: string; nameAr: string; nameFr: string; icon: string }[] = [];
  for (const name of CATEGORY_ORDER) {
    const meta = Object.values(CATEGORY_MAP).find((m) => m.name === name);
    if (!meta) continue;
    const slug = slugify(name);
    nameToSlug.set(name, slug);
    catRecords.push({ name, slug, nameAr: meta.nameAr, nameFr: meta.nameFr, icon: meta.icon });
  }
  for (const c of catRecords) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { nameAr: c.nameAr, nameFr: c.nameFr, icon: c.icon },
      create: c,
    });
  }
  const categories = await prisma.category.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  console.log("Normalizing booksâ€¦");
  const usedSlugs = new Set<string>();
  const items = raw.books
    .map((b) => {
      const meta = CATEGORY_MAP[b.category] ?? { name: b.category, nameAr: b.category, nameFr: b.category, icon: "book" };
      const catSlug = slugify(meta.name);
      const baseSlug = slugify(`${b.title} ${b.author}`);
      let slug = baseSlug;
      let n = 1;
      while (usedSlugs.has(slug)) slug = `${baseSlug}-${++n}`;
      usedSlugs.add(slug);
      const h = hash(b.title + b.author + b.price);
      return {
        title: b.title,
        author: b.author || "Various",
        price: b.price,
        catSlug,
        slug,
        language: b.category.includes("KID'S") || b.category === "LEVELED" || b.category === "TRANSLATED" ? "English" : "English",
        formats: ["paperback", "hardcover", "ebook"],
        pages: 120 + (h % 500),
        publishYear: 1990 + (h % 35),
        publisher: ["Penguin", "Vintage", "Bloomsbury", "HarperCollins", "Oxford", "Macmillan"][h % 6],
        salesCount: h % 900,
        rating: 3.2 + ((h % 18) / 10),
        discountPct: h % 9 === 0 ? [10, 15, 20, 25][h % 4] : 0,
      };
    })
    .filter((b) => catBySlug.has(b.catSlug));

  console.log(`Prepared ${items.length} books across ${new Set(items.map((i) => i.catSlug)).size} categories.`);

  console.log("Fetching covers from Open Library (this can take a few minutes)â€¦");
  const covers = await pooled(items, 6, async (b) => fetchCover(b.title, b.author));
  const coverCount = covers.filter(Boolean).length;
  console.log(`Found ${coverCount}/${items.length} covers.`);

  console.log("Inserting booksâ€¦");
  const BATCH = 200;
  let inserted = 0;
  for (let i = 0; i < items.length; i += BATCH) {
    const slice = items.slice(i, i + BATCH);
    const data = slice.map((b, j) => {
      const idx = i + j;
      const coverUrl = covers[idx] ?? null;
      const discountPct = b.discountPct;
      const oldPrice = discountPct > 0 ? Math.round(b.price / (1 - discountPct / 100)) : null;
      const isBestSeller = b.salesCount > 820;
      const isNew = idx % 37 === 0;
      const isFeatured = b.rating >= 4.6 && b.salesCount > 500;
      return {
        slug: b.slug,
        title: b.title,
        author: b.author,
        price: b.price,
        oldPrice,
        discountPct,
        coverUrl,
        description: pickDesc(b.title, b.author, b.catSlug),
        excerpt: pickExcerpt(b.title, b.author),
        pages: b.pages,
        publisher: b.publisher,
        publishYear: b.publishYear,
        language: b.language,
        formats: b.formats,
        rating: Math.round(b.rating * 10) / 10,
        reviewsCount: Math.floor(b.salesCount / 20),
        salesCount: b.salesCount,
        stock: 20 + (b.salesCount % 60),
        isBestSeller,
        isNew,
        isFeatured,
        categoryId: catBySlug.get(b.catSlug)!,
      };
    });
    await prisma.book.createMany({ data, skipDuplicates: true });
    inserted += data.length;
    process.stdout.write(`\r  inserted ${inserted}/${items.length}`);
  }
  console.log("\nDone inserting books.");

  console.log("Building series linksâ€¦");
  const byAuthor = new Map<string, { id: string; title: string }[]>();
  const all = await prisma.book.findMany({ select: { id: true, title: true, author: true } });
  for (const b of all) {
    const arr = byAuthor.get(b.author) ?? [];
    arr.push({ id: b.id, title: b.title });
    byAuthor.set(b.author, arr);
  }
  let seriesCount = 0;
  for (const [author, books] of byAuthor) {
    if (books.length < 3) continue;
    const seriesName = author;
    for (let i = 0; i < Math.min(books.length, 12); i++) {
      await prisma.book.update({
        where: { id: books[i].id },
        data: { series: seriesName, seriesOrder: i + 1 },
      });
    }
    seriesCount++;
  }
  console.log(`Linked ${seriesCount} series.`);

  console.log("Creating demo adminâ€¦");
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@ruknbooks.dz" },
    update: {},
    create: {
      name: "Rukn Admin",
      email: "admin@ruknbooks.dz",
      passwordHash,
      role: "ADMIN",
    },
  });

  const total = await prisma.book.count();
  const cats = await prisma.category.count();
  console.log(`\nSeed complete. Books: ${total}, Categories: ${cats}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
