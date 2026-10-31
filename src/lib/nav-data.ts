import { prisma } from "@/lib/prisma";
import { CATEGORY_ORDER } from "@/lib/constants";

export type NavCategory = { name: string; slug: string };

export const CATEGORIES: NavCategory[] = CATEGORY_ORDER.map((name) => ({
  name,
  slug: name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, ""),
}));

export async function getNavCategories(): Promise<NavCategory[]> {
  try {
    const rows = await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { name: "asc" },
    });
    if (rows.length) {
      const ordered = CATEGORY_ORDER
        .map((n) => rows.find((r) => r.name === n))
        .filter((c): c is { name: string; slug: string } => Boolean(c));
      const rest = rows.filter((r) => !CATEGORY_ORDER.includes(r.name));
      return [...ordered, ...rest];
    }
  } catch {
  }
  return CATEGORIES;
}
