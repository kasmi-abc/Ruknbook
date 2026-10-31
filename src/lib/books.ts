import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type BookCard = {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: number;
  oldPrice: number | null;
  discountPct: number;
  coverUrl: string | null;
  rating: number;
  reviewsCount: number;
  isBestSeller: boolean;
  isNew: boolean;
  language: string;
  category?: { name: string; slug: string };
};

export async function getBookBySlug(slug: string) {
  return prisma.book.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedBooks(bookId: string, categoryId: string | null, limit = 8) {
  return prisma.book.findMany({
    where: { categoryId: categoryId ?? undefined, id: { not: bookId } },
    orderBy: [{ rating: "desc" }, { salesCount: "desc" }],
    take: limit,
    include: { category: true },
  });
}

export async function getSeriesBooks(series: string, excludeId: string) {
  return prisma.book.findMany({
    where: { series, id: { not: excludeId } },
    orderBy: { seriesOrder: "asc" },
    include: { category: true },
  });
}

export async function getFeaturedBooks(limit = 8) {
  return prisma.book.findMany({
    where: { isFeatured: true },
    orderBy: [{ rating: "desc" }, { salesCount: "desc" }],
    take: limit,
    include: { category: true },
  });
}

export async function getBestSellers(limit = 8) {
  return prisma.book.findMany({
    orderBy: [{ salesCount: "desc" }, { rating: "desc" }],
    take: limit,
    include: { category: true },
  });
}

export async function getNewReleases(limit = 8) {
  return prisma.book.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    include: { category: true },
  });
}

export async function getOnSaleBooks(limit = 8) {
  return prisma.book.findMany({
    where: { discountPct: { gt: 0 } },
    orderBy: [{ discountPct: "desc" }],
    take: limit,
    include: { category: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { books: true } } },
  });
}

export type BookFilters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  language?: string;
  format?: string;
  sort?: string;
  q?: string;
  page?: number;
  perPage?: number;
};

export async function queryBooks(filters: BookFilters) {
  const {
    category,
    minPrice,
    maxPrice,
    minRating,
    language,
    format,
    sort = "featured",
    q,
    page = 1,
    perPage = 24,
  } = filters;

  const where: Prisma.BookWhereInput = {};
  if (category) where.category = { slug: category };
  if (minPrice != null || maxPrice != null) {
    where.price = {
      ...(minPrice != null ? { gte: minPrice } : {}),
      ...(maxPrice != null ? { lte: maxPrice } : {}),
    };
  }
  if (minRating != null) where.rating = { gte: minRating };
  if (language) where.language = language;
  if (format) where.formats = { has: format };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { author: { contains: q, mode: "insensitive" } },
      { isbn: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.BookOrderByWithRelationInput | Prisma.BookOrderByWithRelationInput[] =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "rating"
          ? { rating: "desc" }
          : sort === "newest"
            ? { createdAt: "desc" }
            : sort === "best_sellers"
              ? { salesCount: "desc" }
              : [{ isFeatured: "desc" }, { rating: "desc" }];

  const [total, books] = await Promise.all([
    prisma.book.count({ where }),
    prisma.book.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
  ]);

  return { books, total, page, perPage, pages: Math.ceil(total / perPage) };
}

export async function searchBooks(q: string, limit = 8) {
  if (!q.trim()) return [];
  return prisma.book.findMany({
    where: {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { author: { contains: q, mode: "insensitive" } },
        { isbn: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: [{ salesCount: "desc" }, { rating: "desc" }],
    take: limit,
    select: { id: true, slug: true, title: true, author: true, price: true, coverUrl: true },
  });
}

export function toCard(book: {
  id: string;
  slug: string;
  title: string;
  author: string;
  price: unknown;
  oldPrice: unknown;
  discountPct?: number | null;
  coverUrl?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
  isBestSeller?: boolean | null;
  isNew?: boolean | null;
  language?: string | null;
  category?: { name: string; slug: string } | null;
}): BookCard {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    price: Number(book.price),
    oldPrice: book.oldPrice ? Number(book.oldPrice) : null,
    discountPct: book.discountPct ?? 0,
    coverUrl: book.coverUrl ?? null,
    rating: book.rating ?? 0,
    reviewsCount: book.reviewsCount ?? 0,
    isBestSeller: book.isBestSeller ?? false,
    isNew: book.isNew ?? false,
    language: book.language ?? "English",
    category: book.category ? { name: book.category.name, slug: book.category.slug } : undefined,
  };
}
