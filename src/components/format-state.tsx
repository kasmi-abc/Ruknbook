"use client";
import * as React from "react";
import { FormatSelector } from "@/components/format-selector";
import { AddToCart } from "@/components/add-to-cart";
import { formatPriceFor } from "@/store/cart";
import type { BookCard as BookCardData } from "@/lib/types";

export function FormatState({
  formats,
  basePrice,
  book,
  outOfStock,
}: {
  formats: string[];
  basePrice: number;
  book: BookCardData;
  outOfStock: boolean;
}) {
  const [format, setFormat] = React.useState(formats[0] ?? "paperback");
  const price = formatPriceFor(basePrice, format);
  return (
    <div className="space-y-4">
      <FormatSelector formats={formats} basePrice={basePrice} value={format} onChange={setFormat} />
      <AddToCart book={book} format={format} price={price} outOfStock={outOfStock} />
    </div>
  );
}
