import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </span>
      <h3 className="font-serif text-lg font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
