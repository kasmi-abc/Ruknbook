"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) {
        return <Button variant="ghost" size="icon" className="h-9 w-9" aria-hidden/>;
    }
    return (<Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
      {resolvedTheme === "dark" ? <Sun className="h-[1.1rem] w-[1.1rem]"/> : <Moon className="h-[1.1rem] w-[1.1rem]"/>}
    </Button>);
}
