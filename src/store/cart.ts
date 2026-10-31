"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORMAT_MODIFIERS } from "@/lib/constants";

export type CartLine = {
  bookId: string;
  slug: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  price: number;
  format: string;
  quantity: number;
};

export function formatPriceFor(base: number, format: string) {
  const modifier = FORMAT_MODIFIERS[format as keyof typeof FORMAT_MODIFIERS] ?? 0;
  return Math.round(base * (1 + modifier));
}

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (bookId: string, format: string) => void;
  setQuantity: (bookId: string, format: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      add: (line, quantity = 1) =>
        set((state) => {
          const idx = state.lines.findIndex(
            (l) => l.bookId === line.bookId && l.format === line.format
          );
          if (idx >= 0) {
            const lines = [...state.lines];
            lines[idx] = { ...lines[idx], quantity: Math.min(lines[idx].quantity + quantity, 20) };
            return { lines };
          }
          return { lines: [...state.lines, { ...line, quantity }] };
        }),
      remove: (bookId, format) =>
        set((state) => ({
          lines: state.lines.filter((l) => !(l.bookId === bookId && l.format === format)),
        })),
      setQuantity: (bookId, format, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.bookId === bookId && l.format === format
              ? { ...l, quantity: Math.max(1, Math.min(20, quantity)) }
              : l
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "rukn-cart",
      onRehydrateStorage: () => () => {
        useCart.setState({ hydrated: true });
      },
    }
  )
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
}
