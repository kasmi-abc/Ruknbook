"use client";
import * as React from "react";
import { useI18n } from "@/components/i18n-provider";
import { RatingStars } from "@/components/rating-stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
type ReviewRow = {
    id: string;
    rating: number;
    title: string;
    content: string;
    user?: { name?: string | null } | null;
};
export function Reviews({
    bookId,
    reviews,
    avg,
    count,
    canReview,
    loginHref,
}: {
    bookId: string;
    reviews: ReviewRow[];
    avg: number;
    count: number;
    canReview: boolean;
    loginHref: string;
}) {
    const { t } = useI18n();
    const [open, setOpen] = React.useState(false);
    const [rating, setRating] = React.useState(5);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId, rating, title, content }),
            });
            if (res.ok) {
                toast.success(t("book.submitReview"));
                setOpen(false);
                setTitle("");
                setContent("");
                window.location.reload();
            }
            else if (res.status === 401) {
                toast.error(t("book.loginToReview"));
            }
            else {
                toast.error(t("common.error"));
            }
        }
        finally {
            setLoading(false);
        }
    }
    return (<section id="reviews" className="rounded-2xl border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold">{t("book.reviews")}</h2>
          <div className="mt-1 flex items-center gap-2">
            <RatingStars rating={avg} size={16}/>
            <span className="text-sm text-muted-foreground">
              {avg.toFixed(1)} · {count} {t("book.reviewsCount")}
            </span>
          </div>
        </div>
        {canReview ? (<Button variant="outline" onClick={() => setOpen((o) => !o)}>
            {t("book.writeReview")}
          </Button>) : (<Button variant="outline" asChild>
            <a href={loginHref}>{t("book.loginToReview")}</a>
          </Button>)}
      </div>

      {open && canReview && (<form onSubmit={submit} className="mb-8 space-y-3 rounded-2xl border bg-background p-4">
          <div>
            <span className="mb-2 block text-sm font-medium">{t("book.reviewRating")}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (<button key={i} type="button" onClick={() => setRating(i)} className="text-2xl leading-none" aria-label={`${i} stars`}>
                  <span className={i <= rating ? "text-gold" : "text-muted-foreground/30"}>★</span>
                </button>))}
            </div>
          </div>
          <Input required placeholder={t("book.reviewTitle")} value={title} onChange={(e) => setTitle(e.target.value)}/>
          <Textarea required minLength={5} placeholder={t("book.reviewContent")} value={content} onChange={(e) => setContent(e.target.value)}/>
          <Button type="submit" loading={loading}>
            {t("book.submitReview")}
          </Button>
        </form>)}

      {reviews.length === 0 ? (<p className="text-sm text-muted-foreground">{t("book.noReviews")}</p>) : (<ul className="space-y-5">
          {reviews.map((r) => (<li key={r.id} className="border-b pb-5 last:border-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.user?.name ?? "Reader"}</span>
                <RatingStars rating={r.rating} size={13}/>
              </div>
              <h4 className="mt-1 text-sm font-semibold">{r.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.content}</p>
            </li>))}
        </ul>)}
    </section>);
}
