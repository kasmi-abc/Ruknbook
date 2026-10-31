import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, symbol: string = "DA", locale: string = "en") {
  const loc = locale === "ar" ? "ar-DZ" : locale === "fr" ? "fr-DZ" : "en-DZ";
  const num = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(amount);
  const sym = symbol === "DZD" ? (locale === "ar" ? "دج" : "DA") : symbol;
  return `${num} ${sym}`;
}

export function formatDZD(amount: number) {
  return new Intl.NumberFormat("ar-DZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount).concat(" دج");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function formatDate(date: string | Date, locale: string = "en") {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-DZ" : locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BB-${ts}-${rand}`;
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}
