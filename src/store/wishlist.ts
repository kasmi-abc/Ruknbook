"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  bookId: string;
  slug: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  price: number;
  rating: number;
};

type WishlistState = {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (bookId: string) => void;
  clear: () => void;
  has: (bookId: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.bookId === item.bookId);
          if (exists) return { items: state.items.filter((i) => i.bookId !== item.bookId) };
          return { items: [...state.items, item] };
        }),
      remove: (bookId) =>
        set((state) => ({ items: state.items.filter((i) => i.bookId !== bookId) })),
      clear: () => set({ items: [] }),
      has: (bookId) => get().items.some((i) => i.bookId === bookId),
    }),
    { name: "rukn-wishlist" }
  )
);
