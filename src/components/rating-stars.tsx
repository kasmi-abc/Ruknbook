"use client";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        const half = !filled && i - 0.5 === rounded;
        return (
          <span key={i} className="relative inline-flex">
            <Star
              style={{ width: size, height: size }}
              className="text-muted-foreground/30"
              strokeWidth={1.5}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : "100%" }}
              >
                <Star
                  style={{ width: size, height: size }}
                  className="fill-gold text-gold"
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
