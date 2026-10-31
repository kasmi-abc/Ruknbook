"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PrintButton({ label }: { label: string }) {
    return (<Button variant="outline" onClick={() => window.print()} data-no-print>
      <Printer className="h-4 w-4"/> {label}
    </Button>);
}
