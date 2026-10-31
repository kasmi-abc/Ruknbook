"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function Pagination({ page, pages }: { page: number; pages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    if (pages <= 1)
        return null;
    function go(p: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(p));
        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const nums = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    for (let i = start; i <= end; i++)
        nums.push(i);
    return (<nav className="mt-10 flex items-center justify-center gap-1.5">
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" disabled={page <= 1} onClick={() => go(page - 1)} aria-label="Previous">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180"/>
      </Button>
      {start > 1 && (<>
          <PageBtn n={1} active={page === 1} onClick={() => go(1)}/>
          {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
        </>)}
      {nums.map((n) => (<PageBtn key={n} n={n} active={page === n} onClick={() => go(n)}/>))}
      {end < pages && (<>
          {end < pages - 1 && <span className="px-1 text-muted-foreground">…</span>}
          <PageBtn n={pages} active={page === pages} onClick={() => go(pages)}/>
        </>)}
      <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" disabled={page >= pages} onClick={() => go(page + 1)} aria-label="Next">
        <ChevronRight className="h-4 w-4 rtl:rotate-180"/>
      </Button>
    </nav>);
}
function PageBtn({ n, active, onClick }: { n: number; active: boolean; onClick: () => void }) {
    return (<button onClick={onClick} className={cn("h-9 min-w-9 rounded-full px-2 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "hover:bg-accent")}>
      {n}
    </button>);
}
