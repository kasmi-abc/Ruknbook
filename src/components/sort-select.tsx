"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
export function SortSelect() {
    const { t } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const current = searchParams.get("sort") || "featured";
    function onChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "featured")
            params.delete("sort");
        else
            params.set("sort", value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    }
    return (<Select value={current} onValueChange={onChange}>
      <SelectTrigger className="w-52">
        <SelectValue placeholder={t("catalog.sortBy")}/>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="featured">{t("catalog.sortFeatured")}</SelectItem>
        <SelectItem value="best_sellers">{t("catalog.sortBestSellers")}</SelectItem>
        <SelectItem value="rating">{t("catalog.sortRating")}</SelectItem>
        <SelectItem value="newest">{t("catalog.sortNewest")}</SelectItem>
        <SelectItem value="price_asc">{t("catalog.sortPriceAsc")}</SelectItem>
        <SelectItem value="price_desc">{t("catalog.sortPriceDesc")}</SelectItem>
      </SelectContent>
    </Select>);
}
