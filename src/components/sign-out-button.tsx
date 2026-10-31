"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
export function SignOutButton({ locale, label }: { locale: string; label: string }) {
    return (<Button variant="outline" onClick={() => signOut({ callbackUrl: `/${locale}` })}>
      <LogOut className="h-4 w-4"/> {label}
    </Button>);
}
