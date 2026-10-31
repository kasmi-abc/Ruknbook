"use client";
import * as React from "react";
import { Share2, Check } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
export function ShareButton({ title }: { title: string }) {
    const { t } = useI18n();
    const [copied, setCopied] = React.useState(false);
    async function copy() {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({ title, url });
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch {
        }
    }
    return (<Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={copy}>
      {copied ? <Check className="h-4 w-4 text-emerald-600"/> : <Share2 className="h-4 w-4"/>}
      {copied ? t("book.copied") : t("book.share")}
    </Button>);
}
