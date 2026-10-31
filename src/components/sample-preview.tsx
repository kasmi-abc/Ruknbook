"use client";
import * as React from "react";
import { useI18n } from "@/components/i18n-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye } from "lucide-react";
export function SamplePreview({ title, author, excerpt }: { title: string; author: string; excerpt?: string | null }) {
    const { t } = useI18n();
    return (<Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Eye className="h-4 w-4"/> {t("book.lookInside")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{t("book.sampleTitle")}</DialogTitle>
          <DialogDescription>
            {title} — {author}
          </DialogDescription>
        </DialogHeader>
        {excerpt ? (<div className="max-h-[60vh] overflow-y-auto rounded-xl border bg-muted/30 p-6">
            <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-4 w-4"/> {t("book.lookInsideSub")}
            </div>
            <p className="font-serif text-[15px] leading-8 text-foreground/90">{excerpt}</p>
            <p className="mt-6 text-sm italic text-muted-foreground">…</p>
          </div>) : (<p className="py-6 text-center text-sm text-muted-foreground">{t("book.sampleUnavailable")}</p>)}
      </DialogContent>
    </Dialog>);
}
