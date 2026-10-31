"use client";
import { useI18n } from "@/components/i18n-provider";
import type { LucideIcon } from "lucide-react";
import { BookOpen, LayoutGrid, Users, Truck } from "lucide-react";
const items: { icon: LucideIcon; value: string; label: string }[] = [];
export function Stats() {
    const { t } = useI18n();
    const stats = [
        { icon: BookOpen, value: "2,700+", label: t("home.statsBooks") },
        { icon: LayoutGrid, value: "20+", label: t("home.statsCategories") },
        { icon: Users, value: "5,000+", label: t("home.statsReaders") },
        { icon: Truck, value: "58", label: t("home.statsShipping") },
    ];
    return (<section className="grid grid-cols-2 gap-4 rounded-3xl border bg-card p-6 sm:grid-cols-4 sm:p-8">
      {stats.map((s) => {
            const Icon = s.icon;
            return (<div key={s.label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6"/>
            </span>
            <span className="font-serif text-2xl font-bold text-primary">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>);
        })}
    </section>);
}
